using Application.DTO.GetUserProfileDTO;
using Application.DTO.GroupPostDTO;
using Application.DTO.UserPostDTO;
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
using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Intrinsics.X86;
using System.Text;
using System.Threading.Tasks;

namespace Application.Queries.GetOtherUserPostByUserId
{
    public class GetOtherUserPostByUserIdHandler : IQueryHandler<GetOtherUserPostByUserIdQuery, List<GetOtherUserPostByUserIdResult>>
    {
        private readonly fptforumQueryContext _context;
        private readonly IMapper _mapper;

        public GetOtherUserPostByUserIdHandler(fptforumQueryContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public async Task<Result<List<GetOtherUserPostByUserIdResult>>> Handle(GetOtherUserPostByUserIdQuery request, CancellationToken cancellationToken)
        {
            if(_context == null)
            {
                throw new ErrorException(StatusCodeEnum.Context_Not_Found);
            }

            if(request == null)
            {
                throw new ErrorException(StatusCodeEnum.RQ01_Request_Is_Null);
            }

            List<GetOtherUserPostByUserIdResult> combine = new List<GetOtherUserPostByUserIdResult>();

            var idprofilestatus = await _context.Settings
                .AsNoTracking()
                .Where(x => x.SettingName.Contains("Profile Status"))
                .Select(x => x.SettingId)
                .FirstOrDefaultAsync();
            var idpublic = await _context.UserStatuses
                .AsNoTracking()
                .Where(x => x.StatusName.Contains("Public"))
                .Select(x => x.UserStatusId)
                .FirstOrDefaultAsync();
            var setting = await _context.UserSettings
                .AsNoTracking()
                .FirstOrDefaultAsync(x => x.UserId == request.OtherUserId && x.SettingId == idprofilestatus && x.UserStatusId == idpublic);

            if (setting == null)
            {
                throw new ErrorException(StatusCodeEnum.PS01_Profile_Status_Private);
            }

            var isFriend = await _context.Friends
                            .AsNoTracking()
                            .FirstOrDefaultAsync(x => (x.UserId == request.UserId && x.FriendId == request.OtherUserId && x.Confirm == true)
                            || (x.UserId == request.OtherUserId && x.FriendId == request.UserId && x.Confirm == true));

            var sttNames = new List<string> { "Public" };

            if (isFriend != null)
            {
                sttNames.Add("Friend");
            }

            var sttStatuses = await _context.UserStatuses
                .AsNoTracking()
                .Where(x => sttNames.Contains(x.StatusName))
                .ToListAsync();

            var sttStatusIds = sttStatuses.Select(x => x.UserStatusId).ToList();

            var userPosts = await _context.UserPosts
                .AsNoTracking()
                .Include(x => x.UserStatus)
                .Include(x => x.Photo)
                .Include(x => x.Video)
                .Include(x => x.UserPostPhotos.Where(x => x.IsHide != true))
                    .ThenInclude(x => x.Photo)
                .Include(x => x.UserPostVideos.Where(x => x.IsHide != true))
                    .ThenInclude(x => x.Video)
                .Where(x => x.UserId == request.OtherUserId && sttStatusIds.Contains(x.UserStatusId) && x.IsHide != true)
                .OrderByDescending(x => x.CreatedAt)
                .ToListAsync(cancellationToken);

            var avt = await _context.AvataPhotos
                .AsNoTracking()
                .FirstOrDefaultAsync(x => x.UserId == request.OtherUserId && x.IsUsed == true);
            var user = await _context.UserProfiles
                .AsNoTracking()
                .Where(x => x.UserId == request.UserId)
                .Select(x => x.FirstName + " " + x.LastName)
                .FirstOrDefaultAsync(cancellationToken);

            foreach (var item in userPosts)
            {
                var react =  _context.PostReactCounts
                .AsNoTracking()
                .FirstOrDefault(x => x.UserPostId == item.UserPostId);
                combine.Add(new GetOtherUserPostByUserIdResult {
                    PostId = item.UserPostId,
                    UserId = item.UserId,
                    Content = item.Content,
                    UserPostNumber = item.UserPostNumber,
                    UserStatus = new DTO.GetUserProfileDTO.GetUserStatusDTO {
                        UserStatusId = item.UserStatusId,
                        UserStatusName = item.UserStatus.StatusName
                    },
                    IsAvataPost = item.IsAvataPost,
                    IsHide = item.IsHide,
                    IsBanned = item.IsBanned,
                    IsShare = false,
                    CreatedAt = item.CreatedAt,
                    UpdateAt = item.UpdatedAt,
                    PhotoId = item.PhotoId,
                    VideoId = item.VideoId,
                    Photo = _mapper.Map<PhotoDTO>(item.Photo),
                    Video = _mapper.Map<VideoDTO>(item.Video),
                    UserPostPhoto = item.UserPostPhotos?.Select(upp => new UserPostPhotoDTO
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
                    }).ToList(),
                    UserPostVideo = item.UserPostVideos?.Select(upp => new UserPostVideoDTO
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
                    }).ToList(),
                    UserName = user,
                    UserAvatar = _mapper.Map<GetUserAvatar>(avt),
                    ReactCount = new DTO.ReactDTO.ReactCount
                    {
                        ReactNumber = react?.ReactCount ?? null,
                        CommentNumber = react?.CommentCount ?? null,
                        ShareNumber = react?.ShareCount ?? null,
                    }
                });
            }

