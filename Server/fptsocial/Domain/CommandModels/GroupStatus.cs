using System;
using System.Collections.Generic;

namespace Domain.CommandModels
{
    public partial class GroupStatus
    {
        public GroupStatus()
        {
            CommentGroupPosts = new HashSet<CommentGroupPost>();
            CommentGroupVideoPosts = new HashSet<CommentGroupVideoPost>();
            CommentPhotoGroupPosts = new HashSet<CommentPhotoGroupPost>();
            GroupPostPhotos = new HashSet<GroupPostPhoto>();
            GroupPostVideos = new HashSet<GroupPostVideo>();
            GroupPosts = new HashSet<GroupPost>();
            GroupSettingUses = new HashSet<GroupSettingUse>();
        }

        public Guid GroupStatusId { get; set; }
        public string GroupStatusName { get; set; } = null!;
        public DateTime? CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }

        public virtual ICollection<CommentGroupPost> CommentGroupPosts { get; set; }
        public virtual ICollection<CommentGroupVideoPost> CommentGroupVideoPosts { get; set; }
        public virtual ICollection<CommentPhotoGroupPost> CommentPhotoGroupPosts { get; set; }
        public virtual ICollection<GroupPostPhoto> GroupPostPhotos { get; set; }
        public virtual ICollection<GroupPostVideo> GroupPostVideos { get; set; }
        public virtual ICollection<GroupPost> GroupPosts { get; set; }
        public virtual ICollection<GroupSettingUse> GroupSettingUses { get; set; }
    }
}
