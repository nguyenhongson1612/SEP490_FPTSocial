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

namespace Application.Queries.GetReactByCommentPhotoId
{
    public class GetReactByCommentPhotoIdQueryHandler : IQueryHandler<GetReactByCommentPhotoIdQuery, GetReactByCommentPhotoIdQueryResult>
    {
        private readonly fptforumCommandContext _context;
        private readonly fptforumQueryContext _querycontext;
        private readonly IMapper _mapper;
        private readonly GuidHelper _helper;

        public GetReactByCommentPhotoIdQueryHandler(fptforumCommandContext context, fptforumQueryContext querycontext, IMapper mapper)
        {
            _context = context;
            _querycontext = querycontext;
            _mapper = mapper;
            _helper = new GuidHelper();
        }
        public async Task<Result<GetReactByCommentPhotoIdQueryResult>> Handle(GetReactByCommentPhotoIdQuery request, CancellationToken cancellationToken)
        {
            if (_context == null)
            {
                throw new ErrorException(StatusCodeEnum.Context_Not_Found);
            }

            // 1. Fetch Reactions and Include Related Data
            var listUserReact = await (from reactComment in _context.ReactPhotoPostComments
                                       join avata in _context.AvataPhotos on reactComment.UserId equals avata.UserId into avataGroup
                                       from avata in avataGroup.DefaultIfEmpty()
                                       where reactComment.CommentPhotoPostId == request.CommentPhotoPostId
                                       group new { reactComment, avata } by reactComment.ReactPhotoPostCommentId into g
                                       select new ReactCommentPhotoDTO
                                       {
                                           ReactPhotoPostCommentId = g.Key,
                                           UserPostPhotoId = g.First().reactComment.UserPostPhotoId,
                                           UserId = g.First().reactComment.UserId,
                                           UserName = g.First().reactComment.User.FirstName + g.First().reactComment.User.LastName,
                                           ReactTypeId = g.First().reactComment.ReactTypeId,
                                           ReactTypeName = g.First().reactComment.ReactType.ReactTypeName,
                                           CommentPhotoPostId = g.First().reactComment.CommentPhotoPostId,
                                           CreatedDate = g.First().reactComment.CreatedDate,
                                           AvataUrl = g.First().avata != null ? g.First().avata.AvataPhotosUrl : null
                                       }).ToListAsync(cancellationToken);

            var listReact = await (from reactComment in _context.ReactPhotoPostComments
                                   where reactComment.CommentPhotoPostId == request.CommentPhotoPostId
                                   group reactComment by reactComment.ReactTypeId into g
                                   select new ReactTypeCountDTO
                                   {
                                       ReactTypeId = g.Key,
                                       ReactTypeName = g.FirstOrDefault().ReactType.ReactTypeName,
                                       NumberReact = g.Count()
                                   }).ToListAsync(cancellationToken);
            // 2. Calculate Sum of Reactions
            var sumOfReacts = listUserReact.Count;

            // 3. Create Result
            var result = new GetReactByCommentPhotoIdQueryResult
            {
                SumOfReact = sumOfReacts,
                ListCommentReact = listUserReact,
                ListReact = listReact
            };

            return Result<GetReactByCommentPhotoIdQueryResult>.Success(result);
        }

    }
}
