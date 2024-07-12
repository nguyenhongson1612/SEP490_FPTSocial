﻿using Core.CQRS.Query;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Queries.GetReactByVideoPost
{
    public class GetReactByVideoPostQuery : IQuery<GetReactByVideoPostQueryResult>
    {
        public Guid UserPostVideoId { get; set; }
    }
}
