using MediatR;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Newtonsoft.Json;
using ProjectManager.Application.Common;
using ProjectManager.Application.Options;
using ProjectManager.Domain.Contracts;

namespace ProjectManager.Application.Queries
{
    public record AuthenticateTokenQuery(Guid TokenId) : IRequest<CommandResult>;

    public class AuthenticateTokenQueryHandler : IRequestHandler<AuthenticateTokenQuery, CommandResult>
    {
        private readonly ITokenRepository _repo;
        private readonly IOptions<AuthenticationOptions> _options;
        private readonly ILogger<AuthenticateTokenQueryHandler> _logger;

        public AuthenticateTokenQueryHandler(ITokenRepository repo, IOptions<AuthenticationOptions> options, ILogger<AuthenticateTokenQueryHandler> logger)
        {
            _repo = repo;
            _options = options;
            _logger = logger;
        }

        public async Task<CommandResult> Handle(AuthenticateTokenQuery request, CancellationToken cancellationToken)
        {
            try
            {
                var token = await _repo.Get(request.TokenId);

                _logger.LogInformation("{x}", JsonConvert.SerializeObject(token));
                if (token is null)
                    return CommandResult.Failed("Not authorized", 401);

                if (token.ExpiresAt < DateTime.Now)
                {
                    _logger.LogInformation("Token {x} expired", token.TokenId);
                    await _repo.Remove(token);
                    return CommandResult.Failed("Not authorized", 401);
                }


                _logger.LogInformation("Token {x} is correct and not expired", token.TokenId);
                token.ExpiresAt = DateTime.Now.Add(_options.Value.AccessTokenLifeTime);
                await _repo.Commit();

                return CommandResult.Success(token.TokenId);
            }
            catch (Exception e)
            {
                return CommandResult.InternalServerError(e);
            }
        }
    }
}
