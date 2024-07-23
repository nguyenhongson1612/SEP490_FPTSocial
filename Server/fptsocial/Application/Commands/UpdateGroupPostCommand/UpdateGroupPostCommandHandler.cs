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

namespace Application.Commands.UpdateGroupPostCommand
{
    public class UpdateGroupPostCommandHandler : ICommandHandler<UpdateGroupPostCommand, UpdateGroupPostCommandResult>
    {
        private readonly fptforumCommandContext _context;
        private readonly IMapper _mapper;
        private readonly GuidHelper _helper;
        private readonly IConfiguration _configuration;
        private readonly CheckingBadWord _checkContent;

        public UpdateGroupPostCommandHandler(fptforumCommandContext context, IMapper mapper, IConfiguration configuration)
        {
            _context = context;
            _mapper = mapper;
            _helper = new GuidHelper();
            _configuration = configuration;
            _checkContent = new CheckingBadWord();
        }

        public async Task<Result<UpdateGroupPostCommandResult>> Handle(UpdateGroupPostCommand request, CancellationToken cancellationToken)
        {
            if (_context == null)
            {
                throw new ErrorException(StatusCodeEnum.Context_Not_Found);
            }

            var GroupPost = await _context.GroupPosts.FindAsync(request.GroupPostId);
            if (GroupPost == null)
            {
                throw new ErrorException(StatusCodeEnum.UP02_Post_Not_Found);
            }

            if(request.UserId != GroupPost.UserId)
            {
                throw new ErrorException(StatusCodeEnum.UP03_Not_Authorized);
            }

            var photos = request.Photos ?? new List<string>();
            var videos = request.Videos ?? new List<string>();

            var existingPhotoUrls = _context.GroupPostPhotos
                .Where(p => p.GroupPostId == GroupPost.GroupPostId)
                .Select(p => p.GroupPhoto.PhotoUrl)
                .ToList();

            var existingVideoUrls = _context.GroupPostVideos
                .Where(v => v.GroupPostId == GroupPost.GroupPostId)
                .Select(v => v.GroupVideo.VideoUrl)
                .ToList();

            var newPhotos = photos.Except(existingPhotoUrls).ToList();
            var newVideos = videos.Except(existingVideoUrls).ToList();

            var photosToDelete = existingPhotoUrls.Except(photos).ToList();
            var videosToDelete = existingVideoUrls.Except(videos).ToList();


            Guid groupStatusId = (Guid)_context.GroupFpts.Where(x => x.GroupId == request.GroupId).Select(x => x.GroupStatusId).FirstOrDefault();

            if (GroupPost.GroupPhotoId != null && (newPhotos.Count > 1 || newVideos.Count > 1))
            {
                Domain.CommandModels.GroupPost gp = new Domain.CommandModels.GroupPost
                {
                    GroupPostId = GroupPost.GroupPostId,
                    UserId = GroupPost.UserId,
                    Content = GroupPost.Content,
                    GroupPostNumber = GroupPost.GroupPostNumber,
                    GroupStatusId  = groupStatusId,
                    IsHide = GroupPost.IsHide,
                    CreatedAt = GroupPost.CreatedAt,
                    UpdatedAt = DateTime.Now,
                    GroupPhotoId = null,
                    GroupVideoId = GroupPost.GroupVideoId,
                    NumberPost = GroupPost.NumberPost,
                    IsBanned = GroupPost.IsBanned,
                };
                _context.GroupPosts.Update(gp);
                _context.SaveChanges();
            }

            if (GroupPost.GroupVideoId != null && (newPhotos.Count > 1 || newVideos.Count > 1))
            {
                Domain.CommandModels.GroupPost gp = new Domain.CommandModels.GroupPost
                {
                    GroupPostId = GroupPost.GroupPostId,
                    UserId = GroupPost.UserId,
                    Content = GroupPost.Content,
                    GroupPostNumber = GroupPost.GroupPostNumber,
                    GroupStatusId = groupStatusId,
                    IsHide = GroupPost.IsHide,
                    CreatedAt = GroupPost.CreatedAt,
                    UpdatedAt = DateTime.Now,
                    GroupPhotoId = GroupPost.GroupVideoId,
                    GroupVideoId = null,
                    NumberPost = GroupPost.NumberPost,
                    IsBanned = GroupPost.IsBanned,
                };
                _context.GroupPosts.Update(gp);
                _context.SaveChanges();
            }

            foreach (var photoUrl in photosToDelete)
            {
                var photoToDelete = await _context.GroupPhotos.FirstOrDefaultAsync(p => p.PhotoUrl == photoUrl);
                if (photoToDelete != null)
                {
                    var GroupPostPhotosToHide = await _context.GroupPostPhotos
                        .Where(upp => upp.GroupPhotoId == photoToDelete.GroupPhotoId)
                        .ToListAsync();

                    foreach (var GroupPostPhoto in GroupPostPhotosToHide)
                    {
                        GroupPostPhoto.IsHide = true; // Mark as hidden instead of deleting
                    }
                }
            }

            foreach (var videoUrl in videosToDelete)
            {
                var videoToDelete = await _context.GroupVideos.FirstOrDefaultAsync(v => v.VideoUrl == videoUrl);
                if (videoToDelete != null)
                {
                    var GroupPostVideosToHide = await _context.GroupPostVideos
                        .Where(upv => upv.GroupVideoId == videoToDelete.GroupVideoId)
                        .ToListAsync();

                    foreach (var GroupPostVideo in GroupPostVideosToHide)
                    {
                        GroupPostVideo.IsHide = true; // Mark as hidden instead of deleting
                    }
                }
            }

            await _context.SaveChangesAsync(); // Save the changes to the database

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

            GroupPost.Content = request.Content;
            GroupPost.GroupStatusId = groupStatusId;
            GroupPost.UpdatedAt = DateTime.Now;
            GroupPost.NumberPost = numberPost;
            GroupPost.IsBanned = false;

            if (PhotoIdSingle != Guid.Empty)
            {
                GroupPost.GroupPhotoId = PhotoIdSingle;
            }

            if (VideoIdSingle != Guid.Empty)
            {
                GroupPost.GroupVideoId = VideoIdSingle;
            }

            List<CheckingBadWord.BannedWord> haveBadWord = _checkContent.Compare2String(GroupPost.Content);
            if (haveBadWord.Any())
            {
                GroupPost.IsBanned = true;
                GroupPost.Content = MarkBannedWordsInContent(GroupPost.Content, haveBadWord);
            }

            await _context.SaveChangesAsync();

            if (numberPost > 1)
            {
                int postPosition = Math.Max(
                    _context.GroupPostPhotos.Where(upp => upp.GroupPostId == GroupPost.GroupPostId && upp.IsHide == false).Max(upp => (int?)upp.PostPosition) ?? 0,
                    _context.GroupPostVideos.Where(upv => upv.GroupPostId == GroupPost.GroupPostId && upv.IsHide == false).Max(upv => (int?)upv.PostPosition) ?? 0
                );

                if (newPhotos.Any())
                {
                    foreach (var photo in newPhotos)
                    {
                        Guid photoId = await UploadImage(photo, request.GroupId);
                        Domain.CommandModels.GroupPostPhoto GroupPostPhoto = new Domain.CommandModels.GroupPostPhoto
                        {
                            GroupPostPhotoId = _helper.GenerateNewGuid(),
                            GroupPostId = GroupPost.GroupPostId,
                            GroupPhotoId = photoId,
                            Content = string.Empty,
                            GroupPostPhotoNumber = _helper.GenerateNewGuid().ToString().Replace("-",""),
                            GroupStatusId = groupStatusId,
                            IsHide = GroupPost.IsHide,
                            CreatedAt = DateTime.Now,
                            UpdatedAt = DateTime.Now,
                            PostPosition = postPosition + 1
                        };
                        await _context.GroupPostPhotos.AddAsync(GroupPostPhoto);
                        await _context.SaveChangesAsync();
                        postPosition++;
                    }
                }

                if (newVideos.Any())
                {
                    foreach (var video in newVideos)
                    {
                        Guid videoId = await UploadVideo(video, request.GroupId);
                        Domain.CommandModels.GroupPostVideo GroupPostVideo = new Domain.CommandModels.GroupPostVideo
                        {
                            GroupPostVideoId = _helper.GenerateNewGuid(),
                            GroupPostId = GroupPost.GroupPostId,
                            GroupVideoId = videoId,
                            Content = string.Empty,
                            GroupPostVideoNumber = _helper.GenerateNewGuid().ToString().Replace("-", ""),
                            GroupStatusId = GroupPost.GroupStatusId,
                            IsHide = GroupPost.IsHide,
                            CreatedAt = DateTime.Now,
                            UpdatedAt = DateTime.Now,
                            PostPosition = postPosition + 1
                        };
                        await _context.GroupPostVideos.AddAsync(GroupPostVideo);
                        await _context.SaveChangesAsync();
                        postPosition++;
                    }
                }
            }

            var result = _mapper.Map<UpdateGroupPostCommandResult>(GroupPost);
            result.BannedWords = new List<BannedWord>();
            result.BannedWords = haveBadWord;
            if (haveBadWord.Any())
            {
                throw new ErrorException(StatusCodeEnum.UP01_Post_Have_Bad_Word);
            }
            else
            {
                return Result<UpdateGroupPostCommandResult>.Success(result);
            }
        }

        private async Task<Guid> UploadImage(string photoUrl, Guid userId)
        {
            var photoEntity = new Domain.CommandModels.GroupPhoto
            {
                GroupPhotoId = _helper.GenerateNewGuid(),
                GroupId = userId,
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
