using System;
using System.Collections.Generic;

namespace Domain.Models
{
    public partial class CommentPhotoGroupPost
    {
        public CommentPhotoGroupPost()
        {
            ReactGroupPhotoPostComments = new HashSet<ReactGroupPhotoPostComment>();
            ReportComments = new HashSet<ReportComment>();
        }

        public string CommentPhotoGroupPostId { get; set; } = null!;
        public string GroupPostPhotoId { get; set; } = null!;
        public string UserId { get; set; } = null!;
        public string? Content { get; set; }
        public string? ParentCommentId { get; set; }
        public bool? IsHide { get; set; }
        public string GroupStatusId { get; set; } = null!;
        public DateTime? CreatedDate { get; set; }

        public virtual GroupPostPhoto GroupPostPhoto { get; set; } = null!;
        public virtual GroupStatus GroupStatus { get; set; } = null!;
        public virtual UserProfile User { get; set; } = null!;
        public virtual ICollection<ReactGroupPhotoPostComment> ReactGroupPhotoPostComments { get; set; }
        public virtual ICollection<ReportComment> ReportComments { get; set; }
    }
}
