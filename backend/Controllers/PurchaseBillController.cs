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
    public async Task<IActionResult> GetAll() => Ok(await _service.GetAllAsync());

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var bill = await _service.GetByIdAsync(id);
        return bill == null ? NotFound() : Ok(bill);
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreatePurchaseBillDto dto)
    {
        var result = await _service.CreateAsync(dto);
        return CreatedAtAction(nameof(GetById), new { id = result.Id }, result);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, [FromBody] CreatePurchaseBillDto dto)
    {
        var result = await _service.UpdateAsync(id, dto);
        return result == null ? NotFound() : Ok(result);
    }
}
