using System;
using System.Collections.Generic;

namespace Domain.Models
{
    public partial class ReportComment
    {
        public string ReportCommentId { get; set; } = null!;
        public string ReportTypeId { get; set; } = null!;
        public string CommentId { get; set; } = null!;
        public string CommentPhotoPostId { get; set; } = null!;
        public string CommentVideoPostId { get; set; } = null!;
        public string CommentGroupPostId { get; set; } = null!;
        public string CommentPhotoGroupPostId { get; set; } = null!;
        public string CommentGroupVideoPostId { get; set; } = null!;
        public string ReportById { get; set; } = null!;
        public bool? ReportStatus { get; set; }
        public DateTime? CreatedDate { get; set; }

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
