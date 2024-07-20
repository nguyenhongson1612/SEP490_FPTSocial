using Core.CQRS.Query;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Queries.GetBannedPostByUserId
{
    public class GetBannedPostByUserIdQuery : IQuery<List<GetBannedPostByUserIdResult>>
    {
        public Guid UserId { get; set; }
    }
}
