using Application.Commands.CreateChatBox;
using Application.Commands.CreateUserChat;
using Application.Commands.CreateUserInterest;
using Application.Services;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Net.Http.Headers;
using System.IdentityModel.Tokens.Jwt;

namespace API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
    public class ChatController : BaseController
    {

        private readonly ISender _sender;
        public ChatController(ISender sender)
        {
            _sender = sender;
        }

        [HttpPost]
        [Route("createchatbox")]
        public async Task<IActionResult> CreateUserChat(CreateChatBoxCommand userchat)
        {
            var rawToken = HttpContext.Request.Headers[HeaderNames.Authorization].ToString().Replace("Bearer ", "");
            if (string.IsNullOrEmpty(rawToken))
            {
                return BadRequest();
            }
            var handle = new JwtSecurityTokenHandler();
            var jsontoken = handle.ReadToken(rawToken) as JwtSecurityToken;
            if (jsontoken == null)
            {
                return BadRequest();
            }
            userchat.UserId = Guid.Parse(jsontoken.Claims.FirstOrDefault(claim => claim.Type == "userId").Value);
            var res = await _sender.Send(userchat);
            return Success(res.Value);
        }

        [HttpPost]
        [Route("createuserchat")]
        public async Task<IActionResult> CreateUserChatBox(CreateUserChatCommand userchat)
        {
            var rawToken = HttpContext.Request.Headers[HeaderNames.Authorization].ToString().Replace("Bearer ", "");
            if (string.IsNullOrEmpty(rawToken))
            {
                return BadRequest();
            }
            var handle = new JwtSecurityTokenHandler();
            var jsontoken = handle.ReadToken(rawToken) as JwtSecurityToken;
            if (jsontoken == null)
            {
                return BadRequest();
            }
            userchat.UserId = Guid.Parse(jsontoken.Claims.FirstOrDefault(claim => claim.Type == "userId").Value);
            var res = await _sender.Send(userchat);
            return Success(res.Value);
        }
    }
}
