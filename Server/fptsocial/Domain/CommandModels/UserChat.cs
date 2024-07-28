using System;
using System.Collections.Generic;

namespace Domain.CommandModels
{
    public partial class UserChat
    {
        public Guid UserId { get; set; }
        public int UserChatId { get; set; }
        public DateTime? CreateDate { get; set; }

        public virtual UserProfile User { get; set; } = null!;
    }
}
