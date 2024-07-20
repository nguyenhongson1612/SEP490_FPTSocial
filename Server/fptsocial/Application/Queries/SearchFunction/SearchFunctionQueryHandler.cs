using Application.DTO.GetUserProfileDTO;
using Application.DTO.GroupFPTDTO;
using Application.DTO.UserPostDTO;
using Application.DTO.UserPostPhotoDTO;
using Application.DTO.UserPostVideoDTO;
using Application.Queries.GetPost;
using Application.Services;
using AutoMapper;
using Core.CQRS;
using Core.CQRS.Query;
using Core.Helper;
using Domain.CommandModels;
using Domain.Enums;
using Domain.Exceptions;
using Domain.QueryModels;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Queries.SearchFunction
{
    public class SearchFunctionQueryHandler : IQueryHandler<SearchFunctionQuery, SearchFunctionQueryResult>
    {
        private readonly fptforumQueryContext _context;
        private readonly IMapper _mapper;
        private readonly GuidHelper _helper;
        private readonly IConfiguration _configuration;
        private readonly CheckingBadWord _checkContent;

        public SearchFunctionQueryHandler(fptforumQueryContext context, IMapper mapper, IConfiguration configuration)
        {
            _context = context;
            _mapper = mapper;
            _helper = new GuidHelper();
            _configuration = configuration;
        }

        public async Task<Result<SearchFunctionQueryResult>> Handle(SearchFunctionQuery request, CancellationToken cancellationToken)
        {
            if (_context == null)
            {
                throw new ErrorException(StatusCodeEnum.Context_Not_Found);
            }

            if (string.IsNullOrEmpty(request.SearchContent))
            {
                throw new ErrorException("Search content is required");
            }

            var queryResult = new SearchFunctionQueryResult();
            string searchContent = NormalizeString(request.SearchContent);

            switch (request.Type)
            {
                case "All": // Search across all entities
                    queryResult.groups = await searchGroup(searchContent);
                    queryResult.userProfiles = await searchUsers(searchContent);
                    queryResult.userPosts = await searchUserPosts(searchContent, request);

                    break;

                case "Group": // Search groups only
                    queryResult.groups = await searchGroup(searchContent);
                    break;

                case "User": // Search friends (UserProfiles) only
                    queryResult.userProfiles = await searchUsers(searchContent);
                    break;

                case "Post": // Search posts only
                    queryResult.userPosts = await searchUserPosts(searchContent, request);
                    break;
                    // Consider adding a default case to handle invalid request types
            }

            return Result<SearchFunctionQueryResult>.Success(queryResult);
        }

        public async Task<List<GroupFPTDTO>> searchGroup (string content)
        {
            List<GroupFPTDTO> groups = await _context.GroupFpts
                                                     .Where(x => x.IsDelete != true)
                                                     .Select(group => new GroupFPTDTO
                                                     {
                                                         GroupId = group.GroupId,
                                                         GroupNumber = group.GroupNumber,
                                                         GroupName = group.GroupName,
                                                         GroupDescription = group.GroupDescription,
                                                         CreatedById = group.CreatedById,
                                                         CreatedDate = group.CreatedDate,
                                                         UpdateAt = group.UpdateAt,
                                                         GroupTypeId = group.GroupTypeId,
                                                         CoverImage = group.CoverImage,
                                                         GroupStatusId = group.GroupStatusId
                                                     })
                                                     .ToListAsync();

            // Chuẩn hóa nội dung tìm kiếm
            string normalizedContent = NormalizeString(content);

            // Lọc danh sách các nhóm theo nội dung tìm kiếm
            List<GroupFPTDTO> filteredGroups = groups
                .Where(group => NormalizeString(group.GroupName).Contains(normalizedContent))
                .ToList();

            return filteredGroups;
        }

        public async Task<List<UserDTO>> searchUsers(string searchContent)
        {
            // Chuẩn hóa nội dung tìm kiếm **ngoài query**
            string normalizedSearchContent = NormalizeString(searchContent);

            // Sử dụng LINQ để thực hiện LEFT JOIN với DefaultIfEmpty để xử lý trường hợp null
            var filteredUsers = await (
                from userProfile in _context.UserProfiles
                join avataPhoto in _context.AvataPhotos.Where(ap => ap.IsUsed) on userProfile.UserId equals avataPhoto.UserId into userAvataGroup
                from avata in userAvataGroup.DefaultIfEmpty()
                select new { UserProfile = userProfile, AvataPhoto = avata } // Chọn một anonymous type chứa cả UserProfile và AvataPhoto
            ).ToListAsync();

            // Lọc và ánh xạ kết quả sau khi đã lấy dữ liệu
            var result = filteredUsers
                .Where(x => NormalizeString(x.UserProfile.FirstName + " " + x.UserProfile.LastName).Contains(normalizedSearchContent))
                .Select(x => new UserDTO
                {
                    UserName = x.UserProfile.FirstName + " " + x.UserProfile.LastName,
                    UserId = x.UserProfile.UserId,
                    AvataUrl = x.AvataPhoto != null ? x.AvataPhoto.AvataPhotosUrl : null
                })
                .ToList();

            return result;
        }

        public async Task<List<GetPostResult>> searchUserPosts(string searchContent, SearchFunctionQuery request)
        {
            // Chuẩn hóa chuỗi tìm kiếm
            var normalizedSearchContent = NormalizeString(searchContent);

            // Lấy danh sách bạn bè
            var friendUserIds = await _context.Friends
                                              .Where(f => (f.UserId == request.UserId || f.FriendId == request.UserId) && f.Confirm == true)
                                              .Select(f => f.UserId == request.UserId ? f.FriendId : f.UserId)
                                              .ToListAsync();

            // Lấy trạng thái Public và Friend
            var userStatuses = await _context.UserStatuses
                                             .Where(x => x.StatusName == "Public" || x.StatusName == "Friend")
                                             .ToListAsync();

            var statusPublic = userStatuses.FirstOrDefault(x => x.StatusName == "Public");
            var statusFriend = userStatuses.FirstOrDefault(x => x.StatusName == "Friend");

            // Lấy các bài viết theo điều kiện trạng thái mà không chuẩn hóa nội dung
            var posts = await _context.UserPosts
                                      .Where(p => p.IsBanned == false)
                                      //.Where(p => friendUserIds.Contains(p.UserId) &&
                                      //            (p.UserStatusId == statusPublic.UserStatusId || p.UserStatusId == statusFriend.UserStatusId) &&
                                      //            p.IsHide != true)
                                      .Include(p => p.Photo)
                                      .Include(p => p.Video)
                                      .Include(p => p.UserPostPhotos.Where(x => x.IsHide != true))
                                          .ThenInclude(upp => upp.Photo)
                                      .Include(p => p.UserPostVideos.Where(x => x.IsHide != true))
                                          .ThenInclude(upv => upv.Video)
                                      .ToListAsync();

            // Lọc các bài viết dựa trên nội dung chuẩn hóa trong bộ nhớ
            var filteredPosts = posts
                .Where(p => NormalizeString(p.Content).Contains(normalizedSearchContent, StringComparison.OrdinalIgnoreCase))
                .ToList();

            // Tải các đối tượng cần thiết khác
            var counts = await _context.PostReactCounts.ToListAsync();
            var avatars = await _context.AvataPhotos
                                        .Where(x => x.IsUsed)
                                        .ToDictionaryAsync(x => x.UserId);
            var users = await _context.UserProfiles.ToDictionaryAsync(p => p.UserId);

            // Chuyển đổi danh sách các bài viết thành danh sách các UserPostDTO
            var result = filteredPosts.Select(userPost =>
            {
                var user = users.TryGetValue(userPost.UserId, out var userProfile) ? userProfile : null;
                var avatar = avatars.TryGetValue(userPost.UserId, out var avataPhoto) ? avataPhoto : null;

                return new GetPostResult
                {
                    PostId = userPost.UserPostId,
                    UserId = userPost.UserId,
                    Content = userPost.Content,
                    UserPostNumber = userPost.UserPostNumber,
                    UserStatus = new GetUserStatusDTO
                    {
                        UserStatusId = userPost.UserStatusId,
                        UserStatusName = _context.UserStatuses.Where(x => x.UserStatusId == userPost.UserStatusId).Select(x => x.StatusName).FirstOrDefault()
                    },
                    IsAvataPost = userPost.IsAvataPost,
                    IsCoverPhotoPost = userPost.IsCoverPhotoPost,
                    IsHide = userPost.IsHide,
                    CreatedAt = userPost.CreatedAt,
                    UpdateAt = userPost.UpdatedAt,
                    PhotoId = userPost.PhotoId,
                    VideoId = userPost.VideoId,
                    NumberPost = userPost.NumberPost,
                    Photo = _mapper.Map<PhotoDTO>(userPost.Photo),
                    Video = _mapper.Map<VideoDTO>(userPost.Video),
                    UserPostPhoto = userPost.UserPostPhotos?.Select(upp => new UserPostPhotoDTO
                    {
                        UserPostPhotoId = upp.UserPostPhotoId,
                        UserPostId = upp.UserPostId,
                        PhotoId = upp.PhotoId,
                        Content = upp.Content,
                        UserPostPhotoNumber = upp.UserPostPhotoNumber,
                        UserStatusId = upp.UserStatusId,
                        IsHide = upp.IsHide,
                        CreatedAt = upp.CreatedAt,
                        UpdatedAt = upp.UpdatedAt,
                        PostPosition = upp.PostPosition,
                        Photo = _mapper.Map<PhotoDTO>(upp.Photo),
                        ReactCount = new DTO.ReactDTO.ReactCount
                        {
                            ReactNumber = _context.ReactPhotoPosts.Count(x => x.UserPostPhotoId == upp.UserPostPhotoId),
                            CommentNumber = _context.CommentPhotoPosts.Count(x => x.UserPostPhotoId == upp.UserPostPhotoId),
                            ShareNumber = _context.SharePosts.Count(x => x.UserPostPhotoId == upp.UserPostPhotoId) +
                                        _context.GroupSharePosts.Count(x => x.UserPostPhotoId == upp.UserPostPhotoId),
                        },
                    }).ToList(),
                    UserPostVideo = userPost.UserPostVideos?.Select(upp => new UserPostVideoDTO
                    {
                        UserPostVideoId = upp.UserPostVideoId,
                        UserPostId = upp.UserPostId,
                        VideoId = upp.VideoId,
                        Content = upp.Content,
                        UserPostVideoNumber = upp.UserPostVideoNumber,
                        UserStatusId = upp.UserStatusId,
                        IsHide = upp.IsHide,
                        CreatedAt = upp.CreatedAt,
                        UpdatedAt = upp.UpdatedAt,
                        PostPosition = upp.PostPosition,
                        Video = _mapper.Map<VideoDTO>(upp.Video),
                        ReactCount = new DTO.ReactDTO.ReactCount
                        {
                            ReactNumber = _context.ReactVideoPosts.Count(x => x.UserPostVideoId == upp.UserPostVideoId),
                            CommentNumber = _context.CommentVideoPosts.Count(x => x.UserPostVideoId == upp.UserPostVideoId),
                            ShareNumber = _context.SharePosts.Count(x => x.UserPostVideoId == upp.UserPostVideoId) +
                                        _context.GroupSharePosts.Count(x => x.UserPostVideoId == upp.UserPostVideoId),
                        },
                    }).ToList(),
                    EdgeRank = 0,
                    UserAvatar = _mapper.Map<GetUserAvatar>(avatar),
                    UserName = user != null ? $"{user.FirstName} {user.LastName}" : null,
                    ReactCount = new DTO.ReactDTO.ReactCount
                    {
                        ReactNumber = counts.Where(x => x.UserPostId == userPost.UserPostId).Select(x => x.ReactCount).FirstOrDefault(),
                        CommentNumber = counts.Where(x => x.UserPostId == userPost.UserPostId).Select(x => x.CommentCount).FirstOrDefault(),
                        ShareNumber = counts.Where(x => x.UserPostId == userPost.UserPostId).Select(x => x.ShareCount).FirstOrDefault(),
                    }
                };
            }).ToList();

            return result;
        }

        static string NormalizeString(string input)
        {
            // Chuyển đổi thành chữ thường
            input = input.ToLower();

            // Loại bỏ dấu tiếng Việt
            input = RemoveDiacritics(input);

            return input;
        }

        static string RemoveDiacritics(string input)
        {
            string normalizedString = input.Normalize(NormalizationForm.FormD);
            StringBuilder stringBuilder = new StringBuilder();

            foreach (char c in normalizedString)
            {
                UnicodeCategory unicodeCategory = CharUnicodeInfo.GetUnicodeCategory(c);
                if (unicodeCategory != UnicodeCategory.NonSpacingMark)
                {
                    stringBuilder.Append(c);
                }
            }

            return stringBuilder.ToString().Normalize(NormalizationForm.FormC);
        }

    }
}
