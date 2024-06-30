using AutoMapper;
using Core.Helper;
using Domain.CommandModels;
using Domain.Enums;
using Domain.Exceptions;
using Domain.QueryModels;
using Microsoft.EntityFrameworkCore.Query;
using Microsoft.Extensions.DependencyInjection;

namespace Application.Queries.GetNotifications
{
    public class GetNotifications : IGetNotifications
    {
        private readonly IMapper _mapper;
        private readonly IServiceProvider _serviceProvider;
        public GetNotifications(IServiceProvider serviceProvider, IMapper mapper)
        {
            _serviceProvider = serviceProvider;
            _mapper = mapper;
        }

        public Domain.QueryModels.UserProfile GetUserProfileByUserId(string userId)
        {
            using (var scope = _serviceProvider.CreateScope())
            {
                var _querycontext = scope.ServiceProvider.GetRequiredService<fptforumQueryContext>();
                if (_querycontext == null)
                {
                    throw new ErrorException(StatusCodeEnum.Context_Not_Found);
                }
                var user = _querycontext.UserProfiles.FirstOrDefault(x => x.UserId.Equals(Guid.Parse(userId)));

                if (user == null)
                {
                    throw new ErrorException(StatusCodeEnum.U01_Not_Found);
                }
                return user;
            }

        }

        public List<Domain.QueryModels.Notification> GetNotifyByUserId(string userId)
        {
            using (var scope = _serviceProvider.CreateScope())
            {
                var _querycontext = scope.ServiceProvider.GetRequiredService<fptforumQueryContext>();

                if (_querycontext == null)
                {
                    throw new ErrorException(StatusCodeEnum.Context_Not_Found);
                }
                var notice = _querycontext.Notification.Where(x => x.UserId.Equals(Guid.Parse(userId))).ToList();
                if (notice == null)
                {
                    throw new ErrorException(StatusCodeEnum.U01_Not_Found);
                }
                return notice;
            }
        }

        public List<Domain.QueryModels.Notification> GetNotifyBySenderId(string senderId)
        {
            using (var scope = _serviceProvider.CreateScope())
            {
                var _querycontext = scope.ServiceProvider.GetRequiredService<fptforumQueryContext>();

                if (_querycontext == null)
                {
                    throw new ErrorException(StatusCodeEnum.Context_Not_Found);
                }
                var notice = _querycontext.Notification.Where(x => x.SenderId.Equals(Guid.Parse(senderId))).ToList();
                if (notice == null)
                {
                    throw new ErrorException(StatusCodeEnum.U01_Not_Found);
                }
                return notice;
            }
        }
    }
}
