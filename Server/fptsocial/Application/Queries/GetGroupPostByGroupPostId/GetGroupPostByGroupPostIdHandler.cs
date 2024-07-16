using Application.DTO.GetUserProfileDTO;
using Application.DTO.GroupPostDTO;
using Application.Queries.GetGroupPostByGroupId;
using AutoMapper;
using Core.CQRS;
using Core.CQRS.Query;
using Domain.Enums;
using Domain.Exceptions;
using Domain.QueryModels;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Intrinsics.X86;
using System.Text;
using System.Threading.Tasks;

namespace Application.Queries.GetGroupPostByGroupPostId
{
    public class GetGroupPostByGroupPostIdHandler : IQueryHandler<GetGroupPostByGroupPostIdQuery, GetGroupPostByGroupPostIdResult>
    {
        private readonly fptforumQueryContext _context;
        private readonly IMapper _mapper;

        public GetGroupPostByGroupPostIdHandler(fptforumQueryContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public async Task<Result<GetGroupPostByGroupPostIdResult>> Handle(GetGroupPostByGroupPostIdQuery request, CancellationToken cancellationToken)
        {
            if(_context == null)
            {
                throw new ErrorException(StatusCodeEnum.Context_Not_Found);
            }

            if(request == null)
            {
                throw new ErrorException(StatusCodeEnum.RQ01_Request_Is_Null);
            }

            var groupPost = await _context.GroupPosts
                                    .Include(x => x.GroupPhoto)
                                    .Include(x => x.GroupVideo)
                                    .Include(x => x.GroupPostPhotos.Where(x => x.IsHide != true && x.IsBanned != true))
                                        .ThenInclude(x => x.GroupPhoto)
                                    .Include(x => x.GroupPostVideos.Where(x => x.IsHide != true && x.IsBanned != true))
                                        .ThenInclude(x => x.GroupVideo)
                                    .Include(x => x.Group)
                                    .FirstOrDefaultAsync(x => x.GroupPostId == request.GroupPostId && x.IsHide != true && x.IsBanned != true);
            var avt = _context.AvataPhotos.FirstOrDefault(x => x.UserId == groupPost.UserId && x.IsUsed == true);
            var user = _context.UserProfiles.FirstOrDefault(x => x.UserId == groupPost.UserId);

            var result = new GetGroupPostByGroupPostIdResult
            {
                GroupPostId = groupPost.GroupPostId,
                UserId = groupPost.UserId,
                Content = groupPost.Content,
                GroupPostNumber = groupPost.GroupPostNumber,
                GroupStatusId = groupPost.GroupStatusId,
                CreatedAt = groupPost.CreatedAt,
                IsHide = groupPost.IsHide,
                UpdatedAt = groupPost.UpdatedAt,
                GroupPhotoId = groupPost.GroupPhotoId,
                GroupVideoId = groupPost.GroupVideoId,
                NumberPost = groupPost.NumberPost,
                IsBanned = groupPost.IsBanned,
                GroupPhoto = _mapper.Map<GroupPhotoDTO>(groupPost.GroupPhoto),
                GroupVideo = _mapper.Map<GroupVideoDTO>(groupPost.GroupVideo),
                GroupPostPhoto = groupPost.GroupPostPhotos?.Select(upp => new GroupPostPhotoDTO
                {
                    GroupPostPhotoId = upp.GroupPostPhotoId,
                    GroupPostId = upp.GroupPostId,
                    Content = upp.Content,
                    GroupPhotoId = upp.GroupPhotoId,
                    GroupStatusId = upp.GroupStatusId,
                    GroupPostPhotoNumber = upp.GroupPostPhotoNumber,
                    IsHide = upp.IsHide,
                    CreatedAt = upp.CreatedAt,
                    UpdatedAt = upp.UpdatedAt,
                    PostPosition = upp.PostPosition,
                    GroupPhoto = _mapper.Map<GroupPhotoDTO>(upp.GroupPhoto)
                }).ToList(),
                GroupPostVideo = groupPost.GroupPostVideos?.Select(upp => new GroupPostVideoDTO
                {
                    GroupPostVideoId = upp.GroupPostVideoId,
                    GroupPostId = upp.GroupPostId,
                    Content = upp.Content,
                    GroupVideoId = upp.GroupVideoId,
                    GroupStatusId = upp.GroupStatusId,
                    GroupPostVideoNumber = upp.GroupPostVideoNumber,
                    IsHide = upp.IsHide,
                    CreatedAt = upp.CreatedAt,
                    UpdatedAt = upp.UpdatedAt,
                    PostPosition = upp.PostPosition,
                    GroupVideo = _mapper.Map<GroupVideoDTO>(upp.GroupVideo)
                }).ToList(),
                UserAvata = _mapper.Map<GetUserAvatar>(avt),
                UserName = user.FirstName + " " + user.LastName,
                GroupId = groupPost.GroupId,
                GroupName = groupPost.Group.GroupName,
                GroupCorverImage = groupPost.Group.CoverImage
            };

            return Result<GetGroupPostByGroupPostIdResult>.Success(result);
        }
    }
}
