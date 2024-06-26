using Application.Commands.CreateReportType;
using Application.Commands.CreateUserGender;
using MediatR;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

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
    }
}
