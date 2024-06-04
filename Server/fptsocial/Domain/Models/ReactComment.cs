using System;
using System.Collections.Generic;

namespace Domain.Models
{
    public partial class ReactComment
    {
        public string ReactCommentId { get; set; } = null!;
        public string UserPostId { get; set; } = null!;
        public string UserId { get; set; } = null!;
        public string ReactTypeId { get; set; } = null!;
        public string CommentId { get; set; } = null!;
        public DateTime? CreatedDate { get; set; }

        public virtual CommentPost Comment { get; set; } = null!;
        public virtual ReactType ReactType { get; set; } = null!;
        public virtual UserProfile User { get; set; } = null!;
        public virtual UserPost UserPost { get; set; } = null!;
    }
}
