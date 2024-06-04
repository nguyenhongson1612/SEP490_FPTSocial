using System;
using System.Collections.Generic;

namespace Domain.Models
{
    public partial class ReportGroupChat
    {
        public string ReportGroupChatId { get; set; } = null!;
        public string ReportTypeId { get; set; } = null!;
        public string GroupChatId { get; set; } = null!;
        public string ReportById { get; set; } = null!;
        public bool? ReportStatus { get; set; }
        public DateTime? CreatedAt { get; set; }

        public virtual GroupChat GroupChat { get; set; } = null!;
        public virtual UserProfile ReportBy { get; set; } = null!;
        public virtual ReportType ReportType { get; set; } = null!;
    }
}
