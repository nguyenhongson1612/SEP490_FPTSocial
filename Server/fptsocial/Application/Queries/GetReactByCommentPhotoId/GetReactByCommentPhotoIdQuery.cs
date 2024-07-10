﻿using Core.CQRS.Query;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Queries.GetReactByCommentPhotoId
{
    public class GetReactByCommentPhotoIdQuery : IQuery<GetReactByCommentPhotoIdQueryResult>
    {
        public Guid CommentPhotoPostId { get; set; }
    }
}
