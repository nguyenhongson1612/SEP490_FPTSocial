﻿using System;
using System.Collections.Generic;

namespace Domain.Models
{
    public partial class UserLookingFor
    {
        public Guid LookingForId { get; set; }
        public Guid UserId { get; set; }
        public Guid UserStatusId { get; set; }
        public DateTime? CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }

        public virtual LookingFor LookingFor { get; set; } = null!;
        public virtual UserProfile User { get; set; } = null!;
        public virtual UserStatus UserStatus { get; set; } = null!;
    }
}
