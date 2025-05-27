using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using ProjectManager.Application.Options;

namespace ProjectManager.Application.Extensions
{
    public static class ServiceCollectionExtensions
    {
        public static void AddAppMediatR(this IServiceCollection services, IConfiguration config)
        {
            services.AddMediatR(options =>
            {
                options.RegisterServicesFromAssembly(typeof(MediatRRoot).Assembly);
            });
        }

        public static void AddAuthenticationOptions(this IServiceCollection services, IConfiguration configuration)
        {
            services.Configure<AuthenticationOptions>(configuration.GetSection(AuthenticationOptions.OptionsKey));
        }
    }
}
