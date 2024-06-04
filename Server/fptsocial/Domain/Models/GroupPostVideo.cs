using System;
using System.Collections.Generic;

namespace Domain.Models
{
    public partial class GroupPostVideo
    {
        public GroupPostVideo()
        {
            CommentGroupVideoPosts = new HashSet<CommentGroupVideoPost>();
            ReactGroupVideoPostComments = new HashSet<ReactGroupVideoPostComment>();
            ReactGroupVideoPosts = new HashSet<ReactGroupVideoPost>();
        }

        public string GroupPostVideoId { get; set; } = null!;
        public string GroupPostId { get; set; } = null!;
        public string GroupVideoId { get; set; } = null!;
        public string GroupStatusId { get; set; } = null!;
        public string? GroupPostVideoNumber { get; set; }
        public bool? IsHide { get; set; }
        public DateTime? CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }

        public virtual GroupPost GroupPost { get; set; } = null!;
        public virtual GroupStatus GroupStatus { get; set; } = null!;
        public virtual GroupVideo GroupVideo { get; set; } = null!;
        public virtual ICollection<CommentGroupVideoPost> CommentGroupVideoPosts { get; set; }
        public virtual ICollection<ReactGroupVideoPostComment> ReactGroupVideoPostComments { get; set; }
        public virtual ICollection<ReactGroupVideoPost> ReactGroupVideoPosts { get; set; }
    }
}
