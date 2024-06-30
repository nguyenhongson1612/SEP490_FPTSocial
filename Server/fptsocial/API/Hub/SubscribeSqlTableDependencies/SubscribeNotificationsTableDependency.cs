using Application.Hub;
using Domain.CommandModels;
using TableDependency.SqlClient;
using TableDependency.SqlClient.Base;

namespace API.Hub.SubscribeSqlTableDependencies
{
    public class SubscribeNotificationsTableDependency : ISubscribeSqlTableDependency
    {
        SqlTableDependency<Notification> _notificationCommandTableDependency;
        NotificationsHub _notificationsHub;

        public SubscribeNotificationsTableDependency(NotificationsHub notificationsHub)
        {
            _notificationsHub = notificationsHub;
           
        }

        public void SubscribeTableDependency(string connectionString)
        {
            _notificationCommandTableDependency = new SqlTableDependency<Notification>(connectionString);
            _notificationCommandTableDependency.OnChanged += TableDependency_OnChanged;
            _notificationCommandTableDependency.OnError += TableDependency_OnError;
            _notificationCommandTableDependency.Start();
        }

        private async void TableDependency_OnChanged(object sender, TableDependency.SqlClient.Base.EventArgs.RecordChangedEventArgs<Notification> e)
        {
            string userId = e.Entity.UserId.ToString();
            if (e.ChangeType != TableDependency.SqlClient.Base.Enums.ChangeType.None)
            {
                await _notificationsHub.PushAllNotifyByUserIdWithTableDependency(userId);
            }
        }

        private void TableDependency_OnError(object sender, TableDependency.SqlClient.Base.EventArgs.ErrorEventArgs e)
        {
            Console.WriteLine($"{nameof(Notification)} SqlTableDependency error: {e.Error.Message}");
        }
    }
}
