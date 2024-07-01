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

namespace Application.Queries.GetUserPost
{
    public class GetUserPostHandler : IQueryHandler<GetUserPostQuery, List<GetUserPostResult>>
    {
        private readonly fptforumQueryContext _context;
        private readonly IMapper _mapper;
        List<GetUserPostResult> userPosts = new List<GetUserPostResult>();
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

            if (request.UserId == null)
            {
                return Result<List<GetUserPostResult>>.Failure("UserId is required.");
            }

            var userPosts = await _context.UserPosts
                .Include(x => x.Photo)
                .Include(x => x.Video)
                .Include(x => x.UserPostPhotos)
                    .ThenInclude(x => x.Photo)
                .Include(x => x.UserPostVideos)
                    .ThenInclude(x => x.Video)
                .Where(x => x.UserId == request.UserId)
                .ToListAsync(cancellationToken);

            if (userPosts == null || !userPosts.Any())
            {
                throw new ErrorException(StatusCodeEnum.P01_Not_Found);
            }

            var result = userPosts.Select(userPost => new GetUserPostResult
            {
                UserPostId = userPost.UserPostId,
                UserId = userPost.UserId,
                Content = userPost.Content,
                UserPostNumber = userPost.UserPostNumber,
                UserStatusId = userPost.UserStatusId,
                IsAvataPost = userPost.IsAvataPost,
                IsCoverPhotoPost = userPost.IsCoverPhotoPost,
                IsHide = userPost.IsHide,
                CreatedAt = userPost.CreatedAt,
                UpdatedAt = userPost.UpdatedAt,
                PhotoId = userPost.PhotoId,
                VideoId = userPost.VideoId,
                NumberPost = userPost.NumberPost,
                Photo = userPost.Photo,
                Video = userPost.Video,
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
                }).ToList(),
            }).ToList();

            return Result<List<GetUserPostResult>>.Success(result);
        }
    }
}
