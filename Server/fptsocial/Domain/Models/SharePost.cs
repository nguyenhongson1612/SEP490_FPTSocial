using System;
using System.Collections.Generic;

namespace Domain.Models
{
    public partial class SharePost
    {
        public string SharePostId { get; set; } = null!;
        public string UserId { get; set; } = null!;
        public string? Content { get; set; }
        public string? UserPostId { get; set; }
        public string? UserPostVideoId { get; set; }
        public string? UserPostPhotoId { get; set; }
        public string? GroupPostId { get; set; }
        public string? GroupPostPhotoId { get; set; }
        public string? GroupPostVideoId { get; set; }
        public string? SharedToUserId { get; set; }
        public DateTime? CreatedDate { get; set; }

        public virtual GroupPost? GroupPost { get; set; }
        public virtual GroupPostPhoto? GroupPostPhoto { get; set; }
        public virtual GroupPostVideo? GroupPostVideo { get; set; }
        public virtual UserProfile? SharedToUser { get; set; }
        public virtual UserProfile User { get; set; } = null!;
        public virtual UserPost? UserPost { get; set; }
        public virtual UserPostPhoto? UserPostPhoto { get; set; }
        public virtual UserPostVideo? UserPostVideo { get; set; }
    }
}
