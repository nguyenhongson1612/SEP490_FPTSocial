using Application.Commands.GetUserProfile;
using Application.Queries.GetUserByUserId;
using Application.Queries.GetUserProfile;
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
        [Route("getuserbyuserid")]
        public async Task<IActionResult> GetUserProfleByUserId([FromQuery] GetUserByUserIdQuery input)
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

        [ValidateAntiForgeryToken]
        [HttpPost]
        [Route("createbylogin")]     
        public async Task<IActionResult> CreateUser(UserProfileCommand input)
        {
            var res = await _sender.Send(input);
            return Success(res.Value);
        }
    }
}
