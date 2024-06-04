using System;
using System.Collections.Generic;

namespace Domain.Models
{
    public partial class CommentGroupPost
    {
        public CommentGroupPost()
        {
            ReactGroupCommentPosts = new HashSet<ReactGroupCommentPost>();
            ReportComments = new HashSet<ReportComment>();
        }

        public string CommentGroupPostId { get; set; } = null!;
        public string GroupPostId { get; set; } = null!;
        public string UserId { get; set; } = null!;
        public string? Content { get; set; }
        public string? ParentCommentId { get; set; }
        public bool? IsHide { get; set; }
        public string GroupStatusId { get; set; } = null!;
        public DateTime? CreatedDate { get; set; }

        public virtual GroupPost GroupPost { get; set; } = null!;
        public virtual GroupStatus GroupStatus { get; set; } = null!;
        public virtual UserProfile User { get; set; } = null!;
        public virtual ICollection<ReactGroupCommentPost> ReactGroupCommentPosts { get; set; }
        public virtual ICollection<ReportComment> ReportComments { get; set; }
    }
}
