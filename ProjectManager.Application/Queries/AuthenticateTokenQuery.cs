using MediatR;
using Microsoft.Extensions.Options;
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

        public AuthenticateTokenQueryHandler(ITokenRepository repo, IOptions<AuthenticationOptions> options)
        {
            _repo = repo;
            _options = options;
        }

        public async Task<CommandResult> Handle(AuthenticateTokenQuery request, CancellationToken cancellationToken)
        {
            try
            {
                var token = await _repo.Get(request.TokenId);

                if (token is null)
                    return CommandResult.Failed("Not authorized", 401);

                if (token.ExpiresAt < DateTime.Now.Add(_options.Value.AccessTokenLifeTime))
                {
                    await _repo.Remove(token);
                    return CommandResult.Failed("Not authorized", 401);
                }

                token.ExpiresAt = DateTime.Now.Add(_options.Value.AccessTokenLifeTime);
                await _repo.Commit();

                return CommandResult.Success(token);
            }
            catch (Exception e)
            {
                return CommandResult.InternalServerError(e);
            }
        }
    }
}
