﻿namespace Application.DTO.GetUserProfileDTO
{
    public class GetUserContactInfo
    {
        public string? SecondEmail { get; set; }
        public string PrimaryNumber { get; set; } = null!;
        public string? SecondNumber { get; set; }
        public string? UserId { get; set; } = null!;
        public string? StatusName { get; set; } = null!;
        public DateTime? CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
    }
}
