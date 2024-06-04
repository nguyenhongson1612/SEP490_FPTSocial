using System;
using System.Collections.Generic;

namespace Domain.Models
{
    public partial class ReactUserChatMessage
    {
        public string ReactUserChatMessageId { get; set; } = null!;
        public string UserChatMessageId { get; set; } = null!;
        public string UserId { get; set; } = null!;
        public string ReactTypeId { get; set; } = null!;
        public DateTime? CreateAt { get; set; }

        public virtual ReactType ReactType { get; set; } = null!;
        public virtual UserProfile User { get; set; } = null!;
        public virtual UserChatMessage UserChatMessage { get; set; } = null!;
    }
}
