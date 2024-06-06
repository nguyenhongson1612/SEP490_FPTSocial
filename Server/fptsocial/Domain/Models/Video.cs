﻿using System;
using System.Collections.Generic;

namespace Domain.Models
{
    public partial class Video
    {
        public Video()
        {
            UserPostVideos = new HashSet<UserPostVideo>();
        }

        public Guid VideoId { get; set; }
        public string VideoUrl { get; set; } = null!;
        public Guid UserId { get; set; }
        public Guid UserStatusId { get; set; }
        public string? VideoNumber { get; set; }
        public DateTime? CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }

        public virtual UserProfile User { get; set; } = null!;
        public virtual UserStatus UserStatus { get; set; } = null!;
        public virtual ICollection<UserPostVideo> UserPostVideos { get; set; }
    }
}
