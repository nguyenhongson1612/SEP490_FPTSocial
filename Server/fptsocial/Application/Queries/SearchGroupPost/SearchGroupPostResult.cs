﻿using Application.Queries.GetGroupPostByGroupId;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Queries.SearchGroupPost
{
    public class SearchGroupPostResult
    {
        public List<GetGroupPostByGroupIdResult>? GroupPost {  get; set; }
    }
}
