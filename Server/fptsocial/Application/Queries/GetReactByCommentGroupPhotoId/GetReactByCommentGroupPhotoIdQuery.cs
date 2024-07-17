﻿using Core.CQRS.Query;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Queries.GetReactByCommentGroupPhotoId
{
    public class GetReactByCommentGroupPhotoIdQuery : IQuery<GetReactByCommentGroupPhotoIdQueryResult>
    {
        public Guid CommentPhotoGroupPostId { get; set; }
        public Guid UserId { get; set; }
    }
}
