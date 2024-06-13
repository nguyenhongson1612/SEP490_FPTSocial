using Core.CQRS;
using Core.CQRS.Query;
using Domain.CommandModels;
using Domain.Enums;
using Domain.Exceptions;
using Domain.Extensions;
using Domain.QueryModels;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Queries.CheckUserExist
{

    public class CheckUserExistHandler : IQueryHandler<CheckUserExistQuery, CheckUserExistQueryResult>
    {
        private readonly fptforumQueryContext _context;
        public CheckUserExistHandler(fptforumQueryContext context)
        {
            _context = context;
        }
        public async Task<Result<CheckUserExistQueryResult>> Handle(CheckUserExistQuery request, CancellationToken cancellationToken)
        {
            if (_context == null)
            {
                throw new ErrorException(StatusCodeEnum.Context_Not_Found);
            }

            Domain.QueryModels.UserProfile user = new Domain.QueryModels.UserProfile();
            if(request.Email != null)
            {
                user = await _context.UserProfiles.FirstOrDefaultAsync(x => x.Email == request.Email);
            }
            else
            {
                user = await _context.UserProfiles.FirstOrDefaultAsync(x => x.FeId == request.FeId);
            }
            
            var result = new CheckUserExistQueryResult();
            if(user == null)
            {
                result.enumcode = StatusCodeEnum.U01_Not_Found;
                result.Message = StatusCodeEnum.U01_Not_Found.GetDescription();
                return Result<CheckUserExistQueryResult>.Success(result);
            }
            result.enumcode = StatusCodeEnum.U03_User_Exist;
            result.Message = StatusCodeEnum.U03_User_Exist.GetDescription();
            return Result<CheckUserExistQueryResult>.Success(result);
        }
    }
}
