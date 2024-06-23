using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.DTO.FriendDTO
{
    public class GetAllFriendDTO
    {
        public Guid FriendId { get; set; }
        public string FriendName { get; set; }
        public string Avata { get; set; }
    }
}
