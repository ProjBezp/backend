using ProjectManager.Domain.Entities;

namespace ProjectManager.Domain.Contracts
{
    public interface ITokenRepository
    {
        Task Commit();
        Task<AccessToken?> Get(int userId);
        Task<AccessToken?> Get(Guid id);
        Task Add(AccessToken token);
        Task Remove(AccessToken token);
    }
}
