using Application.DTO.GetUserProfileDTO;
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

namespace Application.Queries.GetUserPost
{
    public class GetUserPostHandler : IQueryHandler<GetUserPostQuery, List<GetUserPostResult>>
    {
        private readonly fptforumQueryContext _context;
        private readonly IMapper _mapper;
        List<GetUserPostResult> userPosts = new List<GetUserPostResult>();
        public GetUserPostHandler(fptforumQueryContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }
        public async Task<Result<List<GetUserPostResult>>> Handle(GetUserPostQuery request, CancellationToken cancellationToken)
        {
            if (_context == null)
            {
                throw new ErrorException(StatusCodeEnum.Context_Not_Found);
            }


            if (request.UserId != null || !userPosts.Any())
            {
                var userPosts = await _context.UserPosts
                                    .Where(x => x.UserId == request.UserId).ToListAsync(cancellationToken);

                if (userPosts == null)
                {
                    throw new ErrorException(StatusCodeEnum.P01_Not_Found);
                }

                /*if (getuser.IsActive == false)
                {
                    throw new ErrorException(StatusCodeEnum.U02_Lock_User);
                }*/

                var result = _mapper.Map<List<GetUserPostResult>>(userPosts);
                return Result<List<GetUserPostResult>>.Success(result);
            }

            return Result<List<GetUserPostResult>>.Failure("UserId is required.");
        }
    }
}
