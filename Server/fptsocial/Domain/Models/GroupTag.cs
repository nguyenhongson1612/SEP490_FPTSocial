using System;
using System.Collections.Generic;

namespace Domain.Models
{
    public partial class GroupTag
    {
        public GroupTag()
        {
            GroupTagUseds = new HashSet<GroupTagUsed>();
        }

        public string TagId { get; set; } = null!;
        public string TagName { get; set; } = null!;
        public DateTime? CreatedAt { get; set; }
        public DateTime? UpdateAt { get; set; }

        public virtual ICollection<GroupTagUsed> GroupTagUseds { get; set; }
    }
}
