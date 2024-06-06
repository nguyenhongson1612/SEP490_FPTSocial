using System;
using System.Collections.Generic;

namespace Domain.Models
{
    public partial class Relationship
    {
        public Guid RelationshipId { get; set; }
        public string RelationshipName { get; set; } = null!;
        public DateTime? CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }

        public virtual UserRelationship? UserRelationship { get; set; }
    }
}
