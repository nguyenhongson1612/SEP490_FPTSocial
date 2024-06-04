using System;
using System.Collections.Generic;

namespace Domain.Models
{
    public partial class NotificationType
    {
        public NotificationType()
        {
            Notifications = new HashSet<Notification>();
        }

        public string NotificationTypeId { get; set; } = null!;
        public string NotificationTypeName { get; set; } = null!;
        public DateTime? CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }

        public virtual ICollection<Notification> Notifications { get; set; }
    }
}
