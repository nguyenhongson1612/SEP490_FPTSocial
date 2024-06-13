using Domain.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Queries.CheckUserExist
{
    public class CheckUserExistQueryResult
    {
        public StatusCodeEnum enumcode { get;set; }
        public string Message { get; set; }
    }
}
