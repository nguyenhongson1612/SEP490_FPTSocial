using Application.DTO.FriendDTO;
using Application.Queries.GetAllFriend;
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

namespace Application.Queries.GetAllFriendOtherProfiel
{
    public class GetAllFriendOtherProfileQueryHandler : IQueryHandler<GetAllFriendOtherProfileQuery, GetAllFriendOtherProfileQueryResult>
    {
        private readonly fptforumQueryContext _context;
        private readonly IMapper _mapper;

        public GetAllFriendOtherProfileQueryHandler(fptforumQueryContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }
        public async Task<Result<GetAllFriendOtherProfileQueryResult>> Handle(GetAllFriendOtherProfileQuery request, CancellationToken cancellationToken)
        {
            if (_context == null)
            {
                throw new ErrorException(StatusCodeEnum.Context_Not_Found);
            }
            var getusersetting = await _context.UserSettings.Include(x => x.Setting).Where(x => x.UserId == request.ViewUserId).ToListAsync();
            var getuser = await _context.UserProfiles
                                .Include(x => x.UserSettings)
                                .FirstOrDefaultAsync(x => x.UserId == request.ViewUserId);
            var listfriend = await _context.Friends.Include(x => x.FriendNavigation).Include(x=>x.User).ThenInclude(x => x.AvataPhotos).Where(x => x.UserId == request.ViewUserId && x.Confirm == true).ToListAsync();
            var listmyfriend = await _context.Friends.Include(x => x.FriendNavigation).Where(x => x.UserId == request.UserId && x.Confirm == true).ToListAsync();
            var getstatus = await _context.UserStatuses.ToListAsync();
            var result = new GetAllFriendOtherProfileQueryResult();
            if (getusersetting.FirstOrDefault(x => x.Setting.SettingName.Equals("Profile Status")).UserStatusId
               == getstatus.FirstOrDefault(x => x.StatusName == "Private").UserStatusId)
            {
                result = null;
                return Result<GetAllFriendOtherProfileQueryResult>.Success(result);
            }
            if (listfriend != null)
            {
                result.Count = listfriend.Count;
                foreach (var friend in listfriend)
                {
                    var otherfriend = _context.Friends.Where(x => x.UserId == friend.UserId && x.Confirm == true);
                    var mutualfriend = otherfriend.Intersect(listmyfriend);
                    var frienddto = new GetAllFriendDTO
                    {
                        FriendId = friend.FriendId,
                        FriendName = friend.FriendNavigation.FirstName + " " + friend.FriendNavigation.LastName,
                        ReactCount = friend.ReactCount,
                        Avata = friend.User.AvataPhotos.FirstOrDefault(x => x.IsUsed == true).AvataPhotosUrl,
                        MutualFriends = mutualfriend.Count()
                    };
                    if (friend.User.AvataPhotos.Count > 0)
                    {
                        frienddto.Avata = friend.User.AvataPhotos.FirstOrDefault(x => x.IsUsed == true).AvataPhotosUrl;
                    }
                    result.AllFriend.Add(frienddto);
                }
                result.AllFriend.OrderByDescending(x => x.ReactCount).OrderByDescending(x => x.MutualFriends);
            }
            else
            {
                result.Count = 0;
            }

            return Result<GetAllFriendOtherProfileQueryResult>.Success(result);
        }
    }
}
