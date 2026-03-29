using Microsoft.EntityFrameworkCore;
using PurchaseManagement.API.Data;
using PurchaseManagement.API.Entities;

namespace PurchaseManagement.API.Repositories;

public class PurchaseBillRepository : IPurchaseBillRepository
{
    private readonly AppDbContext _db;
    public PurchaseBillRepository(AppDbContext db) => _db = db;

    public async Task<IEnumerable<PurchaseBill>> GetAllAsync() =>
        await _db.PurchaseBills
            .Include(b => b.Items).ThenInclude(i => i.Item)
            .Include(b => b.Items).ThenInclude(i => i.Location)
            .OrderByDescending(b => b.CreatedAt)
            .ToListAsync();

    public async Task<PurchaseBill?> GetByIdAsync(int id) =>
        await _db.PurchaseBills
            .Include(b => b.Items).ThenInclude(i => i.Item)
            .Include(b => b.Items).ThenInclude(i => i.Location)
            .FirstOrDefaultAsync(b => b.Id == id);

    public async Task<PurchaseBill> CreateAsync(PurchaseBill bill)
    {
        _db.PurchaseBills.Add(bill);
        await _db.SaveChangesAsync();
        return bill;
    }

    public async Task<PurchaseBill> UpdateAsync(PurchaseBill bill)
    {
        _db.PurchaseBills.Update(bill);
        await _db.SaveChangesAsync();
        return bill;
    }
}
