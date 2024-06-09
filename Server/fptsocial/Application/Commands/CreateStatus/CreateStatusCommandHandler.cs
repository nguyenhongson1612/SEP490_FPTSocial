using AutoMapper;
using Core.CQRS;
using Core.CQRS.Command;
using Core.Helper;
using Domain.Enums;
using Domain.Exceptions;
using Domain.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Commands.CreateStatus
{
    public class CreateStatusCommandHandler : ICommandHandler<CreateStatusCommand, CreateStatusCommandResult>
    {

        private readonly fptforumContext _context;
        private readonly IMapper _mapper;
        private readonly GuidHelper _helper;

        public CreateStatusCommandHandler(fptforumContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
            _helper = new GuidHelper();
        }
        public async Task<Result<CreateStatusCommandResult>> Handle(CreateStatusCommand request, CancellationToken cancellationToken)
        {
            if (_context == null)
            {
                throw new ErrorException(StatusCodeEnum.Context_Not_Found);
            }
            var status = await _context.UserStatuses.FirstOrDefaultAsync(x => x.StatusName.Equals(request.StatusName));
            if(status != null)
            {
                throw new ErrorException(StatusCodeEnum.ST02_Status_Existed);
            }

            var newstatus = new UserStatus {
                UserStatusId = _helper.GenerateNewGuid(),
                StatusName = request.StatusName,
                CreatedAt = DateTime.Now
                
            };
            await _context.UserStatuses.AddAsync(newstatus);
            await _context.SaveChangesAsync();
            var result = _mapper.Map<CreateStatusCommandResult>(newstatus);
            return Result<CreateStatusCommandResult>.Success(result);
        }
    }
}
