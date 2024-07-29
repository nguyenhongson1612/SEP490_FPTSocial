//using System;
//using System.Collections.Generic;
//using System.Linq;
//using System.Threading;
//using System.Threading.Tasks;
//using Application.Commands.Post;
//using CommandModel = Domain.CommandModels;
//using Application.Services;
//using AutoMapper;
//using Core.CQRS;
//using Domain.CommandModels;
//using Domain.Enums;
//using Domain.Exceptions;
//using Microsoft.Extensions.Configuration;
//using Moq;
//using Xunit;
//using Microsoft.EntityFrameworkCore.ChangeTracking;
//using Application.Commands.GetUserProfile;
//using Application.DTO.CreateUserDTO;
//using Domain.QueryModels;
//using static Microsoft.EntityFrameworkCore.DbLoggerCategory.Database;

//namespace Test.Commands.Post
//{
//    public class CreateUserPostCommandHandlerTest
//    {
//        private readonly Mock<fptforumCommandContext> _mockContext;
//        private readonly Mock<IMapper> _mockMapper;
//        private readonly Mock<IConfiguration> _mockConfiguration;
//        private readonly CreateUserPostCommandHandler _handler;
//        private CreateUserPostCommand _command;

//        public CreateUserPostCommandHandlerTest()
//        {
//            _mockContext = new Mock<fptforumCommandContext>();
//            _mockMapper = new Mock<IMapper>();
//            _mockConfiguration = new Mock<IConfiguration>();
//            _handler = new CreateUserPostCommandHandler(_mockContext.Object, _mockMapper.Object, _mockConfiguration.Object);
//            Setup();
//        }

//        public void Setup()
//        {
//            IEnumerable<string> photos = new[] { "test photo 1", "test photo 2", "test photo 3" };
//            IEnumerable<string> videos = new[] { "test video 1", "test video 2" };

//            _command = new CreateUserPostCommand
//            {
//                UserId = Guid.NewGuid(),
//                UserStatusId = Guid.NewGuid(),
//                Content = "test string",
//                Photos = photos,
//                Videos = videos,
//            };
//        }

//        [Fact]
//        public async Task Handle_GivenValidRequest_ShouldCreateUserPost()
//        {
//            // Arrange
//            var userPost = new CommandModel.UserPost
//            {
//                UserPostId = Guid.NewGuid(),
//                UserId = _command.UserId,
//                Content = _command.Content,
//                UserStatusId = _command.UserStatusId,
//                UserPostNumber = (DateTime.Now.ToString() + Guid.NewGuid().ToString()),
//                IsAvataPost = false,
//                IsCoverPhotoPost = false,
//                IsHide = false,
//                CreatedAt = DateTime.Now,
//                UpdatedAt = DateTime.Now,
//                PhotoId = Guid.NewGuid(),
//                VideoId = Guid.NewGuid(),
//                NumberPost = 2
//            };

//            _mockMapper.Setup(m => m.Map<CommandModel.UserPost>(It.IsAny<CreateUserPostCommand>()))
//                .Returns(userPost);

//            _mockContext.Setup(c => c.UserPosts.AddAsync(It.IsAny<UserPost>(), It.IsAny<CancellationToken>()))
//                .Returns(new ValueTask<EntityEntry<UserPost>>(Task.FromResult(Mock.Of<EntityEntry<UserPost>>())));

//            _mockContext.Setup(c => c.SaveChangesAsync(It.IsAny<CancellationToken>()))
//                .ReturnsAsync(1);

//            // Act
//            var result = await _handler.Handle(command, CancellationToken.None);

//            // Assert
//            Assert.True(result.IsSuccess);
//            Assert.NotNull(result.Value);
//            _mockContext.Verify(c => c.UserPosts.AddAsync(It.IsAny<UserPost>(), It.IsAny<CancellationToken>()), Times.Once);
//            _mockContext.Verify(c => c.SaveChangesAsync(It.IsAny<CancellationToken>()), Times.Exactly(2));
//        }

//        [Fact]
//        public async Task Handle_GivenNullContext_ShouldThrowErrorException()
//        {
//            // Arrange
//            var command = new CreateUserPostCommand();

//            // Act & Assert
//            await Assert.ThrowsAsync<ErrorException>(() => _handler.Handle(command, CancellationToken.None));
//        }

//        [Fact]
//        public async Task Handle_GivenBadWordInContent_ShouldMarkPostAsBanned()
//        {
//            // Arrange
//            var command = new CreateUserPostCommand
//            {
//                UserId = Guid.NewGuid(),
//                Content = "This is a bad word content",
//                Photos = new List<string>(),
//                Videos = new List<string>(),
//                UserStatusId = Guid.NewGuid()
//            };

//            var userPost = new UserPost
//            {
//                UserPostId = Guid.NewGuid(),
//                UserId = command.UserId,
//                Content = command.Content,
//                UserStatusId = command.UserStatusId,
//                CreatedAt = DateTime.Now,
//                UpdatedAt = DateTime.Now
//            };

//            _mockMapper.Setup(m => m.Map<CreateUserPostCommandResult>(It.IsAny<UserPost>()))
//                .Returns(new CreateUserPostCommandResult());

//            _mockContext.Setup(c => c.UserPosts.AddAsync(It.IsAny<UserPost>(), It.IsAny<CancellationToken>()))
//                .Returns(new ValueTask<EntityEntry<UserPost>>(Task.FromResult(Mock.Of<EntityEntry<UserPost>>())));

//            _mockContext.Setup(c => c.SaveChangesAsync(It.IsAny<CancellationToken>()))
//                .ReturnsAsync(1);

//            // Act
//            var result = await _handler.Handle(command, CancellationToken.None);

//            // Assert
//            Assert.False(result.IsSuccess);
//            Assert.Contains("This is a bad word", result.Error);
//            _mockContext.Verify(c => c.UserPosts.AddAsync(It.IsAny<UserPost>(), It.IsAny<CancellationToken>()), Times.Once);
//            _mockContext.Verify(c => c.SaveChangesAsync(It.IsAny<CancellationToken>()), Times.Exactly(2));
//        }
//    }
//}
