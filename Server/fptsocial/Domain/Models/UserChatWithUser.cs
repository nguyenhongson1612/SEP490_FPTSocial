using System;
using System.Collections.Generic;

namespace Domain.Models
{
    public partial class UserChatWithUser
    {
        public Guid UserChatWithUserId { get; set; }
        public Guid UserChatId { get; set; }
        public Guid WithUserId { get; set; }
        public DateTime? CreateAt { get; set; }

        public virtual UserChat UserChat { get; set; } = null!;
        public virtual UserProfile UserChatNavigation { get; set; } = null!;
    }
}
