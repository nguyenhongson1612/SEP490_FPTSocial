using Application.DTO.GetUserProfileDTO;
using Application.DTO.UserPostPhotoDTO;
using Application.DTO.UserPostVideoDTO;
using Application.Queries.GetUserByUserId;
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
using System.Text;
using System.Threading.Tasks;

namespace Application.Queries.GetOtherUserPost
{
    public class GetOtherUserPostHandler : IQueryHandler<GetOtherUserPostQuery, List<GetOtherUserPostResult>>
    {
        private readonly fptforumQueryContext _context;
        private readonly IMapper _mapper;
        List<GetOtherUserPostResult> userPosts = new List<GetOtherUserPostResult>();
        public GetOtherUserPostHandler(fptforumQueryContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }
        public async Task<Result<List<GetOtherUserPostResult>>> Handle(GetOtherUserPostQuery request, CancellationToken cancellationToken)
        {
            if (_context == null)
            {
                throw new ErrorException(StatusCodeEnum.Context_Not_Found);
            }

            if (request.UserId == null)
            {
                return Result<List<GetOtherUserPostResult>>.Failure("UserId is required.");
            }

            var idprofilestatus = _context.Settings.Where(x => x.SettingName.Contains("Profile Status")).Select(x => x.SettingId).FirstOrDefault();
            var idpublic = _context.UserStatuses.Where(x => x.StatusName.Contains("Public")).Select(x => x.UserStatusId).FirstOrDefault();
            var setting = _context.UserSettings.FirstOrDefault(x =>x.UserId == request.OtherUserId&& x.SettingId == idprofilestatus && x.UserStatusId == idpublic);

            if (setting == null)
            {
                throw new ErrorException(StatusCodeEnum.PS01_Profile_Status_Private);
            }

            var isFriend = _context.Friends
                            .FirstOrDefault(x => (x.UserId == request.UserId && x.FriendId == request.OtherUserId && x.Confirm == true) 
                            || (x.UserId == request.OtherUserId && x.FriendId == request.UserId && x.Confirm == true));

            var sttNames = new List<string> { "Public" };

            if (isFriend != null)
            {
                sttNames.Add("Friend");
            }

            var sttStatuses = _context.UserStatuses
                .Where(x => sttNames.Contains(x.StatusName))
                .ToList();

            var sttStatusIds = sttStatuses.Select(x => x.UserStatusId).ToList();

            var userPosts = await _context.UserPosts
                .Include(x => x.Photo)
                .Include(x => x.Video)
                .Include(x => x.UserPostPhotos.Where(x => x.IsHide != true))
                    .ThenInclude(x => x.Photo)
                .Include(x => x.UserPostVideos.Where(x => x.IsHide != true))
                    .ThenInclude(x => x.Video)
                .Where(x => x.UserId == request.OtherUserId && sttStatusIds.Contains(x.UserStatusId) && x.IsHide != true)
                .OrderByDescending(x => x.CreatedAt)
                .ToListAsync(cancellationToken);

            var avt = await _context.AvataPhotos.FirstOrDefaultAsync(x => x.UserId == request.OtherUserId && x.IsUsed == true);
            var user = await _context.UserProfiles.FirstOrDefaultAsync(x => x.UserId == request.OtherUserId);
            var result = userPosts.Select(userPost => new GetOtherUserPostResult
            {
                UserPostId = userPost.UserPostId,
                UserId = userPost.UserId,
                Content = userPost.Content,
                UserPostNumber = userPost.UserPostNumber,
                UserStatus = new GetUserStatusDTO
                {
                    UserStatusId = userPost.UserStatusId,
                    UserStatusName = _context.UserStatuses.Where(x => x.UserStatusId == userPost.UserStatusId).Select(x => x.StatusName).FirstOrDefault()
                },
                IsAvataPost = userPost.IsAvataPost,
                IsCoverPhotoPost = userPost.IsCoverPhotoPost,
                IsHide = userPost.IsHide,
                CreatedAt = userPost.CreatedAt,
                UpdatedAt = userPost.UpdatedAt,
                PhotoId = userPost.PhotoId,
                VideoId = userPost.VideoId,
                NumberPost = userPost.NumberPost,
                Photo = _mapper.Map<PhotoDTO>(userPost.Photo),
                Video = _mapper.Map<VideoDTO>(userPost.Video),
                UserPostPhotos = userPost.UserPostPhotos?.Select(upp => new UserPostPhotoDTO
                {
                    UserPostPhotoId = upp.UserPostPhotoId,
                    UserPostId = upp.UserPostId,
                    PhotoId = upp.PhotoId,
                    Content = upp.Content,
                    UserPostPhotoNumber = upp.UserPostPhotoNumber,
                    UserStatusId = upp.UserStatusId,
                    IsHide = upp.IsHide,
                    CreatedAt = upp.CreatedAt,
                    UpdatedAt = upp.UpdatedAt,
                    PostPosition = upp.PostPosition,
                    Photo = _mapper.Map<PhotoDTO>(upp.Photo),
                    ReactCount = new DTO.ReactDTO.ReactCount
                    {
                        ReactNumber = _context.ReactPhotoPosts.Count(x => x.UserPostPhotoId == upp.UserPostPhotoId),
                        CommentNumber = _context.CommentPhotoPosts.Count(x => x.UserPostPhotoId == upp.UserPostPhotoId),
                        ShareNumber = _context.SharePosts.Count(x => x.UserPostPhotoId == upp.UserPostPhotoId),
                    },
                }).ToList(),
                UserPostVideos = userPost.UserPostVideos?.Select(upp => new UserPostVideoDTO
                {
                    UserPostVideoId = upp.UserPostVideoId,
                    UserPostId = upp.UserPostId,
                    VideoId = upp.VideoId,
                    Content = upp.Content,
                    UserPostVideoNumber = upp.UserPostVideoNumber,
                    UserStatusId = upp.UserStatusId,
                    IsHide = upp.IsHide,
                    CreatedAt = upp.CreatedAt,
                    UpdatedAt = upp.UpdatedAt,
                    PostPosition = upp.PostPosition,
                    Video = _mapper.Map<VideoDTO>(upp.Video),
                    ReactCount = new DTO.ReactDTO.ReactCount
                    {
                        ReactNumber = _context.ReactVideoPosts.Count(x => x.UserPostVideoId == upp.UserPostVideoId),
                        CommentNumber = _context.CommentVideoPosts.Count(x => x.UserPostVideoId == upp.UserPostVideoId),
                        ShareNumber = _context.SharePosts.Count(x => x.UserPostVideoId == upp.UserPostVideoId),
                    },
                }).ToList(),
                Avatar = _mapper.Map<GetUserAvatar>(avt),
                FullName = user.FirstName + " " + user.LastName,
                ReactCount = new DTO.ReactDTO.ReactCount
                {
                    ReactNumber = _context.PostReactCounts.Where(x => x.UserPostId == userPost.UserPostId).Select(x => x.ReactCount).FirstOrDefault(),
                    CommentNumber = _context.PostReactCounts.Where(x => x.UserPostId == userPost.UserPostId).Select(x => x.CommentCount).FirstOrDefault(),
                    ShareNumber = _context.PostReactCounts.Where(x => x.UserPostId == userPost.UserPostId).Select(x => x.ShareCount).FirstOrDefault(),
                }
            }).ToList();

            return Result<List<GetOtherUserPostResult>>.Success(result);
        }

    }
}
