using Application.Commands.CreateGroupPost;
using Application.Commands.CreateReactCommentGroupPost;
using Application.Commands.CreateReactCommentGroupPostPhoto;
using Application.Commands.CreateReactCommentUserPost;
using Application.Commands.CreateReactCommentUserPostPhoto;
using Application.Commands.CreateReactCommentUserPostVideo;
using Application.Commands.CreateReactGroupPhotoPost;
using Application.Commands.CreateReactGroupPost;
using Application.Commands.CreateReactGroupVideoPost;
using Application.Commands.CreateReactUserPhotoPost;
using Application.Commands.CreateReactUserPost;
using Application.Commands.CreateReactUserVideoPost;
using Application.Commands.CreateUserCommentGroupPhotoPost;
using Application.Commands.CreateUserCommentGroupPost;
using Application.Commands.CreateUserCommentGroupVideoPost;
using Application.Commands.CreateUserCommentPhotoPost;
using Application.Commands.CreateUserCommentVideoPost;
using Application.Commands.DeleteCommentGroupPhotoPost;
using Application.Commands.DeleteCommentGroupPost;
using Application.Commands.DeleteCommentGroupVideoPost;
using Application.Commands.DeleteCommentUserPost;
using Application.Commands.DeleteGroupPost;
using Application.Commands.Post;
using Application.Commands.ShareGroupPostCommand;
using Application.Commands.ShareUserPostCommand;
using Application.Commands.UpdateGroupPhotoPostCommand;
using Application.Commands.UpdateGroupPostCommand;
using Application.Commands.UpdateGroupVideoPostCommand;
using Application.Queries.GetChildGroupPost;
using Application.Queries.GetCommentbyGroupPhotoPostId;
using Application.Queries.GetCommentByGroupPostId;
using Application.Queries.GetCommentByGroupVideoPostId;
using Application.Queries.GetCommentByPostId;
using Application.Queries.GetGroupPostByGroupId;
using Application.Queries.GetGroupPostByGroupPostId;
using Application.Queries.GetGroupPostIdPendingByGroupId;
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

        [HttpGet]
        [Route("getGroupPostByGroupPostId")]
        public async Task<IActionResult> GetGroupPostByGroupPostId([FromQuery] GetGroupPostByGroupPostIdQuery input)
        {
            var res = await _sender.Send(input);
            return Success(res.Value);
        }

        [HttpGet]
        [Route("getChildGroupPost")]
        public async Task<IActionResult> GetChildGroupPost([FromQuery] GetChildGroupPostQuery input)
        {
            var res = await _sender.Send(input);
            return Success(res.Value);
        }

        [HttpPost]
        [Route("shareGroupPost")]
        public async Task<IActionResult> ShareGroupPost(ShareGroupPostCommand command)
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
        [Route("updateGroupPost")]
        public async Task<IActionResult> UpdateGroupPost(UpdateGroupPostCommand command)
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
        [Route("updateGroupPhotoPost")]
        public async Task<IActionResult> UpdateGroupPhotoPost(UpdateGroupPhotoPostCommand command)
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
        [Route("updateGroupVideoPost")]
        public async Task<IActionResult> UpdateGroupVideoPost(UpdateGroupVideoPostCommand command)
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
        [Route("deleteCommentGroupPost")]
        public async Task<IActionResult> DeleteCommentGroupPost([FromQuery] DeleteCommentGroupPostCommand input)
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
        [Route("deleteCommentGroupPhotoPost")]
        public async Task<IActionResult> DeleteCommentGroupPhotoPost([FromQuery] DeleteCommentGroupPhotoPostCommand input)
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
        [Route("deleteCommentGroupVideoPost")]
        public async Task<IActionResult> DeleteCommentGroupVideoPost([FromQuery] DeleteCommentGroupVideoPostCommand input)
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
        [Route("deleteGroupPost")]
        public async Task<IActionResult> DeleteGroupPost([FromQuery] DeleteGroupPostCommand input)
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
        [Route("getGroupPostIdPendingByGroupId")]
        public async Task<IActionResult> GetGroupPostIdPendingByGroupId([FromQuery] GetGroupPostIdPendingByGroupIdQuery input)
        {
            var res = await _sender.Send(input);
            return Success(res.Value);
        }
    }
}
