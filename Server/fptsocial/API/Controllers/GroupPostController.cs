using Application.Commands.CreateGroupPost;
using Application.Commands.CreateUserCommentGroupPhotoPost;
using Application.Commands.CreateUserCommentGroupPost;
using Application.Commands.CreateUserCommentGroupVideoPost;
using Application.Commands.CreateUserCommentPhotoPost;
using Application.Commands.CreateUserCommentVideoPost;
using Application.Commands.Post;
using Application.Queries.GetCommentbyGroupPhotoPostId;
using Application.Queries.GetCommentByGroupPostId;
using Application.Queries.GetCommentByGroupVideoPostId;
using Application.Queries.GetCommentByPostId;
using Application.Queries.GetGroupPostByGroupId;
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

        [HttpPost]
        [Route("commentGroupPost")]
        public async Task<IActionResult> CreateGroupPostComment(CreateUserCommentGroupPostCommand command)
        {
            var res = await _sender.Send(command);
            return Success(res.Value);

        }


        [HttpPost]
        [Route("commentGroupVideoPost")]
        public async Task<IActionResult> CreateGroupVideoComment(CreateUserCommentGroupVideoPostCommand command)
        {
            var res = await _sender.Send(command);
            return Success(res.Value);

        }

        [HttpPost]
        [Route("commentGroupPhotoPost")]
        public async Task<IActionResult> CreateGroupPhotoComment(CreateUserCommentGroupPhotoPostCommand command)
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

        [HttpGet]
        [Route("getGroupVideoPostComment")]
        public async Task<IActionResult> GetGroupVideoPostComment([FromQuery] GetCommentByGroupVideoPostIdQuery command)
        {
            var res = await _sender.Send(command);
            return Success(res.Value);

        }

        [HttpGet]
        [Route("getGroupPhotoPostComment")]
        public async Task<IActionResult> GetGroupPhotoPostComment([FromQuery] GetCommentByGroupPhotoPostIdQuery command)
        {
            var res = await _sender.Send(command);
            return Success(res.Value);

        }

        [HttpGet]
        [Route("getGroupPostByGroupId")]
        public async Task<IActionResult> GetGroupPostByGroupId([FromQuery] GetGroupPostByGroupIdQuery input)
        {
            var res = await _sender.Send(input);
            return Success(res.Value);
        }
    }
}
