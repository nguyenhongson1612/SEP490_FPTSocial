using System;
using System.Collections.Generic;

namespace Domain.Models
{
    public partial class GroupTagUsed
    {
        public string TagId { get; set; } = null!;
        public string GroupId { get; set; } = null!;
        public string UserStatusId { get; set; } = null!;
        public DateTime? CreatedAt { get; set; }
        public DateTime? UpdateAt { get; set; }

        public virtual GroupFpt Group { get; set; } = null!;
        public virtual GroupTag Tag { get; set; } = null!;
        public virtual UserStatus UserStatus { get; set; } = null!;
    }
}
