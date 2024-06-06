﻿using System;
using System.Collections.Generic;

namespace Domain.Models
{
    public partial class GroupPostVideo
    {
        public GroupPostVideo()
        {
            CommentGroupVideoPosts = new HashSet<CommentGroupVideoPost>();
            GroupSharePosts = new HashSet<GroupSharePost>();
            ReactGroupVideoPostComments = new HashSet<ReactGroupVideoPostComment>();
            ReactGroupVideoPosts = new HashSet<ReactGroupVideoPost>();
            SharePosts = new HashSet<SharePost>();
        }

        public Guid GroupPostVideoId { get; set; }
        public Guid GroupPostId { get; set; }
        public string? Content { get; set; }
        public Guid GroupVideoId { get; set; }
        public Guid GroupStatusId { get; set; }
        public string? GroupPostVideoNumber { get; set; }
        public bool? IsHide { get; set; }
        public DateTime? CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }

        public virtual GroupPost GroupPost { get; set; } = null!;
        public virtual GroupStatus GroupStatus { get; set; } = null!;
        public virtual GroupVideo GroupVideo { get; set; } = null!;
        public virtual ICollection<CommentGroupVideoPost> CommentGroupVideoPosts { get; set; }
        public virtual ICollection<GroupSharePost> GroupSharePosts { get; set; }
        public virtual ICollection<ReactGroupVideoPostComment> ReactGroupVideoPostComments { get; set; }
        public virtual ICollection<ReactGroupVideoPost> ReactGroupVideoPosts { get; set; }
        public virtual ICollection<SharePost> SharePosts { get; set; }
    }
}
