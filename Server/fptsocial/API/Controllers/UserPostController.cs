using Application.Commands.CreateUserCommentPost;
using Application.Commands.CreateUserCommentVideoPost;
﻿using Application.Commands.CreateUserCommentPhotoPost;
using Application.Commands.CreateUserCommentPost;
using Application.Commands.Post;
using Application.Queries.GetCommentByPostId;
using Application.Queries.GetCommentByVideoPostId;
using Application.Queries.GetPost;
using Application.Queries.GetUserPost;
using MediatR;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Net.Http.Headers;
using System.IdentityModel.Tokens.Jwt;
using System.Threading.Tasks;
using Application.Queries.GetCommentByPhotoPostId;
using Application.Commands.UpdateUserPostCommand;
using static Microsoft.EntityFrameworkCore.DbLoggerCategory.Database;
using Application.Queries.GetUserPostById;
using Application.Commands.ShareUserPostCommand;
using Application.Queries.GetChildPost;
using Application.Commands.UpdateUserPhotoPost;
using Application.Commands.UpdateUserVideoPost;
using Application.Commands.UpdateCommentUserPost;
using Application.Commands.UpdateCommentUserVideoPost;
using Application.Commands.UpdateCommentUserPhotoPost;
using Application.Queries.GetOtherUserPostByUserId;
using Application.Commands.DeleteUserPost;
using Application.Commands.DeleteCommentUserPost;
using Application.Commands.DeleteCommentUserPhotoPost;
using Application.Commands.DeleteCommentUserVideoPost;
using Application.Queries.GetFriendyName;
using Application.Queries.GetBannedPostByUserId;
using Application.Commands.CreateCommentForSharePost;
using Application.Commands.CreateReactForCommentSharePost;
using Application.Commands.CreateReactForSharePost;
using Application.Queries.GetCommentBySharePost;

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
        [Route("getpost")]
        public async Task<IActionResult> GetPost([FromQuery] GetPostQuery input)
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

        [HttpPost]
        [Route("updateUserPost")]
        public async Task<IActionResult> UpdateUserPost(UpdateUserPostCommand command)
        {
            var res = await _sender.Send(command);
            return Success(res.Value);

        }

        [HttpGet]
        [Route("getuserpostbyid")]
        public async Task<IActionResult> GetUserPostById([FromQuery] GetUserPostByIdQuery input)
        {
            var res = await _sender.Send(input);
            return Success(res.Value);
        }

        //=================DocHere===============================

        [HttpPost]
        [Route("sharePost")]
        public async Task<IActionResult> SharePost(ShareUserPostCommand command)
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
            command.UserId = Guid.Parse(jsontoken.Claims.FirstOrDefault(claim => claim.Type == "userId").Value);
            var res = await _sender.Send(command);
            return Success(res.Value);

        }

        [HttpGet]
        [Route("getChildPostById")]
        public async Task<IActionResult> GetChildPostById([FromQuery] GetChildPostQuery input)
        {
            var res = await _sender.Send(input);
            return Success(res.Value);
        }

        [HttpPost]
        [Route("updatePhotoPost")]
        public async Task<IActionResult> UpdatePhotoPost(UpdateUserPhotoPostCommand command)
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
            command.UserId = Guid.Parse(jsontoken.Claims.FirstOrDefault(claim => claim.Type == "userId").Value);
            var res = await _sender.Send(command);
            return Success(res.Value);

        }

        [HttpPost]
        [Route("updateVideoPost")]
        public async Task<IActionResult> UpdateVideoPost(UpdateUserVideoPostCommand command)
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
            command.UserId = Guid.Parse(jsontoken.Claims.FirstOrDefault(claim => claim.Type == "userId").Value);
            var res = await _sender.Send(command);
            return Success(res.Value);

        }

        [HttpPost]
        [Route("updateUserCommentPost")]
        public async Task<IActionResult> UpdateUserCommentPost(UpdateCommentUserPostCommand command)
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
            command.UserId = Guid.Parse(jsontoken.Claims.FirstOrDefault(claim => claim.Type == "userId").Value);
            var res = await _sender.Send(command);
            return Success(res.Value);

        }

        [HttpPost]
        [Route("updateUserCommentPhotoPost")]
        public async Task<IActionResult> UpdateUserCommentPhotoPost(UpdateCommentUserPhotoPostCommand command)
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
            command.UserId = Guid.Parse(jsontoken.Claims.FirstOrDefault(claim => claim.Type == "userId").Value);
            var res = await _sender.Send(command);
            return Success(res.Value);

        }

        [HttpPost]
        [Route("updateUserCommentVideoPost")]
        public async Task<IActionResult> UpdateUserCommentVideoPost(UpdateCommentUserVideoPostCommand command)
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
            command.UserId = Guid.Parse(jsontoken.Claims.FirstOrDefault(claim => claim.Type == "userId").Value);
            var res = await _sender.Send(command);
            return Success(res.Value);

        }

        [HttpDelete]
        [Route("deleteUserPost")]
        public async Task<IActionResult> DeleteUserPost([FromQuery] DeleteUserPostCommand input)
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

        [HttpDelete]
        [Route("deleteCommentUserPost")]
        public async Task<IActionResult> DeleteCommentUserPost([FromQuery] DeleteCommentUserPostCommand input)
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

        [HttpDelete]
        [Route("deleteCommentUserPhotoPost")]
        public async Task<IActionResult> DeleteCommentUserPhotoPost([FromQuery] DeleteCommentUserPhotoPostCommand input)
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

        [HttpDelete]
        [Route("deleteCommentUserVideoPost")]
        public async Task<IActionResult> DeleteCommentUserVideoPost([FromQuery] DeleteCommentUserVideoPostCommand input)
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
        [Route("getotheruserpostbyuserid")]
        public async Task<IActionResult> GetOtherUserPostByUserId([FromQuery] GetOtherUserPostByUserIdQuery input)
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
        [Route("getBannedPostByUserId")]
        public async Task<IActionResult> GetBannedPostByUserId()
        {
            var input = new GetBannedPostByUserIdQuery();
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

        [HttpPost]
        [Route("createCommentSharePost")]
        public async Task<IActionResult> CreateSharePostComment(CreateCommentForSharePostCommand command)
        {
            var res = await _sender.Send(command);
            return Success(res.Value);

        }

        [HttpGet]
        [Route("getCommentBySharePostId")]
        public async Task<IActionResult> GetCommentBySharePostId([FromQuery] GetCommentBySharePostQuery command)
        {
            var res = await _sender.Send(command);
            return Success(res.Value);

        }






    }
}
