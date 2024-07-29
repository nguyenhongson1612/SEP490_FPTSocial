﻿using AutoMapper;
using Core.CQRS;
using Core.CQRS.Command;
using Core.Helper;
using Domain.CommandModels;
using Domain.Enums;
using Domain.Exceptions;
using Domain.QueryModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Commands.DeleteCommentSharePost
{
    public class DeleteCommentSharePostCommandHandler : ICommandHandler<DeleteCommentSharePostCommand, DeleteCommentSharePostCommandResult>
    {
        private readonly fptforumCommandContext _context;
        private readonly fptforumQueryContext _querycontext;
        public DeleteCommentSharePostCommandHandler(fptforumCommandContext context, fptforumQueryContext querycontext, IMapper mapper)
        {
            _context = context;
            _querycontext = querycontext;

        }
        public async Task<Result<DeleteCommentSharePostCommandResult>> Handle(DeleteCommentSharePostCommand request, CancellationToken cancellationToken)
        {
            if (_context == null || _querycontext == null)
            {
                throw new ErrorException(StatusCodeEnum.Context_Not_Found);
            }

            var userComment = _querycontext.CommentSharePosts.Where(x => x.CommentSharePostId == request.CommentSharePostId).FirstOrDefault();
            var result = new DeleteCommentSharePostCommandResult();
            if (userComment == null)
            {
                throw new ErrorException(StatusCodeEnum.CM04_Comment_Not_Found);
            }
            else
            {
                if (request.UserId != userComment.UserId)
                {
                    throw new ErrorException(StatusCodeEnum.UP03_Not_Authorized);
                }
                else
                {
                    var csp = new Domain.CommandModels.CommentSharePost
                    {
                        CommentSharePostId = userComment.CommentSharePostId,
                        SharePostId = userComment.SharePostId,
                        UserId = userComment.UserId,
                        Content = userComment.Content,
                        ParentCommentId = userComment.ParentCommentId,
                        ListNumber = userComment.ListNumber,
                        LevelCmt = userComment.LevelCmt,
                        IsHide = true,
                        CreateDate = userComment.CreateDate,
                        IsBanned = userComment.IsBanned,
                    };
                    _context.CommentSharePosts.Update(csp);
                    _context.SaveChanges();
                    result.Message = "Delete successfully";
                    result.IsDelete = true;
                }
            }

            return Result<DeleteCommentSharePostCommandResult>.Success(result);
        }
    }
}
