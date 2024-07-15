using Application.Commands.CreateUserCommentPost;
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

namespace Application.Commands.UpdateCommentUserPost
{
    public class UpdateCommentUserPostCommandHandler : ICommandHandler<UpdateCommentUserPostCommand, UpdateCommentUserPostCommandResult>
    {
        private readonly fptforumCommandContext _context;
        private readonly IMapper _mapper;
        private readonly GuidHelper _helper;
        private readonly IConfiguration _configuration;
        private readonly CheckingBadWord _checkContent;

        public UpdateCommentUserPostCommandHandler(fptforumCommandContext context, IMapper mapper, IConfiguration configuration)
        {
            _context = context;
            _mapper = mapper;
            _helper = new GuidHelper();
            _configuration = configuration;
            _checkContent = new CheckingBadWord();
        }

        public async Task<Result<UpdateCommentUserPostCommandResult>> Handle(UpdateCommentUserPostCommand request, CancellationToken cancellationToken)
        {
            // Check if the context is null
            if (_context == null)
            {
                throw new ErrorException(StatusCodeEnum.Context_Not_Found);
            }

            // Check if the request content is null or whitespace
            if (string.IsNullOrWhiteSpace(request.Content))
            {
                throw new ErrorException(StatusCodeEnum.CM01_Comment_Not_Null);
            }
            var userPost = await _context.CommentPosts.FindAsync(request.CommentId);
            if (userPost == null)
            {
                throw new ErrorException(StatusCodeEnum.CM04_Comment_Not_Found);
            }

            if (request.UserId != userPost.UserId)
            {
                throw new ErrorException(StatusCodeEnum.UP03_Not_Authorized);
            }

            var comment = await _context.CommentPosts.Where(x => x.CommentId == request.CommentId).FirstOrDefaultAsync();
            List<CheckingBadWord.BannedWord> bannedWords = _checkContent.Compare2String(request.Content);

            if (comment != null) 
            {
                comment.Content = request.Content;
                if (bannedWords.Any())
                {
                    comment.IsHide = true;
                }
            }
            var result = _mapper.Map<UpdateCommentUserPostCommandResult>(comment);
            result.BannedWords = bannedWords;
            if (bannedWords.Any())
            {
                throw new ErrorException(StatusCodeEnum.CM03_Comment_Contain_Bad_Word);
            }
            // Return the result
            return Result<UpdateCommentUserPostCommandResult>.Success(result);

        }
    }
}
