using AutoMapper;
using Core.CQRS;
using Core.CQRS.Command;
using Domain.CommandModels;
using Domain.Enums;
using Domain.Exceptions;
using Domain.QueryModels;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Query;
using System;
using System.Collections.Generic;
using System.ComponentModel.Design;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Commands.ProcessReportCommand
{
    public class ProcessReportCommandHandler : ICommandHandler<ProcessReportCommand, ProcessReportCommandResult>
    {
        private readonly fptforumCommandContext _context;

        public ProcessReportCommandHandler(fptforumCommandContext context, IMapper mapper)
        {
            _context = context;
        }

        public async Task<Result<ProcessReportCommandResult>> Handle(ProcessReportCommand request, CancellationToken cancellationToken)
        {
            if (_context == null)
            {
                throw new ErrorException(StatusCodeEnum.Context_Not_Found);
            }

            if (request == null)
            {
                throw new ErrorException(StatusCodeEnum.RQ01_Request_Is_Null);
            }

            switch (request.ReportType)
            {
                case "Comment":
                    await ProcessCommentReport(request);
                    break;
                case "Post":
                    await ProcessPostReport(request);
                    break;
                case "User":
                    await ProcessUserReport(request);
                    break;
                case "Group":
                    await ProcessGroupReport(request);
                    break;
                default:
                    throw new ErrorException(StatusCodeEnum.PR01_Invalid_Report_Type);
            }

            await _context.SaveChangesAsync();

            return Result<ProcessReportCommandResult>.Success(new ProcessReportCommandResult
            {
                ReportId = request.ReportId,
                Success = true
            });
        }

        private async Task ProcessCommentReport(ProcessReportCommand request)
        {
            var report = await _context.ReportComments.FirstOrDefaultAsync(r => r.ReportCommentId == request.ReportId);
            if (report == null)
            {
                throw new ErrorException(StatusCodeEnum.RP01_Report_Not_Found);
            }

            report.ReportStatus = false;
            report.Processing = false;

            if (request.IsAccepted == true) {
                report.ReportStatus = true;
            }
            
        }

        private async Task ProcessPostReport(ProcessReportCommand request)
        {
            var report = await _context.ReportPosts.FirstOrDefaultAsync(r => r.ReportPostId == request.ReportId);
            if (report == null)
            {
                throw new ErrorException(StatusCodeEnum.RP01_Report_Not_Found);
            }
            report.ReportStatus = false;
            report.Processing = false;

            if (request.IsAccepted == true)
            {
                report.ReportStatus = true;
            }
        }

        private async Task ProcessUserReport(ProcessReportCommand request)
        {
            var report = await _context.ReportProfiles.FirstOrDefaultAsync(r => r.ReportProfileId == request.ReportId);
            if (report == null)
            {
                throw new ErrorException(StatusCodeEnum.RP01_Report_Not_Found);
            }
            report.ReportStatus = false;
            report.Processing = false;

            if (request.IsAccepted == true)
            {
                report.ReportStatus = true;
            }

            // Deactivate user
            /*var user = await _context.UserProfiles.FirstOrDefaultAsync(u => u.UserId == report.UserId);
            if (user != null)
            {
                user.IsActive = false;
            }*/
        }

        private async Task ProcessGroupReport(ProcessReportCommand request)
        {
            var report = await _context.ReportProfiles.FirstOrDefaultAsync(r => r.ReportProfileId == request.ReportId);
            if (report == null)
            {
                throw new ErrorException(StatusCodeEnum.RP01_Report_Not_Found);
            }
            report.ReportStatus = false;
            report.Processing = false;

            if (request.IsAccepted == true)
            {
                report.ReportStatus = true;
            }
        }
    }
}
