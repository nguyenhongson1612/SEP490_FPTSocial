﻿using Application.Commands.CreateUserCommentVideoPost;
using Application.Commands.CreateUserGender;
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

namespace Application.Commands.CreateUserCommentGroupPost
{
    public class CreateUserCommentGroupPostCommandHandler : ICommandHandler<CreateUserCommentGroupPostCommand, CreateUserCommentGroupPostCommandResult>
    {
        private readonly fptforumCommandContext _context;
        private readonly fptforumQueryContext _queryContext;
        private readonly IMapper _mapper;
        private readonly GuidHelper _helper;
        private readonly IConfiguration _configuration;
        private readonly CheckingBadWord _checkContent;

        public CreateUserCommentGroupPostCommandHandler(fptforumCommandContext context, fptforumQueryContext queryContext, IMapper mapper, IConfiguration configuration)
        {
            _context = context;
            _queryContext = queryContext;
            _mapper = mapper;
            _helper = new GuidHelper();
            _configuration = configuration;
            _checkContent = new CheckingBadWord();
        }

        public async Task<Result<CreateUserCommentGroupPostCommandResult>> Handle(CreateUserCommentGroupPostCommand request, CancellationToken cancellationToken)
        {
            // Check if the context is null
            if (_context == null || _queryContext == null)
            {
                throw new ErrorException(StatusCodeEnum.Context_Not_Found);
            }

            // Check if the request content is null or whitespace
            if (string.IsNullOrWhiteSpace(request.Content))
            {
                throw new ErrorException(StatusCodeEnum.CM01_Comment_Not_Null);
            }

            int levelCmt = 1;
            string listNumber = null;
            var postReactCount = await _queryContext.GroupPostReactCounts.Where(prc => prc.GroupPostId == request.GroupPostId).FirstOrDefaultAsync();

            // If the request has a ParentCommentId, find the parent comment
            if (request.ParentCommentId.HasValue)
            {
                var parentComment = await _queryContext.CommentGroupPosts.FindAsync(request.ParentCommentId.Value);

                // Check if the parent comment exists
                if (parentComment == null || parentComment.IsHide == true)
                {
                    throw new ErrorException(StatusCodeEnum.CM02_Parent_Comment_Not_Found);
                }

                // Determine the level of the comment based on the parent comment's level
                if (parentComment.LevelCmt == 1)
                {
                    levelCmt = 2;
                }
                else if (parentComment.LevelCmt == 2)
                {
                    listNumber = parentComment.CommentGroupPostId.ToString();
                    levelCmt = 3;
                }
                else if (parentComment.LevelCmt == 3)
                {
                    listNumber = parentComment.ListNumber;
                    levelCmt = 3;
                }
            }

            // Create a new comment
            Domain.CommandModels.CommentGroupPost comment = new Domain.CommandModels.CommentGroupPost
            {
                CommentGroupPostId = _helper.GenerateNewGuid(),
                GroupPostId = request.GroupPostId,
                UserId = request.UserId,
                Content = request.Content,
                ParentCommentId = request.ParentCommentId,
                IsHide = false,
                CreatedDate = DateTime.Now,
                LevelCmt = levelCmt,
                ListNumber = listNumber
            };

            // Check for banned words in the content
            List<CheckingBadWord.BannedWord> badWords = _checkContent.Compare2String(comment.Content);
            if (badWords.Any())
            {
                comment.IsHide = true;
            }

            if (postReactCount != null)
            {
                postReactCount.CommentCount++;
            }

            // Add the comment to the context and save changes
            var prc = new Domain.CommandModels.GroupPostReactCount
            {
                GroupPostReactCountId = postReactCount.GroupPostReactCountId,
                GroupPostId = postReactCount.GroupPostId,
                GroupPostPhotoId = postReactCount.GroupPostPhotoId,
                ReactCount = postReactCount.ReactCount,
                CommentCount = postReactCount.CommentCount,
                ShareCount = postReactCount.ShareCount,
            };
            _context.GroupPostReactCounts.Update(prc);
            await _context.CommentGroupPosts.AddAsync(comment);
            await _context.SaveChangesAsync();

            // Map the comment to the result object
            var result = _mapper.Map<CreateUserCommentGroupPostCommandResult>(comment);
            result.BannedWords = badWords;
            if(badWords.Any())
            {
                throw new ErrorException(StatusCodeEnum.CM03_Comment_Contain_Bad_Word);
            }
            // Return the result
            return Result<CreateUserCommentGroupPostCommandResult>.Success(result);
        }
    }
}
