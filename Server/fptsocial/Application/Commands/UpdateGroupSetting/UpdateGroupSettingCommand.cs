using Core.CQRS.Command;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Commands.UpdateGroupSetting
{
    public class UpdateGroupSettingCommand : ICommand<UpdateGroupSettingCommandResult>
    {
        public Guid? UserId { get; set; }
        public Guid GroupId { get; set; }
        public Guid GroupSettingId { get; set; }
        public Guid GroupStatusId { get; set; }
    }
}
