using System;
using System.Collections.Generic;

namespace Domain.Models
{
    public partial class ReactGroupPhotoPost
    {
        public string ReactGroupPhotoPostId { get; set; } = null!;
        public string GroupPostPhotoId { get; set; } = null!;
        public string UserId { get; set; } = null!;
        public string ReactTypeId { get; set; } = null!;
        public DateTime? CreatedDate { get; set; }

        public virtual GroupPostPhoto GroupPostPhoto { get; set; } = null!;
        public virtual ReactType ReactType { get; set; } = null!;
        public virtual UserProfile User { get; set; } = null!;
    }
}
