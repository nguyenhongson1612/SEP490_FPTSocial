﻿using System;
using System.Collections.Generic;

namespace Domain.CommandModels
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
            SharePosts = new HashSet<SharePost>();
        }

        public Guid GroupPostId { get; set; }
        public Guid UserId { get; set; }
        public string? Content { get; set; }
        public string? GroupPostNumber { get; set; }
        public Guid GroupStatusId { get; set; }
        public DateTime? CreatedAt { get; set; }
        public bool? IsHide { get; set; }
        public DateTime? UpdatedAt { get; set; }
        public Guid? GroupPhotoId { get; set; }
        public Guid? GroupVideoId { get; set; }
        public int? NumberPost { get; set; }

        public virtual GroupPhoto? GroupPhoto { get; set; }
        public virtual GroupStatus GroupStatus { get; set; } = null!;
        public virtual GroupVideo? GroupVideo { get; set; }
        public virtual UserProfile User { get; set; } = null!;
        public virtual ICollection<CommentGroupPost> CommentGroupPosts { get; set; }
        public virtual ICollection<GroupPostPhoto> GroupPostPhotos { get; set; }
        public virtual ICollection<GroupPostVideo> GroupPostVideos { get; set; }
        public virtual ICollection<GroupSharePost> GroupSharePosts { get; set; }
        public virtual ICollection<ReactGroupCommentPost> ReactGroupCommentPosts { get; set; }
        public virtual ICollection<ReactGroupPost> ReactGroupPosts { get; set; }
        public virtual ICollection<ReportPost> ReportPosts { get; set; }
        public virtual ICollection<SharePost> SharePosts { get; set; }
    }
}
