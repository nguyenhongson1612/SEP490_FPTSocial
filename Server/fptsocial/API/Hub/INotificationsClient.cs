using API.Hub;
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
        Task ReceiveNotification(string message, string url);
        Task ReceiveNotification(string firstMessage, string secondMessage, string url);
        
    }
}
