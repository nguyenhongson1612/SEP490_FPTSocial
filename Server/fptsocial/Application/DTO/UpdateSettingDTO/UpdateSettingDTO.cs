﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.DTO.UpdateSettingDTO
{
    public class UpdateSettingDTO
    {
        public Guid UserSettingId { get; set; }
        public Guid SettingId { get; set; }
        public Guid UserStatusId { get; set; }
    }
}
