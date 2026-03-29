using Microsoft.AspNetCore.Mvc;
using PurchaseManagement.API.DTOs;
using PurchaseManagement.API.Repositories;

namespace PurchaseManagement.API.Controllers;

[ApiController]
[Route("api/items")]
public class ItemsController : ControllerBase
{
    private readonly IItemRepository _repo;
    public ItemsController(IItemRepository repo) => _repo = repo;

    [HttpGet]
    public async Task<ActionResult<List<ItemDto>>> GetAll()
    {
        var items = await _repo.GetAllAsync();
        return items.Select(i => new ItemDto { Id = i.Id, Name = i.Name }).ToList();
    }
}
