using Application.Commands.CreateInterest;
using AutoMapper;
using Core.CQRS;
using Core.CQRS.Command;
using Core.Helper;
using Domain.CommandModels;
using Domain.Enums;
using Domain.Exceptions;
using Domain.QueryModels;
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
            Domain.CommandModels.ReactPost reactPost = new Domain.CommandModels.ReactPost
            {
                ReactPostId = _helper.GenerateNewGuid(),
                UserPostId = request.UserPostId,
                ReactTypeId = request.ReactTypeId,
                UserId = request.UserId,
                CreatedDate = DateTime.Now
            };

            await _context.ReactPosts.AddAsync(reactPost);
            await _context.SaveChangesAsync();
            var result = _mapper.Map<CreateReactUserPostCommandResult>(reactPost);
            return Result<CreateReactUserPostCommandResult>.Success(result);
        }
    }
}
