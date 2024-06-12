using System;
using System.Collections.Generic;

namespace Domain.CommandModels
{
    public partial class ReactGroupChatMessage
    {
        public Guid ReactGroupChatMessageId { get; set; }
        public Guid GroupChatMessageId { get; set; }
        public Guid UserId { get; set; }
        public Guid ReactTypeId { get; set; }
        public DateTime? CreateAt { get; set; }

        public virtual GroupChatMessage GroupChatMessage { get; set; } = null!;
        public virtual ReactType ReactType { get; set; } = null!;
        public virtual UserProfile User { get; set; } = null!;
    }
}
