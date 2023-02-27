using Moq;
using WebAppBoilerplate.Core.Interfaces;
using WebAppBoilerplate.Core.Models;
using WebAppBoilerplate.Core.Models.Authentication;
using WebAppBoilerplate.Services.Auth;

namespace WebAppBoilerplate.Services.Test
{
    [TestClass]
    public class AuthenticationServiceTests
    {

        [TestMethod]
        public async Task TestAuthenticate_WithValidUser_ReturnsAppUser()
        {
            var mockUnitOfWork = new Mock<IUnitOfWork>();
            var hashedPassword = PasswordHasher.HashPassword("password");
            var loginModel = new LoginModel
            {
                Username = "testuser",
                Password = "password"
            };

            var appUser = new AppUser("testuser", hashedPassword, "testuser@example.com", "user");
            mockUnitOfWork.Setup(uow => uow.Users.GetAll().Result).Returns(new[] { appUser });

            var authService = new AuthService(mockUnitOfWork.Object);
            var result = await authService.Authenticate(loginModel);

            Assert.IsNotNull(result);
            Assert.IsInstanceOfType(result, typeof(AppUser));
            Assert.AreEqual(appUser.Username, result.Username);
        }

        [TestMethod]
        public async Task TestAuthenticate_WithInvalidPassword_ReturnsNull()
        {
            var mockUnitOfWork = new Mock<IUnitOfWork>();
            var hashedPassword = PasswordHasher.HashPassword("password");
            var loginModel = new LoginModel
            {
                Username = "testuser",
                Password = "wrongPassword"
            };

            var appUser = new AppUser("testuser", hashedPassword, "testuser@example.com", "user");
            mockUnitOfWork.Setup(uow => uow.Users.GetAll().Result).Returns(new[] { appUser });

            var authService = new AuthService(mockUnitOfWork.Object);
            var result = await authService.Authenticate(loginModel);

            Assert.IsNull(result);
        }

        [TestMethod]
        public async Task Authenticate_WithNullUser_ThrowsArgumentNullException()
        {
            var unitOfWorkMock = new Mock<IUnitOfWork>();
            var authService = new AuthService(unitOfWorkMock.Object);

            await Assert.ThrowsExceptionAsync<ArgumentNullException>(
                () => authService.Authenticate(null));
        }
    }
}