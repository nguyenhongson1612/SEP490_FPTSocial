using System;
using System.Collections.Generic;

namespace Domain.Models
{
    public partial class UserPostVideo
    {
        public UserPostVideo()
        {
            CommentVideoPosts = new HashSet<CommentVideoPost>();
            ReactVideoPostComments = new HashSet<ReactVideoPostComment>();
            ReactVideoPosts = new HashSet<ReactVideoPost>();
        }

        public string UserPostVideoId { get; set; } = null!;
        public string UserPostId { get; set; } = null!;
        public string VideoId { get; set; } = null!;
        public string? UserPostVideoNumber { get; set; }
        public string UserStatusId { get; set; } = null!;
        public bool? IsHide { get; set; }
        public DateTime? CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }

        public virtual UserPost UserPost { get; set; } = null!;
        public virtual UserStatus UserStatus { get; set; } = null!;
        public virtual Video Video { get; set; } = null!;
        public virtual ICollection<CommentVideoPost> CommentVideoPosts { get; set; }
        public virtual ICollection<ReactVideoPostComment> ReactVideoPostComments { get; set; }
        public virtual ICollection<ReactVideoPost> ReactVideoPosts { get; set; }
    }
}
