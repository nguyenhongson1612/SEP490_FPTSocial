using System;
using System.Collections.Generic;

namespace Domain.Models
{
    public partial class Video
    {
        public Video()
        {
            UserPostVideos = new HashSet<UserPostVideo>();
        }

        public string VideoId { get; set; } = null!;
        public string VideoUrl { get; set; } = null!;
        public string UserId { get; set; } = null!;
        public string UserStatusId { get; set; } = null!;
        public string? VideoNumber { get; set; }
        public DateTime? CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }

        public virtual UserProfile User { get; set; } = null!;
        public virtual UserStatus UserStatus { get; set; } = null!;
        public virtual ICollection<UserPostVideo> UserPostVideos { get; set; }
    }
}
