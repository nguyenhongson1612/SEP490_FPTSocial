using System;
using System.Collections.Generic;

namespace Domain.Models
{
    public partial class LookingFor
    {
        public string LookingForId { get; set; } = null!;
        public string LookingForName { get; set; } = null!;
        public DateTime? CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }

        public virtual UserLookingFor? UserLookingFor { get; set; }
    }
}
