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
        private readonly fptforumQueryContext _querycontext;
        private readonly IMapper _mapper;
        private readonly GuidHelper _helper;

        public GetReactByCommentPhotoIdQueryHandler(fptforumCommandContext context, fptforumQueryContext querycontext, IMapper mapper)
        {
            _querycontext = querycontext;
            _mapper = mapper;
            _helper = new GuidHelper();
        }
        public async Task<Result<GetReactByCommentPhotoIdQueryResult>> Handle(GetReactByCommentPhotoIdQuery request, CancellationToken cancellationToken)
        {
            if (_querycontext == null)
            {
                throw new ErrorException(StatusCodeEnum.Context_Not_Found);
            }
            bool isReact = false;
            // 1. Fetch Reactions and Include Related Data
            var listUserReact = await (from reactComment in _querycontext.ReactPhotoPostComments
                                       join avata in _querycontext.AvataPhotos on reactComment.UserId equals avata.UserId into avataGroup
                                       from avata in avataGroup.Where(x => x.IsUsed == true).DefaultIfEmpty()
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

            var listReact = await (from reactComment in _querycontext.ReactPhotoPostComments
                                   where reactComment.CommentPhotoPostId == request.CommentPhotoPostId
                                   group reactComment by reactComment.ReactTypeId into g
                                   select new ReactTypeCountDTO
                                   {
                                       ReactTypeId = g.Key,
                                       ReactTypeName = g.FirstOrDefault().ReactType.ReactTypeName,
                                       NumberReact = g.Count()
                                   }).ToListAsync(cancellationToken);

            var checkReact = await (_querycontext.ReactPhotoPostComments.Where(x => x.UserId == request.UserId && x.CommentPhotoPostId == request.CommentPhotoPostId)).ToListAsync(cancellationToken);
            if (checkReact.Count() != 0)
            {
                isReact = true;
            }

            // 2. Calculate Sum of Reactions
            var sumOfReacts = listUserReact.Count;

            // 3. Create Result
            var result = new GetReactByCommentPhotoIdQueryResult
            {
                SumOfReact = sumOfReacts,
                ListCommentReact = listUserReact,
                ListReact = listReact,
                IsReact = isReact
            };

            return Result<GetReactByCommentPhotoIdQueryResult>.Success(result);
        }

    }
}
