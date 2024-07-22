﻿using Application.DTO.GetUserProfileDTO;
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
    public class GetGroupPostByGroupIdHandler : IQueryHandler<GetGroupPostByGroupIdQuery, List<GetGroupPostByGroupIdResult>>
    {
        private readonly fptforumQueryContext _context;
        private readonly IMapper _mapper;

        public GetGroupPostByGroupIdHandler(fptforumQueryContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        private List<GetGroupPostByGroupIdResult> ApplySortingAndPaging(List<GetGroupPostByGroupIdResult> query, string type, int page, int pageSize)
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

        public async Task<Result<List<GetGroupPostByGroupIdResult>>> Handle(GetGroupPostByGroupIdQuery request, CancellationToken cancellationToken)
        {
            if (_context == null)
            {
                throw new ErrorException(StatusCodeEnum.Context_Not_Found);
            }

            if (request == null)
            {
                throw new ErrorException(StatusCodeEnum.RQ01_Request_Is_Null);
            }

            List<GetGroupPostByGroupIdResult> combine = new List<GetGroupPostByGroupIdResult>();

            var groupPost = await _context.GroupPosts
                                    .AsNoTracking()
                                    .Include(x => x.GroupStatus)
                                    .Include(x => x.GroupPhoto)
                                    .Include(x => x.GroupVideo)
                                    .Include(x => x.GroupPostPhotos.Where(x => x.IsHide != true && x.IsBanned != true))
                                        .ThenInclude(x => x.GroupPhoto)
                                    .Include(x => x.GroupPostVideos.Where(x => x.IsHide != true && x.IsBanned != true))
                                        .ThenInclude(x => x.GroupVideo)
                                    .Include(x => x.Group)
                                    .Where(x => x.GroupId == request.GroupId && x.IsHide != true && x.IsBanned != true && x.IsPending != false)
                                    .ToListAsync(cancellationToken);

            foreach ( var item in groupPost)
            {
                var userName = _context.UserProfiles.Where(x => x.UserId == item.UserId).Select(x => x.FirstName + " " + x.LastName).FirstOrDefault();
                var userAvatar = _context.AvataPhotos.Where(x => x.UserId == item.UserId && x.IsUsed == true).FirstOrDefault();
                var react = _context.GroupPostReactCounts.FirstOrDefault(x => x.GroupPostId == item.GroupPostId);

                combine.Add(new GetGroupPostByGroupIdResult {
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
                    UserName = userName,
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

            var sharePost = await _context.GroupSharePosts
                .AsNoTracking()
                .Include(x => x.GroupStatus)
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
                .Where(p => p.GroupId == request.GroupId && p.IsHide != true && p.IsBanned != true && p.IsPending != false)
                .ToListAsync(cancellationToken);

            foreach (var item in sharePost)
            {
                var user = _context.UserProfiles
                    .AsNoTracking()
                    .Where(x => x.UserId == item.UserId)
                    .Select(x => x.FirstName + " " + x.LastName)
                    .FirstOrDefault();

                var avatar = _context.AvataPhotos.FirstOrDefault(x => x.UserId == item.UserId && x.IsUsed == true);

                var userShare = _context.UserProfiles
                    .AsNoTracking()
                    .Where(x => x.UserId == item.UserSharedId)
                    .Select(x => x.FirstName + " " + x.LastName)
                    .FirstOrDefault();

                var avtShare = _context.AvataPhotos
                    .AsNoTracking()
                    .Where(x => x.UserId == item.UserSharedId && x.IsUsed == true)
                    .Select(x => new GetUserAvatar {
                        AvataPhotosId = x.AvataPhotosId,
                        AvataPhotosUrl = x.AvataPhotosUrl,
                        UserStatusId = x.UserStatusId,
                    })
                    .FirstOrDefault();

                var groupId = _context.GroupPosts
                    .AsNoTracking()
                    .Where(x => x.GroupPostId == item.GroupPostId).Select(x => x.GroupId).FirstOrDefault();
                var group = _context.GroupFpts
                    .AsNoTracking()
                    .FirstOrDefault(x => x.GroupId == groupId);

                var reactNumber = _context.ReactGroupSharePosts
                    .AsNoTracking()
                    .Count(x => x.GroupSharePostId == item.GroupSharePostId);
                var commentNumber = _context.CommentGroupSharePosts
                    .AsNoTracking()
                    .Count(x => x.GroupSharePostId == item.GroupSharePostId);

                combine.Add(new GetGroupPostByGroupIdResult
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
                    UserNameShare = userShare,
                    UserAvatarShare = avtShare,
                    GroupShareId = group?.GroupId ?? null,
                    GroupShareName = group?.GroupName ?? null,
                    GroupShareCorverImage = group?.CoverImage ?? null,
                    UserName = user,
                    UserAvatar = _mapper.Map<GetUserAvatar>(avatar),
                    GroupStatus = new GetGroupStatusDTO
                    {
                        GroupStatusId = (Guid) item.GroupStatusId,
                        GroupStatusName = item.GroupStatus.GroupStatusName
                    },
                    ReactCount = new DTO.ReactDTO.ReactCount
                    {
                        ReactNumber = reactNumber,
                        CommentNumber = commentNumber,
                        ShareNumber = 0,
                    },
                    EdgeRank = GetEdgeRankAlo.GetEdgeRank(reactNumber, commentNumber, 0, item.CreateDate ?? DateTime.Now)
                });
            }

            combine = ApplySortingAndPaging(combine, request.Type, request.Page, request.PageSize);

            return Result<List<GetGroupPostByGroupIdResult>>.Success(combine);
        }
    }
}
