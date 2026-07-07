using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;
using finalgame.Data;
using finalgame.Models;
using System.Security.Claims;

[Route("api/[controller]")]
[ApiController]
[Authorize]
public class ProfileController : ControllerBase
{
    private readonly AppDbContext _context;

    public ProfileController(AppDbContext context)
    {
        _context = context;
    }

    // GET: api/profile/me
    [HttpGet("me")]
    public async Task<ActionResult<UserProfileDto>> GetMyProfile()
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(userIdClaim) || !int.TryParse(userIdClaim, out int userId))
        {
            return Unauthorized();
        }

        var user = await _context.Users.FindAsync(userId);
        if (user == null) return NotFound();

        return new UserProfileDto
        {
            Id = user.Id,
            Username = user.Username,
            Email = user.Email,
            Bio = user.Bio
        };
    }

    // GET: api/profile/{id}
    [HttpGet("{id}")]
    public async Task<ActionResult<UserProfileDto>> GetProfile(int id)
    {
        var user = await _context.Users.FindAsync(id);
        if (user == null) return NotFound();

        return new UserProfileDto
        {
            Id = user.Id,
            Username = user.Username,
            Email = user.Email,
            Bio = user.Bio
        };
    }

    // PUT: api/profile/{id}
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateProfile(int id, [FromBody] UpdateProfileDto dto)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(userIdClaim) || !int.TryParse(userIdClaim, out int userId) || userId != id)
        {
            return Forbid();
        }

        var user = await _context.Users.FindAsync(id);
        if (user == null) return NotFound();

        // Validate email uniqueness if changing email
        if (dto.Email != user.Email && await _context.Users.AnyAsync(u => u.Email == dto.Email))
        {
            return BadRequest(new { message = "Email is already in use by another user." });
        }

        user.Username = dto.Username;
        user.Email = dto.Email;
        user.Bio = dto.Bio;

        if (!string.IsNullOrEmpty(dto.NewPassword))
        {
            var hasher = new Microsoft.AspNetCore.Identity.PasswordHasher<User>();
            user.PasswordHash = hasher.HashPassword(user, dto.NewPassword);
        }

        _context.Entry(user).State = EntityState.Modified;

        try
        {
            await _context.SaveChangesAsync();
        }
        catch (DbUpdateConcurrencyException)
        {
            if (!_context.Users.Any(e => e.Id == id)) return NotFound();
            else throw;
        }

        return Ok(new { message = "Profile updated successfully!" });
    }
}