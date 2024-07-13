using Application.Services;
using AutoMapper;
using Core.CQRS.Command;
using Core.CQRS;
using Domain.CommandModels;
using Domain.Enums;
using Domain.Exceptions;
using Domain.QueryModels;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using static Application.Services.CheckingBadWord;
using Core.Helper;
using Microsoft.EntityFrameworkCore.Query;
using System.Net.WebSockets;

namespace Application.Commands.ShareGroupPostCommand
{
    public class ShareGroupPostCommandHandler : ICommandHandler<ShareGroupPostCommand, ShareGroupPostCommandResult>
    {
        private readonly fptforumCommandContext _context;
        private readonly fptforumQueryContext _querycontext;
        private readonly IMapper _mapper;
        private readonly GuidHelper _helper;
        private readonly CheckingBadWord _checkContent;

        public ShareGroupPostCommandHandler(fptforumCommandContext context, fptforumQueryContext querycontext, IMapper mapper)
        {
            _context = context;
            _querycontext = querycontext;
            _mapper = mapper;
            _helper = new GuidHelper();
            _checkContent = new CheckingBadWord();
        }

        public async Task<Result<ShareGroupPostCommandResult>> Handle(ShareGroupPostCommand request, CancellationToken cancellationToken)
        {
            if (_context == null)
            {
                throw new ErrorException(StatusCodeEnum.Context_Not_Found);
            }

            //var groupPost = await _context.GroupPosts
            //                    .Include(up => up.GroupPostPhotos)
            //                    .Include(up => up.GroupPostVideos)
            //                    .FirstOrDefaultAsync(up => up.GroupPostId == request.GroupPostId, cancellationToken);

            //if (groupPost == null)
            //{
            //    throw new ErrorException(StatusCodeEnum.UP02_Post_Not_Found); 
            //}

            //if (groupPost.UserId == request.UserId)
            //{
            //    throw new ErrorException(StatusCodeEnum.UP04_Can_Not_Share_Owner_Post);
            //}

            //if (request.UserPostPhotoId.HasValue && !groupPost.GroupPostPhotos.Any(p => p.GroupPostPhotoId == request.UserPostPhotoId))
            //{
            //    throw new ErrorException(StatusCodeEnum.UP04_Can_Not_Share_Owner_Post);
            //}

            //if (request.UserPostVideoId.HasValue && !groupPost.GroupPostVideos.Any(v => v.GroupPostVideoId == request.UserPostVideoId))
            //{
            //    throw new ErrorException(StatusCodeEnum.UP04_Can_Not_Share_Owner_Post);
            //}

            Domain.CommandModels.GroupSharePost sharePost = new Domain.CommandModels.GroupSharePost
            {
                GroupSharePostId = _helper.GenerateNewGuid(),
                UserId = request.UserId,
                Content = request.Content,
                GroupPostId = request.GroupPostId, 
                GroupPostPhotoId = request.GroupPostPhotoId,
                GroupPostVideoId = request.GroupPostVideoId,
                SharedToUserId = request.SharedToUserId, 
                CreatedDate = DateTime.Now,
                IsHide = false
            };

            _context.GroupSharePosts.Add(sharePost);
            _context.SaveChanges();

            List<CheckingBadWord.BannedWord> haveBadWord = _checkContent.Compare2String(sharePost.Content);
            if (haveBadWord.Any())
            {
                sharePost.IsBanned = true;
                sharePost.Content = MarkBannedWordsInContent(sharePost.Content, haveBadWord);
                await _context.SaveChangesAsync();
            }

            var result = _mapper.Map<ShareGroupPostCommandResult>(sharePost);
            result.BannedWords = haveBadWord;
            if (haveBadWord.Any())
            {
                throw new ErrorException(StatusCodeEnum.UP01_Post_Have_Bad_Word);
            }
            else
            {
                return Result<ShareGroupPostCommandResult>.Success(result);
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
