using Domain.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Queries.UserProfile
{
    public class GetUserQueryResult
    {
        public string UserId { get; set; } = null!;
        public string FirstName { get; set; } = null!;
        public string LastName { get; set; } = null!;
        public string? Email { get; set; }
        public string? FeId { get; set; }
        public DateTime BirthDay { get; set; }
        public string? AboutMe { get; set; }
        public string? HomeTown { get; set; }
        public string? CoverImage { get; set; }
        public string? UserNumber { get; set; }
        public bool IsFirstTimeLogin { get; set; }
        public bool IsActive { get; set; }
        public DateTime? CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }

        public string RoleName { get; set; } 
        public string UserStatusName { get; set; } 
        public string ContactInfo { get; set; }
        public string Gender { get; set; }
        public string LookingFor { get; set; }
        public string Relationship { get; set; }
        public string WebAffiliationUrl { get; set; }
        public string AvataPhotosUrl { get; set; }
    }
}
