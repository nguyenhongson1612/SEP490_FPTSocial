﻿using Application.DTO.CommentDTO;
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

namespace Application.Queries.GetCommentbyGroupPhotoPostId
{
    public class GetCommentByGroupPhotoPostIdQueryHandler : IQueryHandler<GetCommentByGroupPhotoPostIdQuery, GetCommentByGroupPhotoPostIdQueryResult>
    {
        private readonly fptforumQueryContext _context;
        private readonly IMapper _mapper;

        public GetCommentByGroupPhotoPostIdQueryHandler(fptforumQueryContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public async Task<Result<GetCommentByGroupPhotoPostIdQueryResult>> Handle(GetCommentByGroupPhotoPostIdQuery request, CancellationToken cancellationToken)
        {
            if (_context == null)
            {
                throw new ErrorException(StatusCodeEnum.Context_Not_Found);
            }

            var comments = await (from c in _context.CommentPhotoGroupPosts // Thay đổi bảng truy vấn
                                  join a in _context.AvataPhotos on c.UserId equals a.UserId into ap
                                  from a in ap.Where(a => a.IsUsed == true).DefaultIfEmpty()
                                  where c.GroupPostPhotoId == request.GroupPostPhotoId && c.IsHide == false && c.IsBanned == false
                                  select new GroupPhotoCommentDto // Sử dụng DTO tương ứng cho photo comment
                                  {
                                      UserId = c.UserId,
                                      UserName = c.User.FirstName + " " + c.User.LastName,
                                      Url = a.AvataPhotosUrl,
                                      GroupPostPhotoId = c.GroupPostPhotoId, // Thay đổi thuộc tính ID
                                      CreatedDate = c.CreatedDate,
                                      Content = c.Content,
                                      IsHide = c.IsHide,
                                      CommentPhotoGroupPostId = c.CommentPhotoGroupPostId, // Thay đổi thuộc tính ID
                                      ParentCommentId = c.ParentCommentId,
                                      Level = c.LevelCmt,
                                      ListNumber = c.ListNumber,
                                      Replies = new List<GroupPhotoCommentDto>() // Sử dụng DTO tương ứng cho photo comment
                                  })
                                .ToListAsync(cancellationToken);

            var result = new GetCommentByGroupPhotoPostIdQueryResult
            {
                Posts = BuildCommentHierarchy(comments) // Tái sử dụng hàm BuildCommentHierarchy
            };

            return Result<GetCommentByGroupPhotoPostIdQueryResult>.Success(result);
        }

        // Hàm BuildCommentHierarchy có thể được tái sử dụng từ lớp GetCommentByGroupVideoPostIdQueryHandler
        // vì logic xây dựng cấu trúc phân cấp bình luận là tương tự
        private List<GroupPhotoCommentDto> BuildCommentHierarchy(List<GroupPhotoCommentDto> comments)
        {
            var commentDict = comments.ToDictionary(c => c.CommentPhotoGroupPostId); // Thay đổi kiểu key

            foreach (var comment in comments)
            {
                // Xử lý comment level 3
                if (comment.Level == 3 && !string.IsNullOrEmpty(comment.ListNumber))
                {
                    Guid parentId = Guid.Parse(comment.ListNumber); // Chuyển ListNumber thành Guid

                    if (commentDict.ContainsKey(parentId))
                    {
                        commentDict[parentId].Replies.Add(comment); // Thêm vào Replies của comment cha (level 2)
                    }
                }
                else if (comment.ParentCommentId.HasValue && commentDict.ContainsKey(comment.ParentCommentId.Value))
                {
                    commentDict[comment.ParentCommentId.Value].Replies.Add(comment); // Thêm vào Replies của comment cha (level 2)
                }
            }

            return comments.Where(c => !c.ParentCommentId.HasValue).OrderBy(c => c.CreatedDate).ToList();
        }
    }

}
