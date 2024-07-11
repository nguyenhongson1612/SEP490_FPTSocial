using Application.DTO.GetUserProfileDTO;
using Application.DTO.UserPostVideoDTO;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Queries.GetUserPostVideo
{
    public class GetUserPostVideoResult
    {
        public Guid UserPostVideoId { get; set; }
        public Guid UserPostId { get; set; }
        public Guid VideoId { get; set; }
        public string? Content { get; set; }
        public string? UserPostVideoNumber { get; set; }
        public virtual GetUserStatusDTO? Status { get; set; }
        public bool? IsHide { get; set; }
        public DateTime? CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
        public int? PostPosition { get; set; }

        public virtual VideoDTO? Video { get; set; }

        public Guid UserId { get; set; }
        public string? FullName { get; set; }
        public GetUserAvatar Avatar { get; set; }
    }
}
