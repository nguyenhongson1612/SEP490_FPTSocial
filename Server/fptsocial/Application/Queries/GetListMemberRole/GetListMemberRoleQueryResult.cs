using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Queries.GetListMemberRole
{
    public class GetListMemberRoleQueryResult
    {
        public Guid MemberId { get; set; }
        public string MemberName { get; set; }
        public string? MemberAvata { get; set; }
    }
}
