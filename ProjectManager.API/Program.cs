using Microsoft.EntityFrameworkCore;
using ProjectManager.Application.Extensions;
using ProjectManager.Infrastructure.Extensions;
using ProjectManager.Infrastructure.Persistence;
using System.Text.Json.Serialization;

namespace ProjectManager.API
{
    public class Program
    {

        public static void Main(string[] args)
        {

            AppDomain.CurrentDomain.UnhandledException += (sender, e) =>
            {
                Console.WriteLine("Unhandled Exception: " + e.ExceptionObject?.ToString());
            };

            var builder = WebApplication.CreateBuilder(args);
            builder.Configuration.AddEnvironmentVariables();

            builder.Services.AddControllers()
                .AddJsonOptions(options =>
                {
                    // configure enums for post jsons
                    options.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter());
                });

            // add db context for app
            builder.Services.AddDatabase(builder.Configuration);

            // add mediatr for controllers
            builder.Services.AddAppMediatR(builder.Configuration);

            /*builder.Services.AddCors(options =>
            {
                options.AddPolicy("AllowSpecificOrigin", policy =>
                    policy
                        .WithOrigins(
#if DEBUG
                            "http://localhost",
                            "http://localhost:80",
#endif
                            "https://projectmanagerapi-app-2025052718.wonderfulwave-2a703125.polandcentral.azurecontainerapps.io"
                        )
                        .SetIsOriginAllowed(_ => true)
                        .AllowAnyMethod()
                        .AllowAnyHeader()
                );
            });*/

            builder.Services.AddAuthenticationOptions(builder.Configuration);

            var app = builder.Build();

            // migrate database
            try
            {
                SeedData.Initialize(app);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"[FATAL SEEDING ERROR] {ex.Message}");
                // Optional: don't rethrow
            }

            app.UseStaticFiles();

            app.Use(async (context, next) =>
            {
                if (context.Request.Method == "OPTIONS")
                {
                    context.Response.StatusCode = 200;
                    await context.Response.CompleteAsync();
                }
                else
                {
                    await next();
                }
            });

            // app.UsehttpRedirection();
            //app.UseCors("AllowSpecificOrigin");
            app.UseAuthorization();
            app.MapControllers();
            app.MapFallbackToFile("log.html");
            // app.MapGet("/", () => "OK");
            app.MapGet("/health", () => "OK");

            app.Urls.Add("http://*:80");

            app.Run();
        }
    }

    public static class SeedData
    {
        public static void Initialize(WebApplication app)
        {
            try
            {
                using var scope = app.Services.CreateScope();
                var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
                db.Database.Migrate();
            }
            catch (Exception ex)
            {
                Console.WriteLine($"[SEED ERROR] B³¹d podczas inicjalizacji danych: {ex.Message}");
                throw;
            }
        }
    }


    
}
