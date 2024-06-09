using API.Controllers;
using Application.Commands.CreateContactInfor;
using Application.Commands.CreateGender;
using Application.Commands.CreateRelationships;
using Application.Commands.CreateSettings;
using Application.Commands.CreateStatus;
using Application.Commands.GetUserProfile;
using Application.DTO.CreateUserDTO;
using Application.DTO.GetUserProfileDTO;
using Application.Queries.GenInterest;
using Application.Queries.GetGender;
using Application.Queries.GetUserByUserId;
using Application.Queries.GetUserProfile;
using Application.Queries.GetWebAffilication;
using AutoMapper;
using Domain.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Mappers
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            CreateMap<UserProfileCommand, UserProfile>()
                .ForMember(dist => dist.FirstName, opt => opt.MapFrom(src => src.FirstName))
                .ForMember(dist => dist.LastName, opt => opt.MapFrom(src => src.LastName))
                .ForMember(dist => dist.Email, opt => opt.MapFrom(src => src.Email))
                .ForMember(dist => dist.FeId, opt => opt.MapFrom(src => src.FeId))
                .ForMember(dist => dist.BirthDay, opt => opt.MapFrom(src => src.BirthDay))
                .ForMember(dist => dist.AboutMe, opt => opt.MapFrom(src => src.AboutMe))
                .ForMember(dist => dist.HomeTown, opt => opt.MapFrom(src => src.HomeTown))
                .ForMember(dist => dist.CoverImage, opt => opt.MapFrom(src => src.CoverImage))
                .ForMember(dist => dist.UserNumber, opt => opt.MapFrom(src => src.UserNumber));
            CreateMap<UserProfile,GetUserQueryResult>()
              .ForMember(dest => dest.RoleName, opt => opt.MapFrom(src => src.Role.NameRole))
            .ForMember(dest => dest.StatusId, opt => opt.MapFrom(src => src.UserStatus.UserStatusId))
            .ForMember(dest => dest.UserStatusName, opt => opt.MapFrom(src => src.UserStatus.StatusName))
            .ForMember(dest => dest.GenderId, opt => opt.MapFrom(src => src.UserGender.Gender.GenderId))
            .ForMember(dest => dest.GenderName, opt => opt.MapFrom(src => src.UserGender.Gender.GenderName))
            .ForMember(dest => dest.LookingFor, opt => opt.MapFrom(src => src.UserLookingFor.LookingFor.LookingForName))
            .ForMember(dest => dest.Relationship, opt => opt.MapFrom(src => src.UserRelationship.Relationship.RelationshipName))
            .ForMember(dest => dest.WebAffiliationUrl, opt => opt.MapFrom(src => src.WebAffiliations))
            .ForMember(dest => dest.AvataPhotosUrl, opt => opt.MapFrom(src => src.AvataPhotos));

            CreateMap<ContactInfo, GetUserContactInfo>().ForMember(dist => dist.StatusName, opt => opt.MapFrom(src => src.UserStatus.StatusName));
            CreateMap<Gender, GetGenderReuslt>();
            CreateMap<UserProfileCommand, UserProfileCommandResult>()
           .ForMember(dest => dest.UserId, opt => opt.Ignore()) // Ignore properties that are not in source
           .ForMember(dest => dest.RoleId, opt => opt.Ignore())
           .ForMember(dest => dest.IsFirstTimeLogin, opt => opt.Ignore())
           .ForMember(dest => dest.UserStatusId, opt => opt.Ignore())
           .ForMember(dest => dest.IsActive, opt => opt.Ignore())
           .ForMember(dest => dest.CreatedAt, opt => opt.Ignore())
           .ForMember(dest => dest.UpdatedAt, opt => opt.Ignore());
            CreateMap<Interest, GetInterestResult>();

            CreateMap<WebAffiliation, GetWebAffilicationResult>()
                .ForMember(dist => dist.UserName, opt => opt.MapFrom(src => src.User.FirstName + " " + src.User.LastName));

            CreateMap<UserProfile, GetUserByUserIdResult>()
            .ForMember(dest => dest.RoleName, opt => opt.MapFrom(src => src.Role.NameRole))
            .ForMember(dest => dest.StatusId, opt => opt.MapFrom(src => src.UserStatus.UserStatusId))
            .ForMember(dest => dest.UserStatusName, opt => opt.MapFrom(src => src.UserStatus.StatusName))
            .ForMember(dest => dest.GenderId, opt => opt.MapFrom(src => src.UserGender.Gender.GenderId))
            .ForMember(dest => dest.GenderName, opt => opt.MapFrom(src => src.UserGender.Gender.GenderName))
            .ForMember(dest => dest.LookingFor, opt => opt.MapFrom(src => src.UserLookingFor.LookingFor.LookingForName))
            .ForMember(dest => dest.Relationship, opt => opt.MapFrom(src => src.UserRelationship.Relationship.RelationshipName))
            .ForMember(dest => dest.WebAffiliationUrl, opt => opt.MapFrom(src => src.WebAffiliations))
            .ForMember(dest => dest.AvataPhotosUrl, opt => opt.MapFrom(src => src.AvataPhotos));

            CreateMap<WebAffiliation, GetUserWebAfflication>()
                .ForMember(dest => dest.WebAffiliationUrl, opt => opt.MapFrom(src => src.WebAffiliationUrl))
                .ForMember(dest => dest.UserStatusId, opt => opt.MapFrom(src => src.UserStatusId))
                .ForMember(dest => dest.StatusName, opt => opt.MapFrom(src => src.UserStatus.StatusName));

            CreateMap<AvataPhoto, GetUserAvatar>()
                .ForMember(dest => dest.AvataPhotosUrl, opt => opt.MapFrom(src => src.AvataPhotosUrl));
            ;

            CreateMap<Gender, CreateGenderCommandResult>();
            CreateMap<ContactInfo, CreateContactInforCommandResult>();
            CreateMap<UserStatus, CreateStatusCommandResult>();
            CreateMap<Relationship, CreateRelationShipCommandResult>();
            CreateMap<Setting, CreateSettingsCommandResult>();
        }
    }
}
