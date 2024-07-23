using Core.CQRS.Command;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Input;

namespace Application.Commands.UpdateGroupPostCommand
{
    public class UpdateGroupPostCommand : ICommand<UpdateGroupPostCommandResult>
    {
        public Guid UserId { get; set; }
        public Guid GroupPostId { get; set; }
        public Guid GroupId { get; set; }
        public string Content { get; set; }
        public IEnumerable<string>? Photos { get; set; }
        public IEnumerable<string>? Videos { get; set; }
    }
}
