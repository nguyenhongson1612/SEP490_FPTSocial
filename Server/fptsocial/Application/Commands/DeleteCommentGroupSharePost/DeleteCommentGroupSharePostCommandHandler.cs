using AutoMapper;
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

namespace Application.Commands.DeleteCommentGroupSharePost
{
    public class DeleteCommentGroupSharePostCommandHandler : ICommandHandler<DeleteCommentGroupSharePostCommand, DeleteCommentGroupSharePostCommandResult>
    {
        private readonly fptforumCommandContext _context;
        private readonly fptforumQueryContext _querycontext;
        public DeleteCommentGroupSharePostCommandHandler(fptforumCommandContext context, fptforumQueryContext querycontext, IMapper mapper)
        {
            _context = context;
            _querycontext = querycontext;

        }
        public async Task<Result<DeleteCommentGroupSharePostCommandResult>> Handle(DeleteCommentGroupSharePostCommand request, CancellationToken cancellationToken)
        {
            if (_context == null || _querycontext == null)
            {
                throw new ErrorException(StatusCodeEnum.Context_Not_Found);
            }

            var userComment = _querycontext.CommentGroupSharePosts.Where(x => x.CommentGroupSharePostId == request.CommentGroupSharePostId).FirstOrDefault();
            var result = new DeleteCommentGroupSharePostCommandResult();
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
                    var cgsp = new Domain.CommandModels.CommentGroupSharePost
                    {
                        CommentGroupSharePostId = userComment.CommentGroupSharePostId,
                        GroupSharePostId = userComment.CommentGroupSharePostId,
                        UserId = userComment.UserId,
                        Content = userComment.Content,
                        ParentCommentId = userComment.CommentGroupSharePostId,
                        ListNumber = userComment.ListNumber,
                        LevelCmt = userComment.LevelCmt,
                        IsHide = true,
                        CreateDate = userComment.CreateDate,
                        IsBanned = userComment.IsBanned,
                    };
                    _context.CommentGroupSharePosts.Update(cgsp);
                    _context.SaveChanges();
                    result.Message = "Delete successfully";
                    result.IsDelete = true;
                }
            }

            return Result<DeleteCommentGroupSharePostCommandResult>.Success(result);
        }
    }
}
