using Core.CQRS.Query;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Queries.GetGroupPostByGroupId
{
    public class GetGroupPostByGroupIdQuery : IQuery<List<GetGroupPostByGroupIdResult>>
    {
        public Guid PostId { get; set; }
    }
}
