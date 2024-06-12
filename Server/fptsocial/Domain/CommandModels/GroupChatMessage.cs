using System;
using System.Collections.Generic;

namespace Domain.CommandModels
{
    public partial class GroupChatMessage
    {
        public GroupChatMessage()
        {
            ReactGroupChatMessages = new HashSet<ReactGroupChatMessage>();
        }

        public Guid GroupChatMessageId { get; set; }
        public Guid GroupChatId { get; set; }
        public Guid SendByUserId { get; set; }
        public bool? IsPin { get; set; }
        public bool? IsHide { get; set; }
        public string MessageChat { get; set; } = null!;
        public DateTime? CreateAt { get; set; }

        public virtual GroupChat GroupChat { get; set; } = null!;
        public virtual UserProfile SendByUser { get; set; } = null!;
        public virtual ICollection<ReactGroupChatMessage> ReactGroupChatMessages { get; set; }
    }
}
