using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace WebAppBoilerplate.Core.Models
{
    public class User
    {
        public string Id { get; }
        public string Username { get; }
        public string Email { get; }
        public string Role { get; }

        public User(string id, string username, string email, string role)
        {
            Id = id;
            Username = username;
            Email = email;
            Role = role;
        }
    }
}
