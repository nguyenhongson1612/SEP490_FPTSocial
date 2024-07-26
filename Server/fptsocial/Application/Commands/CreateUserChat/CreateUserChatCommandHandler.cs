using Application.Services;
using AutoMapper;
using Core.CQRS;
using Core.CQRS.Command;
using Core.Helper;
using Domain.CommandModels;
using Domain.Enums;
using Domain.Exceptions;
using Domain.QueryModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Commands.CreateUserChat
{
    public class CreateUserChatCommandHandler : ICommandHandler<CreateUserChatCommand, CreateUserChatCommandResult>
    {
        private readonly ChatEngineService _chatEngineService;
        

        public CreateUserChatCommandHandler(ChatEngineService chatEngineService)
        {
            _chatEngineService = chatEngineService;
        }
        public async Task<Result<CreateUserChatCommandResult>> Handle(CreateUserChatCommand request, CancellationToken cancellationToken)
        {
            var chat = await _chatEngineService.CreateUserAsync(request.UserId.ToString(), request.Email, request.FirstName, request.LastName,request.Avata);
            var result = new CreateUserChatCommandResult
            {
                UserName = request.UserId.ToString(),
                Messsage = "Create User Success!"
            };

            return Result<CreateUserChatCommandResult>.Success(result);
        }
    }
}
