using Application.DTO.CreateUserDTO;
using Application.DTO.UpdateUserDTO;
using Core.CQRS.Command;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Commands.UpdateUserCommand
{
    public class UpdateUserCommand : ICommand<UpdateUserCommandResult>
    {
        public Guid? UserId { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public DateTime BirthDay { get; set; }
        public UpdateUserGenderDTO? Gender { get; set; }
        public UpdateUserContactInforDTO? ContactInfor { get; set; }
        public UpdateUserRelationshipDTO? Relationship { get; set; }
        public string? AboutMe { get; set; }
        public string? HomeTown { get; set; }
        public string? CoverImage { get; set; }
        public string? Avataphoto { get; set; }
        public List<UpdateUserInteresDTO>? Interes { get; set; }
        public List<UpdateUserWorkPlaceDTO>? WorkPlace { get; set; }
        public List<UpdateUserWebAffilicationDTO>? WebAffilication { get; set; }
    }
}
