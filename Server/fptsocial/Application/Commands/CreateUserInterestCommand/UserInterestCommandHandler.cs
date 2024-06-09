using AutoMapper;
using Core.CQRS;
using Core.CQRS.Command;
using Domain.Models;
using Domain.Exceptions;
using Domain.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Application.DTO.CreateUserDTO;
using Application.Commands.CreateUserInterest;
using Core.Helper;

namespace Application.Commands.CreateUserInterest
{
    public class UserInterestCommandHandler : ICommandHandler<UserInterestCommand, UserInterestCommandResult>
    {
        private readonly fptforumContext _context;
        private readonly IMapper _mapper;
        private readonly GuidHelper _helper;

        public UserInterestCommandHandler(fptforumContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
            _helper = new GuidHelper();
        }

        public async Task<Result<UserInterestCommandResult>> Handle(UserInterestCommand request, CancellationToken cancellationToken)
        {
            if(_context == null)
            {
                throw new ErrorException(StatusCodeEnum.Context_Not_Found);
            }
            var user = _context.UserProfiles.FirstOrDefault(x => x.UserId == request.UserId);
            var interest = _context.Interests.FirstOrDefault(x => x.InterestId == request.InterestId);
            if(user == null || interest == null)
            {
                throw new ErrorException(StatusCodeEnum.U01_Not_Found);
            }
            var UserInterest = new UserInterest
            {
                UserInterestId = _helper.GenerateNewGuid(),
                InterestId = request.InterestId,
                UserId = request.UserId,
                UserStatusId =request.UserStatusId,
                CreatedAt = DateTime.Now,
                UpdatedAt = DateTime.Now
            };
            

            await _context.UserInterests.AddAsync(UserInterest);
            await _context.SaveChangesAsync();
            var result = _mapper.Map<UserInterestCommandResult>(UserInterest);
            return Result<UserInterestCommandResult>.Success(result); 
        }
    }
}
