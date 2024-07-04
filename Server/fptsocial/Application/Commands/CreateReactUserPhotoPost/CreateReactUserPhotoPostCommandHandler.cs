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

namespace Application.Commands.CreateReactUserPhotoPost
{
    public class CreateReactUserPhotoPostCommandHandler : ICommandHandler<CreateReactUserPhotoPostCommand, CreateReactUserPhotoPostCommandResult>
    {
        private readonly fptforumCommandContext _context;
        private readonly IMapper _mapper;
        private readonly GuidHelper _helper;

        public CreateReactUserPhotoPostCommandHandler(fptforumCommandContext context, fptforumQueryContext querycontext, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
            _helper = new GuidHelper();
        }

        public async Task<Result<CreateReactUserPhotoPostCommandResult>> Handle(CreateReactUserPhotoPostCommand request, CancellationToken cancellationToken)
        {
            if (_context == null)
            {
                throw new ErrorException(StatusCodeEnum.Context_Not_Found);
            }
            Domain.CommandModels.ReactPhotoPost reactPost = new Domain.CommandModels.ReactPhotoPost
            {
                ReactPhotoPostId = _helper.GenerateNewGuid(),
                UserPostPhotoId = request.UserPostPhotoId,
                ReactTypeId = request.ReactTypeId,
                UserId = request.UserId,
                CreatedDate = DateTime.Now
            };

            await _context.ReactPhotoPosts.AddAsync(reactPost);
            await _context.SaveChangesAsync();
            var result = _mapper.Map<CreateReactUserPhotoPostCommandResult>(reactPost);
            return Result<CreateReactUserPhotoPostCommandResult>.Success(result);
        }
    }
}
