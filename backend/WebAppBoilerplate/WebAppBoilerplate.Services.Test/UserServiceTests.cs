using Moq;
using WebAppBoilerplate.Core.Interfaces;
using WebAppBoilerplate.Core.Models;
using WebAppBoilerplate.Core.Models.Authentication;
using WebAppBoilerplate.Services;

namespace WebAppBoilerplate.Services.Test
{
    [TestClass]
    public class UserServiceTests
    {

        private UserService _userService;
        private Mock<IUnitOfWork> _mockUnitOfWork;

        [TestInitialize]
        public void TestInitialize()
        {
            _mockUnitOfWork = new Mock<IUnitOfWork>();
            _userService = new UserService(_mockUnitOfWork.Object);
        }

        [TestMethod]
        public async Task CreateUser_ValidUser_ReturnsTrue()
        {
            var registerModel = new RegisterModel
            {
                Username = "testuser",
                Password = "password",
                Email = "testuser@example.com",
                Role = "Admin"
            };
            _mockUnitOfWork.Setup(uow => uow.Users.GetAll().Result)
                .Returns(new List<AppUser>());
            _mockUnitOfWork.Setup(uow => uow.Save()).Returns(1);

            var result = await _userService.CreateUser(registerModel);
            Assert.IsTrue(result);
        }

        [TestMethod]
        public async Task CreateUser_ExistingUser_ReturnsFalse()
        {
            var registerModel = new RegisterModel
            {
                Username = "testuser",
                Password = "password",
                Email = "testuser@example.com",
                Role = "Admin"
            };
            _mockUnitOfWork.Setup(uow => uow.Users.GetAll().Result)
                .Returns(new List<AppUser> { new AppUser("testuser", "", "", "") });

            var result = await _userService.CreateUser(registerModel);
            Assert.IsFalse(result);
        }

        [TestMethod]
        [ExpectedException(typeof(ArgumentNullException))]
        public async Task CreateUser_NullUser_ThrowsException()
        {
            await _userService.CreateUser(null);
        }

        [TestMethod]
        public async Task DeleteUser_ValidId_ReturnsTrue()
        {
            Guid userId = Guid.NewGuid();
            AppUser user = new AppUser
            (
                "TestUser",
                "testuser@test.com",
                "password",
                "user"
            );
            user.Id = userId;
            _mockUnitOfWork.Setup(uow => uow.Users.GetById(userId)).ReturnsAsync(user);
            _mockUnitOfWork.Setup(uow => uow.Save()).Returns(1);

            var result = await _userService.DeleteUser(userId);

            Assert.IsTrue(result);
            _mockUnitOfWork.Verify(uow => uow.Users.Delete(user), Times.Once);
            _mockUnitOfWork.Verify(uow => uow.Save(), Times.Once);
        }


        [TestMethod]
        public async Task UpdateUser_ValidInput_ReturnsTrue()
        {

            var userId = Guid.NewGuid();
            AppUser user = new AppUser
            (
                "TestUser",
                "testuser@test.com",
                "password",
                "user"
            );
            user.Id = userId;
;
            _mockUnitOfWork.Setup(uow => uow.Users.GetById(userId))
                .ReturnsAsync(user);
            _mockUnitOfWork.Setup(uow => uow.Save())
                .Returns(1);

            var userService = new UserService(_mockUnitOfWork.Object);
            var result = await userService.UpdateUser(user);

            Assert.IsTrue(result);
            _mockUnitOfWork.Verify(uow => uow.Users.Update(user), Times.Once());
            _mockUnitOfWork.Verify(uow => uow.Save(), Times.Once());
        }

        // [TestMethod]
        // [ExpectedException(typeof(ArgumentNullException))]
        // public async Task UpdateUser_UserIsNull_ThrowsArgumentNullException()
        // {
        //     await _userService.UpdateUser(null);
        // }

        [TestMethod]
        [ExpectedException(typeof(NullReferenceException))]
        public async Task UpdateUser_UserNotFound_ThrowsNullReferenceException()
        {
            AppUser user = new AppUser
            (
                "TestUser",
                "testuser@test.com",
                "password",
                "user"
            );
            var userId = Guid.NewGuid();
            _mockUnitOfWork.Setup(uow => uow.Users.GetById(userId))
                .ReturnsAsync((AppUser)null);

            var userService = new UserService(_mockUnitOfWork.Object);
            var result = await userService.UpdateUser(user);

            _mockUnitOfWork.Verify(uow => uow.Users.Update(It.IsAny<AppUser>()), Times.Never());
            _mockUnitOfWork.Verify(uow => uow.Save(), Times.Never());
        }

        [TestMethod]
        public async Task GetUserById_ValidInput_ReturnsUser()
        {

            var userId = Guid.NewGuid();
            AppUser user = new AppUser
            (
                "TestUser",
                "testuser@test.com",
                "password",
                "user"
            );
            user.Id = userId;
            _mockUnitOfWork.Setup(uow => uow.Users.GetById(
                It.Is<Guid>(id => id == userId)))
                            .ReturnsAsync(user);

            var userService = new UserService(_mockUnitOfWork.Object);
            var result = await userService.GetUserById(userId);

            Assert.IsNotNull(result);
            Assert.AreEqual(user.Id, result.Id);
            Assert.AreEqual(user.Username, result.Username);
            Assert.AreEqual(user.Email, result.Email);
            Assert.AreEqual(user.Role, result.Role);
            Assert.AreEqual(user.Password, result.Password);
        }

        [TestMethod]
        [ExpectedException(typeof(ArgumentNullException))]
        public async Task GetUserById_InvalidInput_ThrowsArgumentNullException()
        {
            await _userService.GetUserById(Guid.Empty);
        }

        [TestMethod]
        public async Task GetAllUsers_ReturnsListOfUsers()
        {
            AppUser user = new AppUser
            (
                "TestUser",
                "testuser@test.com",
                "password",
                "user"
            );
            var userId = new Guid();
            user.Id = userId;

            var usersList = new List<AppUser>
            {
                user,
                new AppUser
                (
                    "TestUser2",
                    "testuser2@test.com",
                    "password2",
                    "admin"
                )
            };

            _mockUnitOfWork.Setup(x => x.Users.GetAll()).ReturnsAsync(usersList);

            var result = await _userService.GetAllUsers();

            Assert.IsNotNull(result);
            Assert.AreEqual(2, result.Count());
            Assert.AreEqual(user, result.First());
        }

        [TestMethod]
        public async Task GetAllUsers_ReturnsEmptyList_IfEmpty()
        {

            _mockUnitOfWork.Setup(x => x.Users.GetAll()).ReturnsAsync(new List<AppUser>());

            var result = await _userService.GetAllUsers();

            Assert.IsNotNull(result);
            Assert.AreEqual(0, result.Count());
        }
    }
}
