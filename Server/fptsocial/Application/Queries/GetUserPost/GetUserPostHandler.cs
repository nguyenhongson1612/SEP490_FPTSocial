using Application.DTO.GetUserProfileDTO;
using Application.DTO.GroupPostDTO;
using Application.DTO.UserPostDTO;
using Application.DTO.UserPostPhotoDTO;
using Application.DTO.UserPostVideoDTO;
using Application.Queries.GetOtherUserPostByUserId;
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

namespace Application.Queries.GetUserPost
{
    public class GetUserPostHandler : IQueryHandler<GetUserPostQuery, List<GetUserPostResult>>
    {
        private readonly fptforumQueryContext _context;
        private readonly IMapper _mapper;

        public GetUserPostHandler(fptforumQueryContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }
        public async Task<Result<List<GetUserPostResult>>> Handle(GetUserPostQuery request, CancellationToken cancellationToken)
        {
            if (_context == null)
            {
                throw new ErrorException(StatusCodeEnum.Context_Not_Found);
            }

            if (request == null)
            {
                throw new ErrorException(StatusCodeEnum.RQ01_Request_Is_Null);
            }

            List<GetUserPostResult> combine = new List<GetUserPostResult>();

            var userPosts = await _context.UserPosts
                .Include(x => x.UserStatus)
                .Include(x => x.Photo)
                .Include(x => x.Video)
                .Include(x => x.UserPostPhotos.Where(x => x.IsHide != true && x.IsBanned != true))
                    .ThenInclude(x => x.Photo)
                .Include(x => x.UserPostVideos.Where(x => x.IsHide != true && x.IsBanned != true))
                    .ThenInclude(x => x.Video)
                .Where(x => x.UserId == request.UserId && x.IsHide != true && x.IsBanned != true)
                .OrderByDescending(x => x.CreatedAt)
                .ToListAsync(cancellationToken);

            var avt = await _context.AvataPhotos.FirstOrDefaultAsync(x => x.UserId == request.UserId && x.IsUsed == true);
            var user = await _context.UserProfiles.FirstOrDefaultAsync(x => x.UserId == request.UserId);

            foreach (var item in userPosts)
            {
                combine.Add(new GetUserPostResult
                {
                    PostId = item.UserPostId,
                    UserId = item.UserId,
                    Content = item.Content,
                    UserPostNumber = item.UserPostNumber,
                    UserStatus = new DTO.GetUserProfileDTO.GetUserStatusDTO
                    {
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
                    UserName = user.FirstName + " " + user.LastName,
                    UserAvatar = _mapper.Map<GetUserAvatar>(avt),
                    ReactCount = new DTO.ReactDTO.ReactCount
                    {
                        ReactNumber = _context.PostReactCounts.Where(x => x.UserPostId == item.UserPostId).Select(x => x.ReactCount).FirstOrDefault(),
                        CommentNumber = _context.PostReactCounts.Where(x => x.UserPostId == item.UserPostId).Select(x => x.CommentCount).FirstOrDefault(),
                        ShareNumber = _context.PostReactCounts.Where(x => x.UserPostId == item.UserPostId).Select(x => x.ShareCount).FirstOrDefault(),
                    }
                });
            }

            var sharePosts = await _context.SharePosts
                .Include(x => x.UserStatus)
                .Include(x => x.UserPost)
                .Include(x => x.UserPostPhoto)
                    .ThenInclude(x => x.Photo)
                .Include(x => x.UserPostVideo)
                    .ThenInclude(x => x.Video)
                .Include(x => x.GroupPost)
                .Include(x => x.GroupPostPhoto)
                    .ThenInclude(x => x.GroupPhoto)
                .Include(x => x.GroupPostVideo)
                    .ThenInclude(x => x.GroupVideo)
                .Where(x => x.UserId == request.UserId && x.IsHide != true && x.IsBanned != true)
                .OrderByDescending(x => x.CreatedDate)
                .ToListAsync(cancellationToken);

            foreach (var item in sharePosts)
            {
                var userShare = _context.UserProfiles.FirstOrDefault(x => x.UserId == item.UserId);
                var avtShare = _context.AvataPhotos.FirstOrDefault(x => x.UserId == item.UserId && x.IsUsed == true);
                combine.Add(new GetUserPostResult
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
                    UserNameShare = userShare.FirstName + " " + userShare.LastName,
                    UserAvatarShare = _mapper.Map<GetUserAvatar>(avtShare),
                    UserName = user.FirstName + " " + user.LastName,
                    UserAvatar = _mapper.Map<GetUserAvatar>(avt),
                    UserStatus = new DTO.GetUserProfileDTO.GetUserStatusDTO
                    {
                        UserStatusId = item.UserStatusId,
                        UserStatusName = item.UserStatus.StatusName
                    },
                    ReactCount = new DTO.ReactDTO.ReactCount
                    {
                        ReactNumber = _context.PostReactCounts.Where(x => x.UserPostId == item.SharePostId).Select(x => x.ReactCount).FirstOrDefault(),
                        CommentNumber = _context.PostReactCounts.Where(x => x.UserPostId == item.SharePostId).Select(x => x.CommentCount).FirstOrDefault(),
                        ShareNumber = _context.PostReactCounts.Where(x => x.UserPostId == item.SharePostId).Select(x => x.ShareCount).FirstOrDefault(),
                    }
                });
            }

            combine = combine.OrderByDescending(x => x.CreatedAt).ToList();
            return Result<List<GetUserPostResult>>.Success(combine);
        }

    }
}
