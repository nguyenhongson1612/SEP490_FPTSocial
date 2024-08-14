﻿using Application.DTO.ReactDTO;
using Application.Queries.GetPost;
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

namespace Application.Queries.GetReactByGroupVideoPost
{
    public class GetReactByGroupVideoPostQueryHandler : IQueryHandler<GetReactByGroupVideoPostQuery, GetReactByGroupVideoPostQueryResult>
    {
        private readonly fptforumQueryContext _context;
        private readonly IMapper _mapper;

        public GetReactByGroupVideoPostQueryHandler(fptforumQueryContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public async Task<Result<GetReactByGroupVideoPostQueryResult>> Handle(GetReactByGroupVideoPostQuery request, CancellationToken cancellationToken)
        {
            if (_context == null)
            {
                throw new ErrorException(StatusCodeEnum.Context_Not_Found);
            }
            bool isReact = false;
            // 1. Fetch Reactions and Include Related Data
            var listUserReact = await (from react in _context.ReactGroupVideoPosts
                                        join avata in _context.AvataPhotos on react.UserId equals avata.UserId into avataGroup
                                        from avata in avataGroup.Where(x => x.IsUsed == true).DefaultIfEmpty() // Left join
                                        where react.GroupPostVideoId == request.GroupPostVideoId
                                        orderby react.CreatedDate descending
                                        select new ReactGroupVideoPostDTO
                                        {
                                            ReactGroupVideoPostId = react.ReactGroupVideoPostId,
                                            GroupPostVideoId = react.GroupPostVideoId,
                                            ReactTypeId = react.ReactTypeId,
                                            ReactName = react.ReactType.ReactTypeName,
                                            UserId = react.UserId,
                                            UserName = react.User.FirstName + react.User.LastName,
                                            CreatedDate = react.CreatedDate,
                                            AvataUrl = avata != null ? avata.AvataPhotosUrl : null
                                        }
                                    ).ToListAsync(cancellationToken);

            var listReact = await (from reactType in _context.ReactTypes // Start from ReactTypes
                                   join react in _context.ReactGroupVideoPosts.Where(r => r.GroupPostVideoId == request.GroupPostVideoId)
                                       on reactType.ReactTypeId equals react.ReactTypeId into reactGroup
                                   from react in reactGroup.DefaultIfEmpty() // Handle the case where there are no matches
                                   group react by new { reactType.ReactTypeId, reactType.ReactTypeName } into g
                                   select new ReactTypeCountDTO
                                   {
                                       ReactTypeId = g.Key.ReactTypeId,
                                       ReactTypeName = g.Key.ReactTypeName,
                                       NumberReact = g.Count(r => r != null) // Count only non-null reacts
                                   })
                                  .OrderByDescending(dto => dto.NumberReact) // Sort by NumberReact
                                  .ToListAsync(cancellationToken);

            var checkReact = await (_context.ReactGroupVideoPosts.Where(x => x.UserId == request.UserId && x.GroupPostVideoId == request.GroupPostVideoId)).ToListAsync(cancellationToken);
            if (checkReact.Count() != 0)
            {
                isReact = true;
            }
            // 2. Calculate Sum of Reactions
            var sumOfReacts = listUserReact.Count;

            // 3. Create Result
            var result = new GetReactByGroupVideoPostQueryResult
            {
                SumOfReact = sumOfReacts,
                ListUserReact = listUserReact,
                IsReact = isReact,
                ListReact = listReact
            };

            return Result<GetReactByGroupVideoPostQueryResult>.Success(result);
        }

    }
}
