using AutoMapper;
using Core.Helper;
using Domain.CommandModels;
using Domain.Enums;
using Domain.Exceptions;
using Domain.QueryModels;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.InteropServices;
using System.Text;
using System.Threading.Tasks;

namespace Application.Commands.CreateNotifications
{
    public enum NotificationsTypeEnum
    {
        NORMAL,
        IMPORTANCE
    }
    

    public class CreateNotifications : ICreateNotifications
    {
        const string NORMAL = "Normal";
        private readonly GuidHelper _helper;
        private readonly IServiceProvider _serviceProvider;
        public CreateNotifications(IServiceProvider serviceProvider)
        {
            _helper = new GuidHelper();
            _serviceProvider = serviceProvider;
        }
        public async Task CreateNotitfication(string senderId, string receiverId, string notiMessage, string notifiUrl, [Optional] NotificationsTypeEnum? notificationsTypeEnum)
        {
            
            using (var scope = _serviceProvider.CreateScope())
            {
                Domain.CommandModels.Notification _notification = new();
                var _querycontext = scope.ServiceProvider.GetRequiredService<fptforumQueryContext>();
                var _commandcontext = scope.ServiceProvider.GetRequiredService<fptforumCommandContext>();
                if (_querycontext == null || _commandcontext == null)
                {
                    throw new ErrorException(StatusCodeEnum.Context_Not_Found);
                }
                Domain.QueryModels.UserStatus receiverStatus = await _querycontext.UserStatuses.FirstOrDefaultAsync(x => x.UserStatusId.Equals(Guid.Parse(receiverId)));
                if (receiverStatus == null)
                {
                    throw new ErrorException(StatusCodeEnum.Error);
                }
                
                if (notificationsTypeEnum != null)
                {
                    Domain.QueryModels.NotificationType receiverTypeE = await _querycontext.NotificationTypes.FirstOrDefaultAsync(x => x.NotificationTypeName.Equals(notificationsTypeEnum));
                    if (receiverTypeE == null)
                    {
                        throw new ErrorException(StatusCodeEnum.NT01_Not_Found);
                    }
                    _notification.NotificationTypeId = receiverTypeE.NotificationTypeId;
                }
                if (notificationsTypeEnum == null)
                {
                    Domain.QueryModels.NotificationType receiverTypeE = await _querycontext.NotificationTypes.FirstOrDefaultAsync(x => x.NotificationTypeName.Equals(NORMAL));
                    if (receiverTypeE == null)
                    {
                        throw new ErrorException(StatusCodeEnum.NT01_Not_Found);
                    }
                    _notification.NotificationTypeId = receiverTypeE.NotificationTypeId;
                }
                _notification.NotificationId = _helper.GenerateNewGuid();
                _notification.UserId = Guid.Parse(receiverId);
                _notification.SenderId = Guid.Parse(senderId);
                _notification.NotiMessage = notiMessage;
                _notification.UserStatusId = receiverStatus.UserStatusId;
                _notification.IsRead = false;
                _notification.CreatedAt = DateTime.Now;
                _notification.NotifiUrl = notifiUrl;
                try
                {
                    _commandcontext.Notification.Add(_notification);
                    await _commandcontext.SaveChangesAsync();
                }
                catch (Exception ex)
                {
                    Console.WriteLine(ex.Message);
                }
            }   

        }

    }
}
