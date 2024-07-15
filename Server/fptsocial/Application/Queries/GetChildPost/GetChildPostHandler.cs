using Application.DTO.GetUserProfileDTO;
using Application.DTO.UserPostPhotoDTO;
using Application.DTO.UserPostVideoDTO;
using AutoMapper;
using Core.CQRS;
using Core.CQRS.Query;
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

            var combinedResults = new List<GetChildPostResult>();

            var userPostPhoto = await _context.UserPostPhotos
                .Include(x => x.UserPost)
                .Include(x => x.UserStatus)
                .Include(x => x.Photo)
                .Where(x => x.UserPostId == userPostId && x.IsHide != true)
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
                        UserStatusName = _context.UserStatuses.Where(x => x.UserStatusId == photo.UserStatusId).Select(x => x.StatusName).FirstOrDefault()
                    },
                    IsHide = photo.IsHide,
                    CreatedAt = photo.CreatedAt,
                    UpdatedAt = photo.UpdatedAt,
                    PostPosition = photo.PostPosition,
                    MediaType = "Photo",
                    Photo = _mapper.Map<PhotoDTO>(photo.Photo),
                    UserId = user.UserId,
                    FullName = user.FirstName + " " + user.LastName,
                    Avatar = _mapper.Map<GetUserAvatar>(avt)
                });
            }

            var userPostVideo = await _context.UserPostVideos
                .Include(x => x.UserPost)
                .Include(x => x.UserStatus)
                .Include(x => x.Video)
                .Where(x => x.UserPostId == userPostId && x.IsHide != true)
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
                        UserStatusName = _context.UserStatuses.Where(x => x.UserStatusId == video.UserStatusId).Select(x => x.StatusName).FirstOrDefault()
                    },
                    IsHide = video.IsHide,
                    CreatedAt = video.CreatedAt,
                    UpdatedAt = video.UpdatedAt,
                    PostPosition = video.PostPosition,
                    MediaType = "Video",
                    Video = _mapper.Map<VideoDTO>(video.Video),
                    UserId = user.UserId,
                    FullName = user.FirstName + " " + user.LastName,
                    Avatar = _mapper.Map<GetUserAvatar>(avt)
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
