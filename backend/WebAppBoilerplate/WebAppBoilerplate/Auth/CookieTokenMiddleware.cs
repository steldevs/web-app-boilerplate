using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Text;

namespace WebAppBoilerplate.Auth
{
    public class CookieTokenMiddleware
    {
        private readonly RequestDelegate _next;

        public CookieTokenMiddleware(RequestDelegate next)
        {
            _next = next; 
        }

        public async Task Invoke(HttpContext context)
        {
            var jwt = context.Request.Cookies["accessToken"];
            if (!string.IsNullOrEmpty(jwt))
            {
                var handler = new JwtSecurityTokenHandler();
                try
                {
                    var token = handler.ReadToken(jwt) as JwtSecurityToken;
                    var parameters = new TokenValidationParameters
                    {
                        ValidateIssuer = true,
                        ValidIssuer = "WebAppBoilerplateServer",
                        ValidateAudience = true,
                        ValidAudience = "WebbAppBoilerplateClient",
                        ValidateLifetime = true,
                        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes("Yh2k7QSu4l8CZg5p6X3Pna9L0Miy4D3Bvt0JVr87UcOj69Kqw5R2Nmf4FWs03Hdx"))
                    };
                    var claimsPrincipal = handler.ValidateToken(jwt, parameters, out var _);
                    context.User = claimsPrincipal;
                }
                catch (Exception)
                {
                    context.Response.Cookies.Delete("accessToken");
                }
            }

            await _next(context);
        }
    }
}
