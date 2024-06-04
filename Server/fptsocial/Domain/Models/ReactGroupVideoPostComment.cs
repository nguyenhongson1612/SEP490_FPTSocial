using System;
using System.Collections.Generic;

namespace Domain.Models
{
    public partial class ReactGroupVideoPostComment
    {
        public string ReactGroupVideoCommentId { get; set; } = null!;
        public string GroupPostVideoId { get; set; } = null!;
        public string UserId { get; set; } = null!;
        public string ReactTypeId { get; set; } = null!;
        public string CommentGroupVideoPostId { get; set; } = null!;
        public DateTime? CreatedDate { get; set; }

        public virtual CommentGroupVideoPost CommentGroupVideoPost { get; set; } = null!;
        public virtual GroupPostVideo GroupPostVideo { get; set; } = null!;
        public virtual ReactType ReactType { get; set; } = null!;
        public virtual UserProfile User { get; set; } = null!;
    }
}
