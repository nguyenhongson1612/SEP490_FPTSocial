using AutoMapper;
using Core.CQRS;
using Core.CQRS.Query;
using Domain.Enums;
using Domain.Exceptions;
using Domain.QueryModels;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Core.Helper;
using Application.DTO.FriendDTO;
using Application.Queries.GetAllFriend;

namespace Application.Queries.GetFriendyName
{
    public class GetFriendByNameQueryHandler : IQueryHandler<GetFriendByNameQuery, GetFriendByNameQueryResult>
    {
        private readonly fptforumQueryContext _context;
        private readonly IMapper _mapper;
        private readonly StringHelper _stringHelper;
        public GetFriendByNameQueryHandler(fptforumQueryContext context, IMapper mapper, StringHelper stringHelper)
        {
            _context = context;
            _mapper = mapper;
            _stringHelper = stringHelper;
        }
        public async Task<Result<GetFriendByNameQueryResult>> Handle(GetFriendByNameQuery request, CancellationToken cancellationToken)
        {
            if (_context == null)
            {
                throw new ErrorException(StatusCodeEnum.Context_Not_Found);
            }
            var normalizedSearchString = request.FindName.RemoveDiacritics();
            var searchWords = normalizedSearchString.SplitIntoWords();
            var friendrequest = await _context.Friends.Include(x => x.FriendNavigation).Where(x => x.UserId == request.UserId && x.Confirm == true).ToListAsync();
            var friendconfirm = await _context.Friends.Include(x => x.User).Where(x => x.FriendId == request.UserId && x.Confirm == true).ToListAsync();
            var list = new List<Domain.QueryModels.Friend>();
            list.AddRange(friendrequest);
            list.AddRange(friendconfirm);
            var listallfriend = new List<Domain.QueryModels.UserProfile>();
            var listfrienddto = new List<GetAllFriendDTO>();
            var listsearchfriend = new List<Domain.QueryModels.UserProfile>();
            var listreact = new Dictionary<Guid, int?>();
            foreach (var fr in friendrequest)
            {
                listreact.Add(fr.FriendId, fr.ReactCount);
                var profile = await _context.UserProfiles.Include(x => x.AvataPhotos).FirstOrDefaultAsync(x => x.UserId == fr.FriendId);
                listallfriend.Add(profile);
            }

            foreach (var fr in friendconfirm)
            {
                listreact.Add(fr.UserId, fr.ReactCount);
                var profile = await _context.UserProfiles.Include(x => x.AvataPhotos).FirstOrDefaultAsync(x => x.UserId == fr.UserId);
                listallfriend.Add(profile);
            }
            var result = new GetFriendByNameQueryResult();
            if (listallfriend != null)
            {
                //result.Count = listallfriend.Count;
                foreach (var friend in listallfriend)
                {
                    var otherfriend = _context.Friends.Where(x => (x.UserId == friend.UserId && x.Confirm == true)
                                                        || (x.FriendId == friend.UserId && x.Confirm == true)).ToList();
                    var mutualfriend = otherfriend.Intersect(list);
                    var frienddto = new GetAllFriendDTO
                    {
                        FriendId = friend.UserId,
                        FriendName = friend.FirstName + " " + friend.LastName,
                        ReactCount = listreact[friend.UserId],
                        MutualFriends = mutualfriend.Count(),
                    };
                    if (friend.AvataPhotos.Count > 0)
                    {
                        frienddto.Avata = friend.AvataPhotos.FirstOrDefault(x => x.IsUsed == true).AvataPhotosUrl;
                    }
                    listfrienddto.Add(frienddto);
                    //result.getFriendByName.Add(frienddto);
                }

                var firstSearch = listfrienddto.Where(x => x.FriendName.Contains(request.FindName));
                result.getFriendByName.AddRange(firstSearch);
                var secondSearch = listfrienddto.Select(friend => new
                                            {
                                                Friend = friend,
                                                NormalizedName = friend.FriendName.RemoveDiacritics().ToLower(),
                                                NameWords = friend.FriendName.RemoveDiacritics().ToLower().SplitIntoWords(),
                                                Permutations = friend.FriendName.RemoveDiacritics().ToLower().SplitIntoWords().GetAllPermutations()
                                            })
                                    .Select(friend => new
                                            {
                                                friend.Friend,
                                                friend.NormalizedName,
                                                friend.NameWords,
                                                friend.Permutations,
                                                ExactMatch = friend.NormalizedName.Equals(normalizedSearchString),
                                                NoDiacriticsMatch = friend.NormalizedName == normalizedSearchString,
                                                ReverseNameMatch = string.Join(" ", friend.NameWords.Reverse()) == normalizedSearchString,
                                                ReverseNoDiacriticsMatch = string.Join(" ", friend.NameWords.Reverse()) == normalizedSearchString,
                                                PermutationMatch = friend.Permutations.Contains(normalizedSearchString),
                                                ContainsMostWords = searchWords.Count(word => friend.NameWords.Contains(word)),
                                                ContainsAnyWords = searchWords.All(word => friend.NameWords.Contains(word)),
                                                SubstringMatch = searchWords.Any(word => friend.NormalizedName.Contains(word))
                                            })
                                    .OrderByDescending(f => f.ExactMatch)
                                    .ThenByDescending(f => f.NoDiacriticsMatch)
                                    .ThenByDescending(f => f.ReverseNameMatch)
                                    .ThenByDescending(f => f.ReverseNoDiacriticsMatch)
                                    .ThenByDescending(f => f.PermutationMatch)
                                    .ThenByDescending(f => f.ContainsMostWords)
                                    .ThenByDescending(f => f.ContainsAnyWords)
                                    .ThenByDescending(f => f.SubstringMatch)
                                    .ThenBy(f => f.NormalizedName)
                                    .Select(f => f.Friend)
                                    .ToList();
                result.getFriendByName.AddRange(secondSearch);
                //result.getFriendByName.OrderByDescending(x => x.ReactCount).OrderByDescending(x => x.MutualFriends);
            }
            else
            {
                result.Count = 0;
            }

            return Result<GetFriendByNameQueryResult>.Success(result);
        }
    }
}
