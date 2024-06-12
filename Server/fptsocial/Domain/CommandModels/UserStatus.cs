using System;
using System.Collections.Generic;

namespace Domain.CommandModels
{
    public partial class UserStatus
    {
        public UserStatus()
        {
            AvataPhotos = new HashSet<AvataPhoto>();
            CommentPhotoPosts = new HashSet<CommentPhotoPost>();
            CommentPosts = new HashSet<CommentPost>();
            CommentVideoPosts = new HashSet<CommentVideoPost>();
            ContactInfos = new HashSet<ContactInfo>();
            GroupFpts = new HashSet<GroupFpt>();
            GroupPhotos = new HashSet<GroupPhoto>();
            GroupTagUseds = new HashSet<GroupTagUsed>();
            GroupVideos = new HashSet<GroupVideo>();
            Notifications = new HashSet<Notification>();
            Photos = new HashSet<Photo>();
            UserGenders = new HashSet<UserGender>();
            UserInterests = new HashSet<UserInterest>();
            UserLookingFors = new HashSet<UserLookingFor>();
            UserPostPhotos = new HashSet<UserPostPhoto>();
            UserPostVideos = new HashSet<UserPostVideo>();
            UserPosts = new HashSet<UserPost>();
            UserProfiles = new HashSet<UserProfile>();
            UserRelationships = new HashSet<UserRelationship>();
            UserSettings = new HashSet<UserSetting>();
            Videos = new HashSet<Video>();
            WebAffiliations = new HashSet<WebAffiliation>();
        }

        public Guid UserStatusId { get; set; }
        public string StatusName { get; set; } = null!;
        public DateTime? CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }

        public virtual ICollection<AvataPhoto> AvataPhotos { get; set; }
        public virtual ICollection<CommentPhotoPost> CommentPhotoPosts { get; set; }
        public virtual ICollection<CommentPost> CommentPosts { get; set; }
        public virtual ICollection<CommentVideoPost> CommentVideoPosts { get; set; }
        public virtual ICollection<ContactInfo> ContactInfos { get; set; }
        public virtual ICollection<GroupFpt> GroupFpts { get; set; }
        public virtual ICollection<GroupPhoto> GroupPhotos { get; set; }
        public virtual ICollection<GroupTagUsed> GroupTagUseds { get; set; }
        public virtual ICollection<GroupVideo> GroupVideos { get; set; }
        public virtual ICollection<Notification> Notifications { get; set; }
        public virtual ICollection<Photo> Photos { get; set; }
        public virtual ICollection<UserGender> UserGenders { get; set; }
        public virtual ICollection<UserInterest> UserInterests { get; set; }
        public virtual ICollection<UserLookingFor> UserLookingFors { get; set; }
        public virtual ICollection<UserPostPhoto> UserPostPhotos { get; set; }
        public virtual ICollection<UserPostVideo> UserPostVideos { get; set; }
        public virtual ICollection<UserPost> UserPosts { get; set; }
        public virtual ICollection<UserProfile> UserProfiles { get; set; }
        public virtual ICollection<UserRelationship> UserRelationships { get; set; }
        public virtual ICollection<UserSetting> UserSettings { get; set; }
        public virtual ICollection<Video> Videos { get; set; }
        public virtual ICollection<WebAffiliation> WebAffiliations { get; set; }
    }
}
