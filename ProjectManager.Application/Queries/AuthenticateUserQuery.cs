using ProjectManager.Application.Options;
using MediatR;
using Microsoft.Extensions.Options;
using ProjectManager.Application.Common;
using ProjectManager.Domain.Contracts;
using AccessToken = ProjectManager.Domain.Entities.AccessToken;

namespace ProjectManager.Application.Queries
{
    public record AuthenticateUserQuery(string Email, string Password) : IRequest<CommandResult>;

    public class AuthenticateUserQueryHandler : IRequestHandler<AuthenticateUserQuery, CommandResult>
    {
        private readonly ITokenRepository _tokenRepo;
        private readonly IUserRepository _userRepo;
        private readonly IOptions<AuthenticationOptions> _options;
        private readonly IPasswordHashingService _passwordHashingService;

        public AuthenticateUserQueryHandler(ITokenRepository tokenRepo, IUserRepository userRepo, IOptions<AuthenticationOptions> options, IPasswordHashingService passwordHashingService)
        {
            _tokenRepo = tokenRepo;
            _userRepo = userRepo;
            _options = options;
            _passwordHashingService = passwordHashingService;
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
                    TokenId = Guid.NewGuid(),
                    UserId = user.Id,
                    ExpiresAt = DateTime.Now.Add(_options.Value.AccessTokenLifeTime)
                };

                return CommandResult.Success(token);
            }
            catch (Exception e)
            {
                return CommandResult.InternalServerError(e);
            }
        }
    }
}
