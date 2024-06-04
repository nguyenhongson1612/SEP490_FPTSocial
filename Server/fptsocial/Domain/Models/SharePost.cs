using System;
using System.Collections.Generic;

namespace Domain.Models
{
    public partial class SharePost
    {
        public string SharePostId { get; set; } = null!;
        public string UserPostId { get; set; } = null!;
        public string UserId { get; set; } = null!;
        public string? SharedToUserId { get; set; }
        public DateTime? CreatedDate { get; set; }

        public virtual UserProfile? SharedToUser { get; set; }
        public virtual UserProfile User { get; set; } = null!;
        public virtual UserPost UserPost { get; set; } = null!;
    }
}
