using WebAppBoilerplate.Core.Interfaces;
using WebAppBoilerplate.Core.Models;
using WebAppBoilerplate.Core.Models.Authentication;
using WebAppBoilerplate.Services.Auth;
using WebAppBoilerplate.Services.Interfaces;
using WebAppBoilerplate.Services.Mappers;

namespace WebAppBoilerplate.Services
{
    public class UserService : IUserService
    {
        public IUnitOfWork _unitOfWork;
        private UserMapper _mapper;

        public UserService(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
            _mapper = new UserMapper();
        }

        public async Task<bool> CreateUser(RegisterModel user)
        {
            if (user == null) throw new ArgumentNullException(nameof (user));
            AppUser appUser = new AppUser(
                user.Username,
                PasswordHasher.HashPassword(user.Password),
                user.Email,
                user.Role
              );

            var dbUser = _unitOfWork.Users.GetAll().Result.FirstOrDefault(dbUser => dbUser.Username == user.Username);
            if(dbUser != null)
            {
                return false;
            }
            await _unitOfWork.Users.Add(appUser);
            var result = _unitOfWork.Save();

            return Convert.ToBoolean(result);
        }

        public async Task<bool> DeleteUser(Guid userId)
        {
            if (userId == Guid.Empty) throw new ArgumentNullException(nameof(userId));
            var userDetails = await _unitOfWork.Users.GetById(userId);
            _unitOfWork.Users.Delete(userDetails);
            var result = _unitOfWork.Save();
            return Convert.ToBoolean(result);
        }

        public async Task<AppUser> GetUserById(Guid userId)
        {
            if (userId == Guid.Empty) throw new ArgumentNullException(nameof(userId));
            var user = await _unitOfWork.Users.GetById(userId);
            return user;
        }

        public async Task<IEnumerable<User>> GetAllUsers()
        {
            var users = await _unitOfWork.Users.GetAll();
            return _mapper.Map(users);
        }

        public async Task<bool> UpdateUser(AppUser user)
        {
            if (user == null) throw new ArgumentNullException(nameof(user));
            var userDetails = await _unitOfWork.Users.GetById(user.Id);
            if (userDetails == null) throw new NullReferenceException(nameof(userDetails));

            userDetails.Username = user.Username;
            userDetails.Email = user.Email;
            userDetails.Password = userDetails.Password;
            userDetails.Role = user.Role;

            _unitOfWork.Users.Update(userDetails);
            var result = _unitOfWork.Save();
            return Convert.ToBoolean(result);
        }

        public async Task<bool> UpdateUser(User user)
        {
            if (user == null) throw new ArgumentNullException(nameof(user));
            var userDetails = await _unitOfWork.Users.GetById(Guid.Parse(user.Id));
            if (userDetails == null) throw new NullReferenceException(nameof(userDetails));

            userDetails.Username = user.Username;
            userDetails.Email = user.Email;
            userDetails.Role = user.Role;

            _unitOfWork.Users.Update(userDetails);
            var result = _unitOfWork.Save();
            return Convert.ToBoolean(result);
        }


    }
}
