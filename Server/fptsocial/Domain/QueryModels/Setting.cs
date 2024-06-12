using System;
using System.Collections.Generic;

namespace Domain.QueryModels
{
    public partial class Setting
    {
        public Guid SettingId { get; set; }
        public string SettingName { get; set; } = null!;
        public DateTime? CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }

        public virtual UserSetting? UserSetting { get; set; }
    }
}
