using System;
using System.Collections.Generic;

namespace Domain.CommandModels
{
    public partial class ReportUserChat
    {
        public Guid ReportUserChatId { get; set; }
        public Guid ReportTypeId { get; set; }
        public Guid UserChatId { get; set; }
        public bool? ReportStatus { get; set; }
        public Guid ReportById { get; set; }
        public DateTime? CreatedDate { get; set; }
        public bool? Processing { get; set; }

        public virtual UserProfile ReportBy { get; set; } = null!;
        public virtual ReportType ReportType { get; set; } = null!;
        public virtual UserChat UserChat { get; set; } = null!;
    }
}
