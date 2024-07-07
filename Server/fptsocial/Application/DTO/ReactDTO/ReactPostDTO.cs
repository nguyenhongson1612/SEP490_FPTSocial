using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.DTO.ReactDTO
{
    public class ReactPostDTO
    {
        public Guid ReactPostId { get; set; }
        public Guid UserPostId { get; set; }
        public Guid ReactTypeId { get; set; }
        public string ReactName { get; set; }
        public Guid UserId { get; set; }
        public string? UserName {  get; set; }
        public DateTime? CreatedDate {  get; set; }
        public string? AvataUrl { get; set; }
    }
}
