﻿using Application.Commands.CreateUserCommentPost;
using Application.Services;
using AutoMapper;
using Core.CQRS;
using Core.CQRS.Command;
using Core.Helper;
using Domain.CommandModels;
using Domain.Enums;
using Domain.Exceptions;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Commands.CreateUserCommentPhotoPost
{
    public class CreateUserCommentPhotoPostCommandHandler : ICommandHandler<CreateUserCommentPhotoPostCommand, CreateUserCommentPhotoPostCommandResult>
    {
        private readonly fptforumCommandContext _context;
        private readonly IMapper _mapper;
        private readonly GuidHelper _helper;
        private readonly IConfiguration _configuration;
        private readonly CheckingBadWord _checkContent;

        public CreateUserCommentPhotoPostCommandHandler(fptforumCommandContext context, IMapper mapper, IConfiguration configuration)
        {
            _context = context;
            _mapper = mapper;
            _helper = new GuidHelper();
            _configuration = configuration;
            _checkContent = new CheckingBadWord();
        }

        public async Task<Result<CreateUserCommentPhotoPostCommandResult>> Handle(CreateUserCommentPhotoPostCommand request, CancellationToken cancellationToken)
        {
            if (_context == null)
            {
                throw new ErrorException(StatusCodeEnum.Context_Not_Found);
            }
            if (request.Content == null || request.Content == "")
            {
                throw new ErrorException(StatusCodeEnum.CM01_Comment_Not_Null);
            }
            Domain.CommandModels.CommentPhotoPost comment = new Domain.CommandModels.CommentPhotoPost
            {
                CommentPhotoPostId = _helper.GenerateNewGuid(),
                UserPostPhotoId = request.UserPostPhotoId,
                UserId = request.UserId,
                Content = request.Content,
                ParentCommentId = request.ParentCommentId,
                IsHide = false,
                CreatedDate = DateTime.Now
            };
            List<CheckingBadWord.BannedWord> BadWords = _checkContent.Compare2String(comment.Content);
            if (BadWords.Any())
            {
                comment.IsHide = true;
            }
            await _context.CommentPhotoPosts.AddAsync(comment);
            await _context.SaveChangesAsync();
            var result = _mapper.Map<CreateUserCommentPhotoPostCommandResult>(comment);
            result.BannedWords = BadWords;
            return Result<CreateUserCommentPhotoPostCommandResult>.Success(result);
        }


    }
}
