using Application.DTO.ReactDTO;
using AutoMapper;
using Core.CQRS;
using Core.CQRS.Query;
using Core.Helper;
using Domain.CommandModels;
using Domain.Enums;
using Domain.Exceptions;
using Domain.QueryModels;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Queries.GetReactByCommentGroupVideoId
{
    public class GetReactByCommentGroupVideoIdQueryHandler : IQueryHandler<GetReactByCommentGroupVideoIdQuery, GetReactByCommentGroupVideoIdQueryResult>
    {
        private readonly fptforumQueryContext _context;
        private readonly IMapper _mapper;
        private readonly GuidHelper _helper;

        public GetReactByCommentGroupVideoIdQueryHandler(fptforumQueryContext context, fptforumQueryContext querycontext, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
            _helper = new GuidHelper();
        }
        public async Task<Result<GetReactByCommentGroupVideoIdQueryResult>> Handle(GetReactByCommentGroupVideoIdQuery request, CancellationToken cancellationToken)
        {
            if (_context == null)
            {
                throw new ErrorException(StatusCodeEnum.Context_Not_Found);
            }
            bool isReact = false;
            // 1. Fetch Reactions and Include Related Data
            var listUserReact = await (from reactComment in _context.ReactGroupVideoPostComments
                                       join avata in _context.AvataPhotos on reactComment.UserId equals avata.UserId into avataGroup
                                       from avata in avataGroup.Where(x => x.IsUsed == true).DefaultIfEmpty()
                                       where reactComment.CommentGroupVideoPostId == request.CommentGroupVideoPostId
                                       group new { reactComment, avata } by reactComment.ReactGroupVideoCommentId into g
                                       select new ReactGroupCommentVideoDTO
                                       {
                                           ReactGroupVideoCommentId = g.Key,
                                           GroupPostVideoId = g.First().reactComment.GroupPostVideoId,
                                           UserId = g.First().reactComment.UserId,
                                           UserName = g.First().reactComment.User.FirstName + g.First().reactComment.User.LastName,
                                           ReactTypeId = g.First().reactComment.ReactTypeId,
                                           ReactTypeName = g.First().reactComment.ReactType.ReactTypeName,
                                           CommentGroupVideoPostId = g.First().reactComment.CommentGroupVideoPostId,
                                           CreatedDate = g.First().reactComment.CreatedDate,
                                           AvataUrl = g.First().avata != null ? g.First().avata.AvataPhotosUrl : null
                                       }).ToListAsync(cancellationToken);

            var listReact = await (from reactComment in _context.ReactGroupVideoPostComments
                                   where reactComment.CommentGroupVideoPostId == request.CommentGroupVideoPostId
                                   group reactComment by reactComment.ReactTypeId into g
                                   select new ReactTypeCountDTO
                                   {
                                       ReactTypeId = g.Key,
                                       ReactTypeName = g.FirstOrDefault().ReactType.ReactTypeName,
                                       NumberReact = g.Count()
                                   })
                                   .OrderByDescending(dto => dto.NumberReact)
                                   .ToListAsync(cancellationToken);

            var checkReact = await (_context.ReactGroupVideoPostComments.Where(x => x.UserId == request.UserId && x.CommentGroupVideoPostId == request.CommentGroupVideoPostId)).ToListAsync(cancellationToken);
            if (checkReact.Count() != 0)
            {
                isReact = true;
            }

            // 2. Calculate Sum of Reactions
            var sumOfReacts = listUserReact.Count;

            // 3. Create Result
            var result = new GetReactByCommentGroupVideoIdQueryResult
            {
                SumOfReact = sumOfReacts,
                ListCommentReact = listUserReact,
                ListReact = listReact,
                IsReact = isReact
            };

            return Result<GetReactByCommentGroupVideoIdQueryResult>.Success(result);
        }

    }
}
