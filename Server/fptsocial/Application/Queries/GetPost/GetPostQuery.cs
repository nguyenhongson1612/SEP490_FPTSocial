using Core.CQRS.Query;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Queries.GetPost
{
    public class GetPostQuery : IQuery<List<GetPostResult>>
    {
        public Guid UserId { get; set; }
    }

}
