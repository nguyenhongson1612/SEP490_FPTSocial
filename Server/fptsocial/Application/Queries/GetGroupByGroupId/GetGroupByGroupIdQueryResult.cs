using Application.DTO.GroupDTO;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Queries.GetGroupByGroupId
{
    public class GetGroupByGroupIdQueryResult
    {
        public GetGroupByGroupIdQueryResult()
        {
            GroupMember = new GroupMemberDTO();
        }
        public Guid GroupId { get; set; }
        public string? GroupNumber { get; set; }
        public string GroupName { get; set; } = null!;
        public string GroupDescription { get; set; } = null!;
        public string GroupAdmin { get; set; }
        public string? CoverImage { get; set; }
        public int MemberCount { get; set; }
        public GroupMemberDTO GroupMember { get; set; }
    }
}
