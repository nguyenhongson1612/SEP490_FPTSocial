using System;
using System.Collections.Generic;

namespace Domain.Models
{
    public partial class ReportProfile
    {
        public string ReportProfileId { get; set; } = null!;
        public string ReportTypeId { get; set; } = null!;
        public string GroupId { get; set; } = null!;
        public string UserId { get; set; } = null!;
        public string ReportById { get; set; } = null!;
        public bool? ReportStatus { get; set; }
        public DateTime? CreatedDate { get; set; }

        public virtual GroupFpt Group { get; set; } = null!;
        public virtual UserProfile ReportBy { get; set; } = null!;
        public virtual ReportType ReportType { get; set; } = null!;
        public virtual UserProfile User { get; set; } = null!;
    }
}
