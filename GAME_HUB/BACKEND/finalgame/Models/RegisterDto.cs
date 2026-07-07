using System.ComponentModel.DataAnnotations;

namespace finalgame.Models
{
    public class RegisterDto
    {
        [Required]
        [MinLength(3, ErrorMessage = "Username must be at least 3 characters.")]
        public string? Username { get; set; }

        [Required]
        [EmailAddress(ErrorMessage = "Invalid email address.")]
        public string? Email { get; set; }

        [Required]
        [MinLength(6, ErrorMessage = "Password must be at least 6 characters.")]
        public string? Password { get; set; }
    }
}