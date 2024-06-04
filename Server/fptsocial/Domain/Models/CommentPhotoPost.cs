using System;
using System.Collections.Generic;

namespace Domain.Models
{
    public partial class CommentPhotoPost
    {
        public CommentPhotoPost()
        {
            ReactPhotoPostComments = new HashSet<ReactPhotoPostComment>();
            ReportComments = new HashSet<ReportComment>();
        }

        public string CommentPhotoPostId { get; set; } = null!;
        public string UserPostPhotoId { get; set; } = null!;
        public string UserId { get; set; } = null!;
        public string? Content { get; set; }
        public string? ParentCommentId { get; set; }
        public bool? IsHide { get; set; }
        public string UserStatusId { get; set; } = null!;
        public DateTime? CreatedDate { get; set; }

        public virtual UserProfile User { get; set; } = null!;
        public virtual UserPostPhoto UserPostPhoto { get; set; } = null!;
        public virtual UserStatus UserStatus { get; set; } = null!;
        public virtual ICollection<ReactPhotoPostComment> ReactPhotoPostComments { get; set; }
        public virtual ICollection<ReportComment> ReportComments { get; set; }
    }
}
