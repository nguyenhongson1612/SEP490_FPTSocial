﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Queries.GetReactByCommentGroupSharePostId
{
    public class GetReactByCommentGroupSharePostQuery
    {
        public Guid CommentGroupSharePostId { get; set; }
        public Guid UserId { get; set; }

    }
}
