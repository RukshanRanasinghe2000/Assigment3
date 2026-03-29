using Microsoft.EntityFrameworkCore;
using PurchaseManagement.API.Entities;

namespace PurchaseManagement.API.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<Item> Items => Set<Item>();
    public DbSet<Location> Locations => Set<Location>();
    public DbSet<PurchaseBill> PurchaseBills => Set<PurchaseBill>();
    public DbSet<PurchaseBillItem> PurchaseBillItems => Set<PurchaseBillItem>();
    public DbSet<AuditLog> AuditLogs => Set<AuditLog>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<PurchaseBillItem>()
            .Property(x => x.Cost).HasPrecision(18, 2);
        modelBuilder.Entity<PurchaseBillItem>()
            .Property(x => x.Price).HasPrecision(18, 2);
        modelBuilder.Entity<PurchaseBillItem>()
            .Property(x => x.DiscountPercent).HasPrecision(5, 2);
        modelBuilder.Entity<PurchaseBillItem>()
            .Property(x => x.TotalCost).HasPrecision(18, 2);
        modelBuilder.Entity<PurchaseBillItem>()
            .Property(x => x.TotalSelling).HasPrecision(18, 2);

        // Seed data
        modelBuilder.Entity<Location>().HasData(
            new Location { Id = 1, Code = "LOC001", Name = "Warehouse A" },
            new Location { Id = 2, Code = "LOC002", Name = "Warehouse B" },
            new Location { Id = 3, Code = "LOC003", Name = "Main Store" }
        );

        modelBuilder.Entity<Item>().HasData(
            new Item { Id = 1, Name = "Mango" },
            new Item { Id = 2, Name = "Apple" },
            new Item { Id = 3, Name = "Banana" },
            new Item { Id = 4, Name = "Orange" },
            new Item { Id = 5, Name = "Grapes" },
            new Item { Id = 6, Name = "Kiwi" },
            new Item { Id = 7, Name = "Strawberry" }
        );
    }
}
