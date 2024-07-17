using Core.CQRS.Query;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Queries.SearchFunction
{
    public class SearchFunctionQuery : IQuery<SearchFunctionQueryResult>
    {
        public Guid UserId { get; set; }
        public string? SearchContent { get; set; }
        public string Type { get; set; }
    }
}
