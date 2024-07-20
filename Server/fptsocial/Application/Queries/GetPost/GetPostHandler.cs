using AutoMapper;
using Core.CQRS.Query;
using Core.CQRS;
using Domain.Enums;
using Domain.Exceptions;
using Domain.QueryModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Application.DTO.UserPostDTO;
using Core.Helper;
using Application.DTO.GetUserProfileDTO;
using Application.DTO.UserPostPhotoDTO;
using Application.DTO.UserPostVideoDTO;
using System.Runtime.Intrinsics.X86;
using Domain.CommandModels;
using Application.DTO.GroupDTO;
using Application.DTO.GroupPostDTO;
using Application.Queries.GetUserPost;

namespace Application.Queries.GetPost
{
    public class GetPostHandler : IQueryHandler<GetPostQuery, List<GetPostResult>>
    {
        private readonly fptforumQueryContext _context;
        private readonly IMapper _mapper;

        public GetPostHandler(fptforumQueryContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public async Task<Result<List<GetPostResult>>> Handle(GetPostQuery request, CancellationToken cancellationToken)
        {
            if (_context == null)
            {
                throw new ErrorException(StatusCodeEnum.Context_Not_Found);
            }

            if (request == null)
            {
                throw new ErrorException(StatusCodeEnum.RQ01_Request_Is_Null);
            }

            if (request.Page <= 0)
            {
                return Result<List<GetPostResult>>.Failure("Page number must be greater than 0");
            }

            // Retrieve the list of friend UserIds
            var friendUserIds = await _context.Friends
                                              .Where(f => (f.UserId == request.UserId || f.FriendId == request.UserId) && f.Confirm == true)
                                              .Select(f => f.UserId == request.UserId ? f.FriendId : f.UserId)
                                              .ToListAsync(cancellationToken);

            var userStatuses = await _context.UserStatuses
                                              .Where(x => x.StatusName == "Public" || x.StatusName == "Friend")
                                              .ToListAsync(cancellationToken);

            var statusPublic = userStatuses.FirstOrDefault(x => x.StatusName == "Public");
            var statusFriend = userStatuses.FirstOrDefault(x => x.StatusName == "Friend");

            var posts = await _context.UserPosts
                .AsNoTracking()
                .Include(p => p.UserStatus)
                .Include(p => p.Photo)
                .Include(p => p.Video)
                .Include(p => p.UserPostPhotos.Where(x => x.IsHide != true && x.IsBanned != true))
                    .ThenInclude(upp => upp.Photo)
                .Include(p => p.UserPostVideos.Where(x => x.IsHide != true && x.IsBanned != true))
                    .ThenInclude(upv => upv.Video)
                .Where(p => friendUserIds.Contains(p.UserId) &&
                            (p.UserStatusId == statusPublic.UserStatusId || p.UserStatusId == statusFriend.UserStatusId) && p.IsHide != true && p.IsBanned != true)
                .OrderByDescending(x => x.CreatedAt)
                .ToListAsync(cancellationToken);

            List<GetPostResult> combinePost = new List<GetPostResult>();

            foreach (var item in posts)
            {
                var user = _context.UserProfiles.Where(x => x.UserId == item.UserId)
                                                .Select(x => x.FirstName + " " + x.LastName)
                                                .FirstOrDefault();
                var avatar = _context.AvataPhotos.FirstOrDefault(x => x.UserId == item.UserId && x.IsUsed == true);

                var reactCounts = _context.PostReactCounts
                                        .FirstOrDefault(x => x.UserPostId == item.UserPostId);

                combinePost.Add(new GetPostResult
                {
                    PostId = item.UserId,
                    UserId = item.UserId,
                    Content = item.Content,
                    CreatedAt = item.CreatedAt,
                    UpdateAt = item.UpdatedAt,
                    IsHide = item.IsHide,
                    IsBanned = item.IsBanned,
                    IsShare = false,
                    IsGroupPost = false,
                    UserPostNumber = item.UserPostNumber,
                    UserStatusId = item.UserStatusId,
                    IsAvataPost = item.IsAvataPost,
                    IsCoverPhotoPost = item.IsCoverPhotoPost,
                    PhotoId = item.PhotoId,
                    VideoId = item.VideoId,
                    NumberPost = item.NumberPost,
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
                    UserAvatar = _mapper.Map<GetUserAvatar>(avatar),
                    UserStatus = new GetUserStatusDTO
                    {
                        UserStatusId = item.UserStatusId,
                        UserStatusName = item.UserStatus.StatusName,
                    },
                    ReactCount = new DTO.ReactDTO.ReactCount
                    {
                        ReactNumber = reactCounts?.ReactCount ?? 0,
                        CommentNumber = reactCounts?.CommentCount ?? 0,
                        ShareNumber = reactCounts?.ShareCount ?? 0,
                    },
                    EdgeRank = GetEdgeRankAlo.GetEdgeRank(reactCounts?.ReactCount ?? 0, reactCounts?.CommentCount ?? 0, reactCounts?.ShareCount ?? 0, item?.CreatedAt ?? DateTime.Now)
                });
            }

            // Lấy ra id của setting Group Status
            var groupStatus = await _context.GroupSettings
                                    .Where(x => x.GroupSettingName.Contains("Group Status"))
                                    .Select(x => x.GroupSettingId)
                                    .FirstOrDefaultAsync(cancellationToken);

            // Lấy ra id của GroupStatuc ở Public
            var groupStatusPublicId = await _context.GroupStatuses
                                    .Where(x => x.GroupStatusName.Contains("Public"))
                                    .Select(x => x.GroupStatusId)
                                    .FirstOrDefaultAsync (cancellationToken);

            // Lấy ra những group mà friend join nhưng ở chế độ public
            var groupStatusPublic = await _context.GroupSettingUses
                                    .Where(x => x.GroupSettingId == groupStatus && x.GroupStatusId == groupStatusPublicId)
                                    .Select(x => x.GroupId)
                                    .ToListAsync(cancellationToken);

            // Lấy ra id của những group mà user đã join hoặc là của những friend đã join nhưng ở chế độ public
            var groupMemberIds = await _context.GroupMembers
                                    .Where(x => x.UserId == request.UserId || (friendUserIds.Contains(x.UserId) && groupStatusPublic.Contains(x.GroupId)))
                                    .Select(x => x.GroupId)
                                    .ToListAsync(cancellationToken);

            // Truy vấn bảng GroupPost theo những thông tin cần tìm kiếm
            var groupPost = await _context.GroupPosts
                                    .Include(x => x.GroupStatus)
                                    .Include(x => x.Group)
                                    .Include(x => x.GroupPhoto)
                                    .Include(x => x.GroupVideo)
                                    .Include(x => x.GroupPostPhotos.Where(x => x.IsHide != true && x.IsBanned != true))
                                        .ThenInclude(x => x.GroupPhoto)
                                    .Include(x => x.GroupPostVideos.Where(x => x.IsHide != true && x.IsBanned != true))
                                        .ThenInclude(x => x.GroupVideo)
                                    .Where(x => (groupMemberIds.Contains((Guid)x.GroupId) && x.IsHide != true && x.IsBanned != true)
                                        || (groupMemberIds.Contains((Guid)x.GroupId) && x.IsHide != true && x.IsBanned != true))
                                    .ToListAsync();

            foreach(var item  in groupPost)
            {
                var user = _context.UserProfiles.Where(x => x.UserId == item.UserId)
                                                .Select(x => x.FirstName + " " + x.LastName)
                                                .FirstOrDefault();
                var avatar = _context.AvataPhotos.FirstOrDefault(x => x.UserId == item.UserId && x.IsUsed == true);

                var groupreactCounts = _context.PostReactCounts
                                        .FirstOrDefault(x => x.UserPostId == item.GroupPostId);
                combinePost.Add(new GetPostResult { 
                    PostId = item.GroupPostId,
                    UserId = item.UserId,
                    Content = item.Content,
                    CreatedAt = item.CreatedAt,
                    UpdateAt = item.UpdatedAt,
                    IsHide = item.IsHide,
                    IsBanned = item.IsBanned,
                    IsShare = false,
                    IsGroupPost = true,
                    GroupPostNumber = item.GroupPostNumber,
                    GroupStatus = new GetGroupStatusDTO {
                        GroupStatusId = item.GroupStatusId,
                        GroupStatusName = item.GroupStatus.GroupStatusName,
                    },
                    NumberGroupPost = item.NumberPost,
                    GroupPhoto = _mapper.Map<GroupPhotoDTO>(item.GroupPhoto),
                    GroupVideo = _mapper.Map<GroupVideoDTO>(item.GroupVideo),
                    GroupPostPhoto = item.GroupPostPhotos?.Select(upp => new GroupPostPhotoDTO
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
                        GroupPhoto = _mapper.Map<GroupPhotoDTO>(upp.GroupPhoto),
                        ReactCount = new DTO.ReactDTO.ReactCount
                        {
                            ReactNumber = _context.ReactGroupPhotoPosts.Count(x => x.GroupPostPhotoId == upp.GroupPostPhotoId),
                            CommentNumber = _context.ReactGroupPhotoPostComments.Count(x => x.GroupPostPhotoId == upp.GroupPostPhotoId),
                            ShareNumber = _context.GroupSharePosts.Count(x => x.GroupPostPhotoId == upp.GroupPostPhotoId) +
                                        _context.SharePosts.Count(x => x.GroupPostPhotoId == upp.GroupPostPhotoId)
                        }
                    }).ToList(),
                    GroupPostVideo = item.GroupPostVideos?.Select(upp => new GroupPostVideoDTO
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
                        GroupVideo = _mapper.Map<GroupVideoDTO>(upp.GroupVideo),
                        ReactCount = new DTO.ReactDTO.ReactCount
                        {
                            ReactNumber = _context.ReactGroupVideoPosts.Count(x => x.GroupPostVideoId == upp.GroupPostVideoId),
                            CommentNumber = _context.ReactGroupVideoPostComments.Count(x => x.GroupPostVideoId == upp.GroupPostVideoId),
                            ShareNumber = _context.GroupSharePosts.Count(x => x.GroupPostVideoId == upp.GroupPostVideoId) +
                                        _context.SharePosts.Count(x => x.GroupPostVideoId == upp.GroupPostVideoId)
                        }
                    }).ToList(),
                    GroupId = item.GroupId,
                    GroupName = item.Group.GroupName,
                    GroupCorverImage = item.Group.CoverImage,
                    UserName = user,
                    UserAvatar = _mapper.Map<GetUserAvatar>(avatar),
                    ReactCount = new DTO.ReactDTO.ReactCount {
                        ReactNumber = groupreactCounts?.ReactCount ?? 0,
                        CommentNumber = groupreactCounts?.CommentCount ?? 0,
                        ShareNumber = groupreactCounts?.ShareCount ?? 0,
                    },
                    EdgeRank = GetEdgeRankAlo.GetEdgeRank(groupreactCounts?.ReactCount ?? 0, groupreactCounts?.CommentCount ?? 0, groupreactCounts?.ShareCount ?? 0, item.CreatedAt ?? DateTime.Now)
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
                .Where(p => friendUserIds.Contains(p.UserId) &&
                            (p.UserStatusId == statusPublic.UserStatusId || p.UserStatusId == statusFriend.UserStatusId) && p.IsHide != true && p.IsBanned != true)
                .ToListAsync(cancellationToken);

            foreach (var item in sharePosts)
            {
                var user = _context.UserProfiles.Where(x => x.UserId == item.UserId)
                                                .Select(x => x.FirstName + " " + x.LastName)
                                                .FirstOrDefault();

                var avatar = _context.AvataPhotos.FirstOrDefault(x => x.UserId == item.UserId && x.IsUsed == true);

                var userShare = _context.UserProfiles
                    .Where(x => x.UserId == item.UserSharedId)
                    .Select(x => x.FirstName + " " + x.LastName)
                    .FirstOrDefault();

                var avtShare = _context.AvataPhotos.FirstOrDefault(x => x.UserId == item.UserSharedId && x.IsUsed == true);

                var reactNumber = _context.ReactPosts.Count(x => x.UserPostId == item.SharePostId);
                var commentNumber = _context.CommentPosts.Count(x => x.UserPostId == item.SharePostId);
                var shareNumber = _context.SharePosts.Count(x => x.UserPostId == item.SharePostId);

                combinePost.Add(new GetPostResult
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
                    IsGroupPost = false,
                    GroupPostShare = _mapper.Map<GroupPostDTO>(item.GroupPost),
                    GroupPostPhotoShare = _mapper.Map<GroupPostPhotoDTO>(item.GroupPostPhoto),
                    GroupPostVideoShare = _mapper.Map<GroupPostVideoDTO>(item.GroupPostVideo),
                    UserPostShare = _mapper.Map<UserPostDTO>(item.UserPost),
                    UserPostPhotoShare = _mapper.Map<UserPostPhotoDTO>(item.UserPostPhoto),
                    UserPostVideoShare = _mapper.Map<UserPostVideoDTO>(item.UserPostVideo),
                    UserNameShare = userShare,
                    UserAvatarShare = _mapper.Map<GetUserAvatar>(avtShare),
                    UserName = user,
                    UserAvatar = _mapper.Map<GetUserAvatar>(avatar),
                    UserStatus = new DTO.GetUserProfileDTO.GetUserStatusDTO
                    {
                        UserStatusId = item.UserStatusId,
                        UserStatusName = item.UserStatus.StatusName
                    },
                    ReactCount = new DTO.ReactDTO.ReactCount
                    {
                        ReactNumber =  reactNumber,
                        CommentNumber =  commentNumber,
                        ShareNumber =  shareNumber,
                    },
                    EdgeRank = GetEdgeRankAlo.GetEdgeRank(reactNumber, commentNumber, shareNumber, item.CreatedDate ?? DateTime.Now)
                });
            }

            combinePost = combinePost
                            .OrderByDescending(x => x.EdgeRank)
                            .ThenByDescending(x => x.CreatedAt)
                            .Skip((request.Page - 1) * request.PageSize)
                            .Take(request.PageSize)
                            .ToList();


            return Result<List<GetPostResult>>.Success(combinePost);
        }


    }

}
