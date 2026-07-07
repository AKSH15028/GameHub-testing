using System.ComponentModel.DataAnnotations;

namespace finalgame.Models
{
    public class UpdateProfileDto
    {
        [Required]
        public string Username { get; set; } = string.Empty;

        [Required]
        [EmailAddress]
        public string Email { get; set; } = string.Empty;

        public string Bio { get; set; } = string.Empty;

        public string? NewPassword { get; set; }
    }
}
