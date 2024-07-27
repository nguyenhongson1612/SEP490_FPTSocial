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
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Commands.DeleteCommentGroupPhotoPost
{
    public class DeleteCommentGroupPhotoPostCommandHandler : ICommandHandler<DeleteCommentGroupPhotoPostCommand, DeleteCommentGroupPhotoPostCommandResult>
    {
        private readonly fptforumCommandContext _context;
        private readonly fptforumQueryContext _querycontext;
        public DeleteCommentGroupPhotoPostCommandHandler(fptforumCommandContext context, fptforumQueryContext querycontext, IMapper mapper)
        {
            _context = context;
            _querycontext = querycontext;

        }
        public async Task<Result<DeleteCommentGroupPhotoPostCommandResult>> Handle(DeleteCommentGroupPhotoPostCommand request, CancellationToken cancellationToken)
        {
            if (_context == null || _querycontext == null)
            {
                throw new ErrorException(StatusCodeEnum.Context_Not_Found);
            }

            var GroupPhotoComment = _querycontext.CommentPhotoGroupPosts.Where(x => x.CommentPhotoGroupPostId == request.CommentPhotoGroupPostId).FirstOrDefault();
            var groupPostReactCount = _querycontext.GroupPostReactCounts.Where(x => x.GroupPostPhotoId == GroupPhotoComment.GroupPostPhotoId).FirstOrDefault();
            var result = new DeleteCommentGroupPhotoPostCommandResult();
            if (GroupPhotoComment == null)
            {
                throw new ErrorException(StatusCodeEnum.CM04_Comment_Not_Found);
            }
            else
            {
                if (request.UserId != GroupPhotoComment.UserId)
                {
                    throw new ErrorException(StatusCodeEnum.UP03_Not_Authorized);
                }
                else
                {
                    GroupPhotoComment.IsHide = true;
                    var cpgs = ModelConverter.Convert<Domain.QueryModels.CommentPhotoGroupPost, Domain.CommandModels.CommentPhotoGroupPost>(GroupPhotoComment);
                    _context.CommentPhotoGroupPosts.Update(cpgs);
                    if (groupPostReactCount != null)
                    {
                        if (groupPostReactCount.CommentCount > 0)
                        {
                            groupPostReactCount.CommentCount--;
                        }
                        var prc = ModelConverter.Convert<Domain.QueryModels.GroupPostReactCount, Domain.CommandModels.GroupPostReactCount>(groupPostReactCount);
                        _context.GroupPostReactCounts.Update(prc);
                    }
                    _context.SaveChanges();
                    
                    result.Message = "Delete successfully";
                    result.IsDelete = true;
                }
            }

            return Result<DeleteCommentGroupPhotoPostCommandResult>.Success(result);
        }
    }
}
