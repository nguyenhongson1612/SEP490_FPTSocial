using API.Controllers;
using Application.Commands.GetUserProfile;
using Application.DTO.CreateUserDTO;
using Application.DTO.GetUserProfileDTO;
using Application.Queries.GenInterest;
using Application.Queries.GetGender;
using Application.Queries.GetUserProfile;
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
             .ForMember(dist => dist.RoleName, opt => opt.MapFrom(src => src.Role.NameRole))
            .ForMember(dist => dist.UserStatusName , opt => opt.MapFrom(src => src.UserStatus.StatusName))
            .ForMember(dist => dist.Gender, opt => opt.MapFrom(src => src.UserGender.Gender.GenderName))
            .ForMember(dist => dist.LookingFor, opt => opt.MapFrom( src => src.UserLookingFor.LookingFor.LookingForName))
            .ForMember(dist => dist.Relationship, opt => opt.MapFrom( src => src.UserRelationship.Relationship.RelationshipName))
            ;

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
        }
    }
}
