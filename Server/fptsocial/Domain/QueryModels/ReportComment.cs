using System;
using System.Collections.Generic;

namespace Domain.QueryModels
{
    public partial class ReportComment
    {
        public Guid ReportCommentId { get; set; }
        public Guid ReportTypeId { get; set; }
        public Guid CommentId { get; set; }
        public Guid CommentPhotoPostId { get; set; }
        public Guid CommentVideoPostId { get; set; }
        public Guid CommentGroupPostId { get; set; }
        public Guid CommentPhotoGroupPostId { get; set; }
        public Guid CommentGroupVideoPostId { get; set; }
        public Guid ReportById { get; set; }
        public string? Conetent { get; set; }
        public bool? ReportStatus { get; set; }
        public DateTime? CreatedDate { get; set; }
        public string? Content { get; set; }
        public bool? Processing { get; set; }

        public virtual CommentPost Comment { get; set; } = null!;
        public virtual CommentGroupPost CommentGroupPost { get; set; } = null!;
        public virtual CommentGroupVideoPost CommentGroupVideoPost { get; set; } = null!;
        public virtual CommentPhotoGroupPost CommentPhotoGroupPost { get; set; } = null!;
        public virtual CommentPhotoPost CommentPhotoPost { get; set; } = null!;
        public virtual CommentVideoPost CommentVideoPost { get; set; } = null!;
        public virtual UserProfile ReportBy { get; set; } = null!;
        public virtual ReportType ReportType { get; set; } = null!;
    }
}
