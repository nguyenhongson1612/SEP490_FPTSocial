using Core.CQRS.Command;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Input;

namespace Application.Commands.UserProfile
{
    public class UserProfileCommand :ICommand<List<UserProfileCommandResult>>
    {
        public Guid UserId { get; set; }
    }
}
