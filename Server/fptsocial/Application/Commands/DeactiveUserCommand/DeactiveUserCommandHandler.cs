﻿using Core.CQRS;
using Core.CQRS.Command;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Commands.DeactiveUserCommand
{
    public class DeactiveUserCommandHandler : ICommandHandler<DeactiveUserCommand, DeactiveUserCommandResult>
    {
        public Task<Result<DeactiveUserCommandResult>> Handle(DeactiveUserCommand request, CancellationToken cancellationToken)
        {
            throw new NotImplementedException();
        }
    }
}
