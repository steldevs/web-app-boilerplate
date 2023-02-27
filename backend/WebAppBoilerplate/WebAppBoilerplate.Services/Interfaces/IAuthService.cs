using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using WebAppBoilerplate.Core.Models;
using WebAppBoilerplate.Core.Models.Authentication;

namespace WebAppBoilerplate.Services.Interfaces
{
    public interface IAuthService 
    {
        Task<AppUser?> Authenticate(LoginModel user);
        //Task<bool> Logout(string userId);
        //Task<bool> LogoutAll();
    }
}
