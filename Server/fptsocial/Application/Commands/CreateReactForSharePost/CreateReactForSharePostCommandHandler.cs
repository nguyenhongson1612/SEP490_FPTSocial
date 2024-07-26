using Application.Commands.CreateReactUserPost;
using AutoMapper;
using Core.CQRS;
using Core.CQRS.Command;
using Core.Helper;
using Domain.CommandModels;
using Domain.Enums;
using Domain.Exceptions;
using Domain.QueryModels;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Query;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Commands.CreateReactForSharePost
{
    public class CreateReactForSharePostCommandHandler : ICommandHandler<CreateReactForSharePostCommand, CreateReactForSharePostCommandResult>
    {
        private readonly fptforumCommandContext _context;
        private readonly fptforumQueryContext _queryContext;
        private readonly IMapper _mapper;
        private readonly GuidHelper _helper;

        public CreateReactForSharePostCommandHandler(fptforumCommandContext context, fptforumQueryContext querycontext, IMapper mapper)
        {
            _context = context;
            _queryContext = querycontext;
            _mapper = mapper;
            _helper = new GuidHelper();
        }
        public async Task<Result<CreateReactForSharePostCommandResult>> Handle(CreateReactForSharePostCommand request, CancellationToken cancellationToken)
        {
            if (_context == null)
            {
                throw new ErrorException(StatusCodeEnum.Context_Not_Found);
            }

            // 1. Check for Existing Reaction
            var existingReact = await _queryContext.ReactSharePosts
                .FirstOrDefaultAsync(r => r.SharePostId == request.SharePostId && r.UserId == request.UserId, cancellationToken);
            //var postReactCount = await _context.PostReactCounts
            //    .FirstOrDefaultAsync(prc => prc.UserPostId == request.UserPostId);

            Domain.CommandModels.ReactSharePost reactPost = new Domain.CommandModels.ReactSharePost();
            if (existingReact != null)
            {
                // 2. Handle Existing Reaction (Update or Remove)
                if (existingReact.ReactTypeId == request.ReactTypeId)
                {
                    // User clicked the same react type again -> Remove it
                    var commandReact = ModelConverter.Convert<Domain.QueryModels.ReactSharePost, Domain.CommandModels.ReactSharePost>(existingReact);
                    _context.ReactSharePosts.Remove(commandReact);
                }
                else
                {
                    // User changed react type -> Update
                    existingReact.ReactTypeId = request.ReactTypeId;
                    existingReact.CreateDate = DateTime.Now; // Optionally update timestamp
                    var commandReact = ModelConverter.Convert<Domain.QueryModels.ReactSharePost, Domain.CommandModels.ReactSharePost>(existingReact);
                    _context.ReactSharePosts.Update(commandReact);
                }
            }
            else
            {
                // 3. Create New Reaction
                reactPost = new Domain.CommandModels.ReactSharePost
                {
                    ReactSharePostId = _helper.GenerateNewGuid(),
                    SharePostId = request.SharePostId,
                    ReactTypeId = request.ReactTypeId,
                    UserId = request.UserId,
                    CreateDate = DateTime.Now
                };

                await _context.ReactSharePosts.AddAsync(reactPost);
                //if (postReactCount != null)
                //{
                //    postReactCount.ReactCount++;
                //}
            }

            await _context.SaveChangesAsync();

            // 4. Return Result (Consider Adjustments)
            var result = existingReact != null
                ? _mapper.Map<CreateReactForSharePostCommandResult>(existingReact) // If updated/removed
                : _mapper.Map<CreateReactForSharePostCommandResult>(reactPost);   // If newly created

            return Result<CreateReactForSharePostCommandResult>.Success(result);
        }
    }
}
