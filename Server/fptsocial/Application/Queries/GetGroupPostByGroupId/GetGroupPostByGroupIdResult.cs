using Application.DTO.CommentDTO;
using Application.DTO.GetUserProfileDTO;
using Application.DTO.GroupPostDTO;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Queries.GetGroupPostByGroupId
{
    public class GetGroupPostByGroupIdResult
    {
        public Guid GroupPostId { get; set; }
        public Guid UserId { get; set; }
        public string? Content { get; set; }
        public string? GroupPostNumber { get; set; }
        public Guid GroupStatusId { get; set; }
        public DateTime? CreatedAt { get; set; }
        public bool? IsHide { get; set; }
        public DateTime? UpdatedAt { get; set; }
        public Guid? GroupPhotoId { get; set; }
        public Guid? GroupVideoId { get; set; }
        public int? NumberPost { get; set; }

        public virtual GroupPhotoDTO GroupPhoto { get; set; }
        public virtual GroupVideoDTO GroupVideo { get; set; }
        public virtual ICollection<GroupPostPhotoDTO> GroupPostPhoto { get; set; }
        public virtual ICollection<GroupPostVideoDTO> GroupPostVideo { get; set; }
        public virtual GetUserAvatar Avata { get; set; } = null!;
        public string? FullName { get; set; }
    }
}
