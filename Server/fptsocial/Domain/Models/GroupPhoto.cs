using System;
using System.Collections.Generic;

namespace Domain.Models
{
    public partial class GroupPhoto
    {
        public GroupPhoto()
        {
            GroupPostPhotos = new HashSet<GroupPostPhoto>();
        }

        public string GroupPhotoId { get; set; } = null!;
        public string PhotoUrl { get; set; } = null!;
        public string? PhotoBigUrl { get; set; }
        public string? GroupPhotoNumber { get; set; }
        public string? PhotoSmallUrl { get; set; }
        public string GroupId { get; set; } = null!;
        public string UserStatusId { get; set; } = null!;
        public DateTime? CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }

        public virtual GroupFpt Group { get; set; } = null!;
        public virtual UserStatus UserStatus { get; set; } = null!;
        public virtual ICollection<GroupPostPhoto> GroupPostPhotos { get; set; }
    }
}
