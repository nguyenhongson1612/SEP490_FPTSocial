using System;
using System.Collections.Generic;

namespace Domain.Models
{
    public partial class ReportUserChat
    {
        public string ReportUserChatId { get; set; } = null!;
        public string ReportTypeId { get; set; } = null!;
        public string UserChatId { get; set; } = null!;
        public bool? ReportStatus { get; set; }
        public string ReportById { get; set; } = null!;
        public DateTime? CreatedDate { get; set; }

        public virtual UserProfile ReportBy { get; set; } = null!;
        public virtual ReportType ReportType { get; set; } = null!;
        public virtual UserChat UserChat { get; set; } = null!;
    }
}
