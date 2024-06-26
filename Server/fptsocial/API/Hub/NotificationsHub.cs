using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using API.Hub;
using Application.Hub;
using Microsoft.AspNetCore.SignalR;
using Microsoft.AspNetCore.SignalR.Client;
using Microsoft.Extensions.Configuration;

namespace Application.Hub
{
    public class NotificationsHub : Hub<INotificationsClient>
    {
        private readonly static ConnectionMapping<string> _connections =
            new ConnectionMapping<string>();
        
        private readonly IConfiguration _configuration; 
        //private readonly HubConnection _hubConnection;

        public NotificationsHub(IConfiguration configuration)
        {
            _configuration = configuration;
            //_hubConnection = hubConnection;
        }
        public override async Task OnConnectedAsync()
        {
            _connections.Add(Context.User?.Identity?.Name, Context.ConnectionId);
            await Clients.Client(Context.ConnectionId).ReceiveNotification($"The {Context.User?.Identity?.Name} ({Context.ConnectionId}) connected success!");
            Console.WriteLine(Context.ConnectionId + "Is connect to hub!");
            base.OnConnectedAsync();
            

        }
        public override Task OnDisconnectedAsync(Exception? exception)
        {
            _connections.Remove(Context.User.Identity.Name, Context.ConnectionId);
            return base.OnDisconnectedAsync(exception);
        }

        public void OnReconnected()
        {

                if (!_connections.GetConnections(Context.User.Identity.Name).Contains(Context.ConnectionId))
                {
                    _connections.Add(Context.User.Identity.Name, Context.ConnectionId);
                }

        }
        //===================================================================================== Notify For Admin/Staff's Actions ===================================================================================== 
        public async Task PushNotifyToAllUsers(string sender, string content, string url)
        {

            string msg = sender + _configuration["MessageContents:Common-004"] + content;
            await Clients.All.ReceiveNotification(msg, url);
            
        }

        public async Task PushNotifyToListUsers(string sender, string [] receiver, string content, string url)
        {
            string msg = sender + _configuration["MessageContents:Common-004"] + content;
            await Clients.Users(receiver).ReceiveNotification(msg, url);

        }

        public async Task PushNotifyToUser(string sender, string receiver, string content, string url)
        {
            string msg = sender + _configuration["MessageContents:Common-004"] + content;
            await Clients.User(receiver).ReceiveNotification(msg, url);

        }
        //===================================================================================== Notify For Member's Actions ===================================================================================== 
        public async Task SendAddFriendReqNotify(string sender, string receiver, string url)
        {
            string msg = sender + _configuration["MessageContents:User-001"];
            await Clients.User(receiver).ReceiveNotification(msg, url);

        }


    }

}
