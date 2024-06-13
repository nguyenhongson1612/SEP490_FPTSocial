using AutoMapper;
using Core.CQRS.Query;
using Domain.QueryModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Queries.CheckUserExist
{
    public class CheckUserExistQuery : IQuery<CheckUserExistQueryResult>
    {
        public string Email { get; set; }
        public string? FeId { get; set; }
    }
}
