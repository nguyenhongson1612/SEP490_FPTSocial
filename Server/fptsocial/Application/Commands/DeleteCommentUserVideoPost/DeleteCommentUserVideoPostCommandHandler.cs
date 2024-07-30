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
            if (_context == null || _querycontext == null)
            {
                throw new ErrorException(StatusCodeEnum.Context_Not_Found);
            }

            var UserVideoComment = _querycontext.CommentVideoPosts.Where(x => x.CommentVideoPostId == request.CommentVideoPostId).FirstOrDefault();
            var postReactCount = _querycontext.PostReactCounts.Where(x => x.UserPostVideoId == UserVideoComment.UserPostVideoId).FirstOrDefault();

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
                    var csp = new Domain.CommandModels.CommentVideoPost
                    {
                        CommentVideoPostId = UserVideoComment.CommentVideoPostId,
                        UserPostVideoId = UserVideoComment.UserPostVideoId,
                        UserId = UserVideoComment.UserId,
                        Content = UserVideoComment.Content,
                        ParentCommentId = UserVideoComment.ParentCommentId,
                        ListNumber = UserVideoComment.ListNumber,
                        LevelCmt = UserVideoComment.LevelCmt,
                        IsHide = true,
                        CreatedDate = UserVideoComment.CreatedDate,
                        IsBanned = UserVideoComment.IsBanned,
                    };
                    _context.CommentVideoPosts.Update(csp);
                    if (postReactCount != null)
                    {
                        if (postReactCount.CommentCount > 0)
                        {
                            postReactCount.CommentCount--;
                        }

                        var prc = new Domain.CommandModels.PostReactCount
                        {
                            PostReactCountId = postReactCount.PostReactCountId,
                            UserPostId = postReactCount.UserPostId,
                            UserPostPhotoId = postReactCount.UserPostPhotoId,
                            UserPostVideoId = postReactCount.UserPostVideoId,
                            ReactCount = postReactCount.ReactCount,
                            CommentCount = postReactCount.CommentCount,
                            ShareCount = postReactCount.ShareCount,
                            CreateAt = postReactCount.CreateAt,
                            UpdateAt = DateTime.Now,
                        };

                        _context.PostReactCounts.Update(prc);
                    }
                    _context.SaveChanges();
                    result.Message = "Delete successfully";
                    result.IsDelete = true;
                }
            }

            return Result<DeleteCommentUserVideoPostCommandResult>.Success(result);
        }
    }
}
