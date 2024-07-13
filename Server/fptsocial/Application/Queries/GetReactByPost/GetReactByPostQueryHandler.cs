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

namespace Application.Queries.GetReactByPost
{
    public class GetReactByPostQueryHandler : IQueryHandler<GetReactByPostQuery, GetReactByPostQueryResult>
    {
        private readonly fptforumQueryContext _context;
        private readonly IMapper _mapper;

        public GetReactByPostQueryHandler(fptforumQueryContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public async Task<Result<GetReactByPostQueryResult>> Handle(GetReactByPostQuery request, CancellationToken cancellationToken)
        {
            if (_context == null)
            {
                throw new ErrorException(StatusCodeEnum.Context_Not_Found);
            }

            bool isReact = false;

            // 1. Fetch Reactions and Include Related Data
            var listUserReact = await (from react in _context.ReactPosts
                                        join avata in _context.AvataPhotos on react.UserId equals avata.UserId into avataGroup
                                        from avata in avataGroup.DefaultIfEmpty() // Left join
                                        where react.UserPostId == request.UserPostId
                                        orderby react.CreatedDate descending
                                        select new ReactPostDTO
                                        {
                                            ReactPostId = react.ReactPostId,
                                            UserPostId = react.UserPostId,
                                            ReactTypeId = react.ReactTypeId,
                                            ReactName = react.ReactType.ReactTypeName,
                                            UserId = react.UserId,
                                            UserName = react.User.FirstName + react.User.LastName,
                                            CreatedDate = react.CreatedDate,
                                            AvataUrl = avata != null ? avata.AvataPhotosUrl : null
                                        }
                                    ).ToListAsync(cancellationToken);

            var checkReact = await (_context.ReactPosts.Where(x => x.UserId == request.UserId && x.UserPostId == request.UserPostId)).ToListAsync(cancellationToken);

            if (checkReact.Count() != 0)
            {
                isReact = true;
            }

            // 2. Calculate Sum of Reactions
            var sumOfReacts = listUserReact.Count;

            // 3. Create Result
            var result = new GetReactByPostQueryResult
            {
                SumOfReact = sumOfReacts,
                ListUserReact = listUserReact,
                IsReact = isReact
            };

            return Result<GetReactByPostQueryResult>.Success(result);
        }

    }
}
