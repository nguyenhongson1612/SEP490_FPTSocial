﻿using Application.Commands.DeleteUserPost;
using AutoMapper;
using Core.CQRS;
using Core.CQRS.Command;
using Domain.CommandModels;
using Domain.Enums;
using Domain.Exceptions;
using Domain.QueryModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Commands.DeleteSharePost
{
    public class DeleteSharePostCommandHandler : ICommandHandler<DeleteSharePostCommand, DeleteSharePostCommandResult>
    {
        private readonly fptforumCommandContext _context;
        private readonly fptforumQueryContext _querycontext;
        public DeleteSharePostCommandHandler(fptforumCommandContext context, fptforumQueryContext querycontext, IMapper mapper)
        {
            _context = context;
            _querycontext = querycontext;

        }
        public async Task<Result<DeleteSharePostCommandResult>> Handle(DeleteSharePostCommand request, CancellationToken cancellationToken)
        {
            if (request == null || _querycontext == null)
            {
                throw new ErrorException(StatusCodeEnum.Context_Not_Found);
            }

            var userPost = _querycontext.SharePosts.Where(x => x.SharePostId == request.SharePostId).FirstOrDefault();
            var result = new DeleteUserPostCommandResult();
            if (userPost == null)
            {
                throw new ErrorException(StatusCodeEnum.UP02_Post_Not_Found);
            }
            else
            {
                if (request.UserId != userPost.UserId)
                {
                    throw new ErrorException(StatusCodeEnum.UP03_Not_Authorized);
                }
                else
                {
                    userPost.IsHide = true;
                    _querycontext.SaveChanges();
                    result.Message = "Delete successfully";
                    result.IsDelete = true;
                }
            }

            return Result<DeleteSharePostCommandResult>.Success(result);
        }
    }
}
