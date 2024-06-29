using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.DTO.CommentDTO
{
    public class CommentDto
    {
        public Guid UserId { get; set; }
        public Guid CommentId { get; set; }
        public Guid UserPostId { get; set; }
        public string? UserName { get; set; }
        public string? Content { get; set; }
        public Guid? ParentCommentId { get; set; }
        public bool? IsHide { get; set; }
        public DateTime? CreatedDate { get; set; }
    }
}
