using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Application.Hub;
using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.Configuration;

namespace Application.Hub
{
    public class NotificationsHub : Microsoft.AspNetCore.SignalR.Hub
    {
        private readonly IConfiguration _configuration;
        public NotificationsHub(IConfiguration configuration)
        {
            _configuration = configuration;
        }
        public override async Task OnConnectedAsync()
        {

            //await Clients.Client(Context.ConnectionId).ReceiveNotification($"The {Context.User?.Identity?.Name} ({Context.ConnectionId}) connected success!");
            await Clients.All.SendAsync("ReceiveMessage",$"The ({Context.ConnectionId}) connected success!");
            base.OnConnectedAsync();

        }

        public async Task SendNotifications(string message)
        {
            //await Clients.Client(Context.ConnectionId).ReceiveNotification(message);
            //await Clients.All.ReceiveNotification($"{Context.ConnectionId} :{message}");
        }



    }

}
