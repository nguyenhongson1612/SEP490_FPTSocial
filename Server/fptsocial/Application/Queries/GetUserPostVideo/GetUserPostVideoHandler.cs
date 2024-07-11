using Application.DTO.GetUserProfileDTO;
using Application.DTO.UserPostVideoDTO;
using Application.Queries.GetUserPostVideo;
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

namespace Application.Queries.GetUserPostVideo
{
    public class GetUserPostVideoHandler : IQueryHandler<GetUserPostVideoQuery, GetUserPostVideoResult>
    {
        private readonly fptforumQueryContext _context;
        private readonly IMapper _mapper;

        public GetUserPostVideoHandler(fptforumQueryContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public async Task<Result<GetUserPostVideoResult>> Handle(GetUserPostVideoQuery request, CancellationToken cancellationToken)
        {
            if (_context == null)
            {
                throw new ErrorException(StatusCodeEnum.Context_Not_Found);
            }

            if (request == null)
            {
                return Result<GetUserPostVideoResult>.Failure("Request is null");
            }

            var post = await _context.UserPostVideos
                .Include(x => x.UserPost)
                .Include(x => x.UserStatus)
                .Include(x => x.Video)
                .FirstOrDefaultAsync(x => x.UserPostVideoId == request.UserPostVideoId);

            var user = await _context.UserProfiles.FirstOrDefaultAsync(x => x.UserId == post.UserPost.UserId);
            var avt = await _context.AvataPhotos.FirstOrDefaultAsync(x => x.UserId == post.UserPost.UserId);
            var result = new GetUserPostVideoResult
            {
                UserPostVideoId = post.UserPostVideoId,
                UserPostId = post.UserPostId,
                VideoId = post.VideoId,
                Content = post.Content,
                UserPostVideoNumber = post.UserPostVideoNumber,
                Status = new GetUserStatusDTO
                {
                    UserStatusId = post.UserStatusId,
                    UserStatusName = _context.UserStatuses.Where(x => x.UserStatusId == post.UserStatusId).Select(x => x.StatusName).FirstOrDefault()
                },
                IsHide = post.IsHide,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow,
                PostPosition = post.PostPosition,
                Video = _mapper.Map<VideoDTO>(post.Video),
                UserId = user.UserId,
                FullName = user.FirstName + " " + user.LastName,
                Avatar = _mapper.Map<GetUserAvatar>(avt)
            };

            return Result<GetUserPostVideoResult>.Success(result);
        }
    }
}
