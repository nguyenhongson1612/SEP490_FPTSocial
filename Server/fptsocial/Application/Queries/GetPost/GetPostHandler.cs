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

            // Retrieve the list of friend UserIds
            var friendUserId1 = await _context.Friends
                                              .Where(f => f.UserId == request.UserId)
                                              .Select(f => f.FriendId)
                                              .ToListAsync(cancellationToken);

            var friendUserId2 = await _context.Friends
                                              .Where(f => f.FriendId == request.UserId)
                                              .Select(f => f.UserId)
                                              .ToListAsync(cancellationToken);
            /*var groupMemberIds = await _context.GroupMembers
                                                .Where(x => x.UserId == request.UserId)
                                                .Select(x => x.GroupId)
                                                .ToListAsync(cancellationToken);*/

            var posts = await _context.UserPosts
                .Where(p => friendUserId1.Contains(p.UserId) || friendUserId2.Contains(p.UserId))
                .Include(p => p.Photo)
                .Include(p => p.Video)
                .Include(p => p.UserPostPhotos)
                    .ThenInclude(upp => upp.Photo)
                .Include(p => p.UserPostVideos)
                    .ThenInclude(upv => upv.Video)
                .ToListAsync(cancellationToken);

            var result = posts.Select(userPost => new GetPostResult
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
                    Photo = _mapper.Map<PhotoDTO>(upp.Photo)
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
                    Video = _mapper.Map<VideoDTO>(upp.Video)
                }).ToList()
            }).ToList();

            var avt = new AvataPhoto();
            var user = new Domain.QueryModels.UserProfile();
            var counts = await _context.PostReactCounts.ToListAsync(cancellationToken);
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
                avt = await _context.AvataPhotos.FirstOrDefaultAsync(x => x.UserId == post.UserId && x.IsUsed == true);
                post.Avatar = _mapper.Map<GetUserAvatar>(avt);
                user = await _context.UserProfiles.FirstOrDefaultAsync(p => p.UserId == post.UserId);
                post.FullName = user?.FirstName + " " + user.LastName;
            }
            result = result.OrderByDescending(x => x.EdgeRank).ToList();
            return Result<List<GetPostResult>>.Success(result);
        }


    }

}
