using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using WebAppBoilerplate.Services.Interfaces;
using WebAppBoilerplate.Core.Models;
using WebAppBoilerplate.Services;
using WebAppBoilerplate.Core.Models.Authentication;
using System.Security.Cryptography;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Options;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Azure.Core;

namespace WebAppBoilerplate.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TokenController : Controller
    {
        public readonly IAuthService _authService;
        public IConfiguration _configuration;
        public readonly IUserService _userService;

        public TokenController(IAuthService authService, IUserService userService, IConfiguration configuration)
        {
            _authService = authService;
            _userService = userService;
            _configuration = configuration;
        }

        [HttpPost]
        public async Task<IActionResult> Login(LoginModel user)
        {
            if (user == null)
            {
                return BadRequest();
            }
            else
            {
                var existingUser = await _authService.Authenticate(user);
                if (existingUser == null)
                {
                    return Unauthorized();
                }

                var claims = GenerateClaims(existingUser.Id.ToString());
                var token = CreateToken(claims);
                var refreshToken = GenerateRefreshToken();

                _ = int.TryParse(_configuration["JWT:RefreshTokenValidityInDays"], out int refreshTokenValidityInDays);

                existingUser.RefreshToken = refreshToken;
                existingUser.RefreshTokenExpiryTime = DateTime.Now.AddDays(refreshTokenValidityInDays).ToUniversalTime();
                await _userService.UpdateUser(existingUser);

                HttpContext.Response.Cookies.Append("accessToken", new JwtSecurityTokenHandler().WriteToken(token), 
                    GenerateCookieOptions(DateTime.UtcNow.AddMinutes(Convert.ToDouble(_configuration["JWT:TokenValidityInMinutes"]))));
                HttpContext.Response.Cookies.Append("refreshToken", refreshToken, 
                    GenerateCookieOptions(DateTime.UtcNow.AddDays(Convert.ToDouble(_configuration["JWT:RefreshTokenValidityInDays"]))));

                return Ok(new
                {
                    UserId = existingUser.Id,
                    Username = existingUser.Username,
                    Email = existingUser.Email,
                    Role = existingUser.Role
                });
            }
        }




        [HttpGet]
        [Route("persist")]
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
        public async Task<IActionResult> RefreshToken()
        {
            var accessToken = Request.Cookies["accessToken"];
            var refreshToken = Request.Cookies["refreshToken"];

            if ( string.IsNullOrWhiteSpace(accessToken) || string.IsNullOrWhiteSpace(refreshToken))
            {
                return BadRequest("Token cannot be empty");
            }
            else
            {
                var principal = GetPrincipalFromExpiredToken(accessToken);
                if (principal == null)
                {
                    return BadRequest("Invalid access token or refresh token");
                }
                string userId = principal.Claims.Where((x) => x.Type == "UserId").FirstOrDefault()?.Value;
                if (userId == null || userId == string.Empty)
                {
                    return BadRequest();
                }

                var user = await _userService.GetUserById(Guid.Parse(userId));
                if (user == null || user.RefreshToken != refreshToken || user.RefreshTokenExpiryTime <= DateTime.Now)
                {
                    return BadRequest("Invalid access token or refresh token");
                }

                var newAccessToken = CreateToken(principal.Claims.ToList());
                var newRefreshToken = GenerateRefreshToken();

                user.RefreshToken = newRefreshToken;
                await _userService.UpdateUser(user);

                HttpContext.Response.Cookies.Append("accessToken", new JwtSecurityTokenHandler().WriteToken(newAccessToken), 
                    GenerateCookieOptions(DateTime.UtcNow.AddMinutes(Convert.ToDouble(_configuration["JWT:TokenValidityInMinutes"]))));
                HttpContext.Response.Cookies.Append("refreshToken", newRefreshToken, 
                    GenerateCookieOptions(DateTime.UtcNow.AddDays(Convert.ToDouble(_configuration["JWT:RefreshTokenValidityInDays"]))));

                return Ok(new
                {
                    UserId = user.Id,
                    Username = user.Username,
                    Email = user.Email,
                    Role = user.Role
                });
            }
        }

        [HttpDelete]
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
        public async Task<IActionResult> Revoke()
        {
            var accessToken = Request.Cookies["accessToken"];
            var refreshToken = Request.Cookies["refreshToken"];

            if (string.IsNullOrWhiteSpace(accessToken) || string.IsNullOrWhiteSpace(refreshToken))
            {
                return BadRequest("Token cannot be empty");
            }
            else
            {
                var principal = GetPrincipalFromExpiredToken(accessToken);
                if (principal == null)
                {
                    return BadRequest("Invalid access token or refresh token");
                }
                string userId = principal.Claims.Where((x) => x.Type == "UserId").FirstOrDefault()?.Value;
                if (userId == null || userId == string.Empty)
                {
                    return BadRequest();
                }

                var user = await _userService.GetUserById(Guid.Parse(userId));
                if (user == null) return BadRequest("Invalid user");

                user.RefreshToken = null;
                await _userService.UpdateUser(user);

                HttpContext.Response.Cookies.Delete("accessToken");
                HttpContext.Response.Cookies.Delete("refreshToken");

                return Ok();
            }
        }

        private List<Claim> GenerateClaims(string userId)
        {
            return new List<Claim>() {
                new Claim(JwtRegisteredClaimNames.Sub, _configuration["Jwt:Subject"]),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
                new Claim(JwtRegisteredClaimNames.Iat, DateTime.UtcNow.ToString()),
                new Claim("UserId", userId)
             };
        }

        private CookieOptions GenerateCookieOptions(DateTimeOffset expires)
        {
            return new CookieOptions
            {
                HttpOnly = true,
                Secure = true,
                Expires = expires,
                IsEssential = true,
                SameSite = SameSiteMode.None,
                Path = "/"
            };
        }
        private ClaimsPrincipal? GetPrincipalFromExpiredToken(string? token)
        {
            var tokenValidationParameters = new TokenValidationParameters
            {
                ValidateAudience = false,
                ValidateIssuer = false,
                ValidateIssuerSigningKey = true,
                IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["JWT:Key"])),
                ValidateLifetime = false
            };

            var tokenHandler = new JwtSecurityTokenHandler();
            var principal = tokenHandler.ValidateToken(token, tokenValidationParameters, out SecurityToken securityToken);
            if (securityToken is not JwtSecurityToken jwtSecurityToken || !jwtSecurityToken.Header.Alg.Equals(SecurityAlgorithms.HmacSha256, StringComparison.InvariantCultureIgnoreCase))
                throw new SecurityTokenException("Invalid token");

            return principal;

        }

        private JwtSecurityToken CreateToken(List<Claim> authClaims)
        {
            var authSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["JWT:Key"]));
            _ = int.TryParse(_configuration["JWT:TokenValidityInMinutes"], out int tokenValidityInMinutes);

            var token = new JwtSecurityToken(
                issuer: _configuration["JWT:Issuer"],
                audience: _configuration["JWT:Audience"],
                expires: DateTime.Now.AddMinutes(tokenValidityInMinutes),
                claims: authClaims,
                signingCredentials: new SigningCredentials(authSigningKey, SecurityAlgorithms.HmacSha256)
            );

            return token;
        }

        private static string GenerateRefreshToken()
        {
            var randomNumber = new byte[64];
            using var rng = RandomNumberGenerator.Create();
            rng.GetBytes(randomNumber);
            return Convert.ToBase64String(randomNumber);
        }
    }
}
