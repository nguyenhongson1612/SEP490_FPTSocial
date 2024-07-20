using Application.Commands.CreateReportComment;
using Application.Commands.CreateReportType;
using Application.Commands.CreateUserGender;
using Application.Queries.GetReportType;
using MediatR;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Net.Http.Headers;
using System.IdentityModel.Tokens.Jwt;

namespace API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
    public class ReportController : BaseController
    {
        private readonly ISender _sender;
        public ReportController(ISender sender)
        {
            _sender = sender;
        }

        [Authorize(Roles = "Societe-student")]
        [HttpPost]
        [Route("createreporttype")]
        public async Task<IActionResult> CreateReportType(CreateReportTypeCommand input)
        {
            var res = await _sender.Send(input);
            return Success(res.Value);
        }

        [HttpGet]
        [Route("getreporttype")]
        public async Task<IActionResult> GetReportType()
        {
            var input = new GetReportTypeQuery();
            var res = await _sender.Send(input);
            return Success(res.Value);
        }

        [HttpPost]
        [Route("createReportComment")]
        public async Task<IActionResult> CreateReportComment([FromQuery] CreateReportCommentCommand input)
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
            input.ReportById = Guid.Parse(jsontoken.Claims.FirstOrDefault(claim => claim.Type == "userId").Value);
            var res = await _sender.Send(input);
            return Success(res.Value);
        }
    }
}
