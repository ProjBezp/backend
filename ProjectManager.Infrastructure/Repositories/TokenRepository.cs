using Microsoft.EntityFrameworkCore;
using ProjectManager.Domain.Contracts;
using ProjectManager.Domain.Entities;
using ProjectManager.Infrastructure.Persistence;

namespace ProjectManager.Infrastructure.Repositories
{
    public sealed class TokenRepository : ITokenRepository
    {
        private readonly AppDbContext _db;

        public TokenRepository(AppDbContext db)
        {
            _db = db;
        }

        public async Task Add(AccessToken token)
        {
            await _db.Tokens.AddAsync(token);
            await Commit();
        }

        public async Task Commit()
        {
            await _db.SaveChangesAsync();
        }

        public async Task<AccessToken?> Get(int userId)
        {
            return await _db.Tokens.Where(x => x.UserId == userId).FirstOrDefaultAsync();
        }

        public async Task<AccessToken?> Get(Guid id)
        {
            return await _db.Tokens.Where(x => x.TokenId == id).FirstOrDefaultAsync();
        }

        public async Task Remove(AccessToken token)
        {
            _db.Remove(token);
            await Commit();
        }
    }
}
