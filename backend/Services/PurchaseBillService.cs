using System.Text.Json;
using PurchaseManagement.API.DTOs;
using PurchaseManagement.API.Entities;
using PurchaseManagement.API.Repositories;

namespace PurchaseManagement.API.Services;

public class PurchaseBillService : IPurchaseBillService
{
    private readonly IPurchaseBillRepository _repo;
    private readonly IAuditLogRepository _audit;

    public PurchaseBillService(IPurchaseBillRepository repo, IAuditLogRepository audit)
    {
        _repo = repo;
        _audit = audit;
    }

    public async Task<IEnumerable<PurchaseBillDto>> GetAllAsync()
    {
        var bills = await _repo.GetAllAsync();
        return bills.Select(MapToDto);
    }

    public async Task<PurchaseBillDto?> GetByIdAsync(int id)
    {
        var bill = await _repo.GetByIdAsync(id);
        return bill == null ? null : MapToDto(bill);
    }

    public async Task<PurchaseBillDto> CreateAsync(CreatePurchaseBillDto dto)
    {
        var bill = new PurchaseBill
        {
            BillNumber = dto.BillNumber,
            BillDate = dto.BillDate,
            SupplierName = dto.SupplierName,
            Notes = dto.Notes,
            CreatedAt = DateTime.UtcNow,
            Items = dto.Items.Select(i => MapItemFromDto(i)).ToList()
        };

        var created = await _repo.CreateAsync(bill);
        var result = MapToDto(created);
        await _audit.LogAsync("PurchaseBill", "Create", null, JsonSerializer.Serialize(result));
        return result;
    }

    public async Task<PurchaseBillDto?> UpdateAsync(int id, CreatePurchaseBillDto dto)
    {
        var existing = await _repo.GetByIdAsync(id);
        if (existing == null) return null;

        var oldValue = JsonSerializer.Serialize(MapToDto(existing));

        existing.BillNumber = dto.BillNumber;
        existing.BillDate = dto.BillDate;
        existing.SupplierName = dto.SupplierName;
        existing.Notes = dto.Notes;
        existing.UpdatedAt = DateTime.UtcNow;
        existing.Items = dto.Items.Select(i => MapItemFromDto(i, id)).ToList();

        var updated = await _repo.UpdateAsync(existing);
        var result = MapToDto(updated);
        await _audit.LogAsync("PurchaseBill", "Update", oldValue, JsonSerializer.Serialize(result));
        return result;
    }

    private static PurchaseBillItem MapItemFromDto(CreatePurchaseBillItemDto i, int billId = 0)
    {
        var totalCost = (i.Cost * i.Quantity) - (i.Cost * i.Quantity * i.DiscountPercent / 100);
        var totalSelling = i.Price * i.Quantity;
        return new PurchaseBillItem
        {
            PurchaseBillId = billId,
            ItemId = i.ItemId,
            LocationId = i.LocationId,
            Cost = i.Cost,
            Price = i.Price,
            Quantity = i.Quantity,
            DiscountPercent = i.DiscountPercent,
            TotalCost = totalCost,
            TotalSelling = totalSelling
        };
    }

    private static PurchaseBillDto MapToDto(PurchaseBill b) => new()
    {
        Id = b.Id,
        BillNumber = b.BillNumber,
        BillDate = b.BillDate,
        SupplierName = b.SupplierName,
        Notes = b.Notes,
        CreatedAt = b.CreatedAt,
        UpdatedAt = b.UpdatedAt,
        Items = b.Items.Select(i => new PurchaseBillItemDto
        {
            Id = i.Id,
            ItemId = i.ItemId,
            ItemName = i.Item?.Name ?? string.Empty,
            LocationId = i.LocationId,
            LocationName = i.Location?.Name ?? string.Empty,
            Cost = i.Cost,
            Price = i.Price,
            Quantity = i.Quantity,
            DiscountPercent = i.DiscountPercent,
            TotalCost = i.TotalCost,
            TotalSelling = i.TotalSelling
        }).ToList()
    };
}
