using Application.Commands.CreateContactInfor;
using Application.Commands.CreateGender;
using Application.Commands.CreateInterest;
using Application.Commands.CreateRelationships;
using Application.Commands.CreateRole;
using Application.Commands.CreateSettings;
using Application.Commands.CreateStatus;
using Application.Queries.GenInterest;
using Application.Queries.GetGender;
using Application.Queries.GetUserStatus;
using Application.Queries.GetWebAffilication;
using MediatR;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
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

        [HttpGet]
        [Route("getinterest")]
        public async Task<IActionResult> GetInterest()
        {
            var input = new GetInterestQuery();
            var res = await _sender.Send(input);
            return Success(res.Value);
        }

        [HttpGet]
        [Route("getuserwebaffilication")]
        public async Task<IActionResult> GetUserWebAffilication([FromQuery] GetWebAffilicationQuery input)
        {
            var res = await _sender.Send(input);
            return Success(res.Value);
        }

        [HttpPost]
        [Route("creategender")]
        public async Task<IActionResult> CreateGender(CreateGenderCommand input)
        {
            var res = await _sender.Send(input);
            return Success(res.Value);
        }


        [HttpPost]
        [Route("createcontactinfor")]
        public async Task<IActionResult> CreateContactInfor(CreateContactInforCommand input)
        {
            var res = await _sender.Send(input);
            return Success(res.Value);
        }


        [HttpPost]
        [Route("createstatus")]
        public async Task<IActionResult> CreateStatus(CreateStatusCommand input)
        {
            var res = await _sender.Send(input);
            return Success(res.Value);
        }

        [HttpPost]
        [Route("createrelaionship")]
        public async Task<IActionResult> CreateRelationship(CreateRelationShipCommand input)
        {
            var res = await _sender.Send(input);
            return Success(res.Value);
        }

        [HttpPost]
        [Route("createsetting")]
        public async Task<IActionResult> CreateSetting(CreateSettingsCommand input)
        {
            var res = await _sender.Send(input);
            return Success(res.Value);
        }


        [HttpPost]
        [Route("createrole")]
        public async Task<IActionResult> CreateRole(CreateRoleCommand input)
        {
            var res = await _sender.Send(input);
            return Success(res.Value);
        }

        [HttpPost]
        [Route("createinterest")]
        public async Task<IActionResult> CreateInterest(CreateInterestCommand input)
        {
            var res = await _sender.Send(input);
            return Success(res.Value);
        }

        [HttpGet]
        [Route("getstatus")]
        public async Task<IActionResult> GetStatus()
        {
            var input = new GetUserStatusQuery();
            var res = await _sender.Send(input);
            return Success(res.Value);
        }
    }
}
