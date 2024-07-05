using Core.CQRS.Query;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Queries.GetOtherUserPost
{
    public class GetOtherUserPostQuery : IQuery<List<GetOtherUserPostResult>>
    {
        public Guid? UserId { get; set; }
        public Guid? OtherUserId { get; set; }
    }
}

