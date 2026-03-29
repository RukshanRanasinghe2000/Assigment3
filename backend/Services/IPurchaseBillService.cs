using PurchaseManagement.API.DTOs;

namespace PurchaseManagement.API.Services;

public interface IPurchaseBillService
{
    Task<IEnumerable<PurchaseBillDto>> GetAllAsync();
    Task<PurchaseBillDto?> GetByIdAsync(int id);
    Task<PurchaseBillDto> CreateAsync(CreatePurchaseBillDto dto);
    Task<PurchaseBillDto?> UpdateAsync(int id, CreatePurchaseBillDto dto);
}
