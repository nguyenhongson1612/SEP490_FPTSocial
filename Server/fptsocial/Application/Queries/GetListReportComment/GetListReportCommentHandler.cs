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

            var reportListQuery = _context.ReportComments
                .AsNoTracking()
                .Include(x => x.ReportBy)
                .Where(x => x.Processing == true);

            // Áp dụng các điều kiện where tùy theo giá trị trong request
            if (request.CommentId != null)
            {
                reportListQuery = reportListQuery.Where(x => x.CommentId == request.CommentId);
            }
            else if (request.CommentPhotoPostId != null)
            {
                reportListQuery = reportListQuery.Where(x => x.CommentPhotoPostId == request.CommentPhotoPostId);
            }
            else if (request.CommentVideoPostId != null)
            {
                reportListQuery = reportListQuery.Where(x => x.CommentVideoPostId == request.CommentVideoPostId);
            }
            else if (request.CommentGroupPostId != null)
            {
                reportListQuery = reportListQuery.Where(x => x.CommentGroupPostId == request.CommentGroupPostId);
            }
            else if (request.CommentGroupVideoPostId != null)
            {
                reportListQuery = reportListQuery.Where(x => x.CommentGroupVideoPostId == request.CommentGroupVideoPostId);
            }
            else if (request.CommentPhotoGroupPostId != null)
            {
                reportListQuery = reportListQuery.Where(x => x.CommentPhotoGroupPostId == request.CommentPhotoGroupPostId);
            }
            else if (request.CommentSharePostId != null)
            {
                reportListQuery = reportListQuery.Where(x => x.CommentSharePostId == request.CommentSharePostId);
            }
            else if (request.CommentGroupSharePostId != null)
            {
                reportListQuery = reportListQuery.Where(x => x.CommentGroupSharePostId == request.CommentGroupSharePostId);
            }

            var reportList = reportListQuery.Select(x => new GetReportComment {
                ReportCommentId = x.ReportCommentId,
                ReportTypeId = x.ReportTypeId,
                CommentId = x.CommentId,
                CommentPhotoPostId = x.CommentPhotoPostId,
                CommentVideoPostId = x.CommentVideoPostId,
                CommentGroupPostId = x.CommentGroupPostId,
                CommentPhotoGroupPostId = x.CommentPhotoGroupPostId,
                CommentGroupVideoPostId = x.CommentGroupVideoPostId,
                CommentSharePostId = x.CommentSharePostId, 
                CommentGroupSharePostId = x.CommentGroupSharePostId,
                Content = x.Content,
                UserId = x.ReportById,
                UserName = x.ReportBy.FullName,
                AvatarUrl = _context.AvataPhotos.Where(ap => ap.UserId == x.ReportById && ap.IsUsed == true).Select(ap => ap.AvataPhotosUrl).FirstOrDefault(),
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
