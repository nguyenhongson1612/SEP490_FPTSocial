﻿using System;
using System.Collections.Generic;

namespace Domain.Models
{
    public partial class ReactGroupCommentPost
    {
        public string ReactGroupCommentPostId { get; set; } = null!;
        public string GroupPostId { get; set; } = null!;
        public string UserId { get; set; } = null!;
        public string ReactTypeId { get; set; } = null!;
        public string CommentGroupPostId { get; set; } = null!;
        public DateTime? CreatedDate { get; set; }

        public virtual CommentGroupPost CommentGroupPost { get; set; } = null!;
        public virtual GroupPost GroupPost { get; set; } = null!;
        public virtual ReactType ReactType { get; set; } = null!;
        public virtual UserProfile User { get; set; } = null!;
    }
}
