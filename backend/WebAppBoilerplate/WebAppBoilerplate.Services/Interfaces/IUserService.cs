using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using WebAppBoilerplate.Core.Models;
using WebAppBoilerplate.Core.Models.Authentication;

namespace WebAppBoilerplate.Services.Interfaces
{
    public interface IUserService
    {
        Task<bool> CreateUser(RegisterModel user);

        Task<IEnumerable<User>> GetAllUsers();

        Task<AppUser> GetUserById(Guid userId);

        Task<bool> UpdateUser(AppUser user);

        Task<bool> UpdateUser(User user);

        Task<bool> DeleteUser(Guid userId);
    }
}
