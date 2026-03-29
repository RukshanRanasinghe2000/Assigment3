using Microsoft.EntityFrameworkCore;
using PurchaseManagement.API.Data;
using PurchaseManagement.API.Entities;

namespace PurchaseManagement.API.Repositories;

public class AuditLogRepository : IAuditLogRepository
{
    private readonly AppDbContext _db;
    public AuditLogRepository(AppDbContext db) => _db = db;

    public async Task LogAsync(string entity, string action, string? oldValue, string? newValue)
    {
        _db.AuditLogs.Add(new AuditLog
        {
            Entity = entity,
            Action = action,
            OldValue = oldValue,
            NewValue = newValue,
            CreatedAt = DateTime.UtcNow
        });
        await _db.SaveChangesAsync();
    }

    public async Task<IEnumerable<AuditLog>> GetAllAsync() =>
        await _db.AuditLogs.OrderByDescending(a => a.CreatedAt).ToListAsync();
}
