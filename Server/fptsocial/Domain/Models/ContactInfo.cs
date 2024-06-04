using System;
using System.Collections.Generic;

namespace Domain.Models
{
    public partial class ContactInfo
    {
        public string ContactInfoId { get; set; } = null!;
        public string? SecondEmail { get; set; }
        public string PrimaryNumber { get; set; } = null!;
        public string? SecondNumber { get; set; }
        public string UserId { get; set; } = null!;
        public string UserStatusId { get; set; } = null!;
        public DateTime? CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }

        public virtual UserProfile User { get; set; } = null!;
        public virtual UserStatus UserStatus { get; set; } = null!;
    }
}
