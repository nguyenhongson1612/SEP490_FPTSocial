﻿using Application.DTO.FriendDTO;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Queries.GetAllFriendOtherProfiel
{
    public class GetAllFriendOtherProfileQueryResult
    {
        public List<GetAllFriendDTO> AllFriend { get; set; }
        public int Count { get; set; }
    }
}
