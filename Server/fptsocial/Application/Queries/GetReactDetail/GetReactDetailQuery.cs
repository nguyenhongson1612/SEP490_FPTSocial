﻿using Core.CQRS.Query;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Queries.GetReactDetail
{
    public class GetReactDetailQuery : IQuery<GetReactDetailQueryResult>
    {
        public Guid UserId { get; set; }
        public string? PostType { get; set; }
        public Guid? PostId { get; set; }
        public string? ReactName { get; set; }

    }
}
