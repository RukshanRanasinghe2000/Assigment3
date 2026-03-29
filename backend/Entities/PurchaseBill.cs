namespace PurchaseManagement.API.Entities;

public class PurchaseBill
{
    public int Id { get; set; }
    public string BillNumber { get; set; } = string.Empty;
    public DateTime BillDate { get; set; }
    public string SupplierName { get; set; } = string.Empty;
    public string Notes { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? UpdatedAt { get; set; }
    public ICollection<PurchaseBillItem> Items { get; set; } = new List<PurchaseBillItem>();
}
