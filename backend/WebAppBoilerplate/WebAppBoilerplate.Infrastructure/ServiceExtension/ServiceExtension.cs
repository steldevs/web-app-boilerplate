using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using WebAppBoilerplate.Core.Interfaces;
using WebAppBoilerplate.Infrastructure.Repositories;


namespace WebAppBoilerplate.Infrastructure.ServiceExtension
{
    public static class ServiceExtension
    {
        public static IServiceCollection AddDIServices(this IServiceCollection services, IConfiguration configuration)
        {
            services.AddDbContext<DbContextClass>(options =>
            {
                var connectionString = "";
                if (string.IsNullOrEmpty(Environment.GetEnvironmentVariable("SQL_HOST")))
                {
                    connectionString = configuration.GetConnectionString("DevConnection");
                }
                else
                {
                    if (OperatingSystem.IsWindows())
                    {
                        connectionString = configuration.GetConnectionString("DockerWinConnection");
                    }
                    else
                    {
                        connectionString = configuration.GetConnectionString("DockerConnection");
                    }
                }
                options.UseNpgsql(connectionString);
            });
            services.AddScoped<IUnitOfWork, UnitOfWork>();
            services.AddScoped<IUserRepository, UserRepository>();

            return services;
        }
    }
}
