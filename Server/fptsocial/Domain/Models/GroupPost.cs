using System;
using System.Collections.Generic;

namespace Domain.Models
{
    public partial class GroupPost
    {
        public GroupPost()
        {
            CommentGroupPosts = new HashSet<CommentGroupPost>();
            GroupPostPhotos = new HashSet<GroupPostPhoto>();
            GroupPostVideos = new HashSet<GroupPostVideo>();
            GroupSharePosts = new HashSet<GroupSharePost>();
            ReactGroupCommentPosts = new HashSet<ReactGroupCommentPost>();
            ReactGroupPosts = new HashSet<ReactGroupPost>();
            ReportPosts = new HashSet<ReportPost>();
        }

        public string GroupPostId { get; set; } = null!;
        public string UserId { get; set; } = null!;
        public string? Content { get; set; }
        public string? GroupPostNumber { get; set; }
        public string GroupStatusId { get; set; } = null!;
        public DateTime? CreatedAt { get; set; }
        public bool? IsHide { get; set; }
        public DateTime? UpdatedAt { get; set; }

        public virtual GroupStatus GroupStatus { get; set; } = null!;
        public virtual UserProfile User { get; set; } = null!;
        public virtual ICollection<CommentGroupPost> CommentGroupPosts { get; set; }
        public virtual ICollection<GroupPostPhoto> GroupPostPhotos { get; set; }
        public virtual ICollection<GroupPostVideo> GroupPostVideos { get; set; }
        public virtual ICollection<GroupSharePost> GroupSharePosts { get; set; }
        public virtual ICollection<ReactGroupCommentPost> ReactGroupCommentPosts { get; set; }
        public virtual ICollection<ReactGroupPost> ReactGroupPosts { get; set; }
        public virtual ICollection<ReportPost> ReportPosts { get; set; }
    }
}
