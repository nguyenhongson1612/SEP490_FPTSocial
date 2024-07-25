using AutoMapper;
using Core.CQRS;
using Core.CQRS.Command;
using Core.Helper;
using Domain.CommandModels;
using Domain.Enums;
using Domain.Exceptions;
using Domain.QueryModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Commands.CreateReportComment
{
    public class CreateReportCommentCommandHandler : ICommandHandler<CreateReportCommentCommand, CreateReportCommentCommandResult>
    {
        private readonly fptforumCommandContext _context;
        private readonly IMapper _mapper;
        private readonly GuidHelper _helper;

        public CreateReportCommentCommandHandler(fptforumCommandContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
            _helper = new GuidHelper();
        }

        public async Task<Result<CreateReportCommentCommandResult>> Handle(CreateReportCommentCommand request, CancellationToken cancellationToken)
        {
            if (_context == null)
            {
                throw new ErrorException(StatusCodeEnum.Context_Not_Found);
            }

            if (request == null) {
                throw new ErrorException(StatusCodeEnum.RQ01_Request_Is_Null);
            }

            var reportCmt = new Domain.CommandModels.ReportComment();
            reportCmt.ReportCommentId = _helper.GenerateNewGuid();
            reportCmt.ReportTypeId = request.ReportTypeId;
            reportCmt.CommentId =  request.CommentId;
            reportCmt.CommentPhotoPostId =  request.CommentPhotoPostId;
            reportCmt.CommentVideoPostId = request.CommentVideoPostId;
            reportCmt.CommentGroupPostId = request.CommentGroupPostId;
            reportCmt.CommentPhotoPostId =  request.CommentPhotoPostId;
            reportCmt.CommentGroupVideoPostId = request.CommentGroupVideoPostId;
            reportCmt.CommentSharePostId = request.CommentSharePostId;
            reportCmt.CommentGroupSharePostId =request.CommentGroupSharePostId;
            reportCmt.Content = request.Content;
            reportCmt.ReportById = (Guid) request.ReportById;
            reportCmt.ReportStatus = null;
            reportCmt.CreatedDate = DateTime.Now;
            reportCmt.Processing = true;

            await _context.ReportComments.AddAsync(reportCmt);
            await _context.SaveChangesAsync();

            var result = _mapper.Map<CreateReportCommentCommandResult>(reportCmt);

            return Result<CreateReportCommentCommandResult>.Success(result);
        }
    }
}
