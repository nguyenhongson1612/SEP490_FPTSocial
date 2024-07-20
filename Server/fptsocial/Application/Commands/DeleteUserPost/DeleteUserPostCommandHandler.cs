using Application.Commands.DeleteGroup;
using AutoMapper;
using Core.CQRS;
using Core.CQRS.Command;
using Domain.CommandModels;
using Domain.Enums;
using Domain.Exceptions;
using Domain.QueryModels;
using Microsoft.EntityFrameworkCore.Query;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Commands.DeleteUserPost
{
    public class DeleteUserPostCommandHandler : ICommandHandler<DeleteUserPostCommand, DeleteUserPostCommandResult>
    {
        private readonly fptforumCommandContext _context;
        private readonly fptforumQueryContext _querycontext;
        public DeleteUserPostCommandHandler(fptforumCommandContext context, fptforumQueryContext querycontext, IMapper mapper)
        {
            _context = context;
            _querycontext = querycontext;

        }
        public async Task<Result<DeleteUserPostCommandResult>> Handle(DeleteUserPostCommand request, CancellationToken cancellationToken)
        {
            if (request == null || _querycontext == null) 
            {
                throw new ErrorException(StatusCodeEnum.Context_Not_Found);
            }

            var userPost = _querycontext.UserPosts.Where(x => x.UserPostId == request.UserPostId).FirstOrDefault();
            var result = new DeleteUserPostCommandResult();
            if (userPost == null)
            {
                throw new ErrorException(StatusCodeEnum.UP02_Post_Not_Found);
            }
            else
            {
                if (request.UserId != userPost.UserId)
                {
                    throw new ErrorException(StatusCodeEnum.UP03_Not_Authorized);
                }
                else
                {
                    userPost.IsHide = true;
                    var userPhotoPost = _querycontext.UserPostPhotos.Where(x => x.UserPostId == request.UserPostId).ToList();
                    foreach (var photoPost in userPhotoPost) 
                    {
                        photoPost.IsHide = true;
                    }
                    var userVideoPost = _querycontext.UserPostVideos.Where(x => x.UserPostId == request.UserPostId).ToList();
                    foreach (var videoPost in userVideoPost)
                    {
                        videoPost.IsHide = true;
                    }
                    _querycontext.SaveChanges();
                    result.Message = "Delete successfully";
                    result.IsDelete = true;
                }
            }
           
            return Result<DeleteUserPostCommandResult>.Success(result); 
        }
    }
}
