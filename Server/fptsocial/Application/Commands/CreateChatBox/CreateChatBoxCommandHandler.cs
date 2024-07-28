using Application.Commands.CreateUserChat;
using Application.Services;
using AutoMapper;
using Core.CQRS;
using Core.CQRS.Command;
using Core.Helper;
using Domain.CommandModels;
using Domain.QueryModels;
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

        public CreateChatBoxCommandHandler(IMapper mapper, ChatEngineService service)
        {
            _helper = new GuidHelper();
            _service = service;
        }
        public async Task<Result<CreateChatBoxCommandResult>> Handle(CreateChatBoxCommand request, CancellationToken cancellationToken)
        {
            var chat = await _service.CreateChatAsync(request.Title, request.UserId.ToString());
            var getchat = JObject.Parse(chat);
            string id = getchat["id"].ToString();
            var addmember = await _service.AddMemberToChatAsync(request.OtherId.ToString(), id, request.UserId.ToString());
            var result = new CreateChatBoxCommandResult
            {
                Title = request.Title,
                Message = "Create Chat Box Success!"
            };

            return Result<CreateChatBoxCommandResult>.Success(result);
        }
    }
}
