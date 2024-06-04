using Domain.Models;
using MediatR;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Commands.UserProfile
{
    public class UserProfileCommandResult 
    {
        public string UserId { get; set; } = null!;
        public string RoleId { get; set; } = null!;
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
        public string UserStatusId { get; set; } = null!;
        public bool IsActive { get; set; }
        public DateTime? CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }

        public virtual Role Role { get; set; } = null!;
        public virtual UserStatus UserStatus { get; set; } = null!;
        public virtual ContactInfo? ContactInfo { get; set; }
        public virtual UserGender? UserGender { get; set; }
        public virtual UserLookingFor? UserLookingFor { get; set; }
        public virtual UserRelationship? UserRelationship { get; set; }
        public virtual WebAffiliation? WebAffiliation { get; set; }
        public virtual ICollection<AvataPhoto> AvataPhotos { get; set; }
    }
}
