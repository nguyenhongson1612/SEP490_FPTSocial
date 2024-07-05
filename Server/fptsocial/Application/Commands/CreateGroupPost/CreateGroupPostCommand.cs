using Core.CQRS.Command;
using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Input;

namespace Application.Commands.CreateGroupPost
{
    public class CreateGroupPostCommand : ICommand<CreateGroupPostCommandResult>
    {
        public Guid UserId { get; set; }
        public Guid GroupId { get; set; }
        public string Content { get; set; }
        public Guid GroupStatusId { get; set; }
        public IEnumerable<string>? Photos { get; set; }
        public IEnumerable<string>? Videos { get; set; }

    }
}
