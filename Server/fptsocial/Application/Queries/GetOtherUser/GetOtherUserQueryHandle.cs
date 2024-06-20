using Application.Queries.GetUserByUserId;
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

namespace Application.Queries.GetOtherUser
{
    public class GetOtherUserQueryHandle : IQueryHandler<GetOtherUserQuery, GetOtherUserQueryResult>
    {
        private readonly fptforumQueryContext _context;
        private readonly IMapper _mapper;

        public GetOtherUserQueryHandle(fptforumQueryContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }
        public async Task<Result<GetOtherUserQueryResult>> Handle(GetOtherUserQuery request, CancellationToken cancellationToken)
        {
            if (_context == null)
            {
                throw new ErrorException(StatusCodeEnum.Context_Not_Found);
            }

            var getuser = await _context.UserProfiles
                                .Include(x => x.ContactInfo)
                                .Include(x => x.UserStatus)
                                .Include(x => x.AvataPhotos)
                                .Include(x => x.UserGender)
                                .Include(x => x.WebAffiliations)
                                .Include(x => x.UserSettings)
                                .Include(x => x.Role)
                                .Include(x => x.UserInterests)
                                .Include(x=>x.WorkPlaces)
                                .Include(x => x.UserRelationship)
                                .Include(x=>x.BlockUserUserIsBlockeds)
                                .Include(x=>x.BlockUserUsers)
                                .FirstOrDefaultAsync(x => x.UserId == request.ViewUserId);
            if (getuser == null)
            {
                throw new ErrorException(StatusCodeEnum.U01_Not_Found);
            }

            if (getuser.IsActive == false)
            {
                throw new ErrorException(StatusCodeEnum.U02_Lock_User);
            }
            foreach (var item in getuser.BlockUserUserIsBlockeds)
            {
                if ((item.UserIsBlockedId == request.UserId
                    && item.UserId == request.ViewUserId)
                    || (item.UserIsBlockedId == request.ViewUserId 
                    && item.UserId == request.UserId))
                {
                    throw new ErrorException(StatusCodeEnum.U01_Not_Found);
                }
            }

            foreach (var item in getuser.BlockUserUsers)
            {
                if ((item.UserIsBlockedId == request.UserId
                    && item.UserId == request.ViewUserId)
                    || (item.UserIsBlockedId == request.ViewUserId
                    && item.UserId == request.UserId))
                {
                    throw new ErrorException(StatusCodeEnum.U01_Not_Found);
                }
            }

            var result = _mapper.Map<GetOtherUserQueryResult>(getuser);
            return Result<GetOtherUserQueryResult>.Success(result);
        }
    }
}
