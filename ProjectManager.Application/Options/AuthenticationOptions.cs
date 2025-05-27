namespace ProjectManager.Application.Options
{
    public sealed class AuthenticationOptions
    {
        public static string OptionsKey { get; } = nameof(AuthenticationOptions);
        public TimeSpan AccessTokenLifeTime { get; set; }
    }
}
