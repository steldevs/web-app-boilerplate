using Microsoft.EntityFrameworkCore;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using WebAppBoilerplate.Core.Interfaces;
using WebAppBoilerplate.Core.Models;
using WebAppBoilerplate.Infrastructure.Repositories;

namespace WebAppBoilerplate.Infrastructure.Test
{
    [TestClass]
    public class UnitOfWorkTests
    {
        private DbContextOptions<DbContextClass> _dbContextOptions;
        private readonly DbContextClass _dbContext;
        private readonly IUserRepository _userRepository;

        public UnitOfWorkTests()
        {
            _dbContextOptions = new DbContextOptionsBuilder<DbContextClass>()
                        .UseInMemoryDatabase(Guid.NewGuid().ToString())
                        .Options;
            _dbContext = new DbContextClass(_dbContextOptions);
            _userRepository = new UserRepository(_dbContext);
        }

        [TestMethod]
        public async Task Save_ShouldSaveChangesToDatabase()
        {
            var unitOfWork = new UnitOfWork(_dbContext, _userRepository);
            var entity = new AppUser
               (
                   "TestUser",
                   "testuser@test.com",
                   "password",
                   "user"
               );

            await _userRepository.Add(entity);
            int result = unitOfWork.Save();

            Assert.IsTrue(result > 0, "Save method should return a number greater than 0, indicating the number of changes saved to the database.");
        }

        [TestMethod]
        public void Save_ShouldNotSaveIfChangesHaveNotBeenMade()
        {
            var unitOfWork = new UnitOfWork(_dbContext, _userRepository);
            int result = unitOfWork.Save();

            Assert.AreEqual(result, 0);
        }

        [TestMethod]
        public void Dispose_ShouldDisposeDbContext()
        {
            var unitOfWork = new UnitOfWork(_dbContext, _userRepository);
            unitOfWork.Dispose();

            Assert.IsTrue(_dbContext.IsDisposed, "The DbContext should be disposed after calling the Dispose method of UnitOfWork.");
        }
    }
}
