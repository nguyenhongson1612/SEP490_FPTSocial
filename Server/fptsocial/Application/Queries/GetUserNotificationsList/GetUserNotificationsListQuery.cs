using Core.CQRS.Query;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Queries.GetUserNotificationsList
{
    public  class GetUserNotificationsListQuery : IQuery<List<GetUserNotificationsListQueryResult>>
    {
        public Guid? UserId { get; set; }
    }
}
