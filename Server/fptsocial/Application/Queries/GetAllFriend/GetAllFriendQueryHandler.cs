using Core.CQRS;
using Core.CQRS.Query;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Queries.GetAllFriend
{
    public class GetAllFriendQueryHandler : IQueryHandler<GetAllFriendQuery, GetAllFriendQueryResult>
    {

        public Task<Result<GetAllFriendQueryResult>> Handle(GetAllFriendQuery request, CancellationToken cancellationToken)
        {
            throw new NotImplementedException();
        }
    }
}
