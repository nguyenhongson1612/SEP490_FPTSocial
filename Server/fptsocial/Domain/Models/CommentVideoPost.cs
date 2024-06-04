using System;
using System.Collections.Generic;

namespace Domain.Models
{
    public partial class CommentVideoPost
    {
        public CommentVideoPost()
        {
            ReactVideoPostComments = new HashSet<ReactVideoPostComment>();
            ReportComments = new HashSet<ReportComment>();
        }

        public string CommentVideoPostId { get; set; } = null!;
        public string UserPostVideoId { get; set; } = null!;
        public string UserId { get; set; } = null!;
        public string? Content { get; set; }
        public string? ParentCommentId { get; set; }
        public bool? IsHide { get; set; }
        public string UserStatusId { get; set; } = null!;
        public DateTime? CreatedDate { get; set; }

        public virtual UserProfile User { get; set; } = null!;
        public virtual UserPostVideo UserPostVideo { get; set; } = null!;
        public virtual UserStatus UserStatus { get; set; } = null!;
        public virtual ICollection<ReactVideoPostComment> ReactVideoPostComments { get; set; }
        public virtual ICollection<ReportComment> ReportComments { get; set; }
    }
}
