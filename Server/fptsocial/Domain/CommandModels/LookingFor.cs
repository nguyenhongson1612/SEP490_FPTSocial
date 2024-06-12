using System;
using System.Collections.Generic;

namespace Domain.CommandModels
{
    public partial class LookingFor
    {
        public Guid LookingForId { get; set; }
        public string LookingForName { get; set; } = null!;
        public DateTime? CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }

        public virtual UserLookingFor? UserLookingFor { get; set; }
    }
}
