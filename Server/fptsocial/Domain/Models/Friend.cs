using System;
using System.Collections.Generic;

namespace Domain.Models
{
    public partial class Friend
    {
        public string UserId { get; set; } = null!;
        public string FriendId { get; set; } = null!;
        public bool Confirm { get; set; }

        public virtual UserProfile FriendNavigation { get; set; } = null!;
        public virtual UserProfile User { get; set; } = null!;
    }
}
