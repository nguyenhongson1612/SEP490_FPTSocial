﻿using Application.Commands.CreateUserCommentPost;
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

namespace Application.Commands.UpdateCommentGroupPhotoPost
{
    public class UpdateCommentGroupPhotoPostCommandHandler : ICommandHandler<UpdateCommentGroupPhotoPostCommand, UpdateCommentGroupPhotoPostCommandResult>
    {
        private readonly fptforumCommandContext _context;
        private readonly fptforumQueryContext _querycontext;
        private readonly IMapper _mapper;
        private readonly GuidHelper _helper;
        private readonly IConfiguration _configuration;
        private readonly CheckingBadWord _checkContent;

        public UpdateCommentGroupPhotoPostCommandHandler(fptforumCommandContext context, fptforumQueryContext querycontext, IMapper mapper, IConfiguration configuration)
        {
            _context = context;
            _querycontext = querycontext;
            _mapper = mapper;
            _helper = new GuidHelper();
            _configuration = configuration;
            _checkContent = new CheckingBadWord();
        }

        public async Task<Result<UpdateCommentGroupPhotoPostCommandResult>> Handle(UpdateCommentGroupPhotoPostCommand request, CancellationToken cancellationToken)
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
            var GroupPhotoPost = await _querycontext.CommentPhotoGroupPosts.FindAsync(request.CommentPhotoGroupPostId);
            if (GroupPhotoPost == null)
            {
                throw new ErrorException(StatusCodeEnum.CM04_Comment_Not_Found);
            }

            if (request.UserId != GroupPhotoPost.UserId)
            {
                throw new ErrorException(StatusCodeEnum.UP03_Not_Authorized);
            }

            var comment = await _querycontext.CommentPhotoGroupPosts.Where(x => x.CommentPhotoGroupPostId == request.CommentPhotoGroupPostId).FirstOrDefaultAsync();
            List<CheckingBadWord.BannedWord> bannedWords = _checkContent.Compare2String(request.Content);

            if (comment != null) 
            {
                comment.Content = request.Content;
                if (bannedWords.Any())
                {
                    comment.IsHide = true;
                }
            }
            var cpgp = ModelConverter.Convert<Domain.QueryModels.CommentPhotoGroupPost, Domain.CommandModels.CommentPhotoGroupPost>(comment);
            _context.CommentPhotoGroupPosts.Update(cpgp);
            await _context.SaveChangesAsync();
            var result = _mapper.Map<UpdateCommentGroupPhotoPostCommandResult>(comment);
            result.BannedWords = bannedWords;
            if (bannedWords.Any())
            {
                throw new ErrorException(StatusCodeEnum.CM03_Comment_Contain_Bad_Word);
            }
            // Return the result
            return Result<UpdateCommentGroupPhotoPostCommandResult>.Success(result);

        }
    }
}
