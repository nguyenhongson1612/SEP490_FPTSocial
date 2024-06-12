﻿using Application.DTO.GetUserProfileDTO;
using Application.Queries.GetUserProfile;
using Application.Queries.GetWebAffilication;
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

namespace Application.Queries.GetUserByUserId
{
    public class GetUserByUserIdHandler : IQueryHandler<GetUserByUserIdQuery, List<GetUserByUserIdResult>>
    {
        private readonly fptforumQueryContext _context;
        private readonly IMapper _mapper;

        public GetUserByUserIdHandler(fptforumQueryContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }
        public async Task<Result<List<GetUserByUserIdResult>>> Handle(GetUserByUserIdQuery request, CancellationToken cancellationToken)
        {
            if (_context == null)
            {
                throw new ErrorException(StatusCodeEnum.Context_Not_Found);
            }

           
            if(request.UserId != null)
            {
                var getuser = await _context.UserProfiles
                                    .Include(x => x.ContactInfo)
                                    .Include(x => x.UserStatus)
                                    .Include(x => x.AvataPhotos)
                                    .Include(x => x.UserGender)
                                    .Include(x => x.WebAffiliations)
                                    .Include(x => x.UserSettings)
                                    .Include(x => x.Role)
                                    .Include(x=>x.UserGender.Gender)
                                    .Include(x => x.UserRelationship)
                                    .FirstOrDefaultAsync(x => x.UserId == request.UserId);
                if(getuser == null)
                {
                    throw new ErrorException(StatusCodeEnum.U01_Not_Found);
                }

                if (getuser.IsActive == false)
                {
                    throw new ErrorException(StatusCodeEnum.U02_Lock_User);
                }
                var result = _mapper.Map<GetUserByUserIdResult>(getuser);
                foreach (var webaff in getuser.WebAffiliations)
                {
                    var mapweb = _mapper.Map<GetUserWebAfflication>(webaff);
                    result.WebAffiliationUrl.Add(mapweb);
                }

                foreach (var avata in getuser.AvataPhotos)
                {
                    var mapavata = _mapper.Map<GetUserWebAfflication>(avata);
                    result.WebAffiliationUrl.Add(mapavata);
                }
                List<GetUserByUserIdResult> resultuser = new List<GetUserByUserIdResult>();
                result.ContactInfo = _mapper.Map<GetUserContactInfo>(getuser.ContactInfo);
                resultuser.Add(result);
                return Result<List<GetUserByUserIdResult>>.Success(resultuser);
            }

            var user = await _context.UserProfiles
                                    .Include(x => x.ContactInfo)
                                    .Include(x => x.UserStatus)
                                    .Include(x => x.AvataPhotos)
                                    .Include(x => x.UserGender)
                                    .Include(x => x.WebAffiliations)
                                    .Include(x => x.UserSettings)
                                    .Include(x => x.Role)
                                    .Include(x => x.UserGender.Gender)
                                    .Include(x => x.UserRelationship)
                                    .ToListAsync();
            List<GetUserByUserIdResult> resultlist = new List<GetUserByUserIdResult>();
            foreach (var data in user)
            {
              var map  = _mapper.Map<GetUserByUserIdResult>(data);
               foreach(var webaff in data.WebAffiliations)
                {
                    var mapweb = _mapper.Map<GetUserWebAfflication>(webaff);
                    map.WebAffiliationUrl.Add(mapweb);
                }

                foreach (var avata in data.AvataPhotos)
                {
                    var mapavata = _mapper.Map<GetUserWebAfflication>(avata);
                    map.WebAffiliationUrl.Add(mapavata);
                }
                map.ContactInfo = _mapper.Map<GetUserContactInfo>(data.ContactInfo);
                resultlist.Add(map);
            }
            return Result<List<GetUserByUserIdResult>>.Success(resultlist);
        }
    }
}
