using Application.Commands.CreateUserCommentPost;
using Application.DTO.CommentDTO;
using Application.Queries.GetAllFriendOtherProfiel;
using AutoMapper;
using Core.CQRS;
using Core.CQRS.Command;
using Core.CQRS.Query;
using Domain.Enums;
using Domain.Exceptions;
using Domain.QueryModels;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Queries.GetCommentByPostId
{
    public class GetCommentByPostIdQueryHandler : IQueryHandler<GetCommentByPostIdQuery, GetCommentByPostIdQueryResult>
    {
        private readonly fptforumQueryContext _context;
        private readonly IMapper _mapper;

        public GetCommentByPostIdQueryHandler(fptforumQueryContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }
        public async Task<Result<GetCommentByPostIdQueryResult>> Handle(GetCommentByPostIdQuery request, CancellationToken cancellationToken)
        {
            if (_context == null)
            {
                throw new ErrorException(StatusCodeEnum.Context_Not_Found);
            }
            var commentPosts = _context.CommentPosts.Include(cp => cp.User).ToList(); // Lấy dữ liệu comment và user profile

            var commentDTOs = _mapper.Map<List<CommentDTO>>(commentPosts); // Ánh xạ

            var getComment = await _context.CommentPosts.Where(x => x.UserPostId == request.UserPostId).OrderByDescending(x => x.CreatedDate).ToListAsync();



            return Result<GetCommentByPostIdQueryResult>.Success(getComment);
        }

    }
}
