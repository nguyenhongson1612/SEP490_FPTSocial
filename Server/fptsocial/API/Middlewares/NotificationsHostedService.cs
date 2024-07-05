using API.Hub.SubscribeSqlTableDependencies;
using System.Configuration;

namespace API.Middlewares
{
    public class NotificationsHostedService : IHostedService
    {
        private readonly IServiceProvider _serviceProvider;
        private readonly IConfiguration _configuration;
        public NotificationsHostedService(IServiceProvider serviceProvider, IConfiguration configuration)
        {
            _serviceProvider = serviceProvider;
            _configuration = configuration;
        }

        public Task StartAsync(CancellationToken cancellationToken)
        {
            string connectionString = _configuration.GetSection("ConnectionStrings").GetSection("CommandConnection").Value;
            using (var scope = _serviceProvider.CreateScope())
            {
                var notificationsTableDependency = scope.ServiceProvider.GetRequiredService<SubscribeNotificationsTableDependency>();
                notificationsTableDependency.SubscribeTableDependency(connectionString); // Ensure this method exists
            }

            return Task.CompletedTask;
        }

        public Task StopAsync(CancellationToken cancellationToken)
        {
            return Task.CompletedTask;
        }
    }
}
