using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.DTO.NotificationDTO
{
    public class NotificationOutDTO
    {
        public string SenderId { get; set; }
        public string ReciverId { get; set; }
        public string SenderAvatar { get; set; }
        public string Message { get; set; }
        public string Url { get; set; }
    }
}
