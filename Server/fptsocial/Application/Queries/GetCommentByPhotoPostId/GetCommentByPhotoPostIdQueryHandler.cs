using Application.DTO.CommentDTO;
using Application.Queries.GetCommentByPostId;
using AutoMapper;
using Core.CQRS.Query;
using Core.CQRS;
using Domain.Enums;
using Domain.Exceptions;
using Domain.QueryModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;

namespace Application.Queries.GetCommentByPhotoPostId
{
    public class GetCommentByPhotoPostIdQueryHandler : IQueryHandler<GetCommentByPhotoPostIdQuery, GetCommentByPhotoPostIdQueryResult>
    {
        private readonly fptforumQueryContext _context;
        private readonly IMapper _mapper;

        public GetCommentByPhotoPostIdQueryHandler(fptforumQueryContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }
        public async Task<Result<GetCommentByPhotoPostIdQueryResult>> Handle(GetCommentByPhotoPostIdQuery request, CancellationToken cancellationToken)
        {
            if (_context == null)
            {
                throw new ErrorException(StatusCodeEnum.Context_Not_Found);
            }

            // Lấy danh sách bình luận, kèm theo thông tin người dùng và ảnh đại diện (nếu có)
            var comments = await _context.CommentPhotoPosts
                .Include(cp => cp.User)
                .Where(x => x.UserPostPhotoId == request.UserPostPhotoId && x.IsHide == false) // Chỉ lấy bình luận không bị ẩn
                .OrderBy(c => c.CreatedDate) // Sắp xếp theo ngày tạo (giống ví dụ trước)
                .Select(c => new CommentPhotoDto
                {
                    UserId = c.UserId,
                    UserName = c.User.FirstName + " " + c.User.LastName,
                    UserPostPhotoId = c.UserPostPhotoId,
                    CreatedDate = c.CreatedDate,
                    Content = c.Content,
                    IsHide = c.IsHide,
                    CommentPhotoPostId = c.CommentPhotoPostId,
                    ParentCommentId = c.ParentCommentId,
                    ListNumber = c.ListNumber, // Thêm trường này (giả sử có trong CommentPhotoPost)
                    Level = c.LevelCmt,       // Thêm trường này (giả sử có trong CommentPhotoPost)
                    Replies = new List<CommentPhotoDto>()
                })
                .ToListAsync(cancellationToken);

            // Xây dựng cấu trúc phân cấp bình luận
            var result = new GetCommentByPhotoPostIdQueryResult
            {
                Posts = BuildCommentHierarchy(comments)
            };

            return Result<GetCommentByPhotoPostIdQueryResult>.Success(result);
        }

        // Hàm xây dựng cấu trúc phân cấp (giống ví dụ trước, nhưng điều chỉnh cho CommentPhotoDto)
        private List<CommentPhotoDto> BuildCommentHierarchy(List<CommentPhotoDto> comments)
        {
            var commentDict = comments.ToDictionary(c => c.CommentPhotoPostId);

            foreach (var comment in comments)
            {
                if (comment.Level == 3 && !string.IsNullOrEmpty(comment.ListNumber)) // Xử lý comment level 3
                {
                    Guid parentId = Guid.Parse(comment.ListNumber);

                    if (commentDict.ContainsKey(parentId))
                    {
                        commentDict[parentId].Replies.Add(comment);
                    }
                }
                else if (comment.ParentCommentId.HasValue && commentDict.ContainsKey(comment.ParentCommentId.Value))
                {
                    commentDict[comment.ParentCommentId.Value].Replies.Add(comment);
                }
            }

            return comments.Where(c => !c.ParentCommentId.HasValue).OrderBy(c => c.CreatedDate).ToList();
        }


    }

}
