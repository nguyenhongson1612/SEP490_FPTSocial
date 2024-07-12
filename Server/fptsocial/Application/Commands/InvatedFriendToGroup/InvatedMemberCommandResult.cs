using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Commands.InvatedFriendToGroup
{
    public class InvatedMemberCommandResult
    {
        public string Message { get; set; }
        public Guid MemberId { get; set; }
        public bool Invated { get; set; }
    }
}
