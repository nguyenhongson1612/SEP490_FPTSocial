using System;
using System.Collections.Generic;

namespace Domain.CommandModels
{
    public partial class GroupFpt
    {
        public GroupFpt()
        {
            GroupInvitations = new HashSet<GroupInvitation>();
            GroupMembers = new HashSet<GroupMember>();
            GroupPhotos = new HashSet<GroupPhoto>();
            GroupSettingUses = new HashSet<GroupSettingUse>();
            GroupTagUseds = new HashSet<GroupTagUsed>();
            GroupVideos = new HashSet<GroupVideo>();
            ReportProfiles = new HashSet<ReportProfile>();
        }

        public Guid GroupId { get; set; }
        public string? GroupNumber { get; set; }
        public string GroupName { get; set; } = null!;
        public string GroupDescription { get; set; } = null!;
        public Guid CreatedById { get; set; }
        public DateTime? CreatedDate { get; set; }
        public DateTime? UpdateAt { get; set; }
        public Guid GroupTypeId { get; set; }
        public Guid UserStatusId { get; set; }

        public virtual UserProfile CreatedBy { get; set; } = null!;
        public virtual GroupType GroupType { get; set; } = null!;
        public virtual UserStatus UserStatus { get; set; } = null!;
        public virtual ICollection<GroupInvitation> GroupInvitations { get; set; }
        public virtual ICollection<GroupMember> GroupMembers { get; set; }
        public virtual ICollection<GroupPhoto> GroupPhotos { get; set; }
        public virtual ICollection<GroupSettingUse> GroupSettingUses { get; set; }
        public virtual ICollection<GroupTagUsed> GroupTagUseds { get; set; }
        public virtual ICollection<GroupVideo> GroupVideos { get; set; }
        public virtual ICollection<ReportProfile> ReportProfiles { get; set; }
    }
}
