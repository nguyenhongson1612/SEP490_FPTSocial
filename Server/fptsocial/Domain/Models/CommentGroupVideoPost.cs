using System;
using System.Collections.Generic;

namespace Domain.Models
{
    public partial class CommentGroupVideoPost
    {
        public CommentGroupVideoPost()
        {
            ReactGroupVideoPostComments = new HashSet<ReactGroupVideoPostComment>();
            ReportComments = new HashSet<ReportComment>();
        }

        public string CommentGroupVideoPostId { get; set; } = null!;
        public string GroupPostVideoId { get; set; } = null!;
        public string UserId { get; set; } = null!;
        public string? Content { get; set; }
        public string? ParentCommentId { get; set; }
        public bool? IsHide { get; set; }
        public string GroupStatusId { get; set; } = null!;
        public DateTime? CreatedDate { get; set; }

        public virtual GroupPostVideo GroupPostVideo { get; set; } = null!;
        public virtual GroupStatus GroupStatus { get; set; } = null!;
        public virtual UserProfile User { get; set; } = null!;
        public virtual ICollection<ReactGroupVideoPostComment> ReactGroupVideoPostComments { get; set; }
        public virtual ICollection<ReportComment> ReportComments { get; set; }
    }
}
