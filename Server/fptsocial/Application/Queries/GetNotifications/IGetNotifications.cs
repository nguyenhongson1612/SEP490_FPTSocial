using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Queries.GetNotifications
{
    public interface IGetNotifications
    {
        public Domain.QueryModels.UserProfile GetUserProfileByUserId(string userId);
        public List<Domain.QueryModels.Notification> GetNotifyByUserId(string userId);
        public List<Domain.QueryModels.Notification> GetNotifyBySenderId(string senderId);
    }
}
