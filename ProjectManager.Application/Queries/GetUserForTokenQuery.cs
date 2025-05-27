using MediatR;
using Newtonsoft.Json;
using ProjectManager.Application.Common;
using ProjectManager.Application.Models;
using ProjectManager.Domain.Contracts;

namespace ProjectManager.Application.Queries
{
    public record GetUserForTokenQuery(Guid TokenId) : IRequest<CommandResult>;

    public class GetUserForTokenQueryHandler : IRequestHandler<GetUserForTokenQuery, CommandResult>
    {
        private readonly ITokenRepository _tokenRepo;
        private readonly IMediator _mediator;

        public GetUserForTokenQueryHandler(ITokenRepository tokenRepo, IMediator mediator)
        {
            _tokenRepo = tokenRepo;
            _mediator = mediator;
        }

        public async Task<CommandResult> Handle(GetUserForTokenQuery request, CancellationToken cancellationToken)
        {
            try
            {
                var token = await _tokenRepo.Get(request.TokenId);
                
                if (token is null)
                    return CommandResult.Failed("User not found", 404);

                var userId = token.UserId;
                
                var user = await _mediator.Send(new GetUserByIdQuery((int)userId), cancellationToken);

                Console.WriteLine(JsonConvert.SerializeObject(user));

                return user is not null
                    ? CommandResult.Success(user.ReturnValue as UserDto)
                    : CommandResult.Failed("User not found", 404);
            }
            catch (Exception e)
            {
                return CommandResult.InternalServerError(e);
            }
        }
    }
}
