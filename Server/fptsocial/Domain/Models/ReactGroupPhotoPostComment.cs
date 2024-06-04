using System;
using System.Collections.Generic;

namespace Domain.Models
{
    public partial class ReactGroupPhotoPostComment
    {
        public string ReactPhotoPostCommentId { get; set; } = null!;
        public string GroupPostPhotoId { get; set; } = null!;
        public string UserId { get; set; } = null!;
        public string ReactTypeId { get; set; } = null!;
        public string CommentPhotoGroupPostId { get; set; } = null!;
        public DateTime? CreatedDate { get; set; }

        public virtual CommentPhotoGroupPost CommentPhotoGroupPost { get; set; } = null!;
        public virtual GroupPostPhoto GroupPostPhoto { get; set; } = null!;
        public virtual ReactType ReactType { get; set; } = null!;
        public virtual UserProfile User { get; set; } = null!;
    }
}
