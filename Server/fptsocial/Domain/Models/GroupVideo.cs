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

        public string GroupVideoId { get; set; } = null!;
        public string VideoUrl { get; set; } = null!;
        public string GroupId { get; set; } = null!;
        public string? GroupVideoNumber { get; set; }
        public string UserStatusId { get; set; } = null!;
        public DateTime? CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }

        public virtual GroupFpt Group { get; set; } = null!;
        public virtual UserStatus UserStatus { get; set; } = null!;
        public virtual ICollection<GroupPostVideo> GroupPostVideos { get; set; }
    }
}
