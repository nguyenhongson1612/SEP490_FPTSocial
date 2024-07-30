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
using System.Diagnostics;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using static Application.Queries.GetUserPost.GetUserPostResult;

namespace Application.Queries.GetUserPost
{
    public class GetUserPostHandler : IQueryHandler<GetUserPostQuery, GetUserPostResult>
    {
        private readonly fptforumQueryContext _context;
        private readonly IMapper _mapper;

        public GetUserPostHandler(fptforumQueryContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }
        public async Task<Result<GetUserPostResult>> Handle(GetUserPostQuery request, CancellationToken cancellationToken)
        {
            if (_context == null)
            {
                throw new ErrorException(StatusCodeEnum.Context_Not_Found);
            }

            if (request == null)
            {
                throw new ErrorException(StatusCodeEnum.RQ01_Request_Is_Null);
            }
            var stopwatch = new Stopwatch();
            stopwatch.Start();
            var userPosts = await _context.UserPosts
                .AsNoTracking()
                .Where(x => x.UserId == request.UserId && x.IsHide != true && x.IsBanned != true)
                .Select(post => new GetUserPostDTO
                {
                    PostId = post.UserPostId,
                    UserId = post.UserId,
                    Content = post.Content,
                    UserPostNumber = post.UserPostNumber,
                    UserStatus = new GetUserStatusDTO
                    {
                        UserStatusId = post.UserStatusId,
                        UserStatusName = post.UserStatus.StatusName
                    },
                    IsAvataPost = post.IsAvataPost,
                    IsHide = post.IsHide,
                    IsBanned = post.IsBanned,
                    IsShare = false,
                    CreatedAt = post.CreatedAt,
                    UpdateAt = post.UpdatedAt,
                    PhotoId = post.PhotoId,
                    VideoId = post.VideoId,
                    Photo = _mapper.Map<PhotoDTO>(post.Photo),
                    Video = _mapper.Map<VideoDTO>(post.Video),
                    UserPostPhoto = post.UserPostPhotos
                        .Where(upp => upp.IsHide != true && upp.IsBanned != true)
                        .Select(upp => new UserPostPhotoDTO
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
                    UserPostVideo = post.UserPostVideos
                        .Where(upp => upp.IsHide != true && upp.IsBanned != true)
                        .Select(upp => new UserPostVideoDTO
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
                    ReactCount = new DTO.ReactDTO.ReactCount
                    {
                        ReactNumber = post.PostReactCounts.Sum(r => r.ReactCount),
                        CommentNumber = post.PostReactCounts.Sum(r => r.CommentCount),
                        ShareNumber = post.PostReactCounts.Sum(r => r.ShareCount),
                    }
                }).ToListAsync(cancellationToken);

            var avt = await _context.AvataPhotos
                .AsNoTracking()
                .FirstOrDefaultAsync(x => x.UserId == request.UserId && x.IsUsed == true, cancellationToken);

            var user = await _context.UserProfiles
                .AsNoTracking()
                .Where(x => x.UserId == request.UserId)
                .Select(x => x.FirstName + " " + x.LastName)
                .FirstOrDefaultAsync(cancellationToken);

            var sharePosts = await _context.SharePosts
                .AsNoTracking()
                .Where(x => x.UserId == request.UserId && x.IsHide != true && x.IsBanned != true)
                .Select(item => new GetUserPostDTO
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
                    UserNameShare = _context.UserProfiles
                        .AsNoTracking()
                        .Where(x => x.UserId == item.UserSharedId)
                        .Select(x => x.FirstName + " " + x.LastName)
                        .FirstOrDefault(),
                    UserAvatarShare = _mapper.Map<GetUserAvatar>(_context.AvataPhotos.AsNoTracking()
                        .FirstOrDefault(x => x.UserId == item.UserSharedId && x.IsUsed == true)),
                    UserName = user,
                    UserAvatar = _mapper.Map<GetUserAvatar>(avt),
                    UserStatus = new GetUserStatusDTO
                    {
                        UserStatusId = item.UserStatusId,
                        UserStatusName = item.UserStatus.StatusName
                    },
                    ReactCount = new DTO.ReactDTO.ReactCount
                    {
                        ReactNumber = _context.ReactSharePosts.AsNoTracking().Count(x => x.SharePostId == item.SharePostId),
                        CommentNumber = _context.CommentSharePosts.AsNoTracking().Count(x => x.SharePostId == item.SharePostId && x.IsHide != true && x.IsBanned != true),
                        ShareNumber = 0,
                    }
                }).ToListAsync(cancellationToken);

            var combine = userPosts.Concat(sharePosts).ToList();

            var getuserpost = new GetUserPostResult
            {
                totalPage = (int)Math.Ceiling((double)combine.Count() / request.PageSize),
                result = combine.OrderByDescending(x => x.CreatedAt)
                                .Skip((request.Page - 1) * request.PageSize)
                                .Take(request.PageSize)
                                .ToList()
            };
            stopwatch.Stop();
            Debug.WriteLine($"Thời gian thực hiện truy vấn: {stopwatch.ElapsedMilliseconds} ms");
            return Result<GetUserPostResult>.Success(getuserpost);
        }


    }
}
