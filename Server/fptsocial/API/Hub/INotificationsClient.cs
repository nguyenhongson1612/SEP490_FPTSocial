using Domain.CommandModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Hub
{
    public interface INotificationsClient
    {
        Task ReceiveNotification(string message);
        Task ReceiveNotification(string firstMessage, string secondMessage);
        Task ReceiveNotification(string events, string firstMessage, string secondMessage);
        Task ReceiveNotification(string events,UserProfile userProfile, string firstMessage, string secondMessage);
        Task ReceiveNotification(object events, UserProfile userProfile, string firstMessage, string secondMessage);
    }
}
