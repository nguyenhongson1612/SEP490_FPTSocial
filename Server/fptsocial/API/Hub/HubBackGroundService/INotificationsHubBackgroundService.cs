using Microsoft.AspNetCore.SignalR;

namespace API.Hub
{
    public interface INotificationsHubBackgroundService
    {
        public Task SendReactNotifyService(HubCallerContext context, string notice);
        public Task PushAllNotifyByUserIdWithTableDependencyService(HubCallerContext context, string userId);
    }
}
