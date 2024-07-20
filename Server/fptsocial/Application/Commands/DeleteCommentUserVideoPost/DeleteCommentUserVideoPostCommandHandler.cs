using AutoMapper;
using Core.CQRS;
using Core.CQRS.Command;
using Domain.CommandModels;
using Domain.Enums;
using Domain.Exceptions;
using Domain.QueryModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Commands.DeleteCommentUserVideoPost
{
    public class DeleteCommentUserVideoPostCommandHandler : ICommandHandler<DeleteCommentUserVideoPostCommand, DeleteCommentUserVideoPostCommandResult>
    {
        private readonly fptforumCommandContext _context;
        private readonly fptforumQueryContext _querycontext;
        public DeleteCommentUserVideoPostCommandHandler(fptforumCommandContext context, fptforumQueryContext querycontext, IMapper mapper)
        {
            _context = context;
            _querycontext = querycontext;

        }
        public async Task<Result<DeleteCommentUserVideoPostCommandResult>> Handle(DeleteCommentUserVideoPostCommand request, CancellationToken cancellationToken)
        {
            if (request == null || _querycontext == null)
            {
                throw new ErrorException(StatusCodeEnum.Context_Not_Found);
            }

            var UserVideoComment = _querycontext.CommentVideoPosts.Where(x => x.CommentVideoPostId == request.CommentVideoPostId).FirstOrDefault();
            var result = new DeleteCommentUserVideoPostCommandResult();
            if (UserVideoComment == null)
            {
                throw new ErrorException(StatusCodeEnum.CM04_Comment_Not_Found);
            }
            else
            {
                if (request.UserId != UserVideoComment.UserId)
                {
                    throw new ErrorException(StatusCodeEnum.UP03_Not_Authorized);
                }
                else
                {
                    UserVideoComment.IsHide = true;
                    _querycontext.SaveChanges();
                    result.Message = "Delete successfully";
                    result.IsDelete = true;
                }
            }

            return Result<DeleteCommentUserVideoPostCommandResult>.Success(result);
        }
    }
}
