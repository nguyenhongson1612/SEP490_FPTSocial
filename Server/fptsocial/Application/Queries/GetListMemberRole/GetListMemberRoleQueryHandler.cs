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

namespace Application.Queries.GetListMemberRole
{
    public class GetListMemberRoleQueryHandler : IQueryHandler<GetListMemberRoleQuery, List<GetListMemberRoleQueryResult>>
    {
        private readonly fptforumQueryContext _context;
        private readonly IMapper _mapper;

        public GetListMemberRoleQueryHandler(fptforumQueryContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }
        public async Task<Result<List<GetListMemberRoleQueryResult>>> Handle(GetListMemberRoleQuery request, CancellationToken cancellationToken)
        {
            if (_context == null)
            {
                throw new ErrorException(StatusCodeEnum.Context_Not_Found);
            }

            var result = new List<GetListMemberRoleQueryResult>();
            var member = await _context.GroupMembers
                                   .Where(x => x.GroupId == request.GroupId && x.IsJoined == true)
                                   .Include(x => x.GroupRole)
                                   .Include(x => x.User)
                                   .ToListAsync();
            var joined = await _context.GroupMembers.Include(x=>x.User).ThenInclude(x=>x.AvataPhotos)
                .Include(x=>x.GroupRole).FirstOrDefaultAsync(x => x.UserId == request.UserId && x.GroupId == request.GroupId);

            if (joined.GroupRole.GroupRoleName.Equals("Admin"))
            {
                if (member != null)
                {
                    foreach (var item in member)
                    {
                        if (!item.GroupRole.GroupRoleName.Equals("Admin"))
                        {
                            var mem = new GetListMemberRoleQueryResult {
                                MemberId = item.UserId,
                                MemberName = item.User.FirstName + " " + item.User.LastName,
                                MemberAvata = item.User.AvataPhotos.FirstOrDefault(x=>x.IsUsed == true)?.AvataPhotosUrl
                            };
                            result.Add(mem);
                        }
                    }
                }
            }
            else
            {
                throw new ErrorException(StatusCodeEnum.GR11_Not_Permission);
            }

            return Result<List<GetListMemberRoleQueryResult>>.Success(result);
        }
    }
}
