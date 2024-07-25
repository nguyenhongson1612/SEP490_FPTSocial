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
            bool statusGroup = true;
            var groupSettingName = (from g in _context.GroupFpts
                                    join gsu in _context.GroupSettingUses
                                        on g.GroupId equals gsu.GroupId
                                    join groupSetting in _context.GroupSettings
                                        on gsu.GroupSettingId equals groupSetting.GroupSettingId
                                    join groupStatus in _context.GroupStatuses // Join với bảng GroupStatuses
                                        on gsu.GroupStatusId equals groupStatus.GroupStatusId
                                    where g.GroupId == request.GroupId
                                    select new
                                    {
                                        GroupSettingName = groupSetting.GroupSettingName,
                                        GroupStatusName = groupStatus.GroupStatusName
                                    }).FirstOrDefault();
            if (groupSettingName.GroupSettingName == "Approve Post" && groupSettingName.GroupStatusName == "Public")
            {
                statusGroup = false;
            }

            Guid groupStatusId = (Guid)_context.GroupFpts.Where(x => x.GroupId == request.GroupId).Select(x => x.GroupStatusId).FirstOrDefault();

            Domain.CommandModels.GroupSharePost sharePost = new Domain.CommandModels.GroupSharePost
            {
                GroupSharePostId = _helper.GenerateNewGuid(),
                UserId = request.UserId,
                Content = request.Content,
                UserPostId = request.UserPostId,
                UserPostPhotoId = request.UserPostPhotoId,
                UserPostVideoId = request.UserPostVideoId,
                GroupPostId = request.GroupPostId, 
                GroupPostPhotoId = request.GroupPostPhotoId,
                GroupPostVideoId = request.GroupPostVideoId,
                SharedToUserId = request.SharedToUserId, 
                GroupStatusId = groupStatusId,
                CreateDate = DateTime.Now,
                IsHide = false,
                IsBanned = false,
                UserSharedId = request.UserSharedId,
                IsPending = statusGroup,
                GroupId = request.GroupId,
            };

            var countUserPost = _querycontext.PostReactCounts.FirstOrDefault(x =>
                                (x.UserPostId == request.UserPostId && x.UserPostPhotoId == null && x.UserPostVideoId == null) ||
                                (x.UserPostPhotoId == request.UserPostPhotoId && x.UserPostId == null && x.UserPostVideoId == null) ||
                                (x.UserPostVideoId == request.UserPostVideoId && x.UserPostId == null && x.UserPostPhotoId == null)
                                );

            if (countUserPost != null)
            {
                countUserPost.ShareCount++;
                var commandModel = ModelConverter.Convert<Domain.QueryModels.PostReactCount, Domain.CommandModels.PostReactCount>(countUserPost);
                _context.PostReactCounts.Update(commandModel);
                _context.SaveChanges();
            }

            var countGroupPost = _context.GroupPostReactCounts.FirstOrDefault(x =>
                                (x.GroupPostId == request.GroupPostId && x.GroupPostPhotoId == null && x.GroupPostVideoId == null) ||
                                (x.GroupPostPhotoId == request.GroupPostPhotoId && x.GroupPostId == null && x.GroupPostVideoId == null) ||
                                (x.GroupPostVideoId == request.GroupPostVideoId && x.GroupPostId == null && x.GroupPostPhotoId == null)
                                );


            if (countGroupPost != null)
            {
                countGroupPost.ShareCount++;
                _context.SaveChanges();
            }

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
