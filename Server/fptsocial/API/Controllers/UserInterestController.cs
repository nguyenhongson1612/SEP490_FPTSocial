using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.Commands.CreateUserInterest;
using Application.Queries.GenInterest;
using Application.Queries.GetGender;
using MediatR;
using Microsoft.AspNetCore.Mvc;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace API.Controllers
{
    [Route("api/[controller]")]
    public class UserInterestController : BaseController
    {
        private readonly ISender _sender;
        public UserInterestController(ISender sender)
        {
            _sender = sender;
        }

        [ValidateAntiForgeryToken]
        [HttpPost]
        [Route("postuserinterest")]
        public async Task<IActionResult> CreateUserInterest(UserInterestCommand userInterest)
        {
            var res = await _sender.Send(userInterest);
            return Success(res.Value);
        }
    }
}

