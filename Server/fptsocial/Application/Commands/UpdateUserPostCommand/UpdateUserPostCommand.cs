using Core.CQRS.Command;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Input;

namespace Application.Commands.UpdateUserPostCommand
{
    public class UpdateUserPostCommand : ICommand<UpdateUserPostCommandResult>
    {
        public Guid UserId { get; set; }
        public Guid UserPostId { get; set; }
        public string Content { get; set; }
        public Guid UserStatusId { get; set; }
        public IEnumerable<string>? Photos { get; set; }
        public IEnumerable<string>? Videos { get; set; }
    }
}
