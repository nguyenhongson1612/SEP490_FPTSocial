using Application.DTO.GroupDTO;
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

namespace Application.Queries.GetGroupByGroupId
{
    public class GetGroupByGroupIdQueryHandler : IQueryHandler<GetGroupByGroupIdQuery, GetGroupByGroupIdQueryResult>
    {

        private readonly fptforumQueryContext _context;
        private readonly IMapper _mapper;

        public GetGroupByGroupIdQueryHandler(fptforumQueryContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }
        public async Task<Result<GetGroupByGroupIdQueryResult>> Handle(GetGroupByGroupIdQuery request, CancellationToken cancellationToken)
        {
            if (_context == null)
            {
                throw new ErrorException(StatusCodeEnum.Context_Not_Found);
            }

            var group = await _context.GroupFpts.Include(x => x.GroupType)
                                                .Include(x => x.GroupTagUseds)
                                                .Include(x=>x.GroupMembers)
                                                .FirstOrDefaultAsync(x => x.GroupId == request.GroupId);
            var member = await _context.GroupMembers
                                    .Where(x => x.GroupId == request.GroupId)
                                    .Include(x => x.GroupRole)
                                    .Include(x=>x.User)
                                    .ToListAsync();
            bool isJoin = member.FirstOrDefault(x => x.UserId == request.UserId).IsJoined;
            var admin = member.FirstOrDefault(x => x.GroupRole.GroupRoleName.Equals("Admin"));

            if (group == null)
            {
                throw new ErrorException(StatusCodeEnum.GR08_Group_Is_Not_Exist);
            }

            var getgroup = new GetGroupByGroupIdQueryResult
            {
                GroupId = (Guid)request.GroupId,
                GroupName = group.GroupName,
                GroupNumber = group.GroupNumber,
                GroupDescription = group.GroupDescription,
                CoverImage = group.CoverImage,
                GroupAdmin = admin.User.FirstName + " " + admin.User.LastName,
                MemberCount = member.Count(),
            };
            if (isJoin == false)
            {
                getgroup.GroupMember = null;
                getgroup.IsJoin = false;
            }
            else
            {
                getgroup.IsJoin = true;
                foreach(var mem in member)
                {
                    var user = await _context.AvataPhotos.FirstOrDefaultAsync(x => x.UserId == mem.UserId);
                    var gmem = new GroupMemberDTO {
                        GroupId = mem.GroupId,
                        UserId = mem.UserId,
                        MemberName = mem.User.FirstName + " " + mem.User.LastName,
                        Avata = user.AvataPhotosUrl,
                        GroupRoleId = mem.GroupRoleId,
                        GroupRoleName = mem.GroupRole.GroupRoleName
                    };
                    getgroup.GroupMember.Add(gmem);
                }
            }

            var result = new GetGroupByGroupIdQueryResult();
            return Result<GetGroupByGroupIdQueryResult>.Success(result);
        }
    }
}
