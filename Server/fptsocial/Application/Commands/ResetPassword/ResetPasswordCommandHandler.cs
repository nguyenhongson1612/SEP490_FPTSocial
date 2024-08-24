using Application.Commands.CreateAccount;
using Application.Services;
using Core.CQRS;
using Core.CQRS.Command;
using Domain.Exceptions;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Xml.Linq;

namespace Application.Commands.ResetPassword
{
    public class ResetPasswordCommandHandler : ICommandHandler<ResetPasswordCommand, ResetPasswordCommandResult>
    {

        private readonly FptAccountServices _fptAccountServices;

        public ResetPasswordCommandHandler(FptAccountServices fptAccountServices)
        {
            _fptAccountServices = fptAccountServices;
        }
        public async Task<Result<ResetPasswordCommandResult>> Handle(ResetPasswordCommand request, CancellationToken cancellationToken)
        {
            var result = new ResetPasswordCommandResult();
            string email = "";
            string password = "";
            bool st = true;
            var user = await _fptAccountServices
                .ResetPassAsync(request.Username);
            var jsonObject = JObject.Parse(user);
            var getpass = jsonObject["result"];
            var status = jsonObject["status"];
            if (status != null) {
                st = (bool)status;
                if (st == false)
                {
                    throw new ErrorException(Domain.Enums.StatusCodeEnum.RGT02_Does_Not_Existed);
                }
            }
            
            foreach (var item in getpass)
            {
                email = ((JProperty)item).Name;
                password = ((JProperty)item).Value.ToString();
            } 

            result.Username = request.Username;
            result.Password = password;
            return Result<ResetPasswordCommandResult>.Success(result);
        }
    }
}
