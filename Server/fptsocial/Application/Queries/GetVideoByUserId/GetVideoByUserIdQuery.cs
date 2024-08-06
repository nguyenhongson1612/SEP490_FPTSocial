using Core.CQRS.Query;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Queries.GetVideoByUserId
{
    public class GetVideoByUserIdQuery : IQuery<GetVideoByUserIdQueryResult>
    {
        public Guid UserId { get; set; }
    }
}
