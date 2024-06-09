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

namespace Application.Commands.CreateGender
{
    public class CreateGenderCommandHandler : ICommandHandler<CreateGenderCommand, CreateGenderCommandResult>
    {
        private readonly fptforumContext _context;
        private readonly IMapper _mapper;
        private readonly GuidHelper _helper;

        public CreateGenderCommandHandler(fptforumContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
            _helper = new GuidHelper();
        }
        public async Task<Result<CreateGenderCommandResult>> Handle(CreateGenderCommand request, CancellationToken cancellationToken)
        {
            if (_context == null)
            {
                throw new ErrorException(StatusCodeEnum.Context_Not_Found);
            }
            var listgender = await _context.Genders.FirstOrDefaultAsync(x => x.GenderName.Equals(request.GenderName));
            if (listgender != null)
            {
                throw new ErrorException(StatusCodeEnum.G01_Gender_Existed);
            }
            var gender = new Gender();
            gender.GenderId = _helper.GenerateNewGuid();
            gender.GenderName = request.GenderName;
            gender.CreatedAt = DateTime.Now;
            await _context.Genders.AddAsync(gender);
            await _context.SaveChangesAsync();
            var result = _mapper.Map<CreateGenderCommandResult>(gender);
            return Result<CreateGenderCommandResult>.Success(result);
        }
    }
}
