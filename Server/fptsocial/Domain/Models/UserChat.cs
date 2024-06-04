using System;
using System.Collections.Generic;

namespace Domain.Models
{
    public partial class UserChat
    {
        public UserChat()
        {
            ReportUserChats = new HashSet<ReportUserChat>();
            UserChatMessages = new HashSet<UserChatMessage>();
            UserChatWithUsers = new HashSet<UserChatWithUser>();
        }

        public string UserChatId { get; set; } = null!;
        public string UserId { get; set; } = null!;
        public string NameChat { get; set; } = null!;
        public DateTime? CreateAt { get; set; }
        public DateTime? UpdateAt { get; set; }

        public virtual UserProfile User { get; set; } = null!;
        public virtual ICollection<ReportUserChat> ReportUserChats { get; set; }
        public virtual ICollection<UserChatMessage> UserChatMessages { get; set; }
        public virtual ICollection<UserChatWithUser> UserChatWithUsers { get; set; }
    }
}
