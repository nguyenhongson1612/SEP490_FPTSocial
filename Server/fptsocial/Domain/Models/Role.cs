using System;
using System.Collections.Generic;

namespace Domain.Models
{
    public partial class Role
    {
        public Role()
        {
            UserProfiles = new HashSet<UserProfile>();
        }

        public string RoleId { get; set; } = null!;
        public string NameRole { get; set; } = null!;
        public DateTime? CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }

        public virtual ICollection<UserProfile> UserProfiles { get; set; }
    }
}
