using System;
using System.Collections.Generic;

namespace Domain.Models
{
    public partial class ReactPhotoPost
    {
        public string ReactPhotoPostId { get; set; } = null!;
        public string UserPostPhotoId { get; set; } = null!;
        public string UserId { get; set; } = null!;
        public string ReactTypeId { get; set; } = null!;
        public DateTime? CreatedDate { get; set; }

        public virtual ReactType ReactType { get; set; } = null!;
        public virtual UserProfile User { get; set; } = null!;
        public virtual UserPostPhoto UserPostPhoto { get; set; } = null!;
    }
}
