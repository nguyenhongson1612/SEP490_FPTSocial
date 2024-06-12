using System;
using System.Collections.Generic;

namespace Domain.CommandModels
{
    public partial class ReportGroupChat
    {
        public Guid ReportGroupChatId { get; set; }
        public Guid ReportTypeId { get; set; }
        public Guid GroupChatId { get; set; }
        public Guid ReportById { get; set; }
        public bool? ReportStatus { get; set; }
        public DateTime? CreatedAt { get; set; }

        public virtual GroupChat GroupChat { get; set; } = null!;
        public virtual UserProfile ReportBy { get; set; } = null!;
        public virtual ReportType ReportType { get; set; } = null!;
    }
}
