using Application.Commands.CreateInterest;
using AutoMapper;
using Core.CQRS;
using Core.CQRS.Command;
using Core.Helper;
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

namespace Application.Commands.CreateReactUserPost
{
    public class CreateReactUserPostCommandHandler : ICommandHandler<CreateReactUserPostCommand, CreateReactUserPostCommandResult>
    {
        private readonly fptforumCommandContext _context;
        private readonly IMapper _mapper;
        private readonly GuidHelper _helper;

        public CreateReactUserPostCommandHandler(fptforumCommandContext context, fptforumQueryContext querycontext, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
            _helper = new GuidHelper();
        }

        public async Task<Result<CreateReactUserPostCommandResult>> Handle(CreateReactUserPostCommand request, CancellationToken cancellationToken)
        {
            if (_context == null)
            {
                throw new ErrorException(StatusCodeEnum.Context_Not_Found);
            }

            // 1. Check for Existing Reaction
            var existingReact = await _context.ReactPosts
                .FirstOrDefaultAsync(r => r.UserPostId == request.UserPostId && r.UserId == request.UserId, cancellationToken);
            var postReactCount = await _context.PostReactCounts
                .FirstOrDefaultAsync(prc => prc.UserPostId == request.UserPostId);
            if (postReactCount == null) 
            { 
                
            }
            Domain.CommandModels.ReactPost reactPost = new Domain.CommandModels.ReactPost();
            if (existingReact != null)
            {
                // 2. Handle Existing Reaction (Update or Remove)
                if (existingReact.ReactTypeId == request.ReactTypeId)
                {
                    // User clicked the same react type again -> Remove it
                    _context.ReactPosts.Remove(existingReact);
                    if (postReactCount != null)
                    {
                        postReactCount.ReactCount--;

                        if (postReactCount.ReactCount < 0)
                        {
                            postReactCount.ReactCount = 0; 
                        }
                    }
                }
                else
                {
                    // User changed react type -> Update
                    existingReact.ReactTypeId = request.ReactTypeId;
                    existingReact.CreatedDate = DateTime.Now; // Optionally update timestamp
                }
            }
            else
            {
                // 3. Create New Reaction
                reactPost = new Domain.CommandModels.ReactPost
                {
                    ReactPostId = _helper.GenerateNewGuid(),
                    UserPostId = request.UserPostId,
                    ReactTypeId = request.ReactTypeId,
                    UserId = request.UserId,
                    CreatedDate = DateTime.Now
                };

                await _context.ReactPosts.AddAsync(reactPost);
                if (postReactCount != null)
                {
                    postReactCount.ReactCount++;
                }
            }

            await _context.SaveChangesAsync();

            // 4. Return Result (Consider Adjustments)
            var result = existingReact != null
                ? _mapper.Map<CreateReactUserPostCommandResult>(existingReact) // If updated/removed
                : _mapper.Map<CreateReactUserPostCommandResult>(reactPost);   // If newly created

            return Result<CreateReactUserPostCommandResult>.Success(result);
        }

    }
}
