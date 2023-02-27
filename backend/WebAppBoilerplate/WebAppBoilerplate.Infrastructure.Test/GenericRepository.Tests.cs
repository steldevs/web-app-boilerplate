using Microsoft.EntityFrameworkCore;
using WebAppBoilerplate.Core.Models;
using WebAppBoilerplate.Infrastructure;
using WebAppBoilerplate.Infrastructure.Repositories;


namespace WebAppBoilerplate.Infrastructure.Test
{
    [TestClass]
    public class GenericRepositoryTests
    {
        private DbContextOptions<DbContextClass> _dbContextOptions;
        private DbContextClass _dbContext;
        private GenericRepository<AppUser> _repository;

        [TestInitialize]
        public void TestInitialize()
        {
            _dbContextOptions = new DbContextOptionsBuilder<DbContextClass>()
                        .UseInMemoryDatabase(Guid.NewGuid().ToString())
                        .Options;
            _dbContext = new DbContextClass(_dbContextOptions);
            _repository = new UserRepository(_dbContext);
        }

        [TestMethod]
        public async Task GetById_ShouldReturnEntity()
        {
            AppUser entity = new AppUser
                (
                    "TestUser",
                    "testuser@test.com",
                    "password",
                    "user"
                );
            _dbContext.Add(entity);
            await _dbContext.SaveChangesAsync();
            var result = await _repository.GetById(entity.Id);

            Assert.IsNotNull(result);
            Assert.AreEqual(entity, result);
        }

        [TestMethod]
        public async Task GetAll_ShouldReturnAllEntities()
        {
            var entities = new List<AppUser>
            {
            new AppUser
            (
                "TestUser",
                "testuser@test.com",
                "password",
                "user"
            ),
            new AppUser
                (
                    "TestUser2",
                    "testuser2@test.com",
                    "password2",
                    "admin"
                )
            };

            _dbContext.AddRange(entities);
            await _dbContext.SaveChangesAsync();
            var result = await _repository.GetAll();

            CollectionAssert.AreEqual(entities, result.ToArray());
        }

        [TestMethod]
        public async Task Add_ShouldAddEntity()
        {
            var entity = new AppUser
            (
                "TestUser",
                "testuser@test.com",
                "password",
                "user"
            );

            await _repository.Add(entity);
            await _dbContext.SaveChangesAsync();

            var result = await _dbContext.Set<AppUser>().FindAsync(entity.Id);
            Assert.IsNotNull(result);
            Assert.AreEqual(entity, result);
        }

        [TestMethod]
        public async Task Delete_ShouldRemoveEntity()
        {
            var entity = new AppUser
            (
                "TestUser",
                "testuser@test.com",
                "password",
                "user"
            );
            _dbContext.Add(entity);
            await _dbContext.SaveChangesAsync();

            _repository.Delete(entity);
            await _dbContext.SaveChangesAsync();

            var result = await _dbContext.Set<AppUser>().FindAsync(entity.Id);
            Assert.IsNull(result);
        }

        [TestMethod]
        public async Task Update_ShouldUpdateEntity()
        {
            var originalEntity = new AppUser
            (
                "TestUser",
                "testuser@test.com",
                "password",
                "user"
            );
            _dbContext.Add(originalEntity);
            await _dbContext.SaveChangesAsync();
            originalEntity.Username = "newUsername";
            _repository.Update(originalEntity);
            await _dbContext.SaveChangesAsync();

            var updatedEntity = await _repository.GetById(originalEntity.Id);

            Assert.AreEqual("newUsername", updatedEntity.Username);
        }


    }
}