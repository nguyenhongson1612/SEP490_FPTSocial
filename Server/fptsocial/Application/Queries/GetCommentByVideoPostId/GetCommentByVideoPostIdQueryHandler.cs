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

namespace Application.Queries.GetCommentByVideoPostId
{
    public class GetCommentByVideoPostIdQueryHandler : IQueryHandler<GetCommentByVideoPostIdQuery, GetCommentByVideoPostIdQueryResult>
    {
        private readonly fptforumQueryContext _context;
        private readonly IMapper _mapper;

        public GetCommentByVideoPostIdQueryHandler(fptforumQueryContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }
        public async Task<Result<GetCommentByVideoPostIdQueryResult>> Handle(GetCommentByVideoPostIdQuery request, CancellationToken cancellationToken)
        {
            if (_context == null)
            {
                throw new ErrorException(StatusCodeEnum.Context_Not_Found);
            }
            var getComment = await _context.CommentVideoPosts.Include(cp => cp.User).Where(x => x.UserPostVideoId == request.UserPostVideoId).OrderByDescending(x => x.CreatedDate).ToListAsync();

            var result = new GetCommentByVideoPostIdQueryResult() { Posts = new List<CommentVideoDto>() };
            if (getComment != null)
            {
                foreach (var comment in getComment)
                {
                    CommentVideoDto dto = new CommentVideoDto
                    {
                        UserId = comment.UserId,
                        UserName = comment.User.FirstName + " " + comment.User.LastName,
                        UserPostVideoId = comment.UserPostVideoId,
                        CreatedDate = comment.CreatedDate,
                        Content = comment.Content,
                        IsHide = comment.IsHide,
                        CommentVideoPostId = comment.CommentVideoPostId,
                        ParentCommentId = comment.ParentCommentId
                    };
                    result.Posts.Add(dto);
                }
            }
            return Result<GetCommentByVideoPostIdQueryResult>.Success(result);
        }

    }
  
}
