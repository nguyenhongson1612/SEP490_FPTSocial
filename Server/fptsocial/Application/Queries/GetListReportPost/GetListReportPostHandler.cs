using Application.Queries.GetListReportUser;
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
using System.Threading.Tasks;

namespace Application.Queries.GetListReportPost
{
    public class GetListReportPostHandler : IQueryHandler<GetListReportPostQuery, GetListReportPostResult>
    {
        private readonly fptforumQueryContext _context;

        public GetListReportPostHandler(fptforumQueryContext context)
        {
            _context = context;
        }
        public async Task<Result<GetListReportPostResult>> Handle(GetListReportPostQuery request, CancellationToken cancellationToken)
        {
            if (_context == null)
            {
                throw new ErrorException(StatusCodeEnum.Context_Not_Found);
            }

            if (request == null)
            {
                throw new ErrorException(StatusCodeEnum.RQ01_Request_Is_Null);
            }

            var reportListQuery = await _context.ReportPosts
                .AsNoTracking()
                .Where(x => x.Processing == true)
                .ToListAsync(cancellationToken);

            var reportList = reportListQuery.Select(x => new GetReportPost {
                ReportPostId = x.ReportPostId,
                ReportTypeId = x.ReportTypeId,
                ReportById = x.ReportById,
                UserPostId = x.UserPostId,
                UserPostPhotoId = x.UserPostPhotoId,
                UserPostVideoId = x.UserPostVideoId,
                GroupPostId = x.GroupPostId,
                GroupPostPhotoId = x.GroupPostPhotoId,
                GroupPostVideoId = x.GroupPostVideoId,
                SharePostId = x.SharePostId,
                GroupSharePostId = x.GroupSharePostId,
                CreatedDate = x.CreatedDate,
            }).ToList();

            var result = new GetListReportPostResult
            {
                result = reportList.OrderByDescending(x => x.CreatedDate)
                                    .Skip((request.Page - 1) * request.PageSize)
                                    .Take(request.PageSize)
                                    .ToList(),
                totalPage = (int)Math.Ceiling((double)reportList.Count() / request.PageSize),
            };
            return Result<GetListReportPostResult>.Success(result);
        }
    }
}
