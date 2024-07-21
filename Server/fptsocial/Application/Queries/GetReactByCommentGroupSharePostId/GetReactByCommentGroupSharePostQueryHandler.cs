using Application.DTO.ReactDTO;
using Application.Queries.GetReactByCommentId;
using AutoMapper;
using Core.CQRS;
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

namespace Application.Queries.GetReactByCommentGroupSharePostId
{
    public class GetReactByCommentGroupSharePostQueryHandler
    {
        private readonly fptforumCommandContext _context;
        private readonly fptforumQueryContext _querycontext;
        private readonly IMapper _mapper;
        private readonly GuidHelper _helper;

        public GetReactByCommentGroupSharePostQueryHandler(fptforumCommandContext context, fptforumQueryContext querycontext, IMapper mapper)
        {
            _context = context;
            _querycontext = querycontext;
            _mapper = mapper;
            _helper = new GuidHelper();
        }
        public async Task<Result<GetReactByCommentGroupSharePostQueryResult>> Handle(GetReactByCommentGroupSharePostQuery request, CancellationToken cancellationToken)
        {
            if (_context == null)
            {
                throw new ErrorException(StatusCodeEnum.Context_Not_Found);
            }
            bool isReact = false;
            // 1. Fetch Reactions and Include Related Data
            var listUserReact = await (from reactComment in _context.ReactGroupSharePostComments
                                       join avata in _context.AvataPhotos on reactComment.UserId equals avata.UserId into avataGroup
                                       from avata in avataGroup.Where(x => x.IsUsed == true).DefaultIfEmpty()
                                       where reactComment.CommentGroupSharePostId == request.CommentGroupSharePostId
                                       group new { reactComment, avata } by reactComment.ReactGroupSharePosCommentId into g
                                       select new ReactGroupSharePostCommentDTO
                                       {
                                           ReactGroupSharePostCommentId = g.Key,
                                           GroupSharePostId = g.First().reactComment.GroupSharePostId,
                                           UserId = g.First().reactComment.UserId,
                                           UserName = g.First().reactComment.User.FirstName + g.First().reactComment.User.LastName,
                                           ReactTypeId = g.First().reactComment.ReactTypeId,
                                           ReactTypeName = g.First().reactComment.ReactType.ReactTypeName,
                                           CommentGroupSharePostId = g.First().reactComment.CommentGroupSharePostId,
                                           CreatedDate = g.First().reactComment.CreateDate,
                                           AvataUrl = g.First().avata != null ? g.First().avata.AvataPhotosUrl : null
                                       }).ToListAsync(cancellationToken);

            var listReact = await (from reactComment in _context.ReactGroupSharePostComments
                                   where reactComment.CommentGroupSharePostId == request.CommentGroupSharePostId
                                   group reactComment by reactComment.ReactTypeId into g
                                   select new ReactTypeCountDTO
                                   {
                                       ReactTypeId = g.Key,
                                       ReactTypeName = g.FirstOrDefault().ReactType.ReactTypeName,
                                       NumberReact = g.Count()
                                   })
                                   .OrderByDescending(dto => dto.NumberReact)
                                   .ToListAsync(cancellationToken);

            var checkReact = await (_context.ReactGroupSharePostComments.Where(x => x.UserId == request.UserId && x.CommentGroupSharePostId == request.CommentGroupSharePostId)).ToListAsync(cancellationToken);
            if (checkReact.Count() != 0)
            {
                isReact = true;
            }

            // 2. Calculate Sum of Reactions
            var sumOfReacts = listUserReact.Count;

            // 3. Create Result
            var result = new GetReactByCommentGroupSharePostQueryResult
            {
                SumOfReact = sumOfReacts,
                ListCommentReact = listUserReact,
                ListReact = listReact,
                IsReact = isReact
            };

            return Result<GetReactByCommentGroupSharePostQueryResult>.Success(result);
        }
    }
}
