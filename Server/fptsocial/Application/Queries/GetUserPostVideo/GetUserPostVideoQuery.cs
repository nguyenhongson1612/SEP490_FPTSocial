using Application.DTO.GetUserProfileDTO;
using Application.DTO.UserPostVideoDTO;
using Core.CQRS.Query;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Queries.GetUserPostVideo
{
    public class GetUserPostVideoQuery : IQuery<GetUserPostVideoResult>
    {
        public Guid UserPostVideoId { get; set; }
    }
}
