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

namespace Application.Commands.DeleteGroupPost
{
    public class DeleteGroupPostCommandHandler : ICommandHandler<DeleteGroupPostCommand, DeleteGroupPostCommandResult>
    {
        private readonly fptforumCommandContext _context;
        private readonly fptforumQueryContext _querycontext;
        public DeleteGroupPostCommandHandler(fptforumCommandContext context, fptforumQueryContext querycontext, IMapper mapper)
        {
            _context = context;
            _querycontext = querycontext;

        }
        public async Task<Result<DeleteGroupPostCommandResult>> Handle(DeleteGroupPostCommand request, CancellationToken cancellationToken)
        {
            if (_context == null || _querycontext == null) 
            {
                throw new ErrorException(StatusCodeEnum.Context_Not_Found);
            }

            var groupPost = _querycontext.GroupPosts.Where(x => x.GroupPostId == request.GroupPostId).FirstOrDefault();
            var result = new DeleteGroupPostCommandResult();
            if (groupPost == null)
            {
                throw new ErrorException(StatusCodeEnum.UP02_Post_Not_Found);
            }
            else
            {
                if (request.UserId != groupPost.UserId)
                {
                    throw new ErrorException(StatusCodeEnum.UP03_Not_Authorized);
                }
                else
                {
                    groupPost.IsHide = true;
                    var gp = ModelConverter.Convert<Domain.QueryModels.GroupPost, Domain.CommandModels.GroupPost>(groupPost);
                    _context.GroupPosts.Update(gp);

                    var GroupPhotoPost = _querycontext.GroupPostPhotos.Where(x => x.GroupPostId == request.GroupPostId).ToList();
                    foreach (var photoPost in GroupPhotoPost) 
                    {
                        photoPost.IsHide = true;
                        var gpp = ModelConverter.Convert<Domain.QueryModels.GroupPostPhoto, Domain.CommandModels.GroupPostPhoto>(photoPost);
                        _context.GroupPostPhotos.Update(gpp);
                    }
                    var GroupVideoPost = _querycontext.GroupPostVideos.Where(x => x.GroupPostId == request.GroupPostId).ToList();
                    foreach (var videoPost in GroupVideoPost)
                    {
                        videoPost.IsHide = true;
                        var gpp = ModelConverter.Convert<Domain.QueryModels.GroupPostVideo, Domain.CommandModels.GroupPostVideo>(videoPost);
                        _context.GroupPostVideos.Update(gpp);
                    }
                    _context.SaveChanges();
                    result.Message = "Delete successfully";
                    result.IsDelete = true;
                }
            }
           
            return Result<DeleteGroupPostCommandResult>.Success(result); 
        }
    }
}
