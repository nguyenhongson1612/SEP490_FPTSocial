using AutoMapper;
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

namespace Application.Commands.CreateSettings
{
    public class CreateSettingsCommandHandler : ICommandHandler<CreateSettingsCommand, CreateSettingsCommandResult>
    {
        private readonly fptforumContext _context;
        private readonly IMapper _mapper;
        private readonly GuidHelper _helper;

        public CreateSettingsCommandHandler(fptforumContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
            _helper = new GuidHelper();
        }
        public async Task<Result<CreateSettingsCommandResult>> Handle(CreateSettingsCommand request, CancellationToken cancellationToken)
        {
            if (_context == null)
            {
                throw new ErrorException(StatusCodeEnum.Context_Not_Found);
            }
            var setting = await _context.Settings.FirstOrDefaultAsync(x => x.SettingName == request.SettingName);
            if (setting != null)
            {
                throw new ErrorException(StatusCodeEnum.S01_Settings_Existed);
            }

            var newsetting = new Setting { 
                SettingId = _helper.GenerateNewGuid(),
                SettingName = request.SettingName,
                CreatedAt = DateTime.Now
                
            };
            await _context.Settings.AddAsync(newsetting);
            await _context.SaveChangesAsync();
            var result = _mapper.Map<CreateSettingsCommandResult>(newsetting);
            return Result<CreateSettingsCommandResult>.Success(result);
        }
    }
}
