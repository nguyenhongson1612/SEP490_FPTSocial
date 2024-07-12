using Application.DTO.ReactDTO;
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

namespace Application.Queries.GetReactByVideoPost
{
    public class GetReactByVideoPostQueryHandler : IQueryHandler<GetReactByVideoPostQuery, GetReactByVideoPostQueryResult>
    {
        private readonly fptforumQueryContext _context;
        private readonly IMapper _mapper;

        public GetReactByVideoPostQueryHandler(fptforumQueryContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public async Task<Result<GetReactByVideoPostQueryResult>> Handle(GetReactByVideoPostQuery request, CancellationToken cancellationToken)
        {
            if (_context == null)
            {
                throw new ErrorException(StatusCodeEnum.Context_Not_Found);
            }

            // 1. Fetch Reactions and Include Related Data
            var listUserReact = await (from react in _context.ReactVideoPosts
                                        join avata in _context.AvataPhotos on react.UserId equals avata.UserId into avataGroup
                                        from avata in avataGroup.DefaultIfEmpty() // Left join
                                        where react.UserPostVideoId == request.UserPostVideoId
                                        orderby react.CreatedDate descending
                                        select new ReactVideoPostDTO
                                        {
                                            ReactVideoPostId = react.ReactVideoPostId,
                                            UserPostVideoId = react.UserPostVideoId,
                                            ReactTypeId = react.ReactTypeId,
                                            ReactName = react.ReactType.ReactTypeName,
                                            UserId = react.UserId,
                                            UserName = react.User.FirstName + react.User.LastName,
                                            CreatedDate = react.CreatedDate,
                                            AvataUrl = avata != null ? avata.AvataPhotosUrl : null
                                        }
                                    ).ToListAsync(cancellationToken);

            // 2. Calculate Sum of Reactions
            var sumOfReacts = listUserReact.Count;

            // 3. Create Result
            var result = new GetReactByVideoPostQueryResult
            {
                SumOfReact = sumOfReacts,
                ListUserReact = listUserReact
            };

            return Result<GetReactByVideoPostQueryResult>.Success(result);
        }

    }
}
