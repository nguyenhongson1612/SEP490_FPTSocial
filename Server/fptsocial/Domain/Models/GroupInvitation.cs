using System;
using System.Collections.Generic;

namespace Domain.Models
{
    public partial class GroupInvitation
    {
        public string InvitationId { get; set; } = null!;
        public string GroupId { get; set; } = null!;
        public string? InviterId { get; set; }
        public string? InvitedId { get; set; }
        public bool StatusAccept { get; set; }
        public DateTime? CreatedDate { get; set; }
        public DateTime? UpdatedDate { get; set; }

        public virtual GroupFpt Group { get; set; } = null!;
        public virtual UserProfile? Invited { get; set; }
        public virtual UserProfile? Inviter { get; set; }
    }
}
