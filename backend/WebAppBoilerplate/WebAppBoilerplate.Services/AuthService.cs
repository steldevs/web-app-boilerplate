using Microsoft.AspNetCore.Authentication;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using WebAppBoilerplate.Core.Interfaces;
using WebAppBoilerplate.Core.Models;
using WebAppBoilerplate.Core.Models.Authentication;
using WebAppBoilerplate.Services.Auth;
using WebAppBoilerplate.Services.Interfaces;

namespace WebAppBoilerplate.Services
{
    public class AuthService : IAuthService
    {
        public IUnitOfWork _unitOfWork;

        public AuthService(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        public async Task<AppUser?> Authenticate(LoginModel user)
        {
            if (user == null) throw new ArgumentNullException(nameof(user));
            var dbUser = _unitOfWork.Users.GetAll().Result.FirstOrDefault(dbUser => dbUser.Username == user.Username);
            if(dbUser != null)
            {
                if(PasswordHasher.CheckPassword(user.Password, dbUser.Password))
                {
                    return dbUser;
                }
            }
            return null;
        }
    }
}
