using Application.Queries.GetUserPost;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace API.Controllers
{
    [ApiController]
    [Route("/api/[controller]")]
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
    }
}
