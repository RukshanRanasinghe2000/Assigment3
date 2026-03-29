using Microsoft.AspNetCore.Mvc;
using PurchaseManagement.API.DTOs;
using PurchaseManagement.API.Repositories;

namespace PurchaseManagement.API.Controllers;

[ApiController]
[Route("api/audit-logs")]
public class AuditLogsController : ControllerBase
{
    private readonly IAuditLogRepository _repo;
    public AuditLogsController(IAuditLogRepository repo) => _repo = repo;

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var logs = await _repo.GetAllAsync();
        return Ok(logs.Select(l => new AuditLogDto
        {
            Id = l.Id,
            Entity = l.Entity,
            Action = l.Action,
            OldValue = l.OldValue,
            NewValue = l.NewValue,
            CreatedAt = l.CreatedAt
        }));
    }
}
