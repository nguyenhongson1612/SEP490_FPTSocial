using Application.Commands.UpdateCommentUserPhotoPost;
using Application.Services;
using AutoMapper;
using Core.CQRS;
using Core.CQRS.Command;
using Core.Helper;
using Domain.CommandModels;
using Domain.Enums;
using Domain.Exceptions;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.WebSockets;
using System.Text;
using System.Threading.Tasks;

namespace Application.Commands.AprroveGroupPost
{
    public class ApproveGroupPostCommandHandler : ICommandHandler<ApproveGroupPostCommand, ApproveGroupPostCommandResult>
    {
        private readonly fptforumCommandContext _context;
        private readonly IMapper _mapper;
        private readonly GuidHelper _helper;
        private readonly IConfiguration _configuration;
        private readonly CheckingBadWord _checkContent;

        public ApproveGroupPostCommandHandler(fptforumCommandContext context, IMapper mapper, IConfiguration configuration)
        {
            _context = context;
            _mapper = mapper;
            _helper = new GuidHelper();
            _configuration = configuration;
            _checkContent = new CheckingBadWord();
        }

        public async Task<Result<ApproveGroupPostCommandResult>> Handle(ApproveGroupPostCommand request, CancellationToken cancellationToken)
        {
            if (_context == null)
            {
                throw new ErrorException(StatusCodeEnum.Context_Not_Found);
            }
            var result = new ApproveGroupPostCommandResult();
            var groupPost = _context.GroupPosts.Where(x => x.GroupPostId == request.GroupPostId).FirstOrDefault();
            if (groupPost != null) 
            {
                groupPost.IsPending = false;
            }
            else
            {
                throw new ErrorException(StatusCodeEnum.UP02_Post_Not_Found);
            }
            _context.SaveChanges();
            result.Message = "Accept success";
            result.IsApprove = true;

            return Result<ApproveGroupPostCommandResult>.Success(result);

        }
    }
}
