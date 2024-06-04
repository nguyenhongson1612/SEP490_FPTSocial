using System;
using System.Collections.Generic;

namespace Domain.Models
{
    public partial class GroupMember
    {
        public string GroupId { get; set; } = null!;
        public string UserId { get; set; } = null!;
        public string GroupRoleId { get; set; } = null!;
        public bool IsJoined { get; set; }
        public DateTime? JoinedDate { get; set; }

        public virtual GroupFpt Group { get; set; } = null!;
        public virtual GroupRole GroupRole { get; set; } = null!;
        public virtual UserProfile User { get; set; } = null!;
    }
}
