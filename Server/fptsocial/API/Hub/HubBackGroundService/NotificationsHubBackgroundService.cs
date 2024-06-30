using Application.Commands.CreateNotifications;
using Application.Hub;
using Application.Queries.GetNotifications;
using Core.Helper;
using Domain.CommandModels;
using Domain.Enums;
using Domain.Exceptions;
using Domain.QueryModels;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore.Query;
using Microsoft.Net.Http.Headers;
using Newtonsoft.Json;
using System.IdentityModel.Tokens.Jwt;
using System.Threading;

namespace API.Hub
{
    public enum NotificationsTypeEnum
    {
        NORMAL,
        IMPORTANCE
    }
    
    public class NotificationsHubBackgroundService : BackgroundService, INotificationsHubBackgroundService
    {
        const string NORMAL = "Normal";
        private static readonly TimeSpan Period = TimeSpan.FromSeconds(3);
        private readonly ICreateNotifications _createNotifications;
        private readonly IGetNotifications _getNotifications;
        private readonly GuidHelper _helper;
        private readonly ILogger<NotificationsHubBackgroundService> _logger;
        private readonly IConfiguration _configuration;
        private readonly IHubContext<NotificationsHub, INotificationsClient> _hubContext;
        private readonly HubCallerContext _hubCallerContext;
        public NotificationsHubBackgroundService(ILogger<NotificationsHubBackgroundService> logger, IConfiguration configuration, IHubContext<NotificationsHub, INotificationsClient> hubContext,
            ICreateNotifications createNotifications, IGetNotifications getNotifications)
        {
            _helper = new GuidHelper();
            _logger = logger;
            _configuration = configuration;
            _createNotifications = createNotifications;
            _getNotifications = getNotifications;
            _hubContext = hubContext;
        }

        public async Task SendReactNotifyService(HubCallerContext context, string notice)
        {
            HttpContext _httpContext = context.GetHttpContext();
            dynamic routeOb = JsonConvert.DeserializeObject<dynamic>(notice);
            string receiverId = routeOb.Receiver;
            string url = routeOb.Url;
            string senderId = routeOb.Sender;
            Domain.QueryModels.UserProfile sender;

            //var rawToken = _httpContext.Request.Headers[HeaderNames.Authorization].ToString().Replace("Bearer ", "");
            //if (string.IsNullOrEmpty(rawToken))
            //{
            //    await ValueTask.CompletedTask;
            //}
            //var handle = new JwtSecurityTokenHandler();
            //var jsontoken = handle.ReadToken(rawToken) as JwtSecurityToken;
            //if (jsontoken == null)
            //{
            //    await ValueTask.CompletedTask;
            //}
            //string senderId = jsontoken.Claims.FirstOrDefault(claim => claim.Type == "userId").Value;
            using (fptforumQueryContext _querycontext = new fptforumQueryContext())
            {
                sender = _querycontext.UserProfiles.FirstOrDefault(x => x.UserId.Equals(Guid.Parse(senderId)));

                if (sender == null)
                {
                    throw new ErrorException(StatusCodeEnum.U01_Not_Found);
                }
            }
            string senderName = sender.FirstName + " " + sender.LastName;
            string notificationsMessage = _configuration.GetSection("MessageContents").GetSection("User-003").Value;
            string msg = senderName + notificationsMessage;
            //await _hubContext.Clients.User(receiverId).ReceiveNotification(msg, url);
            await _hubContext.Clients.All.ReceiveNotification(msg, url);

            await _createNotifications.CreateNotitfication(senderId, receiverId, msg, url);

        }

        public async Task PushAllNotifyByUserIdWithTableDependencyService(HubCallerContext context, string userId)
        {
            HttpContext _httpContext = context.GetHttpContext();
            List<Domain.QueryModels.Notification> notice = _getNotifications.GetNotifyByUserId(userId);

            string jsonNotice = System.Text.Json.JsonSerializer.Serialize(notice);


            //await _hubContext.Clients.User(receiverId).ReceiveNotification(msg, url);
            await _hubContext.Clients.All.ReceiveNotification(jsonNotice);


        }


        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            using PeriodicTimer timer = new PeriodicTimer(Period);
            while (!stoppingToken.IsCancellationRequested  && await timer.WaitForNextTickAsync(stoppingToken))
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
