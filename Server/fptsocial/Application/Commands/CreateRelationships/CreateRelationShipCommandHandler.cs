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

namespace Application.Commands.CreateRelationships
{
    public class CreateRelationShipCommandHandler : ICommandHandler<CreateRelationShipCommand, CreateRelationShipCommandResult>
    {
        private readonly fptforumContext _context;
        private readonly IMapper _mapper;
        private readonly GuidHelper _helper;

        public CreateRelationShipCommandHandler(fptforumContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
            _helper = new GuidHelper();
        }
        public async Task<Result<CreateRelationShipCommandResult>> Handle(CreateRelationShipCommand request, CancellationToken cancellationToken)
        {
            if (_context == null)
            {
                throw new ErrorException(StatusCodeEnum.Context_Not_Found);
            }
            var relationship = await _context.Relationships.FirstOrDefaultAsync(x => x.RelationshipName.Equals(request.RelationshipName));
            if(relationship != null)
            {
                throw new ErrorException(StatusCodeEnum.RL01_Relationship_Existed);
            }

            var newrelationship = new Relationship { 
                RelationshipId = _helper.GenerateNewGuid(),
                RelationshipName = request.RelationshipName,
                CreatedAt = DateTime.Now
            
            };
            await _context.Relationships.AddAsync(newrelationship);
            await _context.SaveChangesAsync();
            var result = _mapper.Map<CreateRelationShipCommandResult>(newrelationship);
            return Result<CreateRelationShipCommandResult>.Success(result);
        }
    }
}
