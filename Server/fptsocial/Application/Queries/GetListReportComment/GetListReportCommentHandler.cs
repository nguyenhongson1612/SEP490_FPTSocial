using Application.Queries.GetListReportGroup;
using Core.CQRS;
using Core.CQRS.Query;
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

namespace Application.Queries.GetListReportComment
{
    public class GetListReportCommentHandler : IQueryHandler<GetListReportCommentQuery, GetListReportCommentResult>
    {
        private readonly fptforumQueryContext _context;

        public GetListReportCommentHandler(fptforumQueryContext context)
        {
            _context = context;
        }

        public async Task<Result<GetListReportCommentResult>> Handle(GetListReportCommentQuery request, CancellationToken cancellationToken)
        {
            if (_context == null)
            {
                throw new ErrorException(StatusCodeEnum.Context_Not_Found);
            }

            if (request == null)
            {
                throw new ErrorException(StatusCodeEnum.RQ01_Request_Is_Null);
            }

            var repostListQuery = await _context.ReportComments
                .AsNoTracking()
                .Where(x => x.Processing == true)
                .ToListAsync(cancellationToken);

            var reportList = repostListQuery.Select(x => new GetReportComment {
                ReportCommentId = x.ReportCommentId,
                ReportTypeId = x.ReportTypeId,
                ReportById = x.ReportById,
                CommentId = x.CommentId,
                CommentPhotoPostId = x.CommentPhotoPostId,
                CommentVideoPostId = x.CommentVideoPostId,
                CommentGroupPostId = x.CommentGroupPostId,
                CommentPhotoGroupPostId = x.CommentPhotoGroupPostId,
                CommentGroupVideoPostId = x.CommentGroupVideoPostId,
                CommentSharePostId = x.CommentSharePostId, 
                CommentGroupSharePostId = x.CommentGroupSharePostId,
                Content = x.Content,
                CreatedDate = x.CreatedDate,  
            }).ToList();

            var result = new GetListReportCommentResult {
                result = reportList.OrderByDescending(x => x.CreatedDate)
                                    .Skip((request.Page - 1) * request.PageSize)
                                    .Take(request.PageSize)
                                    .ToList(),
                totalPage = (int)Math.Ceiling((double)reportList.Count() / request.PageSize),
            };
            return Result<GetListReportCommentResult>.Success(result);
        }
    }
}
