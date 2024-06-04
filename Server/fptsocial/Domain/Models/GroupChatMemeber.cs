using System;
using System.Collections.Generic;

namespace Domain.Models
{
    public partial class GroupChatMemeber
    {
        public string UserChatWithUserId { get; set; } = null!;
        public string GroupChatId { get; set; } = null!;
        public string MemberId { get; set; } = null!;
        public DateTime? CreateAt { get; set; }

        public virtual GroupChat GroupChat { get; set; } = null!;
        public virtual UserProfile Member { get; set; } = null!;
    }
}
