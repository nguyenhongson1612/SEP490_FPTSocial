using Core.CQRS.Command;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Commands.CreateGroupCommand
{
    public class CreateGroupCommand : ICommand<CreateGroupCommandResult>
    {
        public string? GroupNumber { get; set; }
        public string GroupName { get; set; }
        public string GroupDescription { get; set; } 
        public Guid? CreatedById { get; set; }
    }
}
