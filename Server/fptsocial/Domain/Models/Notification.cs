using System;
using System.Collections.Generic;

namespace Domain.Models
{
    public partial class Notification
    {
        public string NotificationId { get; set; } = null!;
        public string UserId { get; set; } = null!;
        public string? SenderId { get; set; }
        public string NotificationTypeId { get; set; } = null!;
        public string? NotiMessage { get; set; }
        public string UserStatusId { get; set; } = null!;
        public bool? IsRead { get; set; }
        public DateTime? CreatedAt { get; set; }

        public virtual NotificationType NotificationType { get; set; } = null!;
        public virtual UserProfile? Sender { get; set; }
        public virtual UserProfile User { get; set; } = null!;
        public virtual UserStatus UserStatus { get; set; } = null!;
    }
}
