using Core.CQRS;
using Core.CQRS.Command;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Commands.UserProfile
{
    public class UserProfileCommandHandler :ICommandHandler<UserProfileCommand, List<UserProfileCommandResult>>
    {
        public async Task<Result<List<UserProfileCommandResult>>> Handle(UserProfileCommand request, CancellationToken cancellationToken)
        {
            var result = new List<UserProfileCommandResult>();
            return Result<List<UserProfileCommandResult>>.Success(result);
        }
    }
}
