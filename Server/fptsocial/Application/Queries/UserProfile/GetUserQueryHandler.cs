using Application.Commands.UserProfile;
using AutoMapper;
using Core.CQRS;
using Core.CQRS.Query;
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
            var user = _context.UserProfiles.FirstOrDefault(x => x.UserNumber == request.UserNumber);
            if (user == null)
            {
                throw new Exception("can not find user");
            }
            var result = _mapper.Map<GetUserQueryResult>(user);
            return Result<GetUserQueryResult>.Success(result);
        }
    }
}
