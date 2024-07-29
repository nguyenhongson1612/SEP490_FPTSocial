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

namespace Application.Commands.DeleteCommentGroupVideoPost
{
    public class DeleteCommentGroupVideoPostCommandHandler : ICommandHandler<DeleteCommentGroupVideoPostCommand, DeleteCommentGroupVideoPostCommandResult>
    {
        private readonly fptforumCommandContext _context;
        private readonly fptforumQueryContext _querycontext;
        public DeleteCommentGroupVideoPostCommandHandler(fptforumCommandContext context, fptforumQueryContext querycontext, IMapper mapper)
        {
            _context = context;
            _querycontext = querycontext;

        }
        public async Task<Result<DeleteCommentGroupVideoPostCommandResult>> Handle(DeleteCommentGroupVideoPostCommand request, CancellationToken cancellationToken)
        {
            if (_context == null || _querycontext == null)
            {
                throw new ErrorException(StatusCodeEnum.Context_Not_Found);
            }

            var GroupVideoComment = _querycontext.CommentGroupVideoPosts.Where(x => x.CommentGroupVideoPostId == request.CommentGroupVideoPostId).FirstOrDefault();
            var groupPostReactCount = _querycontext.GroupPostReactCounts.Where(x => x.GroupPostVideoId == GroupVideoComment.GroupPostVideoId).FirstOrDefault();

            var result = new DeleteCommentGroupVideoPostCommandResult();
            if (GroupVideoComment == null)
            {
                throw new ErrorException(StatusCodeEnum.CM04_Comment_Not_Found);
            }
            else
            {
                if (request.UserId != GroupVideoComment.UserId)
                {
                    throw new ErrorException(StatusCodeEnum.UP03_Not_Authorized);
                }
                else
                {
                    var cgvs = new Domain.CommandModels.CommentGroupVideoPost
                    {
                        CommentGroupVideoPostId = GroupVideoComment.CommentGroupVideoPostId,
                        GroupPostVideoId = GroupVideoComment.GroupPostVideoId,
                        UserId = GroupVideoComment.UserId,
                        Content = GroupVideoComment.Content,
                        ParentCommentId = GroupVideoComment.ParentCommentId,
                        ListNumber = GroupVideoComment.ListNumber,
                        LevelCmt = GroupVideoComment.LevelCmt,
                        IsHide = true,
                        CreatedDate = GroupVideoComment?.CreatedDate,
                        IsBanned = GroupVideoComment?.IsBanned,
                    };
                    _context.CommentGroupVideoPosts.Update(cgvs);
                    if (groupPostReactCount != null)
                    {
                        if (groupPostReactCount.CommentCount > 0)
                        {
                            groupPostReactCount.CommentCount--;
                        }
                        var prc = new Domain.CommandModels.GroupPostReactCount
                        {
                            GroupPostReactCountId = groupPostReactCount.GroupPostReactCountId,
                            GroupPostId = groupPostReactCount.GroupPostId,
                            GroupPostPhotoId = groupPostReactCount.GroupPostPhotoId,
                            ReactCount = groupPostReactCount.ReactCount,
                            CommentCount = groupPostReactCount.CommentCount,
                            ShareCount = groupPostReactCount.ShareCount,
                        };
                        _context.GroupPostReactCounts.Update(prc);
                    }
                    _context.SaveChanges();
                    result.Message = "Delete successfully";
                    result.IsDelete = true;
                }
            }

            return Result<DeleteCommentGroupVideoPostCommandResult>.Success(result);
        }
    }
}
