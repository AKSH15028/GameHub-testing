namespace finalgame.Models
{
    public class UpdateProfileDto
    {
        public string Username { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string? NewPassword { get; set; }
    }
}
