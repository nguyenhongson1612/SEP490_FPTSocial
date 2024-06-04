using System;
using System.Collections.Generic;

namespace Domain.Models
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

        public string GroupId { get; set; } = null!;
        public string? GroupNumber { get; set; }
        public string GroupName { get; set; } = null!;
        public string GroupDescription { get; set; } = null!;
        public string CreatedById { get; set; } = null!;
        public DateTime? CreatedDate { get; set; }
        public DateTime? UpdateAt { get; set; }
        public string GroupTypeId { get; set; } = null!;
        public string UserStatusId { get; set; } = null!;

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
