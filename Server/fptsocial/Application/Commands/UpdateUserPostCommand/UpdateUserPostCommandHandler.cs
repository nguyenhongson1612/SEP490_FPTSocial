using Application.Commands.Post;
using Application.Services;
using AutoMapper;
using Core.CQRS;
using Core.CQRS.Command;
using Core.Helper;
using Domain.CommandModels;
using Domain.Enums;
using Domain.Exceptions;
using Domain.QueryModels;
using Microsoft.EntityFrameworkCore;
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
        private readonly fptforumQueryContext _querycontext;
        private readonly IMapper _mapper;
        private readonly GuidHelper _helper;
        private readonly IConfiguration _configuration;
        private readonly CheckingBadWord _checkContent;

        public UpdateUserPostCommandHandler(fptforumCommandContext context, fptforumQueryContext querycontext, IMapper mapper, IConfiguration configuration)
        {
            _context = context;
            _querycontext = querycontext;
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

            var userPost = await _querycontext.UserPosts.Where(x => x.UserPostId == request.UserPostId).FirstOrDefaultAsync();
            if (userPost == null)
            {
                throw new ErrorException(StatusCodeEnum.UP02_Post_Not_Found);
            }

            if(request.UserId != userPost.UserId)
            {
                throw new ErrorException(StatusCodeEnum.UP03_Not_Authorized);
            }

            var photos = request.Photos ?? new List<string>();
            var videos = request.Videos ?? new List<string>();

            var existingPhotoUrls = _querycontext.UserPostPhotos
                .Where(p => p.UserPostId == userPost.UserPostId)
                .Select(p => p.Photo.PhotoUrl)
                .ToList();

            var existingVideoUrls = _querycontext.UserPostVideos
                .Where(v => v.UserPostId == userPost.UserPostId)
                .Select(v => v.Video.VideoUrl)
                .ToList();

            var newPhotos = photos.Except(existingPhotoUrls).ToList();
            var newVideos = videos.Except(existingVideoUrls).ToList();

            var photosToDelete = existingPhotoUrls.Except(photos).ToList();
            var videosToDelete = existingVideoUrls.Except(videos).ToList();

            if (userPost.PhotoId != null && (newPhotos.Count > 1 || newVideos.Count > 1))
            {
                Domain.CommandModels.UserPost upp = new Domain.CommandModels.UserPost
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
                    UpdatedAt = DateTime.Now,
                    PhotoId = null,
                    VideoId = userPost.VideoId,
                    NumberPost = userPost.NumberPost,
                    IsBanned = userPost.IsBanned,
                };
                _context.UserPosts.Update(upp   );
                _context.SaveChanges();
            }

            if (userPost.VideoId != null && (newPhotos.Count > 1 || newVideos.Count > 1))
            {
                Domain.CommandModels.UserPost upv = new Domain.CommandModels.UserPost
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
                    UpdatedAt = DateTime.Now,
                    PhotoId = userPost.PhotoId,
                    VideoId = null,
                    NumberPost = userPost.NumberPost,
                    IsBanned = userPost.IsBanned,
                };
                _context.UserPosts.Update(upv);
                _context.SaveChanges();
            }

            foreach (var photoUrl in photosToDelete)
            {
                var photoToDelete = await _context.Photos.FirstOrDefaultAsync(p => p.PhotoUrl == photoUrl);
                if (photoToDelete != null)
                {
                    var userPostPhotosToHide = await _context.UserPostPhotos
                        .Where(upp => upp.PhotoId == photoToDelete.PhotoId)
                        .ToListAsync();

                    foreach (var userPostPhoto in userPostPhotosToHide)
                    {
                        userPostPhoto.IsHide = true; // Mark as hidden instead of deleting
                    }
                }
            }

            foreach (var videoUrl in videosToDelete)
            {
                var videoToDelete = await _context.Videos.FirstOrDefaultAsync(v => v.VideoUrl == videoUrl);
                if (videoToDelete != null)
                {
                    var userPostVideosToHide = await _context.UserPostVideos
                        .Where(upv => upv.VideoId == videoToDelete.VideoId)
                        .ToListAsync();

                    foreach (var userPostVideo in userPostVideosToHide)
                    {
                        userPostVideo.IsHide = true; // Mark as hidden instead of deleting
                    }
                }
            }

            await _context.SaveChangesAsync(); // Save the changes to the database

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
            userPost.IsBanned = false;

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
                userPost.IsBanned = true;
                userPost.Content = MarkBannedWordsInContent(userPost.Content, haveBadWord);
            }

            Domain.CommandModels.UserPost up = new Domain.CommandModels.UserPost
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
                UpdatedAt = DateTime.Now,
                PhotoId = userPost.PhotoId,
                VideoId = userPost.VideoId,
                NumberPost = userPost.NumberPost,
                IsBanned = userPost.IsBanned,
            };
            _context.UserPosts.Update(up);
            _context.SaveChanges();

            if (numberPost > 1)
            {
                int postPosition = Math.Max(
                    _context.UserPostPhotos.Where(upp => upp.UserPostId == userPost.UserPostId && upp.IsHide == false).Max(upp => (int?)upp.PostPosition) ?? 0,
                    _context.UserPostVideos.Where(upv => upv.UserPostId == userPost.UserPostId && upv.IsHide == false).Max(upv => (int?)upv.PostPosition) ?? 0
                );

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
                            UserPostPhotoNumber = _helper.GenerateNewGuid().ToString().Replace("-",""),
                            UserStatusId = userPost.UserStatusId,
                            IsHide = userPost.IsHide,
                            CreatedAt = DateTime.Now,
                            UpdatedAt = DateTime.Now,
                            PostPosition = postPosition + 1
                        };
                        await _context.UserPostPhotos.AddAsync(userPostPhoto);
                        await _context.SaveChangesAsync();
                        postPosition++;
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
                            UserPostVideoNumber = _helper.GenerateNewGuid().ToString().Replace("-", ""),
                            UserStatusId = userPost.UserStatusId,
                            IsHide = userPost.IsHide,
                            CreatedAt = DateTime.Now,
                            UpdatedAt = DateTime.Now,
                            PostPosition = postPosition + 1
                        };
                        await _context.UserPostVideos.AddAsync(userPostVideo);
                        await _context.SaveChangesAsync();
                        postPosition++;
                    }
                }
            }

            var result = _mapper.Map<UpdateUserPostCommandResult>(userPost);
            result.BannedWords = new List<BannedWord>();
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
