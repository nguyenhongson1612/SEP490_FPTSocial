using Application.DTO.UserPostPhotoDTO;
using Application.DTO.UserPostVideoDTO;
using Domain.QueryModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Queries.GetUserPost
{
    public class GetUserPostResult
    {
        public Guid UserPostId { get; set; }
        public Guid UserId { get; set; }
        public string? Content { get; set; }
        public string? UserPostNumber { get; set; }
        public Guid UserStatusId { get; set; }
        public bool? IsAvataPost { get; set; }
        public bool? IsCoverPhotoPost { get; set; }
        public bool? IsHide { get; set; }
        public DateTime? CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
        public Guid? PhotoId { get; set; }
        public Guid? VideoId { get; set; }
        public int? NumberPost { get; set; }
        public virtual Photo? Photo { get; set; }
        public virtual Video? Video { get; set; }
        public virtual ICollection<UserPostPhotoDTO>? UserPostPhotos { get; set; }
        public virtual ICollection<UserPostVideoDTO>? UserPostVideos { get; set; }

    }
}

