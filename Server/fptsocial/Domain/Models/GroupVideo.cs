using System;
using System.Collections.Generic;

namespace Domain.Models
{
    public partial class GroupVideo
    {
        public GroupVideo()
        {
            GroupPostVideos = new HashSet<GroupPostVideo>();
        }

        public Guid GroupVideoId { get; set; }
        public string VideoUrl { get; set; } = null!;
        public Guid GroupId { get; set; }
        public string? GroupVideoNumber { get; set; }
        public Guid UserStatusId { get; set; }
        public DateTime? CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }

        public virtual GroupFpt Group { get; set; } = null!;
        public virtual UserStatus UserStatus { get; set; } = null!;
        public virtual ICollection<GroupPostVideo> GroupPostVideos { get; set; }
    }
}
