using Core.CQRS.Query;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Queries.GetUserPost
{
    public class GetUserPostQuery : IQuery<List<GetUserPostResult>>
    {
        public Guid? UserId { get; set; }
    }
}

