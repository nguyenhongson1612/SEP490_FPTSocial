using Core.CQRS.Query;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Queries.GetUserPostPhoto
{
    public class GetUserPostPhotoQuery : IQuery<GetUserPostPhotoResult>
    {
        public Guid UserPostPhotoId { get; set; }
    }
}
