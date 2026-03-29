using Microsoft.EntityFrameworkCore;
using PurchaseManagement.API.Data;
using PurchaseManagement.API.Entities;
using System.Linq;

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
        // Remove old items first to avoid EF tracking conflicts
        var oldItems = await _db.PurchaseBillItems
            .Where(i => i.PurchaseBillId == bill.Id)
            .ToListAsync();
        _db.PurchaseBillItems.RemoveRange(oldItems);

        _db.Entry(bill).State = EntityState.Modified;
        foreach (var item in bill.Items)
        {
            item.Id = 0; // ensure new insert
            _db.PurchaseBillItems.Add(item);
        }

        await _db.SaveChangesAsync();
        return bill;
    }
}
