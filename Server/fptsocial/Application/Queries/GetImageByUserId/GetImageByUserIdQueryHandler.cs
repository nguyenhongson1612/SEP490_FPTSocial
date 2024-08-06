using Application.DTO.NotificationDTO;
using Application.DTO.UserPostPhotoDTO;
using Application.Queries.GetListFriendToInvate;
using Application.Queries.GetUserStatus;
using AutoMapper;
using Core.CQRS;
using Core.CQRS.Query;
using Domain.Enums;
using Domain.Exceptions;
using Domain.QueryModels;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace Application.Queries.GetImageByUserId
{
    public class GetImageByUserIdQueryHandler : IQueryHandler<GetImageByUserIdQuery, GetImageByUserIdQueryResult>
    {
        private readonly fptforumQueryContext _context;
        private readonly IMapper _mapper;

        public GetImageByUserIdQueryHandler(fptforumQueryContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public async Task<Result<GetImageByUserIdQueryResult>> Handle(GetImageByUserIdQuery request, CancellationToken cancellationToken)
        {
            if (_context == null)
            {
                throw new ErrorException(StatusCodeEnum.Context_Not_Found);
            }

            var result = new GetImageByUserIdQueryResult();

            // Tạo list chứa các UserPostPhoto
            List<UserPhotoDTO> userPhotos = new List<UserPhotoDTO>();

            if (request.Type == "Avata")
            {
                userPhotos = GetImageAvatar(request.UserId);
                userPhotos = userPhotos.OrderByDescending(x => x.CreateDate).ToList();
            }
            else if (request.Type == "Cover")
            {
                userPhotos = GetImageCover(request.UserId);
                userPhotos = userPhotos.OrderByDescending(x => x.CreateDate).ToList();
            }
            else if (request.Type == "Post")
            {
                userPhotos = GetImagePost(request.UserId);
                userPhotos = userPhotos.OrderByDescending(x => x.CreateDate).ToList();
            }
            else
            {
                var avatarPhotos = GetImageAvatar(request.UserId);
                var coverPhotos = GetImageCover(request.UserId);
                var postPhotos = GetImagePost(request.UserId);

                userPhotos.AddRange(avatarPhotos);
                userPhotos.AddRange(coverPhotos);
                userPhotos.AddRange(postPhotos);
                userPhotos = userPhotos.OrderByDescending(x => x.CreateDate).ToList();
            }

            result.Photos = userPhotos;

            return Result<GetImageByUserIdQueryResult>.Success(result);
        }

        private List<UserPhotoDTO> GetImageAvatar(Guid userId)
        {
            var avatarPhotos = _context.UserPosts
                                        .Where(x => x.UserId == userId && x.IsAvataPost == true && x.IsHide != true && x.IsBanned != true)
                                        .Select(x => new UserPhotoDTO
                                        {
                                            UserId = x.UserId,
                                            UserPostPhotoId = null,
                                            UserPostId = x.UserPostId,
                                            PhotoUrl = x.Photo.PhotoUrl,
                                            CreateDate = x.CreatedAt
                                        })
                                        .ToList();
            return avatarPhotos;
        }

        private List<UserPhotoDTO> GetImageCover(Guid userId)
        {
            var coverPhotos = _context.UserPosts
                                            .Where(x => x.UserId == userId && x.IsCoverPhotoPost == true && x.IsHide != true && x.IsBanned != true)
                                            .Select(x => new UserPhotoDTO
                                            {
                                                UserId = x.UserId,
                                                UserPostPhotoId = null,
                                                UserPostId = x.UserPostId,
                                                PhotoUrl = x.Photo.PhotoUrl,
                                                CreateDate = x.CreatedAt
                                            })
                                            .ToList();
            return coverPhotos;
        }

        private List<UserPhotoDTO> GetImagePost(Guid userId)
        {
            var postPhotos = _context.UserPostPhotos
                                           .Where(x => x.UserPost.UserId == userId && x.IsHide != true && x.IsBanned != true)
                                           .Select(x => new UserPhotoDTO
                                           {
                                               UserId = x.UserPost.UserId,
                                               UserPostPhotoId = x.UserPostPhotoId,
                                               UserPostId = x.UserPostId,
                                               PhotoUrl = x.Photo.PhotoUrl,
                                               CreateDate = x.CreatedAt
                                           })
                                           .ToList();

            var postPhotos2 = _context.UserPosts
                                           .Where(x => x.UserId == userId && x.IsHide != true && x.IsBanned != true && !string.IsNullOrEmpty(x.PhotoId.ToString()))
                                           .Select(x => new UserPhotoDTO
                                           {
                                               UserId = x.UserId,
                                               UserPostPhotoId = null,
                                               UserPostId = x.UserPostId,
                                               PhotoUrl = x.Photo.PhotoUrl,
                                               CreateDate = x.CreatedAt
                                           })
                                           .ToList();

            postPhotos.AddRange(postPhotos2);
            return postPhotos;
        }

    }
}
