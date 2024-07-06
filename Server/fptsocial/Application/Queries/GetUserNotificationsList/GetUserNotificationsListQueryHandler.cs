using Application.DTO.GetUserProfileDTO;
using Application.Queries.GetGender;
using Application.Queries.GetUserPost;
using Application.Queries.GetUserProfile;
using AutoMapper;
using Core.CQRS;
using Core.CQRS.Query;
using Domain.CommandModels;
using Domain.Enums;
using Domain.Exceptions;
using Domain.Extensions;
using Domain.QueryModels;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Query;
using Microsoft.EntityFrameworkCore.Query.Internal;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Queries.GetUserNotificationsList
{
    public class GetUserNotificationsListQueryHandler : IQueryHandler<GetUserNotificationsListQuery, List<GetUserNotificationsListQueryResult>>
    {
        private readonly fptforumQueryContext _context;
        private readonly IMapper _mapper;
        private readonly SplitString _splitString;

        public GetUserNotificationsListQueryHandler(fptforumQueryContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
            _splitString = new SplitString();
        }

        public async Task<Result<List<GetUserNotificationsListQueryResult>>> Handle(GetUserNotificationsListQuery request, CancellationToken cancellationToken)
        {
            if (_context == null)
            {
                throw new ErrorException(StatusCodeEnum.Context_Not_Found);
            }
            List<Domain.QueryModels.Notification> notifys = await _context.Notifications
                                    .Include(x => x.NotificationType)
                                    .Where(x => x.UserId.Equals(request.UserId))
                                    .ToListAsync(cancellationToken);
            List<GetUserNotificationsListQueryResult> result = new();
            if (notifys == null)
            {
                throw new ErrorException(StatusCodeEnum.N01_Not_Found);
            }
            else
            {
                foreach (var notify in notifys)
                {
                    var senderName = _splitString.SplitStringForNotify(notify.NotiMessage).First();
                    var msg = _splitString.SplitStringForNotify(notify.NotiMessage).Last();
                    var mapgender = _mapper.Map<GetUserNotificationsListQueryResult>(notify);
                    mapgender.SenderName = senderName;
                    mapgender.NotiMessage = msg;
                    result.Add(mapgender);
                }
            }

            return Result<List<GetUserNotificationsListQueryResult>>.Success(result);
        }
    }
}
