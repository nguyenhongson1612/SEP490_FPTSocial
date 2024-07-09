using Application.Commands.CreateNewReact;
using Application.Commands.CreateReactCommentUserPost;
using Application.Commands.CreateReactCommentUserPostPhoto;
using Application.Commands.CreateReactCommentUserPostVideo;
using Application.Commands.CreateReactUserPhotoPost;
using Application.Commands.CreateReactUserPost;
using Application.Commands.CreateReactUserVideoPost;
using Application.Commands.Post;
using Application.Queries.GetAllReactType;
using Application.Queries.GetReactByPost;
using Application.Queries.GetUserStatus;
using MediatR;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [ApiController]
    [Route("/api/[controller]")]
    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
    public class UserReactController : BaseController
    {
        private readonly ISender _sender;

        public UserReactController(ISender sender)
        {
            _sender = sender;
        }

        [HttpPost]
        [Route("createNewReact")]
        public async Task<IActionResult> CreateNewReact(CreateNewReactCommand command)
        {
            var res = await _sender.Send(command);
            return Success(res.Value);

        }

        [HttpPost]
        [Route("createReactPost")]
        public async Task<IActionResult> CreateReactPost(CreateReactUserPostCommand command)
        {
            var res = await _sender.Send(command);
            return Success(res.Value);

        }

        [HttpPost]
        [Route("createReactPhotoPost")]
        public async Task<IActionResult> CreateReactPhotoPost(CreateReactUserPhotoPostCommand command)
        {
            var res = await _sender.Send(command);
            return Success(res.Value);

        }

        [HttpPost]
        [Route("createReactVideoPost")]
        public async Task<IActionResult> CreateReactVideoPost(CreateReactUserVideoPostCommand command)
        {
            var res = await _sender.Send(command);
            return Success(res.Value);

        }

        [HttpPost]
        [Route("createReactCommentUserPost")]
        public async Task<IActionResult> CreateReactCommentUserPost(CreateReactCommentUserPostCommand command)
        {
            var res = await _sender.Send(command);
            return Success(res.Value);
        }

        [HttpPost]
        [Route("createReactCommentUserVideoPost")]
        public async Task<IActionResult> CreateReactCommentUserVideoPost(CreateReactCommentUserPostVideoCommand command)
        {
            var res = await _sender.Send(command);
            return Success(res.Value);
        }

        [HttpPost]
        [Route("createReactCommentUserPhotoPost")]
        public async Task<IActionResult> CreateReactCommentUserPhotoPost(CreateReactCommentUserPostPhotoCommand command)
        {
            var res = await _sender.Send(command);
            return Success(res.Value);
        }

        [HttpGet]
        [Route("getAllReactType")]
        public async Task<IActionResult> GetAllReactType()
        {
            var input = new GetAllReactTypeQuery();
            var res = await _sender.Send(input);
            return Success(res.Value);
        }

        [HttpGet]
        [Route("getAllReactByPostId")]
        public async Task<IActionResult> GetAllReactByPostId([FromQuery] GetReactByPostQuery query)
        {
            var res = await _sender.Send(query);
            return Success(res.Value);
        }
    }
}
