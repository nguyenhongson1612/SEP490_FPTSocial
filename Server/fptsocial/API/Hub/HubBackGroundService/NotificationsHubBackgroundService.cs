using Application.Commands.CreateNotifications;
using Application.DTO.NotificationDTO;
using Application.Hub;
using Application.Queries.GetNotifications;
using Core.Helper;
using Domain.Enums;
using Domain.Exceptions;
using Domain.Extensions;
using Microsoft.AspNetCore.SignalR;
using Newtonsoft.Json;
using System.IdentityModel.Tokens.Jwt;

namespace API.Hub
{
    public enum NotificationsTypeEnum
    {
        NORMAL,
        IMPORTANCE
    }

    public class NotificationsHubBackgroundService : BackgroundService, INotificationsHubBackgroundService
    {
        const string SEC = ")s%ec!r_e-t?^(";
        const string NORMAL = "Normal";
        private static readonly TimeSpan Period = TimeSpan.FromSeconds(3);
        private readonly ConnectionMapping<string> _connections;
        private readonly ICreateNotifications _createNotifications;
        private readonly IGetNotifications _getNotifications;
        private readonly GuidHelper _helper;
        private readonly SplitString _splitString;
        private readonly ILogger<NotificationsHubBackgroundService> _logger;
        private readonly IConfiguration _configuration;
        private readonly IHubContext<NotificationsHub, INotificationsClient> _hubContext;
        private readonly HubCallerContext _hubCallerContext;
        private readonly List<NotificationOutDTO> _listNotificationOutDTO;
        public NotificationsHubBackgroundService(ILogger<NotificationsHubBackgroundService> logger, IConfiguration configuration, IHubContext<NotificationsHub, INotificationsClient> hubContext,
            ICreateNotifications createNotifications, IGetNotifications getNotifications, ConnectionMapping<string> connections)
        {
            _helper = new GuidHelper();
            _logger = logger;
            _configuration = configuration;
            _createNotifications = createNotifications;
            _getNotifications = getNotifications;
            _hubContext = hubContext;
            _connections = connections;
            _splitString = new SplitString();
            _listNotificationOutDTO = new();
        }

        public async Task SendNotifyService(HubCallerContext context, string notice)
        {
            HttpContext _httpContext = context.GetHttpContext();
            dynamic routeOb = JsonConvert.DeserializeObject<dynamic>(notice);
            string receiverId = routeOb.Receiver;
            string url = routeOb.Url;
            string code = routeOb.MsgCode;
            string addMsg = routeOb.AddMsg;
            Domain.QueryModels.UserProfile sender;

            if (_httpContext == null)
            {
                throw new ErrorException(StatusCodeEnum.Context_Not_Found);
            }
            var rawToken = _httpContext.Request.Query["access_token"];

            var path = _httpContext.Request.Path;
            if (string.IsNullOrEmpty(rawToken) &&
                (!path.StartsWithSegments("/notificationsHub")))
            {
                await _hubContext.Clients.Client(context.ConnectionId).ReceiveNotification($"The  ({context.ConnectionId}) Connected Fail!");
            }
            var handle = new JwtSecurityTokenHandler();
            var jsontoken = handle.ReadToken(rawToken) as JwtSecurityToken;
            if (jsontoken == null)
            {
                await _hubContext.Clients.Client(context.ConnectionId).ReceiveNotification($"The  ({context.ConnectionId}) Connected Fail!");
            }
            var senderId = jsontoken.Claims.FirstOrDefault(claim => claim.Type == "userId").Value;


            //using (fptforumQueryContext _querycontext = new fptforumQueryContext())
            //{
            //    sender = _querycontext.UserProfiles.FirstOrDefault(x => x.UserId.Equals(Guid.Parse(senderId)));

            //    if (sender == null)
            //    {
            //        throw new ErrorException(StatusCodeEnum.U01_Not_Found);
            //    }
            //}
            var senderInfo = _getNotifications.GetAvatarBySenderId(senderId);

            string senderName = senderInfo.UserProfile.FirstName + " " + senderInfo.UserProfile.LastName;
            string notificationsMessage = _configuration.GetSection("MessageContents").GetSection(code).Value;
            string msgDB = senderName + SEC + notificationsMessage + addMsg;
            string msg = notificationsMessage + addMsg;
            NotificationOutDTO notificationOutDTO = new()
            {
                SenderId = senderId,
                SenderName = senderName,
                //ReciverId = receiverId,
                SenderAvatar = senderInfo.SenderAvatarURL,
                Message = msg,
                Url = url

            };
            string jsonNotice = System.Text.Json.JsonSerializer.Serialize(notificationOutDTO);
            //await _hubContext.Clients.All.ReceiveNotification(msg, url);
            //var receiverConnectId = _connections.GetConnections(receiverId);
            foreach (var connectionId in _connections.GetConnections(receiverId))
            {
                await _hubContext.Clients.Client(connectionId).ReceiveNotification(jsonNotice);
            }


            //await _hubContext.Clients.All.ReceiveNotification(jsonNotice);

            await _createNotifications.CreateNotitfication(senderId, receiverId, msgDB, url);

        }

