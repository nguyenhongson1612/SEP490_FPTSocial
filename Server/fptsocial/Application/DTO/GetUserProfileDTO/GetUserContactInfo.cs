using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.DTO.GetUserProfileDTO
{
    public class GetUserContactInfo
    {
        public string? SecondEmail { get; set; }
        public string PrimaryNumber { get; set; } = null!;
        public string? SecondNumber { get; set; }
        public string StatusName { get; set; }
        public DateTime? CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
    }
}
