using Application.Commands.CreateInterest;
using AutoMapper;
using Core.CQRS;
using Core.CQRS.Command;
using Core.Helper;
using Domain.CommandModels;
using Domain.Enums;
using Domain.Exceptions;
using Domain.QueryModels;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Commands.CreateReactUserPhotoPost
{
    public class CreateReactUserPhotoPostCommandHandler : ICommandHandler<CreateReactUserPhotoPostCommand, CreateReactUserPhotoPostCommandResult>
    {
        private readonly fptforumCommandContext _context;
        private readonly IMapper _mapper;
        private readonly GuidHelper _helper;

        public CreateReactUserPhotoPostCommandHandler(fptforumCommandContext context, fptforumQueryContext querycontext, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
            _helper = new GuidHelper();
        }

        public async Task<Result<CreateReactUserPhotoPostCommandResult>> Handle(CreateReactUserPhotoPostCommand request, CancellationToken cancellationToken)
        {
            if (_context == null)
            {
                throw new ErrorException(StatusCodeEnum.Context_Not_Found);
            }

            // 1. Kiểm tra phản ứng hiện có
            var existingReact = await _context.ReactPhotoPosts
                .FirstOrDefaultAsync(r => r.UserPostPhotoId == request.UserPostPhotoId && r.UserId == request.UserId, cancellationToken);

            if (existingReact != null)
            {
                // 2. Xử lý phản ứng hiện có
                if (existingReact.ReactTypeId == request.ReactTypeId)
                {
                    // Cùng loại phản ứng -> Xóa
                    _context.ReactPhotoPosts.Remove(existingReact);
                }
                else
                {
                    // Khác loại phản ứng -> Cập nhật
                    existingReact.ReactTypeId = request.ReactTypeId;
                    existingReact.CreatedDate = DateTime.Now;
                }
            }
            else
            {
                // 3. Tạo phản ứng mới
                Domain.CommandModels.ReactPhotoPost reactPost = new Domain.CommandModels.ReactPhotoPost
                {
                    ReactPhotoPostId = _helper.GenerateNewGuid(),
                    UserPostPhotoId = request.UserPostPhotoId,
                    ReactTypeId = request.ReactTypeId,
                    UserId = request.UserId,
                    CreatedDate = DateTime.Now
                };

                await _context.ReactPhotoPosts.AddAsync(reactPost);
            }

            await _context.SaveChangesAsync();

            // 4. Trả về kết quả
            var result = existingReact != null
                ? _mapper.Map<CreateReactUserPhotoPostCommandResult>(existingReact) // Nếu cập nhật/xóa
                : _mapper.Map<CreateReactUserPhotoPostCommandResult>(await _context.ReactPhotoPosts.FirstOrDefaultAsync(r => r.UserPostPhotoId == request.UserPostPhotoId && r.UserId == request.UserId, cancellationToken)); // Nếu mới tạo

            return Result<CreateReactUserPhotoPostCommandResult>.Success(result);
        }

    }
}
