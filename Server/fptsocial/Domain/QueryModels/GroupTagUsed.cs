using System;
using System.Collections.Generic;

namespace Domain.QueryModels
{
    public partial class GroupTagUsed
    {
        public Guid TagId { get; set; }
        public Guid GroupId { get; set; }
        public Guid UserStatusId { get; set; }
        public DateTime? CreatedAt { get; set; }
        public DateTime? UpdateAt { get; set; }

        public virtual GroupFpt Group { get; set; } = null!;
        public virtual GroupTag Tag { get; set; } = null!;
        public virtual UserStatus UserStatus { get; set; } = null!;
    }
}
