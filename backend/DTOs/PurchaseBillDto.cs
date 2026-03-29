namespace PurchaseManagement.API.DTOs;

public class PurchaseBillDto
{
    public int Id { get; set; }
    public string BillNumber { get; set; } = string.Empty;
    public DateTime BillDate { get; set; }
    public string SupplierName { get; set; } = string.Empty;
    public string Notes { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
    public List<PurchaseBillItemDto> Items { get; set; } = new();
}

public class PurchaseBillItemDto
{
    public int Id { get; set; }
    public int ItemId { get; set; }
    public string ItemName { get; set; } = string.Empty;
    public int LocationId { get; set; }
    public string LocationName { get; set; } = string.Empty;
    public decimal Cost { get; set; }
    public decimal Price { get; set; }
    public int Quantity { get; set; }
    public decimal DiscountPercent { get; set; }
    public decimal TotalCost { get; set; }
    public decimal TotalSelling { get; set; }
}

public class CreatePurchaseBillDto
{
    public string BillNumber { get; set; } = string.Empty;
    public DateTime BillDate { get; set; }
    public string SupplierName { get; set; } = string.Empty;
    public string Notes { get; set; } = string.Empty;
    public List<CreatePurchaseBillItemDto> Items { get; set; } = new();
}

public class CreatePurchaseBillItemDto
{
    public int ItemId { get; set; }
    public int LocationId { get; set; }
    public decimal Cost { get; set; }
    public decimal Price { get; set; }
    public int Quantity { get; set; }
    public decimal DiscountPercent { get; set; }
}

public class ItemDto
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
}

public class LocationDto
{
    public int Id { get; set; }
    public string Code { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
}

public class AuditLogDto
{
    public int Id { get; set; }
    public string Entity { get; set; } = string.Empty;
    public string Action { get; set; } = string.Empty;
    public string? OldValue { get; set; }
    public string? NewValue { get; set; }
    public DateTime CreatedAt { get; set; }
}
