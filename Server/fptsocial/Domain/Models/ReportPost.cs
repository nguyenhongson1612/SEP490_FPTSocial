using System;
using System.Collections.Generic;

namespace Domain.Models
{
    public partial class ReportPost
    {
        public string ReportPostId { get; set; } = null!;
        public string ReportTypeId { get; set; } = null!;
        public string GroupPostId { get; set; } = null!;
        public string UserPostId { get; set; } = null!;
        public string ReportById { get; set; } = null!;
        public bool? ReportStatus { get; set; }
        public DateTime? CreatedDate { get; set; }

        public virtual GroupPost GroupPost { get; set; } = null!;
        public virtual UserProfile ReportBy { get; set; } = null!;
        public virtual ReportType ReportType { get; set; } = null!;
        public virtual UserPost UserPost { get; set; } = null!;
    }
}
