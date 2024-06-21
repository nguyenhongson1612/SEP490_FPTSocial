using AutoMapper;
using Core.CQRS;
using Core.CQRS.Command;
using Core.Helper;
using Domain.CommandModels;
using Domain.Enums;
using Domain.Exceptions;
using Domain.Extensions;
using Domain.QueryModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Commands.FriendStatusCommand
{
    public class FriendStatusCommandHandler : ICommandHandler<FriendStatusCommand, FriendStatusCommandResult>
    {
        private readonly fptforumCommandContext _context;
        private readonly fptforumQueryContext _querycontext;
        private readonly IMapper _mapper;
        private readonly GuidHelper _helper;

        public FriendStatusCommandHandler(fptforumCommandContext context, fptforumQueryContext querycontext, IMapper mapper)
        {
            _context = context;
            _querycontext = querycontext;
            _mapper = mapper;
            _helper = new GuidHelper();
        }
        public async Task<Result<FriendStatusCommandResult>> Handle(FriendStatusCommand request, CancellationToken cancellationToken)
        {
            if (_context == null || _querycontext == null)
            {
                throw new ErrorException(StatusCodeEnum.Context_Not_Found);
            }
            var result = new FriendStatusCommandResult();
            if (request.Confirm != null)
            {
                var friend = _querycontext.Friends.FirstOrDefault(x => (x.UserId == request.UserId && x.FriendId == request.FriendId) 
                                                    || (x.FriendId == request.UserId && x.UserId == request.FriendId));
                var newfriend = new Domain.CommandModels.Friend 
                {
                   UserId = friend.UserId,
                   FriendId = friend.FriendId,
                   Confirm = true,
                };
                _context.Friends.Update(newfriend);
                result.UserId = newfriend.UserId;
                result.FriendId = newfriend.FriendId;
                result.Confirm = newfriend.Confirm;
                result.Status = StatusCodeEnum.FR02_Accept_Friend.ToString().Split("_")[0];
                result.Message = StatusCodeEnum.FR02_Accept_Friend.GetDescription();
            }
            else if(request.Cancle!= null)
            {
                var friend = _querycontext.Friends.FirstOrDefault(x => (x.UserId == request.UserId && x.FriendId == request.FriendId)
                                                    || (x.FriendId == request.UserId && x.UserId == request.FriendId));
                var canclefriend = new Domain.CommandModels.Friend
                {
                    UserId = friend.UserId,
                    FriendId = friend.FriendId,
                    Confirm = friend.Confirm,
                };
                _context.Friends.Remove(canclefriend);
                result.UserId = canclefriend.UserId;
                result.FriendId = canclefriend.FriendId;
                result.Confirm = canclefriend.Confirm;
                result.Status = StatusCodeEnum.FR03_Cancle_Friend.ToString().Split("_")[0];
                result.Message = StatusCodeEnum.FR03_Cancle_Friend.GetDescription();
            }
            else if(request.Reject != null)
            {
                var friend = _querycontext.Friends.FirstOrDefault(x => (x.UserId == request.UserId && x.FriendId == request.FriendId)
                                                                    || (x.FriendId == request.UserId && x.UserId == request.FriendId));
                var rejectfriend = new Domain.CommandModels.Friend
                {
                    UserId = friend.UserId,
                    FriendId = friend.FriendId,
                    Confirm = friend.Confirm,
                };
                _context.Friends.Remove(rejectfriend);
                result.UserId = rejectfriend.UserId;
                result.FriendId = rejectfriend.FriendId;
                result.Confirm = rejectfriend.Confirm;
                result.Status = StatusCodeEnum.FR04_Reject_Friend.ToString().Split("_")[0];
                result.Message = StatusCodeEnum.FR04_Reject_Friend.GetDescription();
            }
            return Result<FriendStatusCommandResult>.Success(result);
        }
    }
}
