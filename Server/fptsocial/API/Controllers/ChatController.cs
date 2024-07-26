using Application.Commands.CreateUserChat;
using Application.Commands.CreateUserInterest;
using Application.Services;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ChatController : BaseController
    {

        private readonly ISender _sender;
        public ChatController(ISender sender)
        {
            _sender = sender;
        }

        [HttpPost]
        [Route("createuserchat")]
        public async Task<IActionResult> CreateUserChat(CreateUserChatCommand userchat)
        {
            userchat.UserId = Guid.NewGuid();
            userchat.Email = "anhqunm@gmail.com";
            userchat.FirstName = "Tran";
            userchat.LastName = "Dung";
            userchat.Avata = "https://www.facebook.com";
            var res = await _sender.Send(userchat);
            return Success(res.Value);
        }
    }
}
