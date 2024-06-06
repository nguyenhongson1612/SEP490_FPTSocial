﻿using System;
using System.Collections.Generic;

namespace Domain.Models
{
    public partial class GroupChatMemeber
    {
        public Guid UserChatWithUserId { get; set; }
        public Guid GroupChatId { get; set; }
        public Guid MemberId { get; set; }
        public DateTime? CreateAt { get; set; }

        public virtual GroupChat GroupChat { get; set; } = null!;
        public virtual UserProfile Member { get; set; } = null!;
    }
}
