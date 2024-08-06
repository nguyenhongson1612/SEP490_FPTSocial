﻿using Application.DTO.GetUserProfileDTO;
using Application.DTO.GroupPostDTO;
using Application.DTO.ReactDTO;
using Application.Queries.GetGroupPostByGroupId;
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
using System.Runtime.Intrinsics.X86;
using System.Text;
using System.Threading.Tasks;

namespace Application.Queries.GetGroupPostByGroupPostId
{
    public class GetGroupPostByGroupPostIdHandler : IQueryHandler<GetGroupPostByGroupPostIdQuery, GetGroupPostByGroupPostIdResult>
    {
        private readonly fptforumQueryContext _context;
        private readonly IMapper _mapper;

        public GetGroupPostByGroupPostIdHandler(fptforumQueryContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public async Task<Result<GetGroupPostByGroupPostIdResult>> Handle(GetGroupPostByGroupPostIdQuery request, CancellationToken cancellationToken)
        {
            if(_context == null)
            {
                throw new ErrorException(StatusCodeEnum.Context_Not_Found);
            }

            if(request == null)
            {
                throw new ErrorException(StatusCodeEnum.RQ01_Request_Is_Null);
            }

            var blockUserList = await _context.BlockUsers
                .Where(x => (x.UserId == request.UserId || x.UserIsBlockedId == request.UserId) && x.IsBlock == true)
                .Select(x => x.UserId == request.UserId ? x.UserIsBlockedId : x.UserId)
                .ToListAsync(cancellationToken);

            var userId = await _context.GroupPosts
                .Where(x => x.GroupPostId == request.GroupPostId)
                .Select(x => x.UserId)
                .FirstOrDefaultAsync(cancellationToken);

            if (blockUserList.Contains(userId))
            {
                throw new ErrorException(StatusCodeEnum.UP05_Can_Not_See_Content);
            }

            var groupPost = await _context.GroupPosts
                                    .Include(x => x.GroupStatus)
                                    .Include(x => x.GroupPhoto)
                                    .Include(x => x.GroupVideo)
                                    .Include(x => x.GroupPostPhotos.Where(x => x.IsHide != true && x.IsBanned != true))
                                        .ThenInclude(x => x.GroupPhoto)
                                    .Include(x => x.GroupPostVideos.Where(x => x.IsHide != true && x.IsBanned != true))
                                        .ThenInclude(x => x.GroupVideo)
                                    .Include(x => x.Group)
                                    .FirstOrDefaultAsync(x => x.GroupPostId == request.GroupPostId && x.IsHide != true && x.IsBanned != true);

            if(groupPost == null)
            {
                throw new ErrorException(StatusCodeEnum.UP02_Post_Not_Found);
            }

            var avt = _context.AvataPhotos.FirstOrDefault(x => x.UserId == groupPost.UserId && x.IsUsed == true);
            var user = _context.UserProfiles.FirstOrDefault(x => x.UserId == groupPost.UserId);
            var react = _context.GroupPostReactCounts.FirstOrDefault(x => x.GroupPostId == groupPost.GroupPostId);

            var result = new GetGroupPostByGroupPostIdResult
            {
                GroupPostId = groupPost.GroupPostId,
                UserId = groupPost.UserId,
                Content = groupPost.Content,
                GroupPostNumber = groupPost.GroupPostNumber,
                GroupStatusId = new DTO.GroupDTO.GetGroupStatusDTO
                {
                    GroupStatusId = groupPost.GroupStatusId,
                    GroupStatusName = groupPost.GroupStatus.GroupStatusName
                },
                CreatedAt = groupPost.CreatedAt,
                IsHide = groupPost.IsHide,
                UpdatedAt = groupPost.UpdatedAt,
                GroupPhotoId = groupPost.GroupPhotoId,
                GroupVideoId = groupPost.GroupVideoId,
                NumberPost = groupPost.NumberPost,
                IsBanned = groupPost.IsBanned,
                GroupPhoto = _mapper.Map<GroupPhotoDTO>(groupPost.GroupPhoto),
                GroupVideo = _mapper.Map<GroupVideoDTO>(groupPost.GroupVideo),
                GroupPostPhoto = groupPost.GroupPostPhotos?.Select(upp => new GroupPostPhotoDTO
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
                    ReactCount = new DTO.ReactDTO.ReactCount
                    {
                        ReactNumber = _context.ReactGroupPhotoPosts.Count(x => x.GroupPostPhotoId == upp.GroupPostPhotoId),
                        CommentNumber = _context.ReactGroupPhotoPostComments.Count(x => x.GroupPostPhotoId == upp.GroupPostPhotoId),
                        ShareNumber = _context.GroupSharePosts.Count(x => x.GroupPostPhotoId == upp.GroupPostPhotoId) +
                                        _context.SharePosts.Count(x => x.GroupPostPhotoId == upp.GroupPostPhotoId)
                    }
                }).ToList(),
                GroupPostVideo = groupPost.GroupPostVideos?.Select(upp => new GroupPostVideoDTO
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
                    ReactCount = new ReactCount
                    {
                        ReactNumber = _context.ReactGroupVideoPosts.Count(x => x.GroupPostVideoId == upp.GroupPostVideoId),
                        CommentNumber = _context.ReactGroupVideoPostComments.Count(x => x.GroupPostVideoId == upp.GroupPostVideoId),
                        ShareNumber = _context.GroupSharePosts.Count(x => x.GroupPostVideoId == upp.GroupPostVideoId) +
                                        _context.SharePosts.Count(x => x.GroupPostVideoId == upp.GroupPostVideoId)
                    }
                }).ToList(),
                UserAvata = _mapper.Map<GetUserAvatar>(avt),
                UserName = user?.FirstName + " " + user?.LastName,
                GroupId = groupPost.GroupId,
                GroupName = groupPost.Group?.GroupName,
                GroupCorverImage = groupPost.Group?.CoverImage,
                ReactCount = new ReactCount
                {
                    ReactNumber = react?.ReactCount ?? 0,
                    CommentNumber = react?.CommentCount ?? 0,
                    ShareNumber = react?.ShareCount ?? 0
                }
            };

            var isReact = await _context.ReactGroupPosts
                    .AsNoTracking()
                    .Include(x => x.ReactType)
                    .FirstOrDefaultAsync(x => x.GroupPostId == request.GroupPostId && x.UserId == request.UserId);

            var topReact = await _context.ReactGroupPosts
            .AsNoTracking()
            .Include(x => x.ReactType)
            .Where(x => x.GroupPostId == request.GroupPostId)
            .GroupBy(x => x.ReactTypeId)
            .Select(g => new {
                ReactTypeId = g.Key,
                ReactTypeName = g.First().ReactType.ReactTypeName, // Assuming ReactType has a Name property
                Count = g.Count()
            })
            .OrderByDescending(r => r.Count)
            .Take(2)
            .ToListAsync(cancellationToken);

            result.IsReact = isReact != null ? true : false;

            if (isReact != null)
            {
                result.UserReactType = new DTO.ReactDTO.ReactTypeCountDTO
                {
                    ReactTypeId = isReact.ReactTypeId,
                    ReactTypeName = isReact.ReactType.ReactTypeName,
                    NumberReact = 1
                };
            }

            if (topReact != null)
            {
                result.Top2React = topReact.Select(x => new ReactTypeCountDTO
                {
                    ReactTypeId = x.ReactTypeId,
                    ReactTypeName = x.ReactTypeName,
                    NumberReact = x.Count
                }).ToList();
            }

            return Result<GetGroupPostByGroupPostIdResult>.Success(result);
        }
    }
}
