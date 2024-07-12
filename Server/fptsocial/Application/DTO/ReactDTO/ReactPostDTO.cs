using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.DTO.ReactDTO
{
    public class ReactPostDTO
    {
        public Guid ReactPostId { get; set; }
        public Guid UserPostId { get; set; }
        public Guid ReactTypeId { get; set; }
        public string ReactName { get; set; }
        public Guid UserId { get; set; }
        public string? UserName {  get; set; }
        public DateTime? CreatedDate {  get; set; }
        public string? AvataUrl { get; set; }
    }

    public class ReactPhotoPostDTO
    {
        public Guid ReactPhotoPostId { get; set; }
        public Guid UserPostPhotoId { get; set; }
        public Guid ReactTypeId { get; set; }
        public string ReactName { get; set; }
        public Guid UserId { get; set; }
        public string? UserName { get; set; }
        public DateTime? CreatedDate { get; set; }
        public string? AvataUrl { get; set; }
    }

    public class ReactVideoPostDTO
    {
        public Guid ReactVideoPostId { get; set; }
        public Guid UserPostVideoId { get; set; }
        public Guid ReactTypeId { get; set; }
        public string ReactName { get; set; }
        public Guid UserId { get; set; }
        public string? UserName { get; set; }
        public DateTime? CreatedDate { get; set; }
        public string? AvataUrl { get; set; }
    }

    public class ReactCommentDTO
    {
        public Guid ReactCommentId { get; set; }
        public Guid UserPostId { get; set; }
        public Guid UserId { get; set; }
        public string UserName { get; set; }
        public Guid ReactTypeId { get; set; }
        public string ReactTypeName { get; set; }
        public Guid CommentId { get; set; }
        public DateTime? CreatedDate { get; set; }
        public string AvataUrl { get; set; }
    }

    public class ReactCommentPhotoDTO
    {
        public Guid ReactPhotoPostCommentId { get; set; }
        public Guid UserPostPhotoId { get; set; }
        public Guid UserId { get; set; }
        public string UserName { get; set; }
        public Guid ReactTypeId { get; set; }
        public string ReactTypeName { get; set; }
        public Guid CommentPhotoPostId { get; set; }
        public DateTime? CreatedDate { get; set; }
        public string AvataUrl { get; set; }
    }

    public class ReactCommentVideoDTO
    {
        public Guid ReactVideoPostCommentId { get; set; }
        public Guid UserPostVideoId { get; set; }
        public Guid UserId { get; set; }
        public string UserName { get; set; }
        public Guid ReactTypeId { get; set; }
        public string ReactTypeName { get; set; }
        public Guid CommentVideoPostId { get; set; }
        public DateTime? CreatedDate { get; set; }
        public string AvataUrl { get; set; }
    }

    public class ReactTypeCountDTO
    {
        public Guid ReactTypeId { get; set; }
        public string ReactTypeName { get; set; }
        public int NumberReact { get; set; }
    }
}
