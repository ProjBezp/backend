using ProjectManager.Application.Options;
using MediatR;
using Microsoft.Extensions.Options;
using ProjectManager.Application.Common;
using ProjectManager.Domain.Contracts;
using AccessToken = ProjectManager.Domain.Entities.AccessToken;
using Microsoft.Extensions.Logging;

namespace ProjectManager.Application.Queries
{
    public record AuthenticateUserQuery(string Email, string Password) : IRequest<CommandResult>;

    public class AuthenticateUserQueryHandler : IRequestHandler<AuthenticateUserQuery, CommandResult>
    {
        private readonly ITokenRepository _tokenRepo;
        private readonly IUserRepository _userRepo;
        private readonly IOptions<AuthenticationOptions> _options;
        private readonly IPasswordHashingService _passwordHashingService;
        private readonly ILogger<AuthenticateUserQueryHandler> _logger;

        public AuthenticateUserQueryHandler(ITokenRepository tokenRepo, IUserRepository userRepo, IOptions<AuthenticationOptions> options, IPasswordHashingService passwordHashingService, ILogger<AuthenticateUserQueryHandler> logger)
        {
            _tokenRepo = tokenRepo;
            _userRepo = userRepo;
            _options = options;
            _passwordHashingService = passwordHashingService;
            _logger = logger;
        }

        public async Task<CommandResult> Handle(AuthenticateUserQuery request, CancellationToken cancellationToken)
        {
            try
            {
                var hashedPassword = _passwordHashingService.GetHashedPassword(request.Password);

                var user = await _userRepo.GetUserByEmail(request.Email);

                if (user is null || user.HashedPassword != hashedPassword)
                    return CommandResult.Failed("Incorrect email or password", 401);

                var token = new AccessToken
                {
                    //TokenId = Guid.NewGuid(),
                    UserId = user.Id,
                    ExpiresAt = DateTime.Now.Add(_options.Value.AccessTokenLifeTime)
                };

                token = await _tokenRepo.Add(token);

                if (token is null)
                    throw new Exception();

                return CommandResult.Success(token.TokenId);
            }
            catch (Exception e)
            {
                _logger.LogError("{e}", e.ToString());
                return CommandResult.InternalServerError(e);
            }
        }
    }
}
