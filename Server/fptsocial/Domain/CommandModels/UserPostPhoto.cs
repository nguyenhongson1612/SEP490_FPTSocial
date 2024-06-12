using System;
using System.Collections.Generic;

namespace Domain.CommandModels
{
    public partial class UserPostPhoto
    {
        public UserPostPhoto()
        {
            CommentPhotoPosts = new HashSet<CommentPhotoPost>();
            GroupSharePosts = new HashSet<GroupSharePost>();
            ReactPhotoPostComments = new HashSet<ReactPhotoPostComment>();
            ReactPhotoPosts = new HashSet<ReactPhotoPost>();
            SharePosts = new HashSet<SharePost>();
        }

        public Guid UserPostPhotoId { get; set; }
        public Guid UserPostId { get; set; }
        public Guid PhotoId { get; set; }
        public string? Content { get; set; }
        public string? UserPostPhotoNumber { get; set; }
        public Guid UserStatusId { get; set; }
        public bool? IsHide { get; set; }
        public DateTime? CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
        public int? PostPosition { get; set; }

        public virtual Photo Photo { get; set; } = null!;
        public virtual UserPost UserPost { get; set; } = null!;
        public virtual UserStatus UserStatus { get; set; } = null!;
        public virtual ICollection<CommentPhotoPost> CommentPhotoPosts { get; set; }
        public virtual ICollection<GroupSharePost> GroupSharePosts { get; set; }
        public virtual ICollection<ReactPhotoPostComment> ReactPhotoPostComments { get; set; }
        public virtual ICollection<ReactPhotoPost> ReactPhotoPosts { get; set; }
        public virtual ICollection<SharePost> SharePosts { get; set; }
    }
}