        public async Task SendGroupNotifyService(HubCallerContext context, string notice)
        {
            HttpContext _httpContext = context.GetHttpContext();
            dynamic routeOb = JsonConvert.DeserializeObject<dynamic>(notice);
            string groupId = routeOb.Receiver;
            string url = routeOb.Url;
            string code = routeOb.MsgCode;
            string addMsg = routeOb.AddMsg;
            //Domain.QueryModels.UserProfile sender;

            if (_httpContext == null)
            {
                throw new ErrorException(StatusCodeEnum.Context_Not_Found);
            }
            var rawToken = _httpContext.Request.Query["access_token"];

            var path = _httpContext.Request.Path;
            if (string.IsNullOrEmpty(rawToken) &&
                (!path.StartsWithSegments("/notificationsHub")))
            {
                await _hubContext.Clients.Client(context.ConnectionId).ReceiveNotification($"The  ({context.ConnectionId}) Connected Fail!");
            }
            var handle = new JwtSecurityTokenHandler();
            var jsontoken = handle.ReadToken(rawToken) as JwtSecurityToken;
            if (jsontoken == null)
            {
                await _hubContext.Clients.Client(context.ConnectionId).ReceiveNotification($"The  ({context.ConnectionId}) Connected Fail!");
            }
            var senderId = jsontoken.Claims.FirstOrDefault(claim => claim.Type == "userId").Value;



            var senderInfo = _getNotifications.GetAvatarBySenderId(senderId);
            var groupMember = _getNotifications.GetGroupMemberByGroupId(groupId);

            string senderName = senderInfo.UserProfile.FirstName + " " + senderInfo.UserProfile.LastName;
            string notificationsMessage = _configuration.GetSection("MessageContents").GetSection(code).Value;
            string msgDB = senderName + SEC + notificationsMessage + addMsg;
            string msg = notificationsMessage + addMsg;
            NotificationOutDTO notificationOutDTO = new()
            {
                SenderId = senderId,
                SenderName = senderName,
                //ReciverId = receiverId,
                SenderAvatar = senderInfo.SenderAvatarURL,
                Message = msg,
                Url = url

            };
            string jsonNotice = System.Text.Json.JsonSerializer.Serialize(notificationOutDTO);
            //await _hubContext.Clients.All.ReceiveNotification(msg, url);
            //var receiverConnectId = _connections.GetConnections(receiverId);
            foreach (var receiver in groupMember)
            {
                foreach (var connectionId in _connections.GetConnections(receiver.UserId.ToString()))
                {
                    await _hubContext.Clients.Client(connectionId).ReceiveNotification(jsonNotice);
                    /// [OPTIMIZE] If create oke, i will a new create for group msg to move out create method of for loop
                    await _createNotifications.CreateNotitfication(senderId, receiver.UserId.ToString(), msgDB, url);
                }
            }


        }


        /// <summary>
        /// When the Receiver are connecting
        /// After Notification was created in DB, this method will be trigged and push list notifications to Receiver
        /// *Note: If Receiver disconnected or offline -> Use API 'GetNotificationsListByUserid' to get list Notifications when Receiver online
        /// </summary>
        /// <param name="context">This context transport from Notifications Hub</param>
        /// <param name="userId">ID of Receiver</param>
        /// <returns>
        /// 15 Newest Notificattions of Receiver
        /// </returns>
        public async Task PushAllNotifyByUserIdWithTableDependencyService(HubCallerContext context, string userId)
        {

            var receiverConnectId = _connections.GetConnections(userId);

            HttpContext _httpContext = context.GetHttpContext();
            List<Domain.QueryModels.Notification> rawNotice = _getNotifications.GetNotifyByUserId(userId);
            foreach (var noti in rawNotice)
            {
                if (noti.UserId == noti.SenderId)
                {
                    continue;
                }
                else
                {
                    NotificationOutDTO _notificationOutDTO = new();
                    var senderInfo = _getNotifications.GetAvatarBySenderId(noti.SenderId.ToString());

                    string senderName = senderInfo.UserProfile.FirstName + " " + senderInfo.UserProfile.LastName;

                    _notificationOutDTO.SenderId = noti.SenderId.ToString();
                    _notificationOutDTO.SenderName = senderName;
                    _notificationOutDTO.SenderAvatar = senderInfo.SenderAvatarURL;
                    _notificationOutDTO.Message = _splitString.SplitStringForNotify(noti.NotiMessage).Last();
                    _notificationOutDTO.Url = noti.NotifiUrl;
                    _listNotificationOutDTO.Add(_notificationOutDTO);
                } 

            }
            string jsonNotice = System.Text.Json.JsonSerializer.Serialize(_listNotificationOutDTO);

            foreach (var connectionId in receiverConnectId)
            {
                await _hubContext.Clients.Client(connectionId).listReceiveNotification(jsonNotice);
            }
            _listNotificationOutDTO.Clear();
            
        }


        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            using PeriodicTimer timer = new PeriodicTimer(Period);
            while (!stoppingToken.IsCancellationRequested && await timer.WaitForNextTickAsync(stoppingToken))
            {
                DateTime datetime = DateTime.Now;
                _logger.LogInformation($"excute {1}", nameof(NotificationsHubBackgroundService), datetime);


            }
        }
        public override Task StartAsync(CancellationToken cancellationToken)
        {
            return base.StartAsync(cancellationToken);
        }
        public override Task StopAsync(CancellationToken cancellationToken)
        {
            return base.StopAsync(cancellationToken);
        }
    }
}
