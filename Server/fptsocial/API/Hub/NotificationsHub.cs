using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using API.Hub;
using Application.Commands.CreateNotifications;
using Application.Hub;
using Application.Queries.GetNotifications;
using Domain.Enums;
using Domain.Exceptions;
using Domain.QueryModels;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;
using Microsoft.AspNetCore.SignalR.Client;
using Microsoft.Extensions.Configuration;
using Microsoft.Net.Http.Headers;
using Newtonsoft.Json;


namespace Application.Hub
{
    public enum NotificationsTypeEnum
    {
        NORMAL,
        IMPORTANCE
    }
    
    public class NotificationsHub : Hub<INotificationsClient>
    {
        private readonly static ConnectionMapping<string> _connections =
            new ConnectionMapping<string>();

        HttpContext _httpContext;
        private readonly IConfiguration _configuration;
        public readonly ICreateNotifications _createNotifications;
        public readonly INotificationsHubBackgroundService _INotificationsHubBackgroundService;
        
        public NotificationsHub(IConfiguration configuration, INotificationsHubBackgroundService notificationsHubBackgroundService, ICreateNotifications createNotifications)
        {
            _configuration = configuration;
            _INotificationsHubBackgroundService = notificationsHubBackgroundService;
            _createNotifications = createNotifications;
        }

        public override async Task OnConnectedAsync()
        {
            //_connections.Add(Context.User?.Identity?.Name, Context.ConnectionId);
            //await Clients.Client(Context.ConnectionId).ReceiveNotification($"The {Context.User?.Identity?.Name} ({Context.ConnectionId}) connected success!");
                await Clients.Client(Context.ConnectionId).ReceiveNotification($"The  ({Context.ConnectionId}) connected success!");

        }
        public override async Task OnDisconnectedAsync(Exception? exception)
        {
            //_connections.Remove(Context.User.Identity.Name, Context.ConnectionId);
            await Clients.Client(Context.ConnectionId).ReceiveNotification($"The  ({Context.ConnectionId}) disconnected !");
           // return base.OnDisconnectedAsync(exception);
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

        public async Task PushNotifyToListUsers(string sender, string[] receiver, string content, string url)
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

        public async Task SendReactNotify(string notice)
        {

            await _INotificationsHubBackgroundService.SendReactNotifyService(Context ,notice);

        }

        public async Task PushAllNotifyByUserIdWithTableDependency(string userId)
        {

            await _INotificationsHubBackgroundService.PushAllNotifyByUserIdWithTableDependencyService(Context, userId);

        }

    }

}
