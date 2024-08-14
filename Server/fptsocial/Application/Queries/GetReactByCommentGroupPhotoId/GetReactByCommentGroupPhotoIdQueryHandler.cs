﻿using Application.DTO.ReactDTO;
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

namespace Application.Queries.GetReactByCommentGroupPhotoId
{
    public class GetReactByCommentGroupPhotoIdQueryHandler : IQueryHandler<GetReactByCommentGroupPhotoIdQuery, GetReactByCommentGroupPhotoIdQueryResult>
    {
        private readonly fptforumQueryContext _querycontext;
        private readonly IMapper _mapper;
        private readonly GuidHelper _helper;

        public GetReactByCommentGroupPhotoIdQueryHandler(fptforumCommandContext context, fptforumQueryContext querycontext, IMapper mapper)
        {
            _querycontext = querycontext;
            _mapper = mapper;
            _helper = new GuidHelper();
        }
        public async Task<Result<GetReactByCommentGroupPhotoIdQueryResult>> Handle(GetReactByCommentGroupPhotoIdQuery request, CancellationToken cancellationToken)
        {
            if (_querycontext == null)
            {
                throw new ErrorException(StatusCodeEnum.Context_Not_Found);
            }
            bool isReact = false;
            // 1. Fetch Reactions and Include Related Data
            var listUserReact = await (from reactComment in _querycontext.ReactGroupPhotoPostComments
                                       join avata in _querycontext.AvataPhotos on reactComment.UserId equals avata.UserId into avataGroup
                                       from avata in avataGroup.Where(x => x.IsUsed == true).DefaultIfEmpty()
                                       where reactComment.CommentPhotoGroupPostId == request.CommentPhotoGroupPostId
                                       group new { reactComment, avata } by reactComment.ReactPhotoPostCommentId into g
                                       select new ReactGroupCommentPhotoDTO
                                       {
                                           ReactPhotoPostCommentId = g.Key,
                                           GroupPostPhotoId = g.First().reactComment.GroupPostPhotoId,
                                           UserId = g.First().reactComment.UserId,
                                           UserName = g.First().reactComment.User.FirstName + g.First().reactComment.User.LastName,
                                           ReactTypeId = g.First().reactComment.ReactTypeId,
                                           ReactTypeName = g.First().reactComment.ReactType.ReactTypeName,
                                           CommentPhotoGroupPostId = g.First().reactComment.CommentPhotoGroupPostId,
                                           CreatedDate = g.First().reactComment.CreatedDate,
                                           AvataUrl = g.First().avata != null ? g.First().avata.AvataPhotosUrl : null,
                                           Status = _querycontext.Friends.Where(x => (x.UserId == g.First().reactComment.UserId && x.FriendId == request.UserId) ||
                                                                                       (x.UserId == request.UserId && x.FriendId == g.First().reactComment.UserId))
                                                                            .Select(y => y.Confirm)
                                                                            .FirstOrDefault() != null
                                                                            ? (_querycontext.Friends.Any(x => (x.UserId == g.First().reactComment.UserId && x.FriendId == request.UserId) ||
                                                                                                            (x.UserId == request.UserId && x.FriendId == g.First().reactComment.UserId))
                                                                                ? (_querycontext.Friends.FirstOrDefault(x => (x.UserId == g.First().reactComment.UserId && x.FriendId == request.UserId) ||
                                                                                                                        (x.UserId == request.UserId && x.FriendId == g.First().reactComment.UserId))
                                                                                    .Confirm ? "Friend" : "Pending")
                                                                                : "NotFriend")
                                                                            : "NotFriend"
                                       }).ToListAsync(cancellationToken);

            var listReact = await (from reactType in _querycontext.ReactTypes // Start from ReactTypes
                                   join reactComment in _querycontext.ReactGroupPhotoPostComments
                                       on reactType.ReactTypeId equals reactComment.ReactTypeId into reactGroup
                                   from reactComment in reactGroup.DefaultIfEmpty() // Handle the case where there are no matches
                                   where reactComment == null || reactComment.CommentPhotoGroupPostId == request.CommentPhotoGroupPostId // Filter by CommentPhotoGroupPostId
                                   group reactComment by new { reactType.ReactTypeId, reactType.ReactTypeName } into g // Group by ID and Name
                                   select new ReactTypeCountDTO
                                   {
                                       ReactTypeId = g.Key.ReactTypeId,
                                       ReactTypeName = g.Key.ReactTypeName,
                                       NumberReact = g.Count(r => r != null) // Count only non-null reacts
                                   })
                                   .ToListAsync(cancellationToken);


            var checkReact = await (_querycontext.ReactGroupPhotoPostComments.Where(x => x.UserId == request.UserId && x.CommentPhotoGroupPostId == request.CommentPhotoGroupPostId)).ToListAsync(cancellationToken);
            if (checkReact.Count() != 0)
            {
                isReact = true;
            }

            // 2. Calculate Sum of Reactions
            var sumOfReacts = listUserReact.Count;

            // 3. Create Result
            var result = new GetReactByCommentGroupPhotoIdQueryResult
            {
                SumOfReact = sumOfReacts,
                ListCommentReact = listUserReact,
                ListReact = listReact,
                IsReact = isReact
            };

            return Result<GetReactByCommentGroupPhotoIdQueryResult>.Success(result);
        }

    }
}
