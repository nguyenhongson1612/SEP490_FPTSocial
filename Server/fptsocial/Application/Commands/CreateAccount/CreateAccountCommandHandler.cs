using Application.Services;
using Core.CQRS;
using Core.CQRS.Command;
using Domain.CommandModels;
using Domain.QueryModels;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Commands.CreateAccount
{
    public class CreateAccountCommandHandler : ICommandHandler<CreateAccountCommand, CreateAccountCommandResult>
    {

        private readonly FptAccountServices _fptAccountServices;

        public CreateAccountCommandHandler(FptAccountServices fptAccountServices)
        {
            _fptAccountServices = fptAccountServices;
        }
        public async Task<Result<CreateAccountCommandResult>> Handle(CreateAccountCommand request, CancellationToken cancellationToken)
        {
            var result = new CreateAccountCommandResult();
            string pass = "";
            try
            {
                var user = await _fptAccountServices
                    .CreateChatAsync(request.Username, request.Email, request.FullName, request.RollNumber, request.Campus);
                var getuser = JObject.Parse(user);
                 pass = getuser["successUsers"]?[0]?["password"]?.ToString();
                
            }
            catch (Exception)
            {

                throw new Exception("API Error!");
            }
            
            result.UserName = request.Username;
            result.Email = request.Email;
            result.Password = pass;
            return Result<CreateAccountCommandResult>.Success(result);
        }
    }
}
