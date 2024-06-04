using System;
using System.Collections.Generic;

namespace Domain.Models
{
    public partial class Setting
    {
        public string SettingId { get; set; } = null!;
        public string SettingName { get; set; } = null!;
        public DateTime? CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }

        public virtual UserSetting? UserSetting { get; set; }
    }
}
