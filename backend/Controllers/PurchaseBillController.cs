using Microsoft.AspNetCore.Mvc;
using PurchaseManagement.API.DTOs;
using PurchaseManagement.API.Services;

namespace PurchaseManagement.API.Controllers;

[ApiController]
[Route("api/purchase-bill")]
public class PurchaseBillController : ControllerBase
{
    private readonly IPurchaseBillService _service;
    public PurchaseBillController(IPurchaseBillService service) => _service = service;

    [HttpGet]
    public async Task<ActionResult<List<PurchaseBillDto>>> GetAll()
    {
        var result = await _service.GetAllAsync();
        return result.ToList();
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<PurchaseBillDto>> GetById(int id)
    {
        var bill = await _service.GetByIdAsync(id);
        if (bill == null) return NotFound();
        return bill;
    }

    [HttpPost]
    public async Task<ActionResult<PurchaseBillDto>> Create([FromBody] CreatePurchaseBillDto dto)
    {
        var result = await _service.CreateAsync(dto);
        return CreatedAtAction(nameof(GetById), new { id = result.Id }, result);
    }

    [HttpPut("{id}")]
    public async Task<ActionResult<PurchaseBillDto>> Update(int id, [FromBody] CreatePurchaseBillDto dto)
    {
        var result = await _service.UpdateAsync(id, dto);
        if (result == null) return NotFound();
        return result;
    }
}
