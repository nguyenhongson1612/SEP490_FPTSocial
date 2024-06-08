using Application.Queries.GetGender;
using Application.Queries.UserProfile;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UserEntitiesDetailController :BaseController
    {
        private readonly ISender _sender;
        public UserEntitiesDetailController(ISender sender)
        {
            _sender = sender;
        }

        [HttpGet]
        [Route("getgender")]
        public async Task<IActionResult> GetUserGender()
        {
            var input = new GetGenderQuery();
            var res = await _sender.Send(input);
            return Success(res.Value);
        }
    }
}
