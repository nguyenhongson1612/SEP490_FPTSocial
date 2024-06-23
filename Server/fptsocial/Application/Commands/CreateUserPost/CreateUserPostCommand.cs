using Core.CQRS.Command;
using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Input;

namespace Application.Commands.Post
{
    public class CreateUserPostCommand : ICommand<CreateUserPostCommandResult>
    {
       public Guid UserId { get; set; }
       public string Content { get; set; }
       public Guid UserStatusId { get; set; }
       public string UserPostNumber { get; set; }
        public IEnumerable<string>? Photos { get; set; }
        public IEnumerable<string>? Videos { get; set; }

    }
}
