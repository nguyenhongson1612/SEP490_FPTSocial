using System;
using System.Collections.Generic;

namespace Domain.Models
{
    public partial class GroupSettingUse
    {
        public string GroupId { get; set; } = null!;
        public string GroupSettingId { get; set; } = null!;
        public string GroupStatusId { get; set; } = null!;
        public DateTime? CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }

        public virtual GroupFpt Group { get; set; } = null!;
        public virtual GroupSetting GroupSetting { get; set; } = null!;
        public virtual GroupStatus GroupStatus { get; set; } = null!;
    }
}
