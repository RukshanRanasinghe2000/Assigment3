namespace PurchaseManagement.API.Repositories;

public interface IItemRepository
{
    Task<IEnumerable<Entities.Item>> GetAllAsync();
}

public interface ILocationRepository
{
    Task<IEnumerable<Entities.Location>> GetAllAsync();
}

public interface IPurchaseBillRepository
{
    Task<IEnumerable<Entities.PurchaseBill>> GetAllAsync();
    Task<Entities.PurchaseBill?> GetByIdAsync(int id);
    Task<Entities.PurchaseBill> CreateAsync(Entities.PurchaseBill bill);
    Task<Entities.PurchaseBill> UpdateAsync(Entities.PurchaseBill bill);
}

public interface IAuditLogRepository
{
    Task LogAsync(string entity, string action, string? oldValue, string? newValue);
    Task<IEnumerable<Entities.AuditLog>> GetAllAsync();
}
