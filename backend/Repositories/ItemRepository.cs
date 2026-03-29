using Microsoft.EntityFrameworkCore;
using PurchaseManagement.API.Data;
using PurchaseManagement.API.Entities;

namespace PurchaseManagement.API.Repositories;

public class ItemRepository : IItemRepository
{
    private readonly AppDbContext _db;
    public ItemRepository(AppDbContext db) => _db = db;

    public async Task<IEnumerable<Item>> GetAllAsync() =>
        await _db.Items.OrderBy(i => i.Name).ToListAsync();
}
