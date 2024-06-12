using AutoMapper;
using Core.CQRS;
using Core.CQRS.Command;
using Domain.Exceptions;
using Domain.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Application.DTO.CreateUserDTO;
using Application.Commands.GetUserProfile;
using Core.Helper;
using Domain.CommandModels;
using Domain.QueryModels;

namespace Application.Commands.CreateUserProfile
{
    public class UserProfileCommandHandler : ICommandHandler<UserProfileCommand, UserProfileCommandResult>
    {
        private readonly fptforumCommandContext _context;
        private readonly fptforumQueryContext _querycontext;
        private readonly IMapper _mapper;
        private readonly GuidHelper _helper;

        public UserProfileCommandHandler(fptforumCommandContext context, fptforumQueryContext querycontext, IMapper mapper)
        {
            _context = context;
            _querycontext = querycontext;
            _mapper = mapper;
            _helper = new GuidHelper();
        }

        public async Task<Result<UserProfileCommandResult>> Handle(UserProfileCommand request, CancellationToken cancellationToken)
        {
            if(_context == null)
            {
                throw new ErrorException(StatusCodeEnum.Context_Not_Found);
            }

            if(request.Email == null && request.FeId == null)
            {
                throw new ErrorException(StatusCodeEnum.U04_Can_Not_Create);
            }

            var getuserbyemail = await _querycontext.UserProfiles.FirstOrDefaultAsync(x => x.Email.Equals(request.Email));
            var getuserbyfeid = await _querycontext.UserProfiles.FirstOrDefaultAsync(X => X.FeId.Equals(request.FeId));
            var role = await _querycontext.Roles.FirstOrDefaultAsync(x=>x.NameRole == "User");
            var status = await _querycontext.UserStatuses.FirstOrDefaultAsync(x => x.StatusName == "Public");
            if(getuserbyemail != null || getuserbyfeid != null)
            {
                throw new ErrorException(StatusCodeEnum.U03_User_Exist);
            }

            var userprofile = _mapper.Map<Domain.CommandModels.UserProfile>(request);
            userprofile.UserId = _helper.GenerateNewGuid();
            userprofile.RoleId = role.RoleId;
            userprofile.IsActive = true;
            userprofile.UserStatusId = status.UserStatusId;
            userprofile.IsFirstTimeLogin = false;
            userprofile.CreatedAt = DateTime.Now;
            await _context.UserProfiles.AddAsync(userprofile);
            await _context.SaveChangesAsync();
            var result = _mapper.Map<UserProfileCommandResult>(request);
            result.UserId = userprofile.UserId;
            result.RoleId = userprofile.RoleId;
            result.IsFirstTimeLogin = userprofile.IsFirstTimeLogin;
            result.UserStatusId = userprofile.UserStatusId;
            result.IsActive = userprofile.IsActive;
            result.CreatedAt = userprofile.CreatedAt;
            result.UpdatedAt = userprofile.UpdatedAt;
            return Result<UserProfileCommandResult>.Success(result); 
        }
    }
}
