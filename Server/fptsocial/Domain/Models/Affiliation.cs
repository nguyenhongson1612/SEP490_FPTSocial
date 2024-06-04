using System;
using System.Collections.Generic;

namespace Domain.Models
{
    public partial class Affiliation
    {
        public string AffiliationId { get; set; } = null!;
        public string AffiliationName { get; set; } = null!;
        public DateTime? CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
    }
}
