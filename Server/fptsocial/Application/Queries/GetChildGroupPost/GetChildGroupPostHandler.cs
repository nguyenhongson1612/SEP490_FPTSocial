
using Application.DTO.GetUserProfileDTO;
using Application.DTO.GroupDTO;
using Application.DTO.GroupPostDTO;

using Application.Queries.GetChildPost;
using AutoMapper;
using Core.CQRS;
using Core.CQRS.Query;
using Domain.CommandModels;
using Domain.Enums;
using Domain.Exceptions;
using Domain.QueryModels;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Queries.GetChildGroupPost
{
    public class GetChildGroupPostHandler : IQueryHandler<GetChildGroupPostQuery, GetChildGroupPostResult>
    {
        private readonly fptforumQueryContext _context;
        private readonly IMapper _mapper;

        public GetChildGroupPostHandler(fptforumQueryContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public async Task<Result<GetChildGroupPostResult>> Handle(GetChildGroupPostQuery request, CancellationToken cancellationToken)
        {
            if (_context == null)
            {
                throw new ErrorException(StatusCodeEnum.Context_Not_Found);
            }
            if (request == null)
            {
                throw new ErrorException(StatusCodeEnum.RQ01_Request_Is_Null);
            }

            var groupPostId = await _context.GroupPostPhotos
                                            .Where(x => x.GroupPostPhotoId == request.GroupPostMediaId)
                                            .Select(x => x.GroupPostId)
                                            .FirstOrDefaultAsync();

            if (groupPostId == Guid.Empty)
            {
                groupPostId = await _context.GroupPostVideos
                                            .Where(x => x.GroupPostVideoId == request.GroupPostMediaId)
                                            .Select(x => x.GroupPostId)
                                            .FirstOrDefaultAsync();
            }

            var combinedResults = new List<GetChildGroupPostResult>();

            var groupPostPhotos = await _context.GroupPostPhotos
                .Include(x => x.GroupPost)
                .ThenInclude(x => x.Group)
                .Include(x => x.GroupStatus)
                .Include(x => x.GroupPhoto)
                .Where(x => x.GroupPostId == groupPostId && x.IsHide != true && x.IsBanned != true)
                .ToListAsync(cancellationToken);

            foreach (var photo in groupPostPhotos)
            {
                var user = await _context.UserProfiles.FirstOrDefaultAsync(x => x.UserId == photo.GroupPost.UserId);
                var avt = await _context.AvataPhotos.FirstOrDefaultAsync(x => x.UserId == photo.GroupPost.UserId && x.IsUsed == true);

                combinedResults.Add(new GetChildGroupPostResult
                {
                    GroupPostMediaId = photo.GroupPostPhotoId,
                    GroupPostId = photo.GroupPostId,
                    GroupMediaId = photo.GroupPhotoId,
                    Content = photo.Content,
                    GroupPostMediaNumber = photo.GroupPostPhotoNumber,
                    Status = new GetGroupStatusDTO
                    {
                        GroupStatusId = photo.GroupStatusId,
                        GroupStatusName = photo.GroupStatus.GroupStatusName
                    },
                    IsHide = photo.IsHide,
                    CreatedAt = photo.CreatedAt,
                    UpdatedAt = photo.UpdatedAt,
                    PostPosition = photo.PostPosition,
                    GroupMediaType = "Photo",
                    GroupPhoto = _mapper.Map<GroupPhotoDTO>(photo.GroupPhoto),
                    UserId = photo.GroupPost.UserId,
                    FullName = user != null ? user.FirstName + " " + user.LastName : string.Empty,
                    Avatar = avt != null ? _mapper.Map<GetUserAvatar>(avt) : null,
                    GroupId = photo.GroupId,
                    GroupName = photo.Group?.GroupName,
                    GroupCoverImge = photo.Group?.CoverImage,
                    ReactCount = new DTO.ReactDTO.ReactCount
                    {
                        ReactNumber = _context.ReactGroupPhotoPosts.Count(x => x.GroupPostPhotoId == photo.GroupPostPhotoId),
                        CommentNumber = _context.CommentPhotoGroupPosts
                        .Count(x => x.GroupPostPhotoId == photo.GroupPostPhotoId && x.IsHide != true && x.IsBanned != true),
                        ShareNumber = _context.GroupSharePosts.Count(x => x.GroupPostPhotoId == photo.GroupPostPhotoId && x.IsHide != true && x.IsBanned != true) +
                                        _context.SharePosts.Count(x => x.GroupPostPhotoId == photo.GroupPostPhotoId && x.IsHide != true && x.IsBanned != true)
                    }
                });
            }

            var groupPostVideos = await _context.GroupPostVideos
                .Include(x => x.GroupPost)
                .ThenInclude(x => x.Group)
                .Include(x => x.GroupStatus)
                .Include(x => x.GroupVideo)
                .Where(x => x.GroupPostId == groupPostId && x.IsHide != true && x.IsBanned != true)
                .ToListAsync(cancellationToken);

            foreach (var video in groupPostVideos)
            {
                var user = await _context.UserProfiles.FirstOrDefaultAsync(x => x.UserId == video.GroupPost.UserId);
                var avt = await _context.AvataPhotos.FirstOrDefaultAsync(x => x.UserId == video.GroupPost.UserId && x.IsUsed == true);

                combinedResults.Add(new GetChildGroupPostResult
                {
                    GroupPostMediaId = video.GroupPostVideoId,
                    GroupPostId = video.GroupPostId,
                    GroupMediaId = video.GroupVideoId,
                    Content = video.Content,
                    GroupPostMediaNumber = video.GroupPostVideoNumber,
                    Status = new GetGroupStatusDTO
                    {
                        GroupStatusId = video.GroupStatusId,
                        GroupStatusName = video.GroupStatus.GroupStatusName
                    },
                    IsHide = video.IsHide,
                    CreatedAt = video.CreatedAt,
                    UpdatedAt = video.UpdatedAt,
                    PostPosition = video.PostPosition,
                    GroupMediaType = "Video",
                    GroupVideo = _mapper.Map<GroupVideoDTO>(video.GroupVideo),
                    UserId = video.GroupPost.UserId,
                    FullName = user != null ? user.FirstName + " " + user.LastName : string.Empty,
                    Avatar = avt != null ? _mapper.Map<GetUserAvatar>(avt) : null,
                    GroupId = video.GroupId,
                    GroupName = video.Group?.GroupName,
                    GroupCoverImge = video.Group?.CoverImage,
                    ReactCount = new DTO.ReactDTO.ReactCount
                    {
                        ReactNumber = _context.ReactGroupVideoPosts.Count(x => x.GroupPostVideoId == video.GroupPostVideoId),
                        CommentNumber = _context.CommentGroupVideoPosts
                        .Count(x => x.GroupPostVideoId == video.GroupPostVideoId && x.IsHide != true && x.IsBanned != true),
                        ShareNumber = _context.GroupSharePosts.Count(x => x.GroupPostVideoId == video.GroupPostVideoId && x.IsHide != true && x.IsBanned != true) +
                                        _context.SharePosts.Count(x => x.GroupPostVideoId == video.GroupPostVideoId && x.IsHide != true && x.IsBanned != true)
                    }
                });
            }

            combinedResults = combinedResults.OrderBy(x => x.PostPosition).ToList();

            for (int i = 0; i < combinedResults.Count; i++)
            {
                if (i > 0)
                {
                    combinedResults[i].PreviousId = combinedResults[i - 1].GroupPostMediaId;
                    combinedResults[i].PreviousType = combinedResults[i - 1].GroupMediaType;
                }
                else
                {
                    combinedResults[i].PreviousId = combinedResults[combinedResults.Count - 1].GroupPostMediaId;
                    combinedResults[i].PreviousType = combinedResults[combinedResults.Count - 1].GroupMediaType;
                }

                if (i < combinedResults.Count - 1)
                {
                    combinedResults[i].NextId = combinedResults[i + 1].GroupPostMediaId;
                    combinedResults[i].NextType = combinedResults[i + 1].GroupMediaType;
                }
                else
                {
                    combinedResults[i].NextId = combinedResults[0].GroupPostMediaId;
                    combinedResults[i].NextType = combinedResults[0].GroupMediaType;
                }
            }

            var result = combinedResults.FirstOrDefault(x => x.GroupPostMediaId == request.GroupPostMediaId);

            return Result<GetChildGroupPostResult>.Success(result);
        }


    }
}
