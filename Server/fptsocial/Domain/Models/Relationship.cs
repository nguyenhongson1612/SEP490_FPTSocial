using System;
using System.Collections.Generic;

namespace Domain.Models
{
    public partial class Relationship
    {
        public string RelationshipId { get; set; } = null!;
        public string RelationshipName { get; set; } = null!;
        public DateTime? CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }

        public virtual UserRelationship? UserRelationship { get; set; }
    }
}
