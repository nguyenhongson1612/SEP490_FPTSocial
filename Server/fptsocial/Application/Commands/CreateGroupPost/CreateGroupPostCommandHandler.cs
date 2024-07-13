﻿using Application.Commands.CreateUserInterest;
using Application.Services;
using AutoMapper;
using Core.CQRS;
using Core.CQRS.Command;
using Core.Helper;
using Domain.CommandModels;
using Domain.Enums;
using Domain.Exceptions;
using Domain.QueryModels;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using static Application.Services.CheckingBadWord;

namespace Application.Commands.CreateGroupPost
{
    public class CreateGroupPostCommandHandler : ICommandHandler<CreateGroupPostCommand, CreateGroupPostCommandResult>
    {
        private readonly fptforumCommandContext _context;
        private readonly IMapper _mapper;
        private readonly GuidHelper _helper;
        private readonly IConfiguration _configuration;
        private readonly CheckingBadWord _checkContent;

        public CreateGroupPostCommandHandler(fptforumCommandContext context, IMapper mapper, IConfiguration configuration)
        {
            _context = context;
            _mapper = mapper;
            _helper = new GuidHelper();
            _configuration = configuration;
            _checkContent = new CheckingBadWord();
        }

        public async Task<Result<CreateGroupPostCommandResult>> Handle(CreateGroupPostCommand request, CancellationToken cancellationToken)
        {
            if (_context == null)
            {
                throw new ErrorException(StatusCodeEnum.Context_Not_Found);
            }
            var photos = request.Photos ?? new List<string>();
            var videos = request.Videos ?? new List<string>();

            Guid PhotoIdSingle = Guid.Empty;
            Guid VideoIdSingle = Guid.Empty;
            int numberPost = photos.Count() + videos.Count();

            if (photos.Count() == 1 && numberPost == 1)
            {
                PhotoIdSingle = await UploadImage(photos.First(), request.GroupId);
            }
            if (videos.Count() == 1 && numberPost == 1)
            {
                VideoIdSingle = await UploadVideo(videos.First(), request.GroupId);
            }

            Domain.CommandModels.GroupPost groupPost = new Domain.CommandModels.GroupPost
            {
                GroupPostId = _helper.GenerateNewGuid(),
                UserId = request.UserId,
                Content = request.Content,
                GroupPostNumber = DateTime.Now.ToString("ddMMyyHHmmss") + request.UserId.ToString().Replace("-", ""),
                GroupStatusId = request.GroupStatusId,
                IsHide = false,
                CreatedAt = DateTime.Now,
                UpdatedAt = DateTime.Now,
                NumberPost = numberPost,
                IsBanned = false,
            };

            if (PhotoIdSingle != Guid.Empty)
            {
                groupPost.GroupPhotoId = PhotoIdSingle;
            }

            if (VideoIdSingle != Guid.Empty)
            {
                groupPost.GroupVideoId = VideoIdSingle;
            }
            await _context.GroupPosts.AddAsync(groupPost);
            await _context.SaveChangesAsync();
            List<CheckingBadWord.BannedWord> haveBadWord = _checkContent.Compare2String(groupPost.Content);
            if (haveBadWord.Any())
            {
                groupPost.IsBanned = true;
                groupPost.Content = MarkBannedWordsInContent(groupPost.Content, haveBadWord);
                await _context.SaveChangesAsync();
            }

            Domain.CommandModels.GroupPostReactCount groupPostReactCount = new Domain.CommandModels.GroupPostReactCount
            {
                GroupPostReactCountId = _helper.GenerateNewGuid(),
                GroupPostId = groupPost.GroupPostId,
                ReactCount = 0,
                CommentCount = 0,
                ShareCount = 0,
            };
            await _context.GroupPostReactCounts.AddAsync(groupPostReactCount);
            await _context.SaveChangesAsync();

            if (numberPost > 1)
            {
                int postPosition = 0;
                foreach (var photo in photos)
                {
                    Guid photoId = await UploadImage(photo, request.GroupId);
                    Domain.CommandModels.GroupPostPhoto groupPostPhoto = new Domain.CommandModels.GroupPostPhoto
                    {
                        GroupPostPhotoId = _helper.GenerateNewGuid(),
                        GroupPostId = groupPost.GroupPostId,
                        GroupPhotoId = photoId,
                        Content = string.Empty,
                        GroupPostPhotoNumber = _helper.GenerateNewGuid().ToString().Replace("-", ""),
                        GroupStatusId = groupPost.GroupStatusId,
                        IsHide = groupPost.IsHide,
                        CreatedAt = DateTime.Now,
                        UpdatedAt = DateTime.Now,
                        PostPosition = postPosition + 1
                    };
                    await _context.GroupPostPhotos.AddAsync(groupPostPhoto);
                    await _context.SaveChangesAsync();
                    postPosition++;

                    Domain.CommandModels.GroupPostReactCount groupPostPhotoReactCount = new Domain.CommandModels.GroupPostReactCount
                    {
                        GroupPostReactCountId = _helper.GenerateNewGuid(),
                        GroupPostPhotoId = groupPostPhoto.GroupPostPhotoId,
                        ReactCount = 0,
                        CommentCount = 0,
                        ShareCount = 0,
                    };
                    await _context.GroupPostReactCounts.AddAsync(groupPostPhotoReactCount);
                    await _context.SaveChangesAsync();
                }

                foreach (var video in videos)
                {
                    Guid videoId = await UploadVideo(video, request.GroupId);
                    Domain.CommandModels.GroupPostVideo groupPostVideo = new Domain.CommandModels.GroupPostVideo
                    {
                        GroupPostVideoId = _helper.GenerateNewGuid(),
                        GroupPostId = groupPost.GroupPostId,
                        GroupVideoId = videoId,
                        Content = string.Empty,
                        GroupPostVideoNumber = _helper.GenerateNewGuid().ToString().Replace("-", ""),
                        GroupStatusId = groupPost.GroupStatusId,
                        IsHide = groupPost.IsHide,
                        CreatedAt = DateTime.Now,
                        UpdatedAt = DateTime.Now,
                        PostPosition = postPosition + 1
                    };
                    await _context.GroupPostVideos.AddAsync(groupPostVideo);
                    await _context.SaveChangesAsync();
                    postPosition++;

                    Domain.CommandModels.GroupPostReactCount groupPostVideoReactCount = new Domain.CommandModels.GroupPostReactCount
                    {
                        GroupPostReactCountId = _helper.GenerateNewGuid(),
                        GroupPostVideoId = groupPostVideo.GroupPostVideoId,
                        ReactCount = 0,
                        CommentCount = 0,
                        ShareCount = 0,
                    };
                    await _context.GroupPostReactCounts.AddAsync(groupPostVideoReactCount);
                    await _context.SaveChangesAsync();
                }
            }
            var result = _mapper.Map<CreateGroupPostCommandResult>(groupPost);
            result.BannedWords = haveBadWord;
            if(haveBadWord.Any())
            {
                throw new ErrorException(StatusCodeEnum.GR09_Group_Post_Have_Bad_Word);
            }
            else
            {
                return Result<CreateGroupPostCommandResult>.Success(result);
            }
        }

