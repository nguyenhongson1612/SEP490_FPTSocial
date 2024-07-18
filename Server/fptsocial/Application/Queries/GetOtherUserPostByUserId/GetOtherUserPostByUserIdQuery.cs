using Core.CQRS.Query;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Queries.GetOtherUserPostByUserId
{
    public class GetOtherUserPostByUserIdQuery : IQuery<List<GetOtherUserPostByUserIdResult>>
    {
        public Guid? UserId { get; set; }
        public Guid? OtherUserId { get; set; }
    }
}
