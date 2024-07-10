using Application.DTO.NotificationDTO;
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
        public GetAvatarSenderDTO GetAvatarBySenderId(string senderId)
        {
            using (var scope = _serviceProvider.CreateScope())
            {
                GetAvatarSenderDTO getAvatarSenderDTO = new();
                var _querycontext = scope.ServiceProvider.GetRequiredService<fptforumQueryContext>();
                if (_querycontext == null)
                {
                    throw new ErrorException(StatusCodeEnum.Context_Not_Found);
                }
                var user = _querycontext.UserProfiles.FirstOrDefault(x => x.UserId.Equals(Guid.Parse(senderId)));
                var avatarUrl = _querycontext.AvataPhotos.FirstOrDefault(x => x.UserId.Equals(Guid.Parse(senderId)) && x.IsUsed == true);
                if (avatarUrl == null)
                {
                    getAvatarSenderDTO.UserProfile = user;
                    getAvatarSenderDTO.SenderAvatarURL = "";
                }
                else
                {
                    getAvatarSenderDTO.UserProfile = user;
                    getAvatarSenderDTO.SenderAvatarURL = avatarUrl.AvataPhotosUrl;
                }
                if (user == null)
                {
                    throw new ErrorException(StatusCodeEnum.U01_Not_Found);
                }



                return getAvatarSenderDTO;
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
                var notice = _querycontext.Notifications.Where(x => x.UserId == Guid.Parse(userId))
                                                        .OrderByDescending(x => x.CreatedAt)
                                                        .Take(10)
                                                        .ToList();
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
                var notice = _querycontext.Notifications.Where(x => x.SenderId.Equals(Guid.Parse(senderId))).ToList();
                if (notice == null)
                {
                    throw new ErrorException(StatusCodeEnum.U01_Not_Found);
                }
                return notice;
            }
        }

        public List<Domain.QueryModels.GroupMember> GetGroupMemberByGroupId(string groupId)
        {
            using (var scope = _serviceProvider.CreateScope())
            {
                var _querycontext = scope.ServiceProvider.GetRequiredService<fptforumQueryContext>();
                if (_querycontext == null)
                {
                    throw new ErrorException(StatusCodeEnum.Context_Not_Found);
                }
                var user = _querycontext.GroupMembers.Where(x => x.GroupId.Equals(Guid.Parse(groupId)) && x.IsJoined == true).ToList();

                if (user == null)
                {
                    throw new ErrorException(StatusCodeEnum.U01_Not_Found);
                }
                return user;
            }

        }

    }
}
