using Application.DTO.UserPostPhotoDTO;
using Application.DTO.UserPostVideoDTO;
using Application.Queries.GetImageByUserId;
using AutoMapper;
using Core.CQRS;
using Core.CQRS.Query;
using Domain.Enums;
using Domain.Exceptions;
using Domain.QueryModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Queries.GetVideoByUserId
{
    public class GetVideoByUserIdQueryHandler : IQueryHandler<GetVideoByUserIdQuery, GetVideoByUserIdQueryResult>
    {
        private readonly fptforumQueryContext _context;
        private readonly IMapper _mapper;

        public GetVideoByUserIdQueryHandler(fptforumQueryContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public async Task<Result<GetVideoByUserIdQueryResult>> Handle(GetVideoByUserIdQuery request, CancellationToken cancellationToken)
        {
            if (_context == null)
            {
                throw new ErrorException(StatusCodeEnum.Context_Not_Found);
            }
            var result = new GetVideoByUserIdQueryResult();

            var userVideos = _context.UserPostVideos.Where(x => x.UserPost.UserId == request.UserId && x.IsHide != true && x.IsBanned != true)
                                                    .Select(x => new UserVideoDTO
                                                                {
                                                                    UserId = x.UserPost.UserId,
                                                                    UserPostVideoId = x.UserPostVideoId,
                                                                    UserPostId = x.UserPostId,
                                                                    VideoUrl = x.Video.VideoUrl,
                                                                    CreateDate = x.CreatedAt
                                                                })
                                                                .ToList();

            var userVideos2 = _context.UserPosts.Where(x => x.UserId == request.UserId && x.IsHide != true && x.IsBanned != true && !string.IsNullOrEmpty(x.VideoId.ToString()))
                                                .Select(x => new UserVideoDTO
                                                {
                                                    UserId = x.UserId,
                                                    UserPostVideoId = null,
                                                    UserPostId = x.UserPostId,
                                                    VideoUrl = x.Video.VideoUrl,
                                                    CreateDate = x.CreatedAt
                                                }).ToList();

            userVideos.AddRange(userVideos2);
            userVideos = userVideos.OrderByDescending(x => x.CreateDate).ToList();

            result.Videos = userVideos;

            return Result<GetVideoByUserIdQueryResult>.Success(result);
        }
    }
}
