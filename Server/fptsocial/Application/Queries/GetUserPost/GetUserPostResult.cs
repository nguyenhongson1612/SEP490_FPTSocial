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
    }
}

