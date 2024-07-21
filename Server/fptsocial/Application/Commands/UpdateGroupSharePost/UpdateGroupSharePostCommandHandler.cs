using Application.Commands.UpdateUserPostCommand;
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
using System.Net.WebSockets;
using System.Text;
using System.Threading.Tasks;
using static Application.Services.CheckingBadWord;

namespace Application.Commands.UpdateGroupSharePost
{
    public class UpdateGroupSharePostCommandHandler : ICommandHandler<UpdateGroupSharePostCommand, UpdateGroupSharePostCommandResult>
    {
        private readonly fptforumCommandContext _context;
        private readonly fptforumQueryContext _queryContext;
        private readonly IMapper _mapper;
        private readonly GuidHelper _helper;
        private readonly IConfiguration _configuration;
        private readonly CheckingBadWord _checkContent;

        public UpdateGroupSharePostCommandHandler(fptforumCommandContext context, IMapper mapper, IConfiguration configuration)
        {
            _context = context;
            _mapper = mapper;
            _helper = new GuidHelper();
            _configuration = configuration;
            _checkContent = new CheckingBadWord();
        }
        public async Task<Result<UpdateGroupSharePostCommandResult>> Handle(UpdateGroupSharePostCommand request, CancellationToken cancellationToken)
        {
            if (_context == null)
            {
                throw new ErrorException(StatusCodeEnum.Context_Not_Found);
            }

            var GroupSharePost = await _context.GroupSharePosts.FindAsync(request.GroupSharePostId);
            if (GroupSharePost == null)
            {
                throw new ErrorException(StatusCodeEnum.UP02_Post_Not_Found);
            }
            var userId = await _context.GroupSharePosts
                                      .Where(a => a.GroupSharePostId == request.GroupSharePostId)
                                      .Select(a => a.UserId)
                                      .FirstOrDefaultAsync();

            if (request.UserId != userId)
            {
                throw new ErrorException(StatusCodeEnum.UP03_Not_Authorized);
            }

            var photoPost = _context.GroupSharePosts.Where(x => x.GroupSharePostId == request.GroupSharePostId).FirstOrDefault();
            if (photoPost != null) 
            {
                photoPost.Content = request.Content;
                photoPost.IsBanned = false;
            }
            List<CheckingBadWord.BannedWord> haveBadWord = _checkContent.Compare2String(photoPost.Content);
            if (haveBadWord.Any())
            {
                photoPost.IsBanned = true;
                photoPost.Content = MarkBannedWordsInContent(photoPost.Content, haveBadWord);
            }
            await _context.SaveChangesAsync();

            var result = _mapper.Map<UpdateGroupSharePostCommandResult>(photoPost);
            result.BannedWords = new List<BannedWord>();
            result.BannedWords = haveBadWord;
            if (haveBadWord.Any())
            {
                throw new ErrorException(StatusCodeEnum.UP01_Post_Have_Bad_Word);
            }
            else
            {
                return Result<UpdateGroupSharePostCommandResult>.Success(result);
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

