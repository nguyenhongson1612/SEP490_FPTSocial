using System;
using System.Collections.Generic;

namespace Domain.Models
{
    public partial class GroupSharePost
    {
        public string GroupSharePostId { get; set; } = null!;
        public string GroupPostId { get; set; } = null!;
        public string UserId { get; set; } = null!;
        public string? SharedToUserId { get; set; }
        public DateTime? CreatedDate { get; set; }

        public virtual GroupPost GroupPost { get; set; } = null!;
        public virtual UserProfile? SharedToUser { get; set; }
        public virtual UserProfile User { get; set; } = null!;
    }
}
