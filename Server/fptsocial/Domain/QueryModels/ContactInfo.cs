﻿using System;
using System.Collections.Generic;

namespace Domain.QueryModels
{
    public partial class ContactInfo
    {
        public Guid ContactInfoId { get; set; }
        public string? SecondEmail { get; set; }
        public string PrimaryNumber { get; set; } = null!;
        public string? SecondNumber { get; set; }
        public Guid UserId { get; set; }
        public Guid? UserStatusId { get; set; }
        public DateTime? CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }

        public virtual UserProfile User { get; set; } = null!;
        public virtual UserStatus UserStatus { get; set; } = null!;
    }
}
