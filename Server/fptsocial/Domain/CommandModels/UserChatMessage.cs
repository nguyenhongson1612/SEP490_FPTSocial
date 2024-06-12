using System;
using System.Collections.Generic;

namespace Domain.CommandModels
{
    public partial class UserChatMessage
    {
        public UserChatMessage()
        {
            ReactUserChatMessages = new HashSet<ReactUserChatMessage>();
        }

        public Guid UserChatMessageId { get; set; }
        public Guid UserChatId { get; set; }
        public Guid FromUserId { get; set; }
        public bool? IsPin { get; set; }
        public bool? IsHide { get; set; }
        public string MessageChat { get; set; } = null!;
        public DateTime? CreateAt { get; set; }

        public virtual UserProfile FromUser { get; set; } = null!;
        public virtual UserChat UserChat { get; set; } = null!;
        public virtual ICollection<ReactUserChatMessage> ReactUserChatMessages { get; set; }
    }
}
