using Application.Commands.Post;
using Application.Services;
using AutoMapper;
using Core.CQRS;
using Core.CQRS.Command;
using Core.CQRS.Query;
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
using static Application.Services.CheckingBadWord;

namespace Application.Commands.ShareUserPostCommand
{
    public class ShareUserPostCommandHandler : ICommandHandler<ShareUserPostCommand, ShareUserPostCommandResult>
    {
        private readonly fptforumCommandContext _context;
        private readonly fptforumQueryContext _querycontext;
        private readonly IMapper _mapper;
        private readonly GuidHelper _helper;
        private readonly CheckingBadWord _checkContent;

        public ShareUserPostCommandHandler(fptforumCommandContext context, fptforumQueryContext querycontext, IMapper mapper)
        {
            _context = context;
            _querycontext = querycontext;
            _mapper = mapper;
            _helper = new GuidHelper();
            _checkContent = new CheckingBadWord();
        }

        public async Task<Result<ShareUserPostCommandResult>> Handle(ShareUserPostCommand request, CancellationToken cancellationToken)
        {
            if (_context == null)
            {
                throw new ErrorException(StatusCodeEnum.Context_Not_Found);
            }

            var userPost = await _context.UserPosts
                                .Include(up => up.UserPostPhotos) 
                                .Include(up => up.UserPostVideos) 
                                .FirstOrDefaultAsync(up => up.UserPostId == request.UserPostId, cancellationToken);

            if (userPost == null)
            {
                throw new ErrorException(StatusCodeEnum.UP02_Post_Not_Found); // Or a more suitable error code
            }

            if (userPost.UserId == request.UserId)
            {
                throw new ErrorException(StatusCodeEnum.UP04_Can_Not_Share_Owner_Post);
            }

            // Additional checks for photo and video ownership (if IDs are provided)
            if (request.UserPostPhotoId.HasValue && !userPost.UserPostPhotos.Any(p => p.UserPostPhotoId == request.UserPostPhotoId))
            {
                throw new ErrorException(StatusCodeEnum.UP04_Can_Not_Share_Owner_Post);
            }

            if (request.UserPostVideoId.HasValue && !userPost.UserPostVideos.Any(v => v.UserPostVideoId == request.UserPostVideoId))
            {
                throw new ErrorException(StatusCodeEnum.UP04_Can_Not_Share_Owner_Post);
            }

            Domain.CommandModels.SharePost sharePost = new Domain.CommandModels.SharePost
            {
                SharePostId = _helper.GenerateNewGuid(),
                UserId = request.UserId,
                Content = request.Content,
                UserPostId = request.UserPostId,
                UserPostVideoId = request.UserPostVideoId,
                UserPostPhotoId = request.UserPostPhotoId,
                GroupPostId = request.GroupPostId,
                GroupPostPhotoId = request.GroupPostPhotoId,
                GroupPostVideoId = request.GroupPostVideoId,
                SharedToUserId = request.SharedToUserId,
                CreatedDate = DateTime.Now,
                UserStatusId = request.UserStatusId,
                IsHide = false

            };

            _context.SharePosts.Add(sharePost);
            _context.SaveChanges();

            List<CheckingBadWord.BannedWord> haveBadWord = _checkContent.Compare2String(sharePost.Content);
            if (haveBadWord.Any())
            {
                sharePost.IsBanned = true;
                sharePost.Content = MarkBannedWordsInContent(sharePost.Content, haveBadWord);
                await _context.SaveChangesAsync();
            }

            var result = _mapper.Map<ShareUserPostCommandResult>(sharePost);
            result.BannedWords = haveBadWord;
            if (haveBadWord.Any())
            {
                throw new ErrorException(StatusCodeEnum.UP01_Post_Have_Bad_Word);
            }
            else
            {
                return Result<ShareUserPostCommandResult>.Success(result);
            }
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
