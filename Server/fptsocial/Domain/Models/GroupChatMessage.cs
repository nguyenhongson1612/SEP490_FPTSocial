using System;
using System.Collections.Generic;

namespace Domain.Models
{
    public partial class GroupChatMessage
    {
        public GroupChatMessage()
        {
            ReactGroupChatMessages = new HashSet<ReactGroupChatMessage>();
        }

        public string GroupChatMessageId { get; set; } = null!;
        public string GroupChatId { get; set; } = null!;
        public string SendByUserId { get; set; } = null!;
        public bool? IsPin { get; set; }
        public bool? IsHide { get; set; }
        public string MessageChat { get; set; } = null!;
        public DateTime? CreateAt { get; set; }

        public virtual GroupChat GroupChat { get; set; } = null!;
        public virtual UserProfile SendByUser { get; set; } = null!;
        public virtual ICollection<ReactGroupChatMessage> ReactGroupChatMessages { get; set; }
    }
}
