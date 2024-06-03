using Core.CQRS;
using Core.CQRS.Query;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Queries.UserProfile
{
    public class GetUserQueryHandler: IQueryHandler<GetUserQuery, GetUserQueryResult>
    {
        public async Task<Result<GetUserQueryResult>> Handle(GetUserQuery request, CancellationToken cancellationToken)
        {
            var a = request;
            var result = new GetUserQueryResult();
            return Result<GetUserQueryResult>.Success(result);
        }
    }
}