            var sharePosts = await _context.SharePosts
                .AsNoTracking()
                .Include(x => x.UserStatus)
                .Include(x => x.UserPost)
                    .ThenInclude(x => x.UserPostPhotos)
                        .ThenInclude(x => x.Photo)
                .Include(x => x.UserPost)
                    .ThenInclude(x => x.UserPostVideos)
                        .ThenInclude(x => x.Video)
                .Include(x => x.UserPostPhoto)
                    .ThenInclude(x => x.Photo)
                .Include(x => x.UserPostVideo)
                    .ThenInclude(x => x.Video)
                .Include(x => x.GroupPost)
                    .ThenInclude(x => x.GroupPostPhotos)
                        .ThenInclude(x => x.GroupPhoto)
                .Include(x => x.GroupPost)
                    .ThenInclude(x => x.GroupPostVideos)
                        .ThenInclude(x => x.GroupVideo)
                .Include(x => x.GroupPostPhoto)
                    .ThenInclude(x => x.GroupPhoto)
                .Include(x => x.GroupPostVideo)
                    .ThenInclude(x => x.GroupVideo)
                .Where(x => x.UserId == request.OtherUserId && x.IsHide != true && x.IsBanned != true)
                .OrderByDescending(x => x.CreatedDate)
                .ToListAsync(cancellationToken);

            foreach (var item in sharePosts)
            {
                var userShare =  _context.UserProfiles
                    .Where(x => x.UserId == item.UserSharedId)
                    .Select(x => x.FirstName + " " + x.LastName)
                    .FirstOrDefault();
                
                var avtShare =  _context.AvataPhotos.FirstOrDefault(x => x.UserId == item.UserSharedId && x.IsUsed == true);
                combine.Add(new GetOtherUserPostByUserIdResult
                {
                    PostId = item.SharePostId,
                    UserId = item.UserId,
                    Content = item.Content,
                    UserPostShareId = item.UserPostId,
                    UserPostPhotoShareId = item.UserPostPhotoId,
                    UserPostVideoShareId = item.UserPostVideoId,
                    GroupPostShareId = item.GroupPostId,
                    GroupPostPhotoShareId = item.GroupPostPhotoId,
                    GroupPostVideoShareId = item.GroupPostVideoId,
                    SharedToUserId = item.SharedToUserId,
                    CreatedAt = item.CreatedDate,
                    UpdateAt = item.UpdateDate,
                    IsHide = item.IsHide,
                    IsBanned = item.IsBanned,
                    IsShare = true,
                    GroupPostShare = _mapper.Map<GroupPostDTO>(item.GroupPost),
                    GroupPostPhotoShare = _mapper.Map<GroupPostPhotoDTO>(item.GroupPostPhoto),
                    GroupPostVideoShare = _mapper.Map<GroupPostVideoDTO>(item.GroupPostVideo),
                    UserPostShare = _mapper.Map<UserPostDTO>(item.UserPost),
                    UserPostPhotoShare = _mapper.Map<UserPostPhotoDTO>(item.UserPostPhoto),
                    UserPostVideoShare = _mapper.Map<UserPostVideoDTO>(item.UserPostVideo),
                    UserNameShare = userShare,
                    UserAvatarShare = _mapper.Map<GetUserAvatar>(avtShare),
                    UserName = user,
                    UserAvatar = _mapper.Map<GetUserAvatar>(avt),
                    UserStatus = new DTO.GetUserProfileDTO.GetUserStatusDTO
                    {
                        UserStatusId = item.UserStatusId,
                        UserStatusName = item.UserStatus.StatusName
                    },
                    ReactCount = new DTO.ReactDTO.ReactCount
                    {
                        ReactNumber =  _context.ReactSharePosts.Count(x => x.SharePostId == item.SharePostId),
                        CommentNumber =  _context.CommentSharePosts.Count(x => x.SharePostId == item.SharePostId),
                        ShareNumber = 0,
                    }
                });
            }

            combine = combine.OrderByDescending(x => x.CreatedAt)
                            .Skip((request.Page - 1) * request.PageSize)
                            .Take(request.PageSize)
                            .ToList();

            return Result<List<GetOtherUserPostByUserIdResult>>.Success(combine);
        }
    }
}
