using Application.DTO.GetUserProfileDTO;
using Application.DTO.UserPostPhotoDTO;
using Application.DTO.UserPostVideoDTO;
using Application.Queries.GetOtherUserPost;
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

namespace Application.Queries.GetUserPostById
{
    public class GetUserPostByIdHandler : IQueryHandler<GetUserPostByIdQuery, GetUserPostByIdResult>
    {
        private readonly fptforumQueryContext _context;
        private readonly IMapper _mapper;

        public GetUserPostByIdHandler(fptforumQueryContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public async Task<Result<GetUserPostByIdResult>> Handle(GetUserPostByIdQuery request, CancellationToken cancellationToken)
        {
            if (_context == null)
            {
                throw new ErrorException(StatusCodeEnum.Context_Not_Found);
            }

            if (request == null)
            {
                throw new ErrorException(StatusCodeEnum.RQ01_Request_Is_Null);
            }
            var userPost = await _context.UserPosts
                .Include(x => x.Photo)
                .Include(x => x.Video)
                .Include(x => x.UserPostPhotos.Where(x => x.IsHide != true))
                    .ThenInclude(x => x.Photo)
                .Include(x => x.UserPostVideos.Where(x => x.IsHide != true))
                    .ThenInclude(x => x.Video)
                .Where(x => x.UserPostId == request.UserPostId && x.IsHide != true)
                .FirstOrDefaultAsync(cancellationToken);

            var avt = await _context.AvataPhotos.FirstOrDefaultAsync(x => x.UserId == userPost.UserId && x.IsUsed == true);
            var user = await _context.UserProfiles.FirstOrDefaultAsync(x => x.UserId == userPost.UserId);

            var result = new GetUserPostByIdResult
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
            };
            return Result<GetUserPostByIdResult>.Success(result);
        }
    }
}
