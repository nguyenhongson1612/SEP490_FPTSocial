using System;
using System.Collections.Generic;

namespace Domain.Models
{
    public partial class GroupRole
    {
        public GroupRole()
        {
            GroupMembers = new HashSet<GroupMember>();
        }

        public string GroupRoleId { get; set; } = null!;
        public string GroupRoleName { get; set; } = null!;
        public DateTime? CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }

        public virtual ICollection<GroupMember> GroupMembers { get; set; }
    }
}
