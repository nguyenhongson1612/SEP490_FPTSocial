using Application.DTO.GetUserProfileDTO;
using Application.DTO.UserPostPhotoDTO;
using Application.Queries.GetPost;
using AutoMapper;
using Core.CQRS;
using Core.CQRS.Query;
using Domain.CommandModels;
using Domain.Enums;
using Domain.Exceptions;
using Domain.QueryModels;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Queries.GetUserPostPhoto
{
    public class GetUserPostPhotoHandler : IQueryHandler<GetUserPostPhotoQuery, GetUserPostPhotoResult>
    {
        private readonly fptforumQueryContext _context;
        private readonly IMapper _mapper;

        public GetUserPostPhotoHandler(fptforumQueryContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public async Task<Result<GetUserPostPhotoResult>> Handle(GetUserPostPhotoQuery request, CancellationToken cancellationToken)
        {
            if (_context == null)
            {
                throw new ErrorException(StatusCodeEnum.Context_Not_Found);
            }

            if (request == null)
            {
                return Result<GetUserPostPhotoResult>.Failure("Request is null");
            }

            var post = await _context.UserPostPhotos
                .Include(x => x.UserStatus)
                .Include(x => x.Photo)
                .FirstOrDefaultAsync(x => x.UserPostPhotoId == request.UserPostPhotoId);

            var result = new GetUserPostPhotoResult {
                UserPostPhotoId = post.UserPostPhotoId,
                UserPostId = post.UserPostId,
                PhotoId = post.PhotoId,
                Content = post.Content,
                UserPostPhotoNumber = post.UserPostPhotoNumber,
                Status = new GetUserStatusDTO {
                    UserStatusId = post.UserStatusId,
                    UserStatusName = _context.UserStatuses.Where(x => x.UserStatusId == post.UserStatusId).Select(x => x.StatusName).FirstOrDefault()
                },
                IsHide = post.IsHide,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow,
                PostPosition = post.PostPosition,
                Photo = _mapper.Map<PhotoDTO>(post.Photo)
            };

            return Result<GetUserPostPhotoResult>.Success(result);
        }
    }
}
