using System;
using System.Collections.Generic;

namespace Domain.Models
{
    public partial class UserSetting
    {
        public string SettingId { get; set; } = null!;
        public string UserId { get; set; } = null!;
        public string UserStatusId { get; set; } = null!;

        public virtual Setting Setting { get; set; } = null!;
        public virtual UserProfile User { get; set; } = null!;
        public virtual UserStatus UserStatus { get; set; } = null!;
    }
}
