﻿using Application.DTO.ReactDTO;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Queries.GetReactByPost
{
    public class GetReactByPostQueryResult
    {
        public int SumOfReact {  get; set; }
        public List<ReactPostDTO>? ListUserReact { get; set; }
    }
}
