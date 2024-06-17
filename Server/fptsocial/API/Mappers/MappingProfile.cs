using API.Controllers;
using Application.Commands.CreateContactInfor;
using Application.Commands.CreateGender;
using Application.Commands.CreateInterest;
using Application.Commands.CreateRelationships;
using Application.Commands.CreateRole;
using Application.Commands.CreateSettings;
using Application.Commands.CreateStatus;
using Application.Commands.CreateUserGender;
using Application.Commands.CreateUserInterest;
using Application.Commands.GetUserProfile;
using Application.DTO.CreateUserDTO;
using Application.Queries.GenInterest;
using Application.Queries.GetGender;
using Application.Queries.GetUserByUserId;
using Application.Queries.GetUserProfile;
using Application.Queries.GetWebAffilication;
using AutoMapper;
using Command = Domain.CommandModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Query = Domain.QueryModels;
using Application.DTO.GetUserProfileDTO;
using Application.Queries.GetOtherUser;
using Application.Commands.UpdateUserCommand;
using Application.Queries.GetUserStatus;
using Application.Queries.GetUserPost;

namespace Application.Mappers
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            CreateMap<UserProfileCommand, Command.UserProfile>()
                .ForMember(dist => dist.FirstName, opt => opt.MapFrom(src => src.FirstName))
                .ForMember(dist => dist.LastName, opt => opt.MapFrom(src => src.LastName))
                .ForMember(dist => dist.Email, opt => opt.MapFrom(src => src.Email))
                .ForMember(dist => dist.FeId, opt => opt.MapFrom(src => src.FeId))
                .ForMember(dist => dist.BirthDay, opt => opt.MapFrom(src => src.BirthDay))
                .ForMember(dist => dist.AboutMe, opt => opt.MapFrom(src => src.AboutMe))
                .ForMember(dist => dist.HomeTown, opt => opt.MapFrom(src => src.HomeTown))
                .ForMember(dist => dist.CoverImage, opt => opt.MapFrom(src => src.CoverImage))
                .ForMember(dist => dist.UserNumber, opt => opt.MapFrom(src => src.UserNumber));
            CreateMap<Query.UserProfile, GetUserQueryResult>()
              .ForMember(dest => dest.RoleName, opt => opt.MapFrom(src => src.Role.NameRole))
            .ForMember(dest => dest.StatusId, opt => opt.MapFrom(src => src.UserStatus.UserStatusId))
            .ForMember(dest => dest.UserStatusName, opt => opt.MapFrom(src => src.UserStatus.StatusName))
            .ForMember(dest => dest.GenderId, opt => opt.MapFrom(src => src.UserGender.Gender.GenderId))
            .ForMember(dest => dest.GenderName, opt => opt.MapFrom(src => src.UserGender.Gender.GenderName))
            .ForMember(dest => dest.Relationship, opt => opt.MapFrom(src => src.UserRelationship.Relationship.RelationshipName))
            .ForMember(dest => dest.WebAffiliationUrl, opt => opt.MapFrom(src => src.WebAffiliations))
            .ForMember(dest => dest.AvataPhotosUrl, opt => opt.MapFrom(src => src.AvataPhotos));

            CreateMap<Query.Gender, GetGenderReuslt>();
            CreateMap<UserProfileCommand, UserProfileCommandResult>()
           .ForMember(dest => dest.UserId, opt => opt.Ignore()) // Ignore properties that are not in source
           .ForMember(dest => dest.RoleId, opt => opt.Ignore())
           .ForMember(dest => dest.IsFirstTimeLogin, opt => opt.Ignore())
           .ForMember(dest => dest.UserStatusId, opt => opt.Ignore())
           .ForMember(dest => dest.IsActive, opt => opt.Ignore())
           .ForMember(dest => dest.CreatedAt, opt => opt.Ignore())
           .ForMember(dest => dest.UpdatedAt, opt => opt.Ignore());
            CreateMap<Query.Interest, GetInterestResult>();
            CreateMap<Command.UserInterest, UserInterestCommandResult>();
            CreateMap<Query.WebAffiliation, GetWebAffilicationResult>()
                .ForMember(dist => dist.UserName, opt => opt.MapFrom(src => src.User.FirstName + " " + src.User.LastName));

            CreateMap<Query.UserProfile, GetUserByUserIdResult>()
            .ForMember(dest => dest.RoleName, opt => opt.MapFrom(src => src.Role.NameRole))
            .ForMember(dest => dest.UserStatusName, opt => opt.MapFrom(src => src.UserStatus.StatusName));


            CreateMap<Query.UserProfile, GetOtherUserQueryResult>();
            CreateMap<UpdateUserCommand, Query.UserProfile>();
            CreateMap<Query.UserPost, GetUserPostResult>();

            CreateMap<Command.Gender, CreateGenderCommandResult>();
            CreateMap<Command.ContactInfo, CreateContactInforCommandResult>();
            CreateMap<Command.UserStatus, CreateStatusCommandResult>();
            CreateMap<Command.Relationship, CreateRelationShipCommandResult>();
            CreateMap<Command.Setting, CreateSettingsCommandResult>();
            CreateMap<Command.Role, CreateRoleCommandResult>();
            CreateMap<Command.Interest, CreateInterestCommandResult>();
            CreateMap<CreateUserGenderCommand, Command.UserGender>();
            CreateMap<Command.UserGender, CreateUserGenderCommandResult>();



            //Mapping for getuser
            CreateMap<Query.WorkPlace, GetUserWorkPlaceDTO>();
            CreateMap<Query.UserInterest, GetUserInterers>()
                .ForMember(dest => dest.InteresName, opt => opt.MapFrom(src => src.Interest.InterestName))
                .ForMember(dest => dest.StatusName, opt => opt.MapFrom(src => src.UserStatus.StatusName));
            CreateMap<Query.ContactInfo, GetUserContactInfo>()
                .ForMember(dest => dest.StatusName, opt => opt.MapFrom(src => src.UserStatus.StatusName));
            CreateMap<Query.UserGender, GetUserGenderDTO>()
                .ForMember(dest => dest.StatusName, opt => opt.MapFrom(src => src.UserStatus.StatusName))
                .ForMember(dest => dest.GenderName, opt => opt.MapFrom(src => src.Gender.GenderName));
            CreateMap<Query.UserRelationship, GetUserWorkPlaceDTO>();
            CreateMap<Query.AvataPhoto, GetUserAvatar>()
               .ForMember(dest => dest.StatusName, otp => otp.MapFrom(src => src.UserStatus.StatusName));
            CreateMap<Query.UserRelationship, GetUserRelationship>()
                .ForMember(dest => dest.StatusName, otp => otp.MapFrom(src => src.UserStatus.StatusName));
            CreateMap<Query.WebAffiliation, GetUserWebAfflication>();

            //update user
            CreateMap<UpdateUserCommand, Command.UserProfile>();
            CreateMap<UpdateUserCommand, UpdateUserCommandResult>();
            CreateMap<Query.AvataPhoto, Command.AvataPhoto>();
            CreateMap<Query.UserGender, Command.UserGender>();
            CreateMap<Query.ContactInfo, Command.ContactInfo>();
            CreateMap<Query.Relationship, Command.Relationship>();
            CreateMap<Query.WebAffiliation, Command.WebAffiliation>();
            CreateMap<Query.Interest, Command.Interest>();
            CreateMap<Query.WorkPlace, Command.WorkPlace>();


            CreateMap<Query.UserStatus, GetUserStatusQueryResult>();
        }
    }
}
