using System;
using System.Collections.Generic;

namespace Domain.Models
{
    public partial class ReactType
    {
        public ReactType()
        {
            ReactComments = new HashSet<ReactComment>();
            ReactGroupChatMessages = new HashSet<ReactGroupChatMessage>();
            ReactGroupCommentPosts = new HashSet<ReactGroupCommentPost>();
            ReactGroupPhotoPostComments = new HashSet<ReactGroupPhotoPostComment>();
            ReactGroupPhotoPosts = new HashSet<ReactGroupPhotoPost>();
            ReactGroupPosts = new HashSet<ReactGroupPost>();
            ReactGroupVideoPostComments = new HashSet<ReactGroupVideoPostComment>();
            ReactGroupVideoPosts = new HashSet<ReactGroupVideoPost>();
            ReactPhotoPostComments = new HashSet<ReactPhotoPostComment>();
            ReactPhotoPosts = new HashSet<ReactPhotoPost>();
            ReactPosts = new HashSet<ReactPost>();
            ReactUserChatMessages = new HashSet<ReactUserChatMessage>();
            ReactVideoPostComments = new HashSet<ReactVideoPostComment>();
            ReactVideoPosts = new HashSet<ReactVideoPost>();
        }

        public string ReactTypeId { get; set; } = null!;
        public string ReactTypeName { get; set; } = null!;
        public DateTime? CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }

        public virtual ICollection<ReactComment> ReactComments { get; set; }
        public virtual ICollection<ReactGroupChatMessage> ReactGroupChatMessages { get; set; }
        public virtual ICollection<ReactGroupCommentPost> ReactGroupCommentPosts { get; set; }
        public virtual ICollection<ReactGroupPhotoPostComment> ReactGroupPhotoPostComments { get; set; }
        public virtual ICollection<ReactGroupPhotoPost> ReactGroupPhotoPosts { get; set; }
        public virtual ICollection<ReactGroupPost> ReactGroupPosts { get; set; }
        public virtual ICollection<ReactGroupVideoPostComment> ReactGroupVideoPostComments { get; set; }
        public virtual ICollection<ReactGroupVideoPost> ReactGroupVideoPosts { get; set; }
        public virtual ICollection<ReactPhotoPostComment> ReactPhotoPostComments { get; set; }
        public virtual ICollection<ReactPhotoPost> ReactPhotoPosts { get; set; }
        public virtual ICollection<ReactPost> ReactPosts { get; set; }
        public virtual ICollection<ReactUserChatMessage> ReactUserChatMessages { get; set; }
        public virtual ICollection<ReactVideoPostComment> ReactVideoPostComments { get; set; }
        public virtual ICollection<ReactVideoPost> ReactVideoPosts { get; set; }
    }
}
