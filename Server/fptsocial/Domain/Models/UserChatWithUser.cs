using System;
using System.Collections.Generic;

namespace Domain.Models
{
    public partial class UserChatWithUser
    {
        public string UserChatWithUserId { get; set; } = null!;
        public string UserChatId { get; set; } = null!;
        public string WithUserId { get; set; } = null!;
        public DateTime? CreateAt { get; set; }

        public virtual UserChat UserChat { get; set; } = null!;
        public virtual UserProfile UserChatNavigation { get; set; } = null!;
    }
}
