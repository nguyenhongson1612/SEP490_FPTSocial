using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Commands.ProcessReportCommand
{
    public class ProcessReportCommandResult
    {
        public Guid ReportId { get; set; }
        public bool Success { get; set; }
    }
}
