using Application.Commands.DeleteGroup;
using Application.Commands.DeleteGroupPost;
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

namespace Application.Commands.DeleteCommentGroupPost
{
    public class DeleteCommentGroupPostCommandHandler : ICommandHandler<DeleteCommentGroupPostCommand, DeleteCommentGroupPostCommandResult>
    {
        private readonly fptforumCommandContext _context;
        private readonly fptforumQueryContext _querycontext;
        public DeleteCommentGroupPostCommandHandler(fptforumCommandContext context, fptforumQueryContext querycontext, IMapper mapper)
        {
            _context = context;
            _querycontext = querycontext;

        }
        public async Task<Result<DeleteCommentGroupPostCommandResult>> Handle(DeleteCommentGroupPostCommand request, CancellationToken cancellationToken)
        {
            if (_context == null || _querycontext == null)
            {
                throw new ErrorException(StatusCodeEnum.Context_Not_Found);
            }

            var GroupComment = _querycontext.CommentGroupPosts.Where(x => x.CommentGroupPostId == request.CommentGroupPostId).FirstOrDefault();
            var result = new DeleteCommentGroupPostCommandResult();
            if (GroupComment == null)
            {
                throw new ErrorException(StatusCodeEnum.CM04_Comment_Not_Found);
            }
            else
            {
                if (request.UserId != GroupComment.UserId)
                {
                    throw new ErrorException(StatusCodeEnum.UP03_Not_Authorized);
                }
                else
                {
                    GroupComment.IsHide = true;
                    var cgp = ModelConverter.Convert<Domain.QueryModels.CommentGroupPost, Domain.CommandModels.CommentGroupPost>(GroupComment);
                    _context.CommentGroupPosts.Update(cgp);
                    _context.SaveChanges();
                    result.Message = "Delete successfully";
                    result.IsDelete = true;
                }
            }

            return Result<DeleteCommentGroupPostCommandResult>.Success(result);
        }
    }
}
