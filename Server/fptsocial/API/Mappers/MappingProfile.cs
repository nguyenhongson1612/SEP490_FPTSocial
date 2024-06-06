using API.Controllers;
using Application.Commands.UserProfile;
using Application.Queries.UserProfile;
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
            CreateMap<UserProfile,GetUserQueryResult>()
             .ForMember(dist => dist.RoleName, opt => opt.MapFrom(src => src.Role.NameRole))
            .ForMember(dist => dist.UserStatusName , opt => opt.MapFrom(src => src.UserStatus.StatusName))
            .ForMember(dist => dist.Gender, opt => opt.MapFrom(src => src.UserGender.Gender.GenderName))
            .ForMember(dist => dist.LookingFor, opt => opt.MapFrom( src => src.UserLookingFor.LookingFor.LookingForName))
            .ForMember(dist => dist.Relationship, opt => opt.MapFrom( src => src.UserRelationship.Relationship.RelationshipName))
            ;

            CreateMap<ContactInfo, GetUserContactInfo>().ForMember(dist => dist.StatusName, opt => opt.MapFrom(src => src.UserStatus.StatusName));
        }
    }
}
