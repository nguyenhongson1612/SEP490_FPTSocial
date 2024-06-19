using Application.Commands.AddFriendCommand;
using Application.Commands.GetUserProfile;
using Application.Queries.GetUserRelationships;
using MediatR;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Net.Http.Headers;
using System.IdentityModel.Tokens.Jwt;

namespace API.Controllers
{
    [ApiController]
    [Route("/api/[controller]")]
    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
    public class UserRelationshipController : BaseController
    {
        private readonly ISender _sender;
        public UserRelationshipController(ISender sender)
        {
            _sender = sender;
        }
        [HttpPost]
        [Route("sendfriend")]
        public async Task<IActionResult> SendFriend(AddFriendCommand input)
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
            input.UserId = Guid.Parse(jsontoken.Claims.FirstOrDefault(claim => claim.Type == "userId").Value);
            var res = await _sender.Send(input);
            return Success(res.Value);
        }

        [HttpGet]
        [Route("getuserrelationshipbyuserid")]
        public async Task<IActionResult> GetUserRelationshipByUserId()
        {
            GetUserRelationshipQuery input = new GetUserRelationshipQuery();
            var rawToken = HttpContext.Request.Headers[HeaderNames.Authorization].ToString().Replace("Bearer ", "");
            if (string.IsNullOrEmpty(rawToken))
            {
                return BadRequest("Authorization token is required.");
            }

            var handle = new JwtSecurityTokenHandler();
            var jsontoken = handle.ReadToken(rawToken) as JwtSecurityToken;
            if (jsontoken == null)
            {
                return BadRequest("Invalid token.");
            }

            input.UserId = Guid.Parse(jsontoken.Claims.FirstOrDefault(claim => claim.Type == "userId").Value);

            if (input.UserId == null)
            {
                return BadRequest("UserId is required.");
            }

            var res = await _sender.Send(input);
            if (!res.IsSuccess)
            {
                return StatusCode(500, res.Error);
            }

            return Success(res.Value);
        }
    }
}
