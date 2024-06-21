using System;
using System.Collections.Generic;

namespace Domain.QueryModels
{
    public partial class ReportPost
    {
        public Guid ReportPostId { get; set; }
        public Guid ReportTypeId { get; set; }
        public Guid GroupPostId { get; set; }
        public Guid UserPostId { get; set; }
        public Guid ReportById { get; set; }
        public bool? ReportStatus { get; set; }
        public DateTime? CreatedDate { get; set; }
        public bool? Processing { get; set; }

        public virtual GroupPost GroupPost { get; set; } = null!;
        public virtual UserProfile ReportBy { get; set; } = null!;
        public virtual ReportType ReportType { get; set; } = null!;
        public virtual UserPost UserPost { get; set; } = null!;
    }
}
