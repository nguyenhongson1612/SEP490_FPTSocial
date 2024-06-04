using AutoMapper;
using Core.CQRS;
using Core.CQRS.Command;
using Domain.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Commands.UserProfile
{
    public class UserProfileCommandHandler : ICommandHandler<UserProfileCommand, UserProfileCommandResult>
    {
        private readonly fptforumContext _context;
        private readonly IMapper _mapper;

        public UserProfileCommandHandler(fptforumContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public async Task<Result<UserProfileCommandResult>> Handle(UserProfileCommand request, CancellationToken cancellationToken)
        {
            var user = _context.UserProfiles.FirstOrDefault(x => x.UserNumber == request.UserNumber);
            if(user == null)
            {
                throw new Exception("can not find user");
            }
            var result = _mapper.Map<UserProfileCommandResult>(user);
            return Result<UserProfileCommandResult>.Success(result);
        }
    }
}
