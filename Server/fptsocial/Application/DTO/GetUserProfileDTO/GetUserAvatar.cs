using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.DTO.GetUserProfileDTO
{
    public class GetUserAvatar
    {
        public string AvataPhotosUrl { get; set; } = null!;
        public string StatusName { get; set; }
        public bool IsUsed { get; set; }
        public DateTime? CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
    }
}
