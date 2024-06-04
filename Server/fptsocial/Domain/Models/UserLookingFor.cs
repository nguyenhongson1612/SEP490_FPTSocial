using System;
using System.Collections.Generic;

namespace Domain.Models
{
    public partial class UserLookingFor
    {
        public string LookingForId { get; set; } = null!;
        public string UserId { get; set; } = null!;
        public string UserStatusId { get; set; } = null!;
        public DateTime? CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }

        public virtual LookingFor LookingFor { get; set; } = null!;
        public virtual UserProfile User { get; set; } = null!;
        public virtual UserStatus UserStatus { get; set; } = null!;
    }
}
