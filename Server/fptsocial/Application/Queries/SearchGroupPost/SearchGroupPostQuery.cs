using Core.CQRS.Query;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Queries.SearchGroupPost
{
    public class SearchGroupPostQuery : IQuery<SearchGroupPostResult>
    {
        public Guid GroupId { get; set; }
        public string SearchString { get; set; }
    }
}
