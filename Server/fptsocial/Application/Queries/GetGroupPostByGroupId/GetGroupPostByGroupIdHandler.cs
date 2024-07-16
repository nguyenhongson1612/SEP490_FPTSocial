using Application.DTO.GetUserProfileDTO;
using Application.DTO.GroupPostDTO;
using AutoMapper;
using Core.CQRS;
using Core.CQRS.Query;
using Domain.Enums;
using Domain.Exceptions;
using Domain.QueryModels;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json.Serialization;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;

namespace Application.Queries.GetGroupPostByGroupId
{
    public class GetGroupPostByGroupIdHandler : IQueryHandler<GetGroupPostByGroupIdQuery, List<GetGroupPostByGroupIdResult>>
    {
        private readonly fptforumQueryContext _context;
        private readonly IMapper _mapper;

        public GetGroupPostByGroupIdHandler(fptforumQueryContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public async Task<Result<List<GetGroupPostByGroupIdResult>>> Handle(GetGroupPostByGroupIdQuery request, CancellationToken cancellationToken)
        {
            if (_context == null)
            {
                throw new ErrorException(StatusCodeEnum.Context_Not_Found);
            }

            if (request == null)
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
                                    .Where(x => x.GroupId == request.GroupId && x.IsHide != true && x.IsBanned != true)
                                    .ToListAsync(cancellationToken);

            var result = groupPost.Select(x => new GetGroupPostByGroupIdResult
            {
                GroupPostId = x.GroupPostId,
                UserId = x.UserId,
                Content = x.Content,
                GroupPostNumber = x.GroupPostNumber,
                GroupStatusId = x.GroupStatusId,
                CreatedAt = x.CreatedAt,
                IsHide = x.IsHide,
                UpdatedAt = x.UpdatedAt,
                GroupPhotoId = x.GroupPhotoId,
                GroupVideoId = x.GroupVideoId,
                NumberPost = x.NumberPost,
                IsBanned = x.IsBanned,
                GroupPhoto = _mapper.Map<GroupPhotoDTO>(x.GroupPhoto),
                GroupVideo = _mapper.Map<GroupVideoDTO>(x.GroupVideo),
                GroupPostPhoto = x.GroupPostPhotos?.Select(upp => new GroupPostPhotoDTO {
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
                GroupPostVideo = x.GroupPostVideos?.Select(upp => new GroupPostVideoDTO
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
                GroupId = x.GroupId,
                GroupName = x.Group.GroupName,
                GroupCorverImage = x.Group.CoverImage
            }).ToList();

            foreach (var item in result)
            {
                var avt = _context.AvataPhotos.FirstOrDefault(x => x.UserId == item.UserId && x.IsUsed == true);
                var user = _context.UserProfiles.FirstOrDefault(x => x.UserId == item.UserId);
                item.UserAvata = _mapper.Map<GetUserAvatar>(avt);
                item.UserName = user.FirstName + " " + user.LastName;
            }
            return Result<List<GetGroupPostByGroupIdResult>>.Success(result);
        }
    }
}
