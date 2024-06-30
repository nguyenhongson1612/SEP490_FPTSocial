using Application.Commands.CreateUserCommentPost;
using Application.Commands.CreateUserCommentVideoPost;
﻿using Application.Commands.CreateUserCommentPhotoPost;
using Application.Commands.CreateUserCommentPost;
using Application.Commands.Post;
using Application.Queries.GetCommentByPostId;
using Application.Queries.GetCommentByVideoPostId;
using Application.Queries.GetUserPost;
using MediatR;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using Application.Queries.GetCommentByPhotoPostId;

namespace API.Controllers
{
    [ApiController]
    [Route("/api/[controller]")]
    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
    public class UserPostController : BaseController
    {
        private readonly ISender _sender;

        public UserPostController(ISender sender)
        {
            _sender = sender;
        }

        [HttpGet]
        [Route("getuserpostbyuserid")]
        public async Task<IActionResult> GetUserPostByUserId([FromQuery] GetUserPostQuery input)
        {
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

        
        [HttpPost]
        [Route("createPost")]
        public async Task<IActionResult> CreatePost(CreateUserPostCommand command)
        {
            var res = await _sender.Send(command);
            return Success(res.Value);

        }

        [HttpPost]
        [Route("commentPost")]
        public async Task<IActionResult> CreateComment(CreateUserCommentPostCommand command)
        {
            var res = await _sender.Send(command);
            return Success(res.Value);

        }

        [HttpGet]
        [Route("getComment")]
        public async Task<IActionResult> GetComment([FromQuery] GetCommentByPostIdQuery command)
        {
            var res = await _sender.Send(command);
            return Success(res.Value);

        }

        [HttpPost]
        [Route("commentVideoPost")]
        public async Task<IActionResult> CreateVideoComment(CreateUserCommentVideoPostCommand command)
        {
            var res = await _sender.Send(command);
            return Success(res.Value);

        }

        [HttpPost]
        [Route("commentPhotoPost")]
        public async Task<IActionResult> CreatePhotoComment(CreateUserCommentPhotoPostCommand command)
        {
            var res = await _sender.Send(command);
            return Success(res.Value);

        }

        [HttpGet]
        [Route("getVideoComment")]
        public async Task<IActionResult> GetVideoComment([FromQuery] GetCommentByVideoPostIdQuery command)
        {
            var res = await _sender.Send(command);
            return Success(res.Value);

        }

        [HttpGet]
        [Route("getPhotoComment")]
        public async Task<IActionResult> GetPhotoComment([FromQuery] GetCommentByPhotoPostIdQuery command)
        {
            var res = await _sender.Send(command);
            return Success(res.Value);

        }


    }
}
