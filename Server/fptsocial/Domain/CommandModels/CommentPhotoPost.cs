﻿using System;
using System.Collections.Generic;

namespace Domain.CommandModels
{
    public partial class CommentPhotoPost
    {
        public CommentPhotoPost()
        {
            ReactPhotoPostComments = new HashSet<ReactPhotoPostComment>();
            ReportComments = new HashSet<ReportComment>();
        }

        public Guid CommentPhotoPostId { get; set; }
        public Guid UserPostPhotoId { get; set; }
        public Guid UserId { get; set; }
        public string? Content { get; set; }
        public Guid? ParentCommentId { get; set; }
        public int? ListNumber { get; set; }
        public int? LevelCmt { get; set; }
        public bool? IsHide { get; set; }
        public DateTime? CreatedDate { get; set; }

        public virtual UserProfile User { get; set; } = null!;
        public virtual UserPostPhoto UserPostPhoto { get; set; } = null!;
        public virtual ICollection<ReactPhotoPostComment> ReactPhotoPostComments { get; set; }
        public virtual ICollection<ReportComment> ReportComments { get; set; }
    }
}
