
using Application.Commands.UserProfile;
using Application.DTO.GetUserProfileDTO;
using AutoMapper;
using Core.CQRS;
using Core.CQRS.Query;
using Domain.Enums;
using Domain.Exceptions;
using Domain.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Queries.UserProfile
{
    public class GetUserQueryHandler: IQueryHandler<GetUserQuery, GetUserQueryResult>
    {
        private readonly fptforumContext _context;
        private readonly IMapper _mapper;

        public GetUserQueryHandler(fptforumContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public async Task<Result<GetUserQueryResult>> Handle(GetUserQuery request, CancellationToken cancellationToken)
        {
            if(_context == null)
            {
                throw new ErrorException(StatusCodeEnum.Context_Not_Found);
            }
            var user = await _context.UserProfiles
                .Include(x=>x.ContactInfo)
                .Include(x=>x.UserStatus)
                .Include(x=>x.AvataPhotos)
                .Include(x=>x.UserGender)
                .Include(x=>x.WebAffiliations)
                .Include(x=>x.UserSettings)
                .Include(x=>x.Role)

                .FirstOrDefaultAsync(x => x.UserNumber == request.UserNumber);
            if (user == null)
            {
                throw new ErrorException(StatusCodeEnum.U01_Not_Found);
            }
            if(user.IsActive == false)
            {
                throw new ErrorException(StatusCodeEnum.U02_Lock_user);
            }
            var result = _mapper.Map<GetUserQueryResult>(user);
            result.ContactInfo = _mapper.Map<GetUserContactInfo>(user.ContactInfo);
            result.Gender = _context.Genders.FirstOrDefault(x=>x.GenderId == user.UserGender.GenderId).GenderName;
            return Result<GetUserQueryResult>.Success(result);
        }
    }
}
