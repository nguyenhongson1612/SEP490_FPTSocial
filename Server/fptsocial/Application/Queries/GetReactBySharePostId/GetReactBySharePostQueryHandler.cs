﻿using Application.DTO.ReactDTO;
using Application.Queries.GetReactByPost;
using AutoMapper;
using Core.CQRS;
using Core.CQRS.Query;
using Domain.Enums;
using Domain.Exceptions;
using Domain.QueryModels;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Queries.GetReactBySharePostId
{
    public class GetReactBySharePostQueryHandler : IQueryHandler<GetReactBySharePostQuery, GetReactBySharePostQueryResult>
    {
        private readonly fptforumQueryContext _context;
        private readonly IMapper _mapper;

        public GetReactBySharePostQueryHandler(fptforumQueryContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public async Task<Result<GetReactBySharePostQueryResult>> Handle(GetReactBySharePostQuery request, CancellationToken cancellationToken)
        {
            if (_context == null)
            {
                throw new ErrorException(StatusCodeEnum.Context_Not_Found);
            }

            bool isReact = false;

            // 1. Fetch Reactions and Include Related Data
            var listUserReact = await (from react in _context.ReactSharePosts
                                       join avata in _context.AvataPhotos on react.UserId equals avata.UserId into avataGroup
                                       from avata in avataGroup.Where(x => x.IsUsed == true).DefaultIfEmpty() // Left join
                                       where react.SharePostId == request.SharePostId
                                       orderby react.CreateDate descending
                                       select new ReactSharePostDTO
                                       {
                                           ReactSharePostId = react.ReactSharePostId,
                                           SharePostId = react.SharePostId,
                                           ReactTypeId = react.ReactTypeId,
                                           ReactName = react.ReactType.ReactTypeName,
                                           UserId = react.UserId,
                                           UserName = react.User.FirstName + react.User.LastName,
                                           CreatedDate = react.CreateDate,
                                           AvataUrl = avata != null ? avata.AvataPhotosUrl : null
                                       }
                                    ).ToListAsync(cancellationToken);

            var listReact = await (from reactComment in _context.ReactSharePosts
                                   where reactComment.SharePostId == request.SharePostId
                                   group reactComment by new { reactComment.ReactTypeId, reactComment.ReactType.ReactTypeName } into g // Group by ID and Name
                                   select new ReactTypeCountDTO // Use your existing DTO
                                   {
                                       ReactTypeId = g.Key.ReactTypeId,    // Access the grouped keys
                                       ReactTypeName = g.Key.ReactTypeName,
                                       NumberReact = g.Count()                   // Maintain consistent naming
                                   })
                                    .OrderByDescending(dto => dto.NumberReact)   // Sort by Count (not NumberReact)
                                    .ToListAsync(cancellationToken);

            var checkReact = await (_context.ReactSharePosts.Where(x => x.UserId == request.UserId && x.SharePostId == request.SharePostId)).ToListAsync(cancellationToken);

            if (checkReact.Count() != 0)
            {
                isReact = true;
            }

            // 2. Calculate Sum of Reactions
            var sumOfReacts = listUserReact.Count;

            // 3. Create Result
            var result = new GetReactBySharePostQueryResult
            {
                SumOfReact = sumOfReacts,
                ListUserReact = listUserReact,
                IsReact = isReact,
                ListReact = listReact
            };

            return Result<GetReactBySharePostQueryResult>.Success(result);
        }
        
    }
}
