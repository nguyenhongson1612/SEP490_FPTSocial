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
                return Result<List<GetPostResult>>.Failure("Request is null");
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

            /*var groupMemberIds = await _context.GroupMembers
                                                .Where(x => x.UserId == request.UserId)
                                                .Select(x => x.GroupId)
                                                .ToListAsync(cancellationToken);*/

            var userStatuses = await _context.UserStatuses
                                              .Where(x => x.StatusName == "Public" || x.StatusName == "Friend")
                                              .ToListAsync(cancellationToken);

            var statusPublic = userStatuses.FirstOrDefault(x => x.StatusName == "Public");
            var statusFriend = userStatuses.FirstOrDefault(x => x.StatusName == "Friend");

            var posts = await _context.UserPosts
                .Where(p => friendUserIds.Contains(p.UserId) &&
                            (p.UserStatusId == statusPublic.UserStatusId || p.UserStatusId == statusFriend.UserStatusId) && p.IsHide != true)
                .Include(p => p.Photo)
                .Include(p => p.Video)
                .Include(p => p.UserPostPhotos)
                    .ThenInclude(upp => upp.Photo)
                .Include(p => p.UserPostVideos)
                    .ThenInclude(upv => upv.Video)
                .ToListAsync(cancellationToken);

            var totalPosts = posts.Count();

            var counts = await _context.PostReactCounts.ToListAsync(cancellationToken);
            var avatars = await _context.AvataPhotos
                                        .Where(x => x.IsUsed)
                                        .ToDictionaryAsync(x => x.UserId, cancellationToken);
            var users = await _context.UserProfiles.ToDictionaryAsync(p => p.UserId, cancellationToken);

            var result = posts.Select(userPost =>
            {
                var user = users.TryGetValue(userPost.UserId, out var userProfile) ? userProfile : null;
                var avatar = avatars.TryGetValue(userPost.UserId, out var avataPhoto) ? avataPhoto : null;

                return new GetPostResult
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
                    UserPostPhotos = _mapper.Map<List<UserPostPhotoDTO>>(userPost.UserPostPhotos),
                    UserPostVideos = _mapper.Map<List<UserPostVideoDTO>>(userPost.UserPostVideos),
                    EdgeRank = 0,
                    Avatar = _mapper.Map<GetUserAvatar>(avatar),
                    FullName = user != null ? $"{user.FirstName} {user.LastName}" : null
                };
            }).ToList();

            foreach (var post in result)
            {
                foreach (var count in counts)
                {
                    if (post.UserPostId == count.UserPostId)
                    {
                        GetEdgeRankAlo getEdgeRank = new GetEdgeRankAlo();
                        post.EdgeRank = getEdgeRank.GetEdgeRank(count.ReactCount ?? 0, count.CommentCount ?? 0, count.ShareCount ?? 0, count.CreateAt ?? DateTime.Now);
                    }
                }
            }

            result = result.OrderByDescending(x => x.EdgeRank)
                              .Skip((request.Page - 1) * request.PageSize)
                              .Take(request.PageSize)
                              .ToList();

            return Result<List<GetPostResult>>.Success(result);
        }


    }

}
