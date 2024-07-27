using Application.Commands.DeleteGroup;
using AutoMapper;
using Core.CQRS;
using Core.CQRS.Command;
using Core.Helper;
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
                    var up = ModelConverter.Convert<Domain.QueryModels.UserPost, Domain.CommandModels.UserPost>(userPost);
                    _context.UserPosts.Update(up);

                    var userPhotoPost = _querycontext.UserPostPhotos.Where(x => x.UserPostId == request.UserPostId).ToList();
                    foreach (var photoPost in userPhotoPost) 
                    {
                        photoPost.IsHide = true;
                        var pp = ModelConverter.Convert<Domain.QueryModels.UserPostPhoto, Domain.CommandModels.UserPostPhoto>(photoPost);
                        _context.UserPostPhotos.Update(pp);
                    }
                    var userVideoPost = _querycontext.UserPostVideos.Where(x => x.UserPostId == request.UserPostId).ToList();
                    foreach (var videoPost in userVideoPost)
                    {
                        videoPost.IsHide = true;
                        var vp = ModelConverter.Convert<Domain.QueryModels.UserPostVideo, Domain.CommandModels.UserPostVideo>(videoPost);
                        _context.UserPostVideos.Update(vp);
                    }
                    _context.SaveChanges();
                    result.Message = "Delete successfully";
                    result.IsDelete = true;
                }
            }
           
            return Result<DeleteUserPostCommandResult>.Success(result); 
        }
    }
}
