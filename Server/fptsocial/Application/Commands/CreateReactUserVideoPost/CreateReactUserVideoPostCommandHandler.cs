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

namespace Application.Commands.CreateReactUserVideoPost
{
    public class CreateReactUserVideoPostCommandHandler : ICommandHandler<CreateReactUserVideoPostCommand, CreateReactUserVideoPostCommandResult>
    {
        private readonly fptforumCommandContext _context;
        private readonly IMapper _mapper;
        private readonly GuidHelper _helper;

        public CreateReactUserVideoPostCommandHandler(fptforumCommandContext context, fptforumQueryContext querycontext, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
            _helper = new GuidHelper();
        }

        public async Task<Result<CreateReactUserVideoPostCommandResult>> Handle(CreateReactUserVideoPostCommand request, CancellationToken cancellationToken)
        {
            if (_context == null)
            {
                throw new ErrorException(StatusCodeEnum.Context_Not_Found);
            }
            Domain.CommandModels.ReactVideoPost reactPost = new Domain.CommandModels.ReactVideoPost
            {
                ReactVideoPostId = _helper.GenerateNewGuid(),
                UserPostVideoId = request.UserPostVideoId,
                ReactTypeId = request.ReactTypeId,
                UserId = request.UserId,
                CreatedDate = DateTime.Now
            };

            await _context.ReactVideoPosts.AddAsync(reactPost);
            await _context.SaveChangesAsync();
            var result = _mapper.Map<CreateReactUserVideoPostCommandResult>(reactPost);
            return Result<CreateReactUserVideoPostCommandResult>.Success(result);
        }
    }
}