        private async Task<Guid> UploadImage(string photoUrl, Guid groupId)
        {
            var photoEntity = new Domain.CommandModels.GroupPhoto
            {
                GroupPhotoId = _helper.GenerateNewGuid(),
                GroupId = groupId,
                PhotoUrl = photoUrl,
                GroupPhotoNumber = _helper.GenerateNewGuid().ToString().Replace("-", ""),
                CreatedAt = DateTime.Now,
                UpdatedAt = DateTime.Now
            };

            await _context.GroupPhotos.AddAsync(photoEntity);
            await _context.SaveChangesAsync();

            return photoEntity.GroupPhotoId;
        }

        private async Task<Guid> UploadVideo(string videoUrl, Guid groupId)
        {
            var videoEntity = new Domain.CommandModels.GroupVideo
            {
                GroupVideoId = _helper.GenerateNewGuid(),
                GroupId = groupId,
                VideoUrl = videoUrl,
                GroupVideoNumber = _helper.GenerateNewGuid().ToString().Replace("-", ""),
                CreatedAt = DateTime.Now,
                UpdatedAt = DateTime.Now
            };

            await _context.GroupVideos.AddAsync(videoEntity);
            await _context.SaveChangesAsync();

            return videoEntity.GroupVideoId;
        }

        public string MarkBannedWordsInContent(string content, List<BannedWord> bannedWords)
        {
            foreach (var bannedWord in bannedWords)
            {
                string wordPattern = $"\\b{bannedWord.Word}\\b";
                string replacement = $"<span style='background-color: yellow;'>{bannedWord.Word}</span>";
                content = System.Text.RegularExpressions.Regex.Replace(content, wordPattern, replacement, System.Text.RegularExpressions.RegexOptions.IgnoreCase);
            }
            return content;
        }
    }
}
