using System;
using System.Collections.Generic;

namespace Domain.Models
{
    public partial class GroupPostPhoto
    {
        public GroupPostPhoto()
        {
            CommentPhotoGroupPosts = new HashSet<CommentPhotoGroupPost>();
            GroupSharePosts = new HashSet<GroupSharePost>();
            ReactGroupPhotoPostComments = new HashSet<ReactGroupPhotoPostComment>();
            ReactGroupPhotoPosts = new HashSet<ReactGroupPhotoPost>();
            SharePosts = new HashSet<SharePost>();
        }

        public string GroupPostPhotoId { get; set; } = null!;
        public string GroupPostId { get; set; } = null!;
        public string? Content { get; set; }
        public string GroupPhotoId { get; set; } = null!;
        public string GroupStatusId { get; set; } = null!;
        public string? GroupPostPhotoNumber { get; set; }
        public bool? IsHide { get; set; }
        public DateTime? CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }

        public virtual GroupPhoto GroupPhoto { get; set; } = null!;
        public virtual GroupPost GroupPost { get; set; } = null!;
        public virtual GroupStatus GroupStatus { get; set; } = null!;
        public virtual ICollection<CommentPhotoGroupPost> CommentPhotoGroupPosts { get; set; }
        public virtual ICollection<GroupSharePost> GroupSharePosts { get; set; }
        public virtual ICollection<ReactGroupPhotoPostComment> ReactGroupPhotoPostComments { get; set; }
        public virtual ICollection<ReactGroupPhotoPost> ReactGroupPhotoPosts { get; set; }
        public virtual ICollection<SharePost> SharePosts { get; set; }
    }
}
