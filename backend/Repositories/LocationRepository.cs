using Microsoft.EntityFrameworkCore;
using PurchaseManagement.API.Data;
using PurchaseManagement.API.Entities;

namespace PurchaseManagement.API.Repositories;

public class LocationRepository : ILocationRepository
{
    private readonly AppDbContext _db;
    public LocationRepository(AppDbContext db) => _db = db;

    public async Task<IEnumerable<Location>> GetAllAsync() =>
        await _db.Locations.OrderBy(l => l.Code).ToListAsync();
}
