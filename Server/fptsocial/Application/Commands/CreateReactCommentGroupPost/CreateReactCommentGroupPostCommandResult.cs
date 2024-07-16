﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Commands.CreateReactCommentGroupPost
{
    public class CreateReactCommentGroupPostCommandResult
    {
        public Guid ReactCommentId { get; set; }
        public Guid GroupPostId { get; set; }
        public Guid UserId { get; set; }
        public Guid ReactTypeId { get; set; }
        public Guid CommentId { get; set; }
        public DateTime? CreatedDate { get; set; }
    }
}
