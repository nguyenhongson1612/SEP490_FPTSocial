using System;
using System.Collections.Generic;

namespace Domain.Models
{
    public partial class Interest
    {
        public string InterestId { get; set; } = null!;
        public string InterestName { get; set; } = null!;
        public DateTime? CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }

        public virtual UserInterest? UserInterest { get; set; }
    }
}
