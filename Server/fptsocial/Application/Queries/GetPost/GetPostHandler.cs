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
using Application.DTO.UserPostDTO;
using Core.Helper;

namespace Application.Queries.GetPost
{
    public class GetPostHandler : IQueryHandler<GetPostQuery, List<GetPostResult>>
    {
        private readonly fptforumQueryContext _context;
        private readonly IMapper _mapper;

        public GetPostHandler(fptforumQueryContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public async Task<Result<List<GetPostResult>>> Handle(GetPostQuery request, CancellationToken cancellationToken)
        {
            if (_context == null)
            {
                throw new ErrorException(StatusCodeEnum.Context_Not_Found);
            }

            if (request == null)
            {
                return Result<List<GetPostResult>>.Failure("Request is null");
            }

            // Retrieve the list of friend UserIds
            var friendUserIds = await _context.Friends
                                              .Where(f => f.UserId == request.UserId)
                                              .Select(f => f.FriendId)
                                              .ToListAsync(cancellationToken);

            /*var groupMemberIds = await _context.GroupMembers
                                                .Where(x => x.UserId == request.UserId)
                                                .Select(x => x.GroupId)
                                                .ToListAsync(cancellationToken);*/

            var posts = await _context.UserPosts
                .Where(p => friendUserIds.Contains(p.UserId))
                .Include(p => p.Photo)
                .Include(p => p.Video)
                .Include(p => p.UserPostPhotos)
                    .ThenInclude(upp => upp.Photo)
                .Include(p => p.UserPostVideos)
                    .ThenInclude(upv => upv.Video)
                .ToListAsync(cancellationToken);
            var PostDTO = _mapper.Map<List<UserPostDTO>>(posts);
            var counts = await _context.PostReactCounts.ToListAsync(cancellationToken);

            foreach (var count in counts) {
                foreach (var post in PostDTO)
                {
                    if(post.UserPostId == count.UserPostId)
                    {
                        GetEdgeRankAlo getEdgeRank = new GetEdgeRankAlo();
                        post.alo = getEdgeRank.GetEdgeRank(count.ReactCount ?? 0, count.CommentCount ?? 0, count.ShareCount ?? 0, count.CreateAt ?? DateTime.Now);
                    }
                }
            }
            PostDTO = PostDTO.OrderByDescending(p => p.alo).ToList();
            var result = _mapper.Map<List<GetPostResult>>(PostDTO);
            return Result<List<GetPostResult>>.Success(result);
        }

    }

}
