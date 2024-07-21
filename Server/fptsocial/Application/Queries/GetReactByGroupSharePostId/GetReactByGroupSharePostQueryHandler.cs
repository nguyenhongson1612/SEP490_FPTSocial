using Application.DTO.ReactDTO;
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

namespace Application.Queries.GetReactByGroupSharePostId
{
    public class GetReactByGroupSharePostQueryHandler : IQueryHandler<GetReactByGroupSharePostQuery, GetReactByGroupSharePostQueryResult>
    {
        private readonly fptforumQueryContext _context;
        private readonly IMapper _mapper;

        public GetReactByGroupSharePostQueryHandler(fptforumQueryContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public async Task<Result<GetReactByGroupSharePostQueryResult>> Handle(GetReactByGroupSharePostQuery request, CancellationToken cancellationToken)
        {
            if (_context == null)
            {
                throw new ErrorException(StatusCodeEnum.Context_Not_Found);
            }

            bool isReact = false;

            // 1. Fetch Reactions and Include Related Data
            var listUserReact = await (from react in _context.ReactGroupSharePosts
                                       join avata in _context.AvataPhotos on react.UserId equals avata.UserId into avataGroup
                                       from avata in avataGroup.Where(x => x.IsUsed == true).DefaultIfEmpty() // Left join
                                       where react.GroupSharePostId == request.GroupSharePostId
                                       orderby react.CreateDate descending
                                       select new ReactGroupSharePostDTO
                                       {
                                           ReactGroupSharePostId = react.ReactGroupSharePostId,
                                           GroupSharePostId = react.GroupSharePostId,
                                           ReactTypeId = react.ReactTypeId,
                                           ReactName = react.ReactType.ReactTypeName,
                                           UserId = react.UserId,
                                           UserName = react.User.FirstName + react.User.LastName,
                                           CreatedDate = react.CreateDate,
                                           AvataUrl = avata != null ? avata.AvataPhotosUrl : null
                                       }
                                    ).ToListAsync(cancellationToken);

            var listReact = await (from reactComment in _context.ReactGroupSharePosts
                                   where reactComment.GroupSharePostId == request.GroupSharePostId
                                   group reactComment by new { reactComment.ReactTypeId, reactComment.ReactType.ReactTypeName } into g // Group by ID and Name
                                   select new ReactTypeCountDTO // Use your existing DTO
                                   {
                                       ReactTypeId = g.Key.ReactTypeId,    // Access the grouped keys
                                       ReactTypeName = g.Key.ReactTypeName,
                                       NumberReact = g.Count()                   // Maintain consistent naming
                                   })
                                    .OrderByDescending(dto => dto.NumberReact)   // Sort by Count (not NumberReact)
                                    .ToListAsync(cancellationToken);

            var checkReact = await (_context.ReactGroupSharePosts.Where(x => x.UserId == request.UserId && x.GroupSharePostId == request.GroupSharePostId)).ToListAsync(cancellationToken);

            if (checkReact.Count() != 0)
            {
                isReact = true;
            }

            // 2. Calculate Sum of Reactions
            var sumOfReacts = listUserReact.Count;

            // 3. Create Result
            var result = new GetReactByGroupSharePostQueryResult
            {
                SumOfReact = sumOfReacts,
                ListUserReact = listUserReact,
                IsReact = isReact,
                ListReact = listReact
            };

            return Result<GetReactByGroupSharePostQueryResult>.Success(result);
        }
        
    }
}
