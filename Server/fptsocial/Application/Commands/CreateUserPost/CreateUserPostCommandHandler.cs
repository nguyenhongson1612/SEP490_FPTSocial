using Application.Services;
using AutoMapper;
using Core.CQRS;
using Core.CQRS.Command;
using Core.Helper;
using Domain.CommandModels;
using Domain.Enums;
using Domain.Exceptions;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;

namespace Application.Commands.Post
{
    public class CreateUserPostCommandHandler : ICommandHandler<CreateUserPostCommand, CreateUserPostCommandResult>
    {
        private readonly fptforumCommandContext _context;
        private readonly IMapper _mapper;
        private readonly GuidHelper _helper;
        private readonly IConfiguration _configuration;
        private readonly CheckingBadWord _checkContent;
        private bool HaveBadWord;

        public CreateUserPostCommandHandler(fptforumCommandContext context, IMapper mapper, IConfiguration configuration)
        {
            _context = context;
            _mapper = mapper;
            _helper = new GuidHelper();
            _configuration = configuration;
        }

        public async Task<Result<CreateUserPostCommandResult>> Handle(CreateUserPostCommand request, CancellationToken cancellationToken)
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
                PhotoIdSingle = await UploadImage(photos.First(), request.UserId, request.UserStatusId);
            }
            if (videos.Count() == 1 && numberPost == 1)
            {
                VideoIdSingle = await UploadVideo(videos.First(), request.UserId, request.UserStatusId);
            }
            Domain.CommandModels.UserPost userPost = new Domain.CommandModels.UserPost
            {
                UserPostId = _helper.GenerateNewGuid(),
                UserId = request.UserId,
                Content = request.Content,
                UserPostNumber = request.UserPostNumber,
                UserStatusId = request.UserStatusId,
                IsAvataPost = false,
                IsCoverPhotoPost = false,
                IsHide = false,
                CreatedAt = DateTime.Now,
                UpdatedAt = DateTime.Now,
                NumberPost = numberPost
            };
            if (PhotoIdSingle != Guid.Empty)
            {
                userPost.PhotoId = PhotoIdSingle;
            }

            if (VideoIdSingle != Guid.Empty)
            {
                userPost.VideoId = VideoIdSingle;
            }
            await _context.UserPosts.AddAsync(userPost);
            await _context.SaveChangesAsync();
            HaveBadWord = _checkContent.Compare2String(userPost.Content);

            if (numberPost > 1)
            {
                int postPosition = 0;
                foreach (var photo in photos)
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

                foreach (var video in videos)
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

            return Result<CreateUserPostCommandResult>.Success(request);
        }

        //private async Task<string> UploadFileToCloudinary(IFormFile file, string folder)
        //{
        //    using (var stream = new MemoryStream())
        //    {
        //        await file.CopyToAsync(stream);
        //        stream.Seek(0, SeekOrigin.Begin);

        //        var uploadParams = new RawUploadParams()
        //        {
        //            File = new FileDescription(file.FileName, stream),
        //            Folder = folder
        //        };

        //        var uploadResult = await _cloudinary.UploadAsync(uploadParams);

        //        if (uploadResult.StatusCode != System.Net.HttpStatusCode.OK)
        //        {
        //            throw new ErrorException(StatusCodeEnum.UL01_Upload_Cloud_Fail);
        //        }

        //        return uploadResult.SecureUrl.ToString();
        //    }
        //}

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

    }
}
