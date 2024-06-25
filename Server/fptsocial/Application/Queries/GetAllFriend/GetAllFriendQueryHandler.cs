using Application.DTO.FriendDTO;
using AutoMapper;
using Core.CQRS;
using Core.CQRS.Query;
using Domain.Enums;
using Domain.Exceptions;
using Domain.QueryModels;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Queries.GetAllFriend
{
    public class GetAllFriendQueryHandler : IQueryHandler<GetAllFriendQuery, GetAllFriendQueryResult>
    {
        private readonly fptforumQueryContext _context;
        private readonly IMapper _mapper;

        public GetAllFriendQueryHandler(fptforumQueryContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }
        public async Task<Result<GetAllFriendQueryResult>> Handle(GetAllFriendQuery request, CancellationToken cancellationToken)
        {
            if (_context == null)
            {
                throw new ErrorException(StatusCodeEnum.Context_Not_Found);
            }
            var listfriend = await _context.Friends.Include(x=>x.FriendNavigation).Where(x => x.UserId == request.UserId && x.Confirm == true).ToListAsync();

            var result = new GetAllFriendQueryResult();
            if(listfriend != null)
            {
                result.Count = listfriend.Count;
                foreach (var friend in listfriend)
                {
                    var otherfriend = _context.Friends.Where(x => x.UserId == friend.UserId && x.Confirm == true);
                    var mutualfriend = otherfriend.Intersect(listfriend);
                    var frienddto = new GetAllFriendDTO
                    {
                        FriendId = friend.FriendId,
                        FriendName = friend.FriendNavigation.FirstName + " " + friend.FriendNavigation.LastName,
                        ReactCount = friend.ReactCount,
                        MutualFriends = mutualfriend.Count()
                    };
                    result.AllFriend.Add(frienddto);
                }
                result.AllFriend.OrderByDescending(x => x.ReactCount).OrderByDescending(x => x.MutualFriends);
            }
            else
            {
                result.Count = 0;
            }

            return Result<GetAllFriendQueryResult>.Success(result);
        }
    }
}
