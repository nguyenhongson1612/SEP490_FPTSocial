using System;
using System.Collections.Generic;

namespace Domain.CommandModels
{
    public partial class GroupChat
    {
        public GroupChat()
        {
            GroupChatMembers = new HashSet<GroupChatMember>();
            GroupChatMessages = new HashSet<GroupChatMessage>();
            ReportGroupChats = new HashSet<ReportGroupChat>();
        }

        public Guid GroupChatId { get; set; }
        public Guid CreateByUserId { get; set; }
        public string NameChat { get; set; } = null!;
        public DateTime? CreateAt { get; set; }
        public DateTime? UpdateAt { get; set; }

        public virtual UserProfile CreateByUser { get; set; } = null!;
        public virtual ICollection<GroupChatMember> GroupChatMembers { get; set; }
        public virtual ICollection<GroupChatMessage> GroupChatMessages { get; set; }
        public virtual ICollection<ReportGroupChat> ReportGroupChats { get; set; }
    }
}
