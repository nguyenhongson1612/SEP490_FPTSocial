using System;
using System.Collections.Generic;

namespace Domain.Models
{
    public partial class ReactGroupChatMessage
    {
        public string ReactGroupChatMessageId { get; set; } = null!;
        public string GroupChatMessageId { get; set; } = null!;
        public string UserId { get; set; } = null!;
        public string ReactTypeId { get; set; } = null!;
        public DateTime? CreateAt { get; set; }

        public virtual GroupChatMessage GroupChatMessage { get; set; } = null!;
        public virtual ReactType ReactType { get; set; } = null!;
        public virtual UserProfile User { get; set; } = null!;
    }
}
