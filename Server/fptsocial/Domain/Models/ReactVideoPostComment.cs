using System;
using System.Collections.Generic;

namespace Domain.Models
{
    public partial class ReactVideoPostComment
    {
        public string ReactVideoPostCommentId { get; set; } = null!;
        public string UserPostVideoId { get; set; } = null!;
        public string UserId { get; set; } = null!;
        public string ReactTypeId { get; set; } = null!;
        public string CommentVideoPostId { get; set; } = null!;
        public DateTime? CreatedDate { get; set; }

        public virtual CommentVideoPost CommentVideoPost { get; set; } = null!;
        public virtual ReactType ReactType { get; set; } = null!;
        public virtual UserProfile User { get; set; } = null!;
        public virtual UserPostVideo UserPostVideo { get; set; } = null!;
    }
}
