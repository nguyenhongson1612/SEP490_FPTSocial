using System;
using System.Collections.Generic;

namespace Domain.Models
{
    public partial class Photo
    {
        public Photo()
        {
            UserPostPhotos = new HashSet<UserPostPhoto>();
        }

        public string PhotoId { get; set; } = null!;
        public string PhotoUrl { get; set; } = null!;
        public string? PhotoBigUrl { get; set; }
        public string? PhotoSmallUrl { get; set; }
        public string UserId { get; set; } = null!;
        public string? PhotoNumber { get; set; }
        public string UserStatusId { get; set; } = null!;
        public DateTime? CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }

        public virtual UserProfile User { get; set; } = null!;
        public virtual UserStatus UserStatus { get; set; } = null!;
        public virtual ICollection<UserPostPhoto> UserPostPhotos { get; set; }
    }
}
