using Application.DTO.GetUserProfileDTO;
using Application.DTO.UserPostPhotoDTO;
using Application.DTO.UserPostVideoDTO;
using AutoMapper;
using Core.CQRS;
using Core.CQRS.Query;
using Domain.CommandModels;
using Domain.Enums;
using Domain.Exceptions;
using Domain.QueryModels;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Hosting;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Queries.GetChildPost
{
    public class GetChildPostHandler : IQueryHandler<GetChildPostQuery, GetChildPostResult>
    {
        private readonly fptforumQueryContext _context;
        private readonly IMapper _mapper;

        public GetChildPostHandler(fptforumQueryContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public async Task<Result<GetChildPostResult>> Handle(GetChildPostQuery request, CancellationToken cancellationToken)
        {
            if (_context == null)
            {
                throw new ErrorException(StatusCodeEnum.Context_Not_Found);
            }

            if (request == null) {
                throw new ErrorException(StatusCodeEnum.RQ01_Request_Is_Null);
            }

            var userPostId = await _context.UserPostPhotos
                                            .Where(x => x.UserPostPhotoId == request.UserPostMediaId)
                                            .Select(x => x.UserPostId)
                                            .FirstOrDefaultAsync();
            if(userPostId == Guid.Empty)
            {
                userPostId = await _context.UserPostVideos
                                            .Where(x => x.UserPostVideoId == request.UserPostMediaId)
                                            .Select(x => x.UserPostId)
                                            .FirstOrDefaultAsync();
            }

            var blockUserList = await _context.BlockUsers
                .Where(x => (x.UserId == request.UserId || x.UserIsBlockedId == request.UserId) && x.IsBlock == true)
                .Select(x => x.UserId == request.UserId ? x.UserIsBlockedId : x.UserId)
                .ToListAsync(cancellationToken);

            //Lấy UserId của bài post cha
            var userId = await _context.UserPosts
                .Where(x => x.UserPostId == userPostId)
                .Select(x => x.UserId)
                .FirstOrDefaultAsync(cancellationToken);

            if (blockUserList.Contains(userId))
            {
                throw new ErrorException(StatusCodeEnum.UP02_Post_Not_Found);
            }

            var combinedResults = new List<GetChildPostResult>();

            var userPostPhoto = await _context.UserPostPhotos
                .Include(x => x.UserPost)
                .Include(x => x.UserStatus)
                .Include(x => x.Photo)
                .Where(x => x.UserPostId == userPostId && x.IsHide != true && x.IsBanned != true)
                .ToListAsync(cancellationToken);

            foreach (var photo in userPostPhoto)
            {
                var user = await _context.UserProfiles.FirstOrDefaultAsync(x => x.UserId == photo.UserPost.UserId);
                var avt = await _context.AvataPhotos.FirstOrDefaultAsync(x => x.UserId == photo.UserPost.UserId && x.IsUsed == true);
                combinedResults.Add(new GetChildPostResult
                {
                    UserPostMediaId = photo.UserPostPhotoId,
                    UserPostId = photo.UserPostId,
                    MediaId = photo.PhotoId,
                    Content = photo.Content,
                    UserPostMediaNumber = photo.UserPostPhotoNumber,
                    Status = new GetUserStatusDTO
                    {
                        UserStatusId = photo.UserStatusId,
                        UserStatusName = photo.UserStatus.StatusName
                    },
                    IsHide = photo.IsHide,
                    CreatedAt = photo.CreatedAt,
                    UpdatedAt = photo.UpdatedAt,
                    PostPosition = photo.PostPosition,
                    MediaType = "Photo",
                    Photo = _mapper.Map<PhotoDTO>(photo.Photo),
                    UserId = user.UserId,
                    FullName = user.FirstName + " " + user.LastName,
                    Avatar = _mapper.Map<GetUserAvatar>(avt),
                    ReactCount = new DTO.ReactDTO.ReactCount
                    {
                        ReactNumber = _context.ReactPhotoPosts.Count(x => x.UserPostPhotoId == photo.UserPostPhotoId),
                        CommentNumber = _context.CommentPhotoPosts
                        .Count(x => x.UserPostPhotoId == photo.UserPostPhotoId && x.IsHide != true && x.IsBanned != true),
                        ShareNumber = _context.GroupSharePosts.Count(x => x.UserPostPhotoId == photo.UserPostPhotoId && x.IsHide != true && x.IsBanned != true) +
                                        _context.SharePosts.Count(x => x.UserPostPhotoId == photo.UserPostPhotoId && x.IsHide != true && x.IsBanned != true)
                    }
                });
            }

            var userPostVideo = await _context.UserPostVideos
                .Include(x => x.UserPost)
                .Include(x => x.UserStatus)
                .Include(x => x.Video)
                .Where(x => x.UserPostId == userPostId && x.IsHide != true && x.IsBanned != true )
                .ToListAsync(cancellationToken);

            foreach (var video in userPostVideo)
            {
                var user = await _context.UserProfiles.FirstOrDefaultAsync(x => x.UserId == video.UserPost.UserId);
                var avt = await _context.AvataPhotos.FirstOrDefaultAsync(x => x.UserId == video.UserPost.UserId && x.IsUsed == true);
                combinedResults.Add(new GetChildPostResult
                {
                    UserPostMediaId = video.UserPostVideoId,
                    UserPostId = video.UserPostId,
                    MediaId = video.VideoId,
                    Content = video.Content,
                    UserPostMediaNumber = video.UserPostVideoNumber,
                    Status = new GetUserStatusDTO
                    {
                        UserStatusId = video.UserStatusId,
                        UserStatusName = video.UserStatus.StatusName
                    },
                    IsHide = video.IsHide,
                    CreatedAt = video.CreatedAt,
                    UpdatedAt = video.UpdatedAt,
                    PostPosition = video.PostPosition,
                    MediaType = "Video",
                    Video = _mapper.Map<VideoDTO>(video.Video),
                    UserId = user.UserId,
                    FullName = user.FirstName + " " + user.LastName,
                    Avatar = _mapper.Map<GetUserAvatar>(avt),
                    ReactCount = new DTO.ReactDTO.ReactCount
                    {
                        ReactNumber = _context.ReactVideoPosts.Count(x => x.UserPostVideoId == video.UserPostVideoId),
                        CommentNumber = _context.CommentVideoPosts
                        .Count(x => x.UserPostVideoId == video.UserPostVideoId && x.IsHide != true && x.IsBanned != true),
                        ShareNumber = _context.GroupSharePosts.Count(x => x.UserPostVideoId == video.UserPostVideoId && x.IsHide != true && x.IsBanned != true) +
                                        _context.SharePosts.Count(x => x.UserPostVideoId == video.UserPostVideoId && x.IsHide != true && x.IsBanned != true)
                    }
                });
            }

            combinedResults = combinedResults.OrderBy(x => x.PostPosition).ToList();
            for (int i = 0; i < combinedResults.Count; i++)
            {
                if (i > 0)
                {
                    combinedResults[i].PreviousId = combinedResults[i - 1].UserPostMediaId;
                    combinedResults[i].PreviousType = combinedResults[i - 1].MediaType;
                }
                else
                {
                    combinedResults[i].PreviousId = combinedResults[combinedResults.Count - 1].UserPostMediaId;
                    combinedResults[i].PreviousType = combinedResults[combinedResults.Count - 1].MediaType;
                }

                if (i < combinedResults.Count - 1)
                {
                    combinedResults[i].NextId = combinedResults[i + 1].UserPostMediaId;
                    combinedResults[i].NextType = combinedResults[i + 1].MediaType;
                }
                else
                {
                    combinedResults[i].NextId = combinedResults[0].UserPostMediaId;
                    combinedResults[i].NextType = combinedResults[0].MediaType;
                }
            }

            var result = combinedResults.FirstOrDefault(x => x.UserPostMediaId == request.UserPostMediaId);
            return Result<GetChildPostResult>.Success(result);
        }
    }
}
