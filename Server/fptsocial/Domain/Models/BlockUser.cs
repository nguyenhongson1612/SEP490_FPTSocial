using System;
using System.Collections.Generic;

namespace Domain.Models
{
    public partial class BlockUser
    {
        public string BlockUserId { get; set; } = null!;
        public string UserId { get; set; } = null!;
        public string UserIsBlockedId { get; set; } = null!;
        public string? BlockTypeId { get; set; }
        public bool? IsBolck { get; set; }
        public DateTime? CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }

        public virtual BlockType? BlockType { get; set; }
        public virtual UserProfile User { get; set; } = null!;
        public virtual UserProfile UserIsBlocked { get; set; } = null!;
    }
}
