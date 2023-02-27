using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using WebAppBoilerplate.Core.Models;

namespace WebAppBoilerplate.Services.Mappers
{
    public class UserMapper
    {
        public IEnumerable<User> Map(IEnumerable<AppUser> users)
        {
            List<User> result = new List<User>();
            foreach (AppUser user in users)
            {
                result.Add(new User(
                    user.Id.ToString(),
                    user.Username,
                    user.Email,
                    user.Role)
                );
            }
            return result;
        }
    }
}
