﻿using Application.DTO.ReactDTO;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Queries.GetReactByCommentPhotoId
{
    public class GetReactByCommentPhotoIdQueryResult
    {
        public int SumOfReact { get; set; }
        public List<ReactCommentPhotoDTO>? ListCommentReact { get; set; }
        public List<ReactTypeCountDTO>? ListReact { get; set;}
    }
}
