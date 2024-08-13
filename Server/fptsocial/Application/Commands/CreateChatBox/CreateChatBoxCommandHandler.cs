using Application.Commands.CreateUserChat;
using Application.Services;
using AutoMapper;
using Core.CQRS;
using Core.CQRS.Command;
using Core.Helper;
using Domain.CommandModels;
using Domain.Enums;
using Domain.Exceptions;
using Domain.QueryModels;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Query;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Commands.CreateChatBox
{
    public class CreateChatBoxCommandHandler : ICommandHandler<CreateChatBoxCommand, CreateChatBoxCommandResult>
    {
        private readonly ChatEngineService _service;
        private readonly GuidHelper _helper;
        private readonly fptforumQueryContext _context;
        private readonly fptforumCommandContext _commandContext;

        public CreateChatBoxCommandHandler(IMapper mapper, ChatEngineService service, fptforumQueryContext context, fptforumCommandContext commandContext)
        {
            _helper = new GuidHelper();
            _service = service;
            _context = context;
            _commandContext = commandContext;
        }
        public async Task<Result<CreateChatBoxCommandResult>> Handle(CreateChatBoxCommand request, CancellationToken cancellationToken)
        {
            if (_context == null)
            {
                throw new ErrorException(StatusCodeEnum.Context_Not_Found);
            }

            var otherChat = await _context.UserProfiles.FirstOrDefaultAsync(x => x.UserId == request.OtherId);
            var block = await _context.BlockUsers.FirstOrDefaultAsync(x => (x.UserId == request.UserId && x.UserIsBlockedId == request.OtherId)
                                                  || (x.UserId == request.OtherId && x.UserIsBlockedId == request.UserId));
            request.Title = otherChat.FirstName + " " + otherChat.LastName;
            var chat = await _service.CreateChatAsync(request.Title, request.UserId.ToString());
            if(block != null || otherChat.IsActive == false)
            {
                throw new ErrorException(StatusCodeEnum.CH01_Can_Not_Chat);
            }
            var getchat = JObject.Parse(chat);
            string id = getchat["id"].ToString();
            var addmember = await _service.AddMemberToChatAsync(request.OtherId.ToString(), id, request.UserId.ToString());
            var newchat = new Domain.CommandModels.UserChat
            {
                UserChatId = int.Parse(id),
                UserId = (Guid)request.UserId,
                CreateDate = DateTime.Now
            };
            await _commandContext.UserChats.AddAsync(newchat);
            await _commandContext.SaveChangesAsync();
            var result = new CreateChatBoxCommandResult
            {
                Title = request.Title,
                Message = "Create Chat Box Success!",
                ChatId = id
            };

            return Result<CreateChatBoxCommandResult>.Success(result);
        }
    }
}
