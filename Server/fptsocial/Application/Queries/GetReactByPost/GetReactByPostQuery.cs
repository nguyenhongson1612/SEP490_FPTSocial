﻿using Core.CQRS.Query;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Queries.GetReactByPost
{
    public class GetReactByPostQuery : IQuery<GetReactByPostQueryResult>
    {
        public Guid UserPostId { get; set; }
        public Guid UserId { get; set; }
    }
}
