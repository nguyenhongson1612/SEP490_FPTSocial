using System;
using System.Collections.Generic;

namespace Domain.Models
{
    public partial class BlockType
    {
        public BlockType()
        {
            BlockUsers = new HashSet<BlockUser>();
        }

        public string BlockTypeId { get; set; } = null!;
        public string BlockTypeName { get; set; } = null!;
        public DateTime? CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }

        public virtual ICollection<BlockUser> BlockUsers { get; set; }
    }
}
