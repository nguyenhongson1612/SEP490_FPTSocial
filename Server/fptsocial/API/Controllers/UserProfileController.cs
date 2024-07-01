﻿using Application.Commands.GetUserProfile;
using Application.Commands.UpdateUserCommand;
using Application.Queries.CheckUserExist;
using Application.Queries.GetAllFriend;
using Application.Queries.GetAllFriendOtherProfiel;
using Application.Queries.GetButtonFriend;
using Application.Queries.GetOtherUser;
using Application.Queries.GetUserByUserId;
using Application.Queries.GetUserProfile;
using MediatR;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Net.Http.Headers;
using Newtonsoft.Json;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;

namespace API.Controllers
{
    [ApiController]
    [Route("/api/[controller]")]
    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
    public class UserProfileController : BaseController
    {
        private readonly ISender _sender;
        public UserProfileController(ISender sender)
        {
            _sender = sender;
        }

        [HttpGet]
        [Route("getuserbyuserid")]
        public async Task<IActionResult> GetUserProfleByUserId([FromQuery] GetUserByUserIdQuery input)
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
        [Route("getotheruserbyuserid")]
        public async Task<IActionResult> GetOtherUserProfleByUserId([FromQuery] GetOtherUserQuery input)
        {
            var res = await _sender.Send(input);
            return Success(res.Value);
        }

        [HttpGet]
        [Route("getuserbynumber")]
        public async Task<IActionResult> GetUserProfleByNumber([FromQuery]GetUserQuery input)
        {
            var res = await _sender.Send(input);
            return Success(res.Value);
        }

        [HttpGet]
        [Route("getbuttonfriend")]
        public async Task<IActionResult> GetButtonFriendStatus([FromQuery] GetButtonFriendQuery input)
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
        [Route("checkuserexist")]
        public async Task<IActionResult> CheckUserExisted()
        {
            var rawToken = HttpContext.Request.Headers[HeaderNames.Authorization].ToString().Replace("Bearer ", "");
            if (string.IsNullOrEmpty(rawToken))
            {
                return BadRequest();
            }
            var handle = new JwtSecurityTokenHandler();
            var jsontoken = handle.ReadToken(rawToken) as JwtSecurityToken;
            if(jsontoken == null)
            {
                return BadRequest();    
            }
            var input = new CheckUserExistQuery();
            input.UserId = Guid.Parse(jsontoken.Claims.FirstOrDefault(claim => claim.Type == "userId").Value);
            //input.FeId = jsontoken.Claims.FirstOrDefault(claim => claim.Type == "feid").Value;
            var res = await _sender.Send(input);
            return Success(res.Value);

        }

        [HttpGet]
        [Route("getallfriend")]
        public async Task<IActionResult> GetAllFriend()
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
            var input = new GetAllFriendQuery();
            input.UserId = Guid.Parse(jsontoken.Claims.FirstOrDefault(claim => claim.Type == "userId").Value);
            //input.FeId = jsontoken.Claims.FirstOrDefault(claim => claim.Type == "feid").Value;
            var res = await _sender.Send(input);
            return Success(res.Value);

        }


        [HttpGet]
        [Route("getallfriendotherprofile")]
        public async Task<IActionResult> GetAllFriendOtherProfile([FromQuery] GetAllFriendOtherProfileQuery input)
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
        [Route("createbylogin")]     
        public async Task<IActionResult> CreateUser(UserProfileCommand input)
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
            input.RoleName = jsontoken.Claims.FirstOrDefault(claim => claim.Type == "role").Value;
            var projectCampuses = jsontoken.Claims.FirstOrDefault(claim => claim.Type == "projectCampuses")?.Value;
            if (!string.IsNullOrEmpty(projectCampuses))
            {
                var campuses = JsonConvert.DeserializeObject<dynamic>(projectCampuses);
                foreach (var campus in campuses)
                {
                    input.Campus = campus.CampusCode;
                    input.UserNumber = campus.RollNumber;
                }
            }
            var res = await _sender.Send(input);
            return Success(res.Value);
        }



        [HttpPost]
        [Route("updateprofile")]
        public async Task<IActionResult> UpdateProfile(UpdateUserCommand input)
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
    }
}
