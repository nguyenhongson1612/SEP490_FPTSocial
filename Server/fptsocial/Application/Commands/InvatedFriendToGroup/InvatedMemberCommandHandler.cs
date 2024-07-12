using Application.Commands.JoinGroupCommand;
using AutoMapper;
using Core.CQRS;
using Core.CQRS.Command;
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

namespace Application.Commands.InvatedFriendToGroup
{
    public class InvatedMemberCommandHandler : ICommandHandler<InvatedMemberCommand, InvatedMemberCommandResult>
    {
        private readonly fptforumCommandContext _context;
        private readonly fptforumQueryContext _querycontext;


        public InvatedMemberCommandHandler(fptforumCommandContext context, fptforumQueryContext querycontext, IMapper mapper)
        {
            _context = context;
            _querycontext = querycontext;

        }
        public async Task<Result<InvatedMemberCommandResult>> Handle(InvatedMemberCommand request, CancellationToken cancellationToken)
        {
            if (_context == null || _querycontext == null)
            {
                throw new ErrorException(StatusCodeEnum.Context_Not_Found);
            }
            var admin = await _querycontext.GroupRoles.FirstOrDefaultAsync(x => x.GroupRoleName.Equals("Admin"));
            var censor = await _querycontext.GroupRoles.FirstOrDefaultAsync(x => x.GroupRoleName.Equals("Censor"));
            var member = await _querycontext.GroupRoles.FirstOrDefaultAsync(x => x.GroupRoleName.Equals("Member"));
            var getrole = await _querycontext.GroupMembers.FirstOrDefaultAsync(x => x.GroupId == request.GroupId && x.UserId == request.UserId);
            var memjoin = await _querycontext.GroupMembers.FirstOrDefaultAsync(x => x.UserId == request.MemberId && x.GroupId == request.GroupId);
            var friend = await _querycontext.Friends.FirstOrDefaultAsync(x => x.Confirm == true &&
                                                                            ((x.UserId == request.UserId && x.FriendId == request.MemberId)
                                                                            || (x.UserId == request.MemberId && x.FriendId == request.UserId)));
            if (getrole.GroupRoleId != admin.GroupRoleId || getrole.GroupRoleId != censor.GroupRoleId)
            {
                throw new ErrorException(StatusCodeEnum.GR11_Not_Permission);
            }
            if(memjoin != null)
            {
                throw new ErrorException(StatusCodeEnum.GR12_Is_Request);

            }
            if(friend == null)
            {
                throw new ErrorException(StatusCodeEnum.GR13_Can_Not_Invated);
            }
            var result = new InvatedMemberCommandResult();
            var requestJoin = new Domain.CommandModels.GroupMember
            {
                GroupId = request.GroupId,
                UserId = (Guid)request.MemberId,
                GroupRoleId = member.GroupRoleId,
                IsJoined = false,
                JoinedDate = DateTime.Now,

            };
            await _context.GroupMembers.AddAsync(requestJoin);
            await _context.SaveChangesAsync();
            result.Message = "Invated friend join to group success!";
            result.Invated = true;
            result.MemberId = request.MemberId;
            return Result<InvatedMemberCommandResult>.Success(result);

        }
    }
}
