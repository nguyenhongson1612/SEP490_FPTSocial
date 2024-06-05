﻿using Application.Commands.UserProfile;
using Application.Queries.UserProfile;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [ApiController]
    [Route("/api/[controller]")]
    public class UserProfileController : BaseController
    {
        private readonly ISender _sender;
        public UserProfileController(ISender sender)
        {
            _sender = sender;
        }

        [HttpGet]
        [Route("/getuserbynumber")]
        public async Task<IActionResult> GetUserProfleByNumber([FromQuery]GetUserQuery input)
        {
            var res = await _sender.Send(input);
            return Success(res.Value);
        }
    }
}
