using Application.Commands.Post;
using Application.Services;
using AutoMapper;
using Core.CQRS;
using Core.CQRS.Command;
using Core.Helper;
using Domain.CommandModels;
using Domain.Enums;
using Domain.Exceptions;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Input;
using static Application.Services.CheckingBadWord;

namespace Application.Commands.UpdateUserPostCommand
{
    public class UpdateUserPostCommandHandler : ICommandHandler<UpdateUserPostCommand, UpdateUserPostCommandResult>
    {
        private readonly fptforumCommandContext _context;
        private readonly IMapper _mapper;
        private readonly GuidHelper _helper;
        private readonly IConfiguration _configuration;
        private readonly CheckingBadWord _checkContent;

        public UpdateUserPostCommandHandler(fptforumCommandContext context, IMapper mapper, IConfiguration configuration)
        {
            _context = context;
            _mapper = mapper;
            _helper = new GuidHelper();
            _configuration = configuration;
            _checkContent = new CheckingBadWord();
        }

        public async Task<Result<UpdateUserPostCommandResult>> Handle(UpdateUserPostCommand request, CancellationToken cancellationToken)
        {
            if (_context == null)
            {
                throw new ErrorException(StatusCodeEnum.Context_Not_Found);
            }

            var userPost = await _context.UserPosts.FindAsync(request.UserPostId);
            if (userPost == null)
            {
                throw new ErrorException(StatusCodeEnum.UP02_Post_Not_Found);
            }

            var photos = request.Photos ?? new List<string>();
            var videos = request.Videos ?? new List<string>();

            var existingPhotoUrls = _context.UserPostPhotos
                .Where(p => p.UserPostId == userPost.UserPostId)
                .Select(p => p.Photo.PhotoUrl)
                .ToList();

            var existingVideoUrls = _context.UserPostVideos
                .Where(v => v.UserPostId == userPost.UserPostId)
                .Select(v => v.Video.VideoUrl)
                .ToList();

            var newPhotos = photos.Except(existingPhotoUrls).ToList();
            var newVideos = videos.Except(existingVideoUrls).ToList();

            Guid PhotoIdSingle = Guid.Empty;
            Guid VideoIdSingle = Guid.Empty;
            int numberPost = photos.Count() + videos.Count();

            if (photos.Count() == 1 && numberPost == 1)
            {
                PhotoIdSingle = await UploadImage(photos.First(), request.UserId, request.UserStatusId);
            }
            if (videos.Count() == 1 && numberPost == 1)
            {
                VideoIdSingle = await UploadVideo(videos.First(), request.UserId, request.UserStatusId);
            }

            userPost.Content = request.Content;
            userPost.UserStatusId = request.UserStatusId;
            userPost.UpdatedAt = DateTime.Now;
            userPost.NumberPost = numberPost;

            if (PhotoIdSingle != Guid.Empty)
            {
                userPost.PhotoId = PhotoIdSingle;
            }

            if (VideoIdSingle != Guid.Empty)
            {
                userPost.VideoId = VideoIdSingle;
            }

            List<CheckingBadWord.BannedWord> haveBadWord = _checkContent.Compare2String(userPost.Content);
            if (haveBadWord.Any())
            {
                userPost.IsHide = true;
                userPost.Content = MarkBannedWordsInContent(userPost.Content, haveBadWord);
            }

            await _context.SaveChangesAsync();

            if (numberPost > 1)
            {
                int postPosition = 0;

                if (newPhotos.Any())
                {
                    foreach (var photo in newPhotos)
                    {
                        Guid photoId = await UploadImage(photo, request.UserId, request.UserStatusId);
                        Domain.CommandModels.UserPostPhoto userPostPhoto = new Domain.CommandModels.UserPostPhoto
                        {
                            UserPostPhotoId = _helper.GenerateNewGuid(),
                            UserPostId = userPost.UserPostId,
                            PhotoId = photoId,
                            Content = string.Empty,
                            UserPostPhotoNumber = (numberPost + 1).ToString(),
                            UserStatusId = userPost.UserStatusId,
                            IsHide = userPost.IsHide,
                            CreatedAt = DateTime.Now,
                            UpdatedAt = DateTime.Now,
                            PostPosition = postPosition + 1
                        };
                        await _context.UserPostPhotos.AddAsync(userPostPhoto);
                        await _context.SaveChangesAsync();
                    }
                }

                if (newVideos.Any())
                {
                    foreach (var video in newVideos)
                    {
                        Guid videoId = await UploadVideo(video, request.UserId, request.UserStatusId);
                        Domain.CommandModels.UserPostVideo userPostVideo = new Domain.CommandModels.UserPostVideo
                        {
                            UserPostVideoId = _helper.GenerateNewGuid(),
                            UserPostId = userPost.UserPostId,
                            VideoId = videoId,
                            Content = string.Empty,
                            UserPostVideoNumber = (numberPost + 1).ToString(),
                            UserStatusId = userPost.UserStatusId,
                            IsHide = userPost.IsHide,
                            CreatedAt = DateTime.Now,
                            UpdatedAt = DateTime.Now,
                            PostPosition = postPosition + 1
                        };
                        await _context.UserPostVideos.AddAsync(userPostVideo);
                        await _context.SaveChangesAsync();
                    }
                }
            }

            var result = _mapper.Map<UpdateUserPostCommandResult>(userPost);
            result.BannedWords = haveBadWord;
            if (haveBadWord.Any())
            {
                throw new ErrorException(StatusCodeEnum.UP01_Post_Have_Bad_Word);
            }
            else
            {
                return Result<UpdateUserPostCommandResult>.Success(result);
            }
        }

        private bool AreListsEqual(List<string> list1, List<string> list2)
        {
            return list1.Count == list2.Count && !list1.Except(list2).Any();
        }

        private async Task<Guid> UploadImage(string photoUrl, Guid userId, Guid userStatusId)
        {
            var photoEntity = new Domain.CommandModels.Photo
            {
                PhotoId = _helper.GenerateNewGuid(),
                UserId = userId,
                PhotoUrl = photoUrl,
                UserStatusId = userStatusId,
                CreatedAt = DateTime.Now,
                UpdatedAt = DateTime.Now
            };

            await _context.Photos.AddAsync(photoEntity);
            await _context.SaveChangesAsync();

            return photoEntity.PhotoId;
        }

        private async Task<Guid> UploadVideo(string videoUrl, Guid userId, Guid userStatusId)
        {
            var videoEntity = new Domain.CommandModels.Video
            {
                VideoId = _helper.GenerateNewGuid(),
                UserId = userId,
                VideoUrl = videoUrl,
                UserStatusId = userStatusId,
                CreatedAt = DateTime.Now,
                UpdatedAt = DateTime.Now
            };

            await _context.Videos.AddAsync(videoEntity);
            await _context.SaveChangesAsync();

            return videoEntity.VideoId;
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
