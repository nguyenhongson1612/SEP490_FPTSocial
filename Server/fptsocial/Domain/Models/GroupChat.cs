using System;
using System.Collections.Generic;

namespace Domain.Models
{
    public partial class GroupChat
    {
        public GroupChat()
        {
            GroupChatMemebers = new HashSet<GroupChatMemeber>();
            GroupChatMessages = new HashSet<GroupChatMessage>();
            ReportGroupChats = new HashSet<ReportGroupChat>();
        }

        public string GroupChatId { get; set; } = null!;
        public string CreateByUserId { get; set; } = null!;
        public string NameChat { get; set; } = null!;
        public DateTime? CreateAt { get; set; }
        public DateTime? UpdateAt { get; set; }

        public virtual UserProfile CreateByUser { get; set; } = null!;
        public virtual ICollection<GroupChatMemeber> GroupChatMemebers { get; set; }
        public virtual ICollection<GroupChatMessage> GroupChatMessages { get; set; }
        public virtual ICollection<ReportGroupChat> ReportGroupChats { get; set; }
    }
}
