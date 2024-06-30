using Application.DTO.CommentDTO;
using Application.Queries.GetCommentByPostId;
using AutoMapper;
using Core.CQRS.Query;
using Core.CQRS;
using Domain.Enums;
using Domain.Exceptions;
using Domain.QueryModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;

namespace Application.Queries.GetCommentByPhotoPostId
{
    public class GetCommentByPhotoPostIdQueryHandler : IQueryHandler<GetCommentByPhotoPostIdQuery, GetCommentByPhotoPostIdQueryResult>
    {
        private readonly fptforumQueryContext _context;
        private readonly IMapper _mapper;

        public GetCommentByPhotoPostIdQueryHandler(fptforumQueryContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }
        public async Task<Result<GetCommentByPhotoPostIdQueryResult>> Handle(GetCommentByPhotoPostIdQuery request, CancellationToken cancellationToken)
        {
            if (_context == null)
            {
                throw new ErrorException(StatusCodeEnum.Context_Not_Found);
            }
            var getComment = await _context.CommentPhotoPosts.Include(cp => cp.User).Where(x => x.UserPostPhotoId == request.UserPostPhotoId).OrderByDescending(x => x.CreatedDate).ToListAsync();

            var result = new GetCommentByPhotoPostIdQueryResult() { Posts = new List<CommentPhotoDto>() };
            if (getComment != null)
            {
                foreach (var comment in getComment)
                {
                    CommentPhotoDto dto = new CommentPhotoDto
                    {
                        UserId = comment.UserId,
                        UserName = comment.User.FirstName + " " + comment.User.LastName,
                        UserPostPhotoId = comment.UserPostPhotoId,
                        CreatedDate = comment.CreatedDate,
                        Content = comment.Content,
                        IsHide = comment.IsHide,
                        CommentPhotoPostId = comment.CommentPhotoPostId,
                        ParentCommentId = comment.ParentCommentId
                    };
                    result.Posts.Add(dto);
                }
            }
            return Result<GetCommentByPhotoPostIdQueryResult>.Success(result);
        }

    }
  
}
