using Application.Commands.CreateGroupPost;
using Application.Commands.Post;
using Application.Queries.GetCommentByGroupPostId;
using Application.Queries.GetCommentByPostId;
using MediatR;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [ApiController]
    [Route("/api/[controller]")]
    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
    public class GroupPostController : BaseController
    {
        private readonly ISender _sender;

        public GroupPostController(ISender sender)
        {
            _sender = sender;
        }

        [HttpPost]
        [Route("createGroupPost")]
        public async Task<IActionResult> CreateGroupPost(CreateGroupPostCommand command)
        {
            var res = await _sender.Send(command);
            return Success(res.Value);

        }

        [HttpGet]
        [Route("getGroupPostComment")]
        public async Task<IActionResult> GetGroupPostComment([FromQuery] GetCommentByGroupPostIdQuery command)
        {
            var res = await _sender.Send(command);
            return Success(res.Value);

        }
    }
}
