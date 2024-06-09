﻿using AutoMapper;
using Core.CQRS;
using Core.CQRS.Command;
using Core.Helper;
using Domain.Enums;
using Domain.Exceptions;
using Domain.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Commands.CreateContactInfor
{
    public class CreateContactInforCommandHandler : ICommandHandler<CreateContactInforCommand, CreateContactInforCommandResult>
    {
        private readonly fptforumContext _context;
        private readonly IMapper _mapper;
        private readonly GuidHelper _helper;

        public CreateContactInforCommandHandler(fptforumContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
            _helper = new GuidHelper();
        }

        public async Task<Result<CreateContactInforCommandResult>> Handle(CreateContactInforCommand request, CancellationToken cancellationToken)
        {
            if (_context == null)
            {
                throw new ErrorException(StatusCodeEnum.Context_Not_Found);
            }

            var user = await _context.UserProfiles.FirstOrDefaultAsync(x => x.UserId == request.UserId);
            var status = await _context.UserStatuses.FirstOrDefaultAsync(x => x.UserStatusId == request.UserStatus);
            if(user == null)
            {
                throw new ErrorException(StatusCodeEnum.U01_Not_Found);
            }
            if(status == null)
            {
                throw new ErrorException(StatusCodeEnum.ST01_Status_Not_Found);
            }
            var contact = new ContactInfo { 
                ContactInfoId = _helper.GenerateNewGuid(),
                SecondEmail = request.SecondEmail,
                PrimaryNumber = request.PrimaryNumber,
                SecondNumber = request.SecondNumber,
                UserId = request.UserId,
                UserStatusId =  request.UserStatus,
                CreatedAt = DateTime.Now
            };
            await _context.ContactInfos.AddAsync(contact);
            await _context.SaveChangesAsync();
            var result = _mapper.Map<CreateContactInforCommandResult>(contact);
            return Result<CreateContactInforCommandResult>.Success(result);
        }
    }
}
