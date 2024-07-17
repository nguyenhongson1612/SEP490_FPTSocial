//using AutoMapper;
//using Core.CQRS;
//using Core.CQRS.Command;
//using Domain.CommandModels;
//using Domain.Enums;
//using Domain.Exceptions;
//using Domain.QueryModels;
//using Microsoft.EntityFrameworkCore;
//using System;
//using System.Collections.Generic;
//using System.Linq;
//using System.Text;
//using System.Threading.Tasks;

//namespace Application.Commands.UpdateGroupInfor
//{
//    public class UpdateGroupCommandHandler : ICommandHandler<UpdateGroupCommand, UpdateGroupCommandResult>
//    {
//        private readonly fptforumCommandContext _context;
//        private readonly fptforumQueryContext _querycontext;


//        public UpdateGroupCommandHandler(fptforumCommandContext context, fptforumQueryContext querycontext, IMapper mapper)
//        {
//            _context = context;
//            _querycontext = querycontext;

//        }

//        public async Task<Result<UpdateGroupCommandResult>> Handle(UpdateGroupCommand request, CancellationToken cancellationToken)
//        {
//            if (_context == null || _querycontext == null)
//            {
//                throw new ErrorException(StatusCodeEnum.Context_Not_Found);
//            }
//            var result = new UpdateGroupCommandResult();
//            var grouprole = await _querycontext.GroupMembers.Include(x => x.GroupRole)
//               .FirstOrDefaultAsync(x => x.UserId == request.UserId
//                                    && x.GroupId == request.GroupId);
//            var group = await _querycontext.GroupFpts.FirstOrDefaultAsync(x => x.GroupId == request.GroupId);
//            var groupstauts = await _querycontext.GroupStatuses.ToListAsync();
//            if (grouprole.GroupRole.GroupRoleName.Equals("Admin"))
//            {
    
//                if(group != null)
//                {
//                    var newgroup = new Domain.CommandModels.GroupFpt
//                    {
//                        GroupId = request.GroupId,
//                        GroupSettingId = request.GroupSettingId,
//                        GroupStatusId = request.GroupStatusId,
//                        CreatedAt = item.CreatedAt,
//                        UpdatedAt = DateTime.Now
//                    };
//                    _context.GroupSettingUses.Update(newsetting);

//                    await _context.SaveChangesAsync();
//                }  
//            }
//            else
//            {
//                throw new ErrorException(StatusCodeEnum.GR11_Not_Permission);
//            }
//        }
//    }
//}
