using Microsoft.AspNetCore.Mvc;
using PurchaseManagement.API.DTOs;
using PurchaseManagement.API.Repositories;

namespace PurchaseManagement.API.Controllers;

[ApiController]
[Route("api/locations")]
public class LocationsController : ControllerBase
{
    private readonly ILocationRepository _repo;
    public LocationsController(ILocationRepository repo) => _repo = repo;

    [HttpGet]
    public async Task<ActionResult<List<LocationDto>>> GetAll()
    {
        var locations = await _repo.GetAllAsync();
        return locations.Select(l => new LocationDto { Id = l.Id, Code = l.Code, Name = l.Name }).ToList();
    }
}
