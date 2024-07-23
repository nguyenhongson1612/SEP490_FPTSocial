using Application.DTO.GetUserProfileDTO;
using Application.DTO.GroupDTO;
using Application.DTO.GroupPostDTO;
using Application.DTO.UserPostDTO;
using Application.DTO.UserPostPhotoDTO;
using Application.DTO.UserPostVideoDTO;
using Application.Queries.GetPost;
using AutoMapper;
using Core.CQRS;
using Core.CQRS.Query;
using Core.Helper;
using Domain.CommandModels;
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
    public class GetGroupPostByGroupIdHandler : IQueryHandler<GetGroupPostByGroupIdQuery, GetGroupPostByGroupIdResult>
    {
        private readonly fptforumQueryContext _context;
        private readonly IMapper _mapper;

        public GetGroupPostByGroupIdHandler(fptforumQueryContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        private List<GetGroupPostByGroupIdDTO> ApplySortingAndPaging(List<GetGroupPostByGroupIdDTO> query, string type, int page, int pageSize)
        {
            if (type.Contains("Valid"))
            {
                query = query.OrderByDescending(x => x.EdgeRank)
                             .ThenByDescending(x => x.CreatedAt)
                             .ToList();
            }
            else if (type.Contains("New"))
            {
                query = query.OrderByDescending(x => x.CreatedAt)
                    .ToList();
            }

            return query.Skip((page - 1) * pageSize)
                        .Take(pageSize)
                        .ToList();
        }

        public async Task<Result<GetGroupPostByGroupIdResult>> Handle(GetGroupPostByGroupIdQuery request, CancellationToken cancellationToken)
        {
            if (_context == null)
            {
                throw new ErrorException(StatusCodeEnum.Context_Not_Found);
            }

            if (request == null)
            {
                throw new ErrorException(StatusCodeEnum.RQ01_Request_Is_Null);
            }

            var isDelete = await _context.GroupFpts.FirstOrDefaultAsync(x => x.GroupId == request.GroupId && x.IsDelete == true);
            if (isDelete != null)
            {
                throw new ErrorException(StatusCodeEnum.GR17_Group_Is_Not_Exist);
            }

            // Truy vấn các bài đăng nhóm với các thông tin liên quan
            var groupPosts = await _context.GroupPosts
                .AsNoTracking()
                .Include(gp => gp.Group)
                .Include(gp => gp.GroupStatus)
                .Include(gp => gp.GroupPhoto)
                .Include(gp => gp.GroupVideo)
                .Include(gp => gp.GroupPostPhotos)
                    .ThenInclude(gpp => gpp.GroupPhoto)
                .Include(gp => gp.GroupPostVideos)
                    .ThenInclude(gpv => gpv.GroupVideo)
                .Where(gp => gp.GroupId == request.GroupId && gp.IsHide != true && gp.IsBanned != true && gp.IsPending == false)
                .ToListAsync(cancellationToken);

            var groupPostIds = groupPosts.Select(gp => gp.GroupPostId).ToList();

            // Truy vấn thông tin người dùng, ảnh đại diện và số lượng tương tác một lần cho tất cả bài đăng
            var userProfiles = await _context.UserProfiles
                .Where(up => groupPosts.Select(gp => gp.UserId).Contains(up.UserId))
                .ToListAsync(cancellationToken);

            var avatarPhotos = await _context.AvataPhotos
                .Where(ap => groupPosts.Select(gp => gp.UserId).Contains(ap.UserId) && ap.IsUsed)
                .ToListAsync(cancellationToken);

            var reactCounts = await _context.GroupPostReactCounts
                .Where(r => groupPostIds.Contains((Guid)r.GroupPostId))
                .ToListAsync(cancellationToken);

            var sharePosts = await _context.GroupSharePosts
                .AsNoTracking()
                .Include(gsp => gsp.GroupStatus)
                .Include(gsp => gsp.GroupPost)
                    .ThenInclude(gp => gp.GroupPostPhotos)
                        .ThenInclude(gpp => gpp.GroupPhoto)
                .Include(gsp => gsp.GroupPost)
                    .ThenInclude(gp => gp.GroupPostVideos)
                        .ThenInclude(gpv => gpv.GroupVideo)
                .Include(gsp => gsp.UserPost)
                    .ThenInclude(up => up.UserPostPhotos)
                        .ThenInclude(upp => upp.Photo)
                .Include(gsp => gsp.UserPost)
                    .ThenInclude(up => up.UserPostVideos)
                        .ThenInclude(upv => upv.Video)
                .Include(gsp => gsp.UserPostPhoto)
                    .ThenInclude(up => up.Photo)
                .Include(gsp => gsp.UserPostVideo)
                    .ThenInclude(upv => upv.Video)
                .Where(gsp => gsp.GroupId == request.GroupId && gsp.IsHide != true && gsp.IsBanned != true && gsp.IsPending == false)
                .ToListAsync(cancellationToken);

            var userShareProfiles = await _context.UserProfiles
                .Where(up => sharePosts.Select(gsp => gsp.UserSharedId).Contains(up.UserId))
                .ToListAsync(cancellationToken);

            var avatarSharePhotos = await _context.AvataPhotos
                .Where(ap => sharePosts.Select(gsp => gsp.UserSharedId).Contains(ap.UserId) && ap.IsUsed)
                .ToListAsync(cancellationToken);

            var groupPostShareIds = sharePosts.Select(gsp => gsp.GroupPostId).Distinct().ToList();
            var groupPostsForShare = await _context.GroupPosts
                .AsNoTracking()
                .Where(gp => groupPostShareIds.Contains(gp.GroupPostId))
                .ToListAsync(cancellationToken);

            var groupIds = groupPostsForShare.Select(gp => gp.GroupId).Distinct().ToList();
            var groups = await _context.GroupFpts
                .AsNoTracking()
                .Where(g => groupIds.Contains(g.GroupId))
                .ToListAsync(cancellationToken);

            var reactGroupShareCounts = await _context.ReactGroupSharePosts
                .AsNoTracking()
                .GroupBy(r => r.GroupSharePostId)
                .Select(g => new { GroupSharePostId = g.Key, ReactCount = g.Count() })
                .ToListAsync(cancellationToken);

            var commentGroupShareCounts = await _context.CommentGroupSharePosts
                .AsNoTracking()
                .Where(c => c.IsHide != true)
                .GroupBy(c => c.GroupSharePostId)
                .Select(g => new { GroupSharePostId = g.Key, CommentCount = g.Count() })
                .ToListAsync(cancellationToken);

            // Tạo danh sách kết quả
            var combine = new List<GetGroupPostByGroupIdDTO>();

            foreach (var item in groupPosts)
            {
                var userProfile = userProfiles.FirstOrDefault(up => up.UserId == item.UserId);
                var userAvatar = avatarPhotos.FirstOrDefault(ap => ap.UserId == item.UserId);
                var react = reactCounts.FirstOrDefault(r => r.GroupPostId == item.GroupPostId);

                combine.Add(new GetGroupPostByGroupIdDTO
                {
                    PostId = item.GroupPostId,
                    UserId = item.UserId,
                    Content = item.Content,
                    CreatedAt = item.CreatedAt,
                    UpdateAt = item.UpdatedAt,
                    IsHide = item.IsHide,
                    IsShare = false,
                    IsBanned = item.IsBanned,
                    IsPending = item.IsPending,
                    GroupPostNumber = item.GroupPostNumber,
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
                    }).ToList(),
                    UserName = $"{userProfile?.FirstName} {userProfile?.LastName}",
                    UserAvatar = _mapper.Map<GetUserAvatar>(userAvatar),
                    GroupStatus = new GetGroupStatusDTO
                    {
                        GroupStatusId = item.GroupStatusId,
                        GroupStatusName = item.GroupStatus.GroupStatusName,
                    },
                    GroupId = item.GroupId,
                    GroupName = item.Group.GroupName,
                    GroupCorverImage = item.Group.CoverImage,
                    ReactCount = new DTO.ReactDTO.ReactCount
                    {
                        ReactNumber = react?.ReactCount ?? 0,
                        CommentNumber = react?.CommentCount ?? 0,
                        ShareNumber = react?.ShareCount ?? 0
                    },
                    EdgeRank = GetEdgeRankAlo.GetEdgeRank(react?.ReactCount ?? 0, react?.CommentCount ?? 0, react?.ShareCount ?? 0, item.CreatedAt ?? DateTime.Now)
                });
            }

            foreach (var item in sharePosts)
            {
                var userProfile = userProfiles.FirstOrDefault(up => up.UserId == item.UserId);
                var userAvatar = avatarPhotos.FirstOrDefault(ap => ap.UserId == item.UserId);
                var userShareProfile = userShareProfiles.FirstOrDefault(up => up.UserId == item.UserSharedId);
                var avatarShare = avatarSharePhotos.FirstOrDefault(ap => ap.UserId == item.UserSharedId);

                var reactCount = reactGroupShareCounts.FirstOrDefault(r => r.GroupSharePostId == item.GroupSharePostId)?.ReactCount ?? 0;
                var commentCount = commentGroupShareCounts.FirstOrDefault(c => c.GroupSharePostId == item.GroupSharePostId)?.CommentCount ?? 0;

                var groupPost = groupPostsForShare.FirstOrDefault(gp => gp.GroupPostId == item.GroupPostId);
                var group = groups.FirstOrDefault(g => g.GroupId == groupPost?.GroupId);

                combine.Add(new GetGroupPostByGroupIdDTO
                {
                    PostId = item.GroupSharePostId,
                    UserId = item.UserId,
                    Content = item.Content,
                    UserPostShareId = item.UserPostId,
                    UserPostPhotoShareId = item.UserPostPhotoId,
                    UserPostVideoShareId = item.UserPostVideoId,
                    GroupPostShareId = item.GroupPostId,
                    GroupPostPhotoShareId = item.GroupPostPhotoId,
                    GroupPostVideoShareId = item.GroupPostVideoId,
                    SharedToUserId = item.SharedToUserId,
                    CreatedAt = item.CreateDate,
                    UpdateAt = item.UpdateDate,
                    IsHide = item.IsHide,
                    IsBanned = item.IsBanned,
                    IsShare = true,
                    IsPending = item.IsPending,
                    GroupPostShare = _mapper.Map<GroupPostDTO>(item.GroupPost),
                    GroupPostPhotoShare = _mapper.Map<GroupPostPhotoDTO>(item.GroupPostPhoto),
                    GroupPostVideoShare = _mapper.Map<GroupPostVideoDTO>(item.GroupPostVideo),
                    UserPostShare = _mapper.Map<UserPostDTO>(item.UserPost),
                    UserPostPhotoShare = _mapper.Map<UserPostPhotoDTO>(item.UserPostPhoto),
                    UserPostVideoShare = _mapper.Map<UserPostVideoDTO>(item.UserPostVideo),
                    UserNameShare = $"{userShareProfile?.FirstName} {userShareProfile?.LastName}",
                    UserAvatarShare = _mapper.Map<GetUserAvatar>(avatarShare),
                    GroupShareId = group?.GroupId,
                    GroupShareName = group?.GroupName,
                    GroupShareCorverImage = group?.CoverImage,
                    UserName = $"{userProfile?.FirstName} {userProfile?.LastName}",
                    UserAvatar = _mapper.Map<GetUserAvatar>(userAvatar),
                    GroupStatus = new GetGroupStatusDTO
                    {
                        GroupStatusId = item.GroupStatusId ?? Guid.Empty,
                        GroupStatusName = item.GroupStatus.GroupStatusName
                    },
                    ReactCount = new DTO.ReactDTO.ReactCount
                    {
                        ReactNumber = reactCount,
                        CommentNumber = commentCount,
                        ShareNumber = 0
                    },
                    EdgeRank = GetEdgeRankAlo.GetEdgeRank(reactCount, commentCount, 0, item.CreateDate ?? DateTime.Now)
                });
            }

            var getgrouppost = new GetGroupPostByGroupIdResult();

            getgrouppost.totalPage = (combine.Count()) / request.PageSize;

            combine = ApplySortingAndPaging(combine, request.Type, request.Page, request.PageSize);

            getgrouppost.result = combine;

            return Result<GetGroupPostByGroupIdResult>.Success(getgrouppost);
        }
    }
}
