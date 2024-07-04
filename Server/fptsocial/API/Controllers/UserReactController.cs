﻿using Application.Commands.CreateNewReact;
using Application.Commands.CreateReactUserPhotoPost;
using Application.Commands.CreateReactUserPost;
using Application.Commands.CreateReactUserVideoPost;
using Application.Commands.Post;
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
    }
}
