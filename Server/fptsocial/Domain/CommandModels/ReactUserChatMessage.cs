using System;
using System.Collections.Generic;

namespace Domain.CommandModels
{
    public partial class ReactUserChatMessage
    {
        public Guid ReactUserChatMessageId { get; set; }
        public Guid UserChatMessageId { get; set; }
        public Guid UserId { get; set; }
        public Guid ReactTypeId { get; set; }
        public DateTime? CreateAt { get; set; }

        public virtual ReactType ReactType { get; set; } = null!;
        public virtual UserProfile User { get; set; } = null!;
        public virtual UserChatMessage UserChatMessage { get; set; } = null!;
    }
}
