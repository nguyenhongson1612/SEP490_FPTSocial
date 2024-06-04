using System;
using System.Collections.Generic;

namespace Domain.Models
{
    public partial class UserChatMessage
    {
        public UserChatMessage()
        {
            ReactUserChatMessages = new HashSet<ReactUserChatMessage>();
        }

        public string UserChatMessageId { get; set; } = null!;
        public string UserChatId { get; set; } = null!;
        public string FromUserId { get; set; } = null!;
        public bool? IsPin { get; set; }
        public bool? IsHide { get; set; }
        public string MessageChat { get; set; } = null!;
        public DateTime? CreateAt { get; set; }

        public virtual UserProfile FromUser { get; set; } = null!;
        public virtual UserChat UserChat { get; set; } = null!;
        public virtual ICollection<ReactUserChatMessage> ReactUserChatMessages { get; set; }
    }
}
