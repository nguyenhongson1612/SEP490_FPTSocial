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

namespace Application.Commands.DeleteCommentUserPhotoPost
{
    public class DeleteCommentUserPhotoPostCommandHandler : ICommandHandler<DeleteCommentUserPhotoPostCommand, DeleteCommentUserPhotoPostCommandResult>
    {
        private readonly fptforumCommandContext _context;
        private readonly fptforumQueryContext _querycontext;
        public DeleteCommentUserPhotoPostCommandHandler(fptforumCommandContext context, fptforumQueryContext querycontext, IMapper mapper)
        {
            _context = context;
            _querycontext = querycontext;

        }
        public async Task<Result<DeleteCommentUserPhotoPostCommandResult>> Handle(DeleteCommentUserPhotoPostCommand request, CancellationToken cancellationToken)
        {
            if (_context == null || _querycontext == null)
            {
                throw new ErrorException(StatusCodeEnum.Context_Not_Found);
            }

            var UserPhotoComment = _querycontext.CommentPhotoPosts.Where(x => x.CommentPhotoPostId == request.CommentPhotoPostId).FirstOrDefault();
            var postReactCount = _querycontext.PostReactCounts.Where(x => x.UserPostPhotoId == UserPhotoComment.UserPostPhotoId).FirstOrDefault();

            var result = new DeleteCommentUserPhotoPostCommandResult();
            if (UserPhotoComment == null)
            {
                throw new ErrorException(StatusCodeEnum.CM04_Comment_Not_Found);
            }
            else
            {
                if (request.UserId != UserPhotoComment.UserId)
                {
                    throw new ErrorException(StatusCodeEnum.UP03_Not_Authorized);
                }
                else
                {
                    UserPhotoComment.IsHide = true;
                    var cpp = ModelConverter.Convert<Domain.QueryModels.CommentPhotoPost, Domain.CommandModels.CommentPhotoPost>(UserPhotoComment);
                    _context.CommentPhotoPosts.Update(cpp);
                    if (postReactCount != null)
                    {
                        if (postReactCount.CommentCount > 0)
                        {
                            postReactCount.CommentCount--;
                        }
                        var prc = ModelConverter.Convert<Domain.QueryModels.PostReactCount, Domain.CommandModels.PostReactCount>(postReactCount);
                        _context.PostReactCounts.Update(prc);
                    }
                    _context.SaveChanges();
                    result.Message = "Delete successfully";
                    result.IsDelete = true;
                }
            }

            return Result<DeleteCommentUserPhotoPostCommandResult>.Success(result);
        }
    }
}
