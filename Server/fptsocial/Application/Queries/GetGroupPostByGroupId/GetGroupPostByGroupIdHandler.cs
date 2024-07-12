using Application.DTO.GroupPostDTO;
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
using System.Text.RegularExpressions;
using System.Threading.Tasks;

namespace Application.Queries.GetGroupPostByGroupId
{
    public class GetGroupPostByGroupIdHandler : IQueryHandler<GetGroupPostByGroupIdQuery, List<GetGroupPostByGroupIdResult>>
    {
        private readonly fptforumQueryContext _context;
        private readonly IMapper _mapper;

        public GetGroupPostByGroupIdHandler (fptforumQueryContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public async Task<Result<List<GetGroupPostByGroupIdResult>>> Handle(GetGroupPostByGroupIdQuery request, CancellationToken cancellationToken)
        {
            if (_context == null)
            {
                throw new ErrorException(StatusCodeEnum.Context_Not_Found);
            }

            if (request == null)
            {
                throw new ErrorException(StatusCodeEnum.RQ01_Request_Is_Null);
            }

            var groupPost = await _context.GroupPosts
                                    .Include(x => x.GroupPhoto)
                                    .Include(x => x.GroupVideo)
                                    .Include(x => x.GroupPostPhotos)
                                        .ThenInclude(gpp => gpp.GroupPhoto)
                                        .ThenInclude(gp => gp.Group)
                                    .Include(x => x.GroupPostVideos)
                                        .ThenInclude(gpv => gpv.GroupVideo)
                                        .ThenInclude(gv => gv.Group)
                                    .Where(x => x.GroupPostPhotos.Any(gpp => gpp.GroupPhoto.Group.GroupId == request.GroupId)
                                            || x.GroupPostVideos.Any(gpv => gpv.GroupVideo.Group.GroupId == request.GroupId))
                                    .ToListAsync(cancellationToken);

            var result = groupPost.Select(x => new GetGroupPostByGroupIdResult {
                GroupPostId = x.GroupPostId,
                UserId = x.UserId,
                Content = x.Content,
                GroupPostNumber = x.GroupPostNumber,
                GroupStatusId = x.GroupStatusId,
                CreatedAt = x.CreatedAt,
                IsHide = x.IsHide,
                UpdatedAt = x.UpdatedAt,
                GroupPhotoId = x.GroupPhotoId,
                GroupVideoId = x.GroupVideoId,
                NumberPost = x.NumberPost,
                GroupPhoto = _mapper.Map<GroupPhotoDTO>(x.GroupPhoto),
                GroupVideo = _mapper.Map<GroupVideoDTO>(x.GroupVideo),
                GroupPostPhoto = _mapper.Map<List<GroupPostPhotoDTO>>(x.GroupPostPhotos),
                GroupPostVideo = _mapper.Map<List<GroupPostVideoDTO>>(x.GroupPostVideos),
            });
            return Result<List<GetGroupPostByGroupIdResult>>.Success(result);
        }
    }
}
