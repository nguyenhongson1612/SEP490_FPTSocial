using System;
using System.Collections.Generic;

namespace Domain.Models
{
    public partial class ReportType
    {
        public ReportType()
        {
            ReportComments = new HashSet<ReportComment>();
            ReportGroupChats = new HashSet<ReportGroupChat>();
            ReportPosts = new HashSet<ReportPost>();
            ReportProfiles = new HashSet<ReportProfile>();
            ReportUserChats = new HashSet<ReportUserChat>();
        }

        public string ReportTypeId { get; set; } = null!;
        public string ReportTypeName { get; set; } = null!;
        public DateTime? CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }

        public virtual ICollection<ReportComment> ReportComments { get; set; }
        public virtual ICollection<ReportGroupChat> ReportGroupChats { get; set; }
        public virtual ICollection<ReportPost> ReportPosts { get; set; }
        public virtual ICollection<ReportProfile> ReportProfiles { get; set; }
        public virtual ICollection<ReportUserChat> ReportUserChats { get; set; }
    }
}
