using Application.Commands.CreateGender;
using Application.Commands.CreateGroupRole;
using Application.Commands.CreateGroupSetting;
using Application.Commands.CreateGroupTag;
using Application.Queries.GetAllGroupRole;
using Application.Queries.GetAllGroupSetting;
using Application.Queries.GetAllGroupTag;
using Application.Queries.GetGender;
using MediatR;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
    public class GroupEntityController : BaseController
    {
        private readonly ISender _sender;
        public GroupEntityController(ISender sender)
        {
            _sender = sender;
        }

        [HttpGet]
        [Route("getgrouprole")]
        public async Task<IActionResult> GetGroupRole()
        {
            var input = new GetAllGroupRoleQuery();
            var res = await _sender.Send(input);
            return Success(res.Value);
        }

        [Authorize(Roles = "Societe-student")]
        [HttpPost]
        [Route("creategrouprole")]
        public async Task<IActionResult> CreateGroupRole(CreateGroupRoleCommand input)
        {
            var res = await _sender.Send(input);
            return Success(res.Value);
        }

        [HttpGet]
        [Route("getgrouptag")]
        public async Task<IActionResult> GetGroupTag()
        {
            var input = new GetAllGroupTagQuery();
            var res = await _sender.Send(input);
            return Success(res.Value);
        }

        [Authorize(Roles = "Societe-student")]
        [HttpPost]
        [Route("creategrouptag")]
        public async Task<IActionResult> CreateGroupTag(CreateGroupTagCommand input)
        {
            var res = await _sender.Send(input);
            return Success(res.Value);
        }


        [HttpGet]
        [Route("getgroupsetting")]
        public async Task<IActionResult> GetGroupSetting()
        {
            var input = new GetAllGroupSettingQuery();
            var res = await _sender.Send(input);
            return Success(res.Value);
        }

        [Authorize(Roles = "Societe-student")]
        [HttpPost]
        [Route("creategroupsetting")]
        public async Task<IActionResult> CreateGroupSetting(CreateGroupSettingCommand input)
        {
            var res = await _sender.Send(input);
            return Success(res.Value);
        }
    }
}
