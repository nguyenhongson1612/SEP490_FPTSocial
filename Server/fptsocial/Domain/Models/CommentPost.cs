using System;
using System.Collections.Generic;

namespace Domain.Models
{
    public partial class CommentPost
    {
        public CommentPost()
        {
            ReactComments = new HashSet<ReactComment>();
            ReportComments = new HashSet<ReportComment>();
        }

        public string CommentId { get; set; } = null!;
        public string UserPostId { get; set; } = null!;
        public string UserId { get; set; } = null!;
        public string? Content { get; set; }
        public string? ParentCommentId { get; set; }
        public string UserStatusId { get; set; } = null!;
        public bool? IsHide { get; set; }
        public DateTime? CreatedDate { get; set; }

        public virtual UserProfile User { get; set; } = null!;
        public virtual UserPost UserPost { get; set; } = null!;
        public virtual UserStatus UserStatus { get; set; } = null!;
        public virtual ICollection<ReactComment> ReactComments { get; set; }
        public virtual ICollection<ReportComment> ReportComments { get; set; }
    }
}
