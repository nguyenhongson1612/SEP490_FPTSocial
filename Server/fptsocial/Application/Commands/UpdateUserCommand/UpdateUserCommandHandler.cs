using Application.Commands.GetUserProfile;
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

namespace Application.Commands.UpdateUserCommand
{
    public class UpdateUserCommandHandler : ICommandHandler<UpdateUserCommand, UpdateUserCommandResult>
    {
        private readonly fptforumCommandContext _context;
        private readonly fptforumQueryContext _querycontext;
        private readonly IMapper _mapper;
        private readonly GuidHelper _helper;

        public UpdateUserCommandHandler(fptforumCommandContext context, fptforumQueryContext querycontext, IMapper mapper)
        {
            _context = context;
            _querycontext = querycontext;
            _mapper = mapper;
            _helper = new GuidHelper();
        }
        public async Task<Result<UpdateUserCommandResult>> Handle(UpdateUserCommand request, CancellationToken cancellationToken)
        {
            if (_context == null)
            {
                throw new ErrorException(StatusCodeEnum.Context_Not_Found);
            }

            var getuser = await _querycontext.UserProfiles.FirstOrDefaultAsync(x => x.UserId == request.UserId);
            var usergender = await _querycontext.UserGenders.FirstOrDefaultAsync(x => x.UserId == request.UserId);
            var usercontact = await _querycontext.ContactInfos.FirstOrDefaultAsync(x => x.UserId == request.UserId);
            var userrelationship = await _querycontext.UserRelationships.FirstOrDefaultAsync(x => x.UserId == request.UserId);
            var userweb = await _querycontext.WebAffiliations.Where(x => x.UserId == request.UserId).ToListAsync();
            var userinteres = await _querycontext.UserInterests.Where(x => x.UserId == request.UserId).ToListAsync();
            var userwork = await _querycontext.WorkPlaces.Where(x => x.UserId == request.UserId).ToListAsync();
            var useravata = await _querycontext.AvataPhotos.Where(x => x.UserId == request.UserId).ToListAsync();
            var status = await _querycontext.UserStatuses.ToListAsync();
            var listsetting = await _querycontext.Settings.ToListAsync();
            if (getuser  == null)
            {
                throw new ErrorException(StatusCodeEnum.U01_Not_Found);
            }

            var userprofile = new Domain.CommandModels.UserProfile
            {
                UserId  = (Guid)request.UserId,
                FirstName = request.FirstName,
                LastName = request.LastName,
                BirthDay = request.BirthDay,
                AboutMe = request.AboutMe,
                HomeTown= request.HomeTown,
                CoverImage = request.CoverImage,
                UpdatedAt = DateTime.Now
            };

            _context.UserProfiles.Update(userprofile);

            if(request.UserGender != null)
            {
                usergender.GenderId = request.UserGender.GenderId;
                usergender.UserStatusId = request.UserGender.UserStatusId;
                usergender.UpdatedAt = DateTime.Now;
                var updategender = _mapper.Map<Domain.CommandModels.UserGender>(usergender);
                _context.UserGenders.Update(updategender);
            }
         
            if(request.ContactInfo != null)
            {
                usercontact.ContactInfoId = usercontact.ContactInfoId;
                usercontact.SecondEmail = request.ContactInfo.SecondEmail;
                usercontact.PrimaryNumber = request.ContactInfo.PrimaryNumber;
                usercontact.SecondNumber = request.ContactInfo.SecondNumber;
                usercontact.UserId = userprofile.UserId;
                usercontact.UserStatusId =  request.ContactInfo.UserStatusId;
                usercontact.UpdatedAt = DateTime.Now;
                var updatecontac = _mapper.Map<Domain.CommandModels.ContactInfo>(usercontact);
                _context.ContactInfos.Update(updatecontac);
            } 

           
            if(request.UserRelationship != null)
            {
                userrelationship.RelationshipId = request.UserRelationship.UserStatusId;
                userrelationship.UserStatusId = request.UserRelationship.UserStatusId;
                userrelationship.UpdatedAt = DateTime.Now;
                var updaterelationship= _mapper.Map<Domain.CommandModels.UserRelationship>(userrelationship);
                _context.UserRelationships.Update(updaterelationship);
            }                     

            if (request.Avataphoto != null)
            {
                var avata = new Domain.CommandModels.AvataPhoto
                {

                    AvataPhotosId = _helper.GenerateNewGuid(),
                    AvataPhotosUrl = request.Avataphoto,
                    IsUsed = true,
                    UserId = userprofile.UserId,
                    UserStatusId = status.FirstOrDefault(x => x.StatusName == "Public").UserStatusId,
                    CreatedAt = DateTime.Now
                };
                await _context.AvataPhotos.AddAsync(avata);
                
                foreach(var a in useravata)
                {
                    if(a.AvataPhotosId != avata.AvataPhotosId)
                    {
                        a.IsUsed = false;
                        var updateavata = _mapper.Map<Domain.CommandModels.AvataPhoto>(a);
                        _context.AvataPhotos.Update(updateavata);
                    }  
                }
            }

            if (request.UserInterests.Count > 0)
            {
                foreach (var us in request.UserInterests)
                {
                    var existing = userinteres.FirstOrDefault(x => x.InterestId == us.InterestId);
                    if(existing == null)
                    {
                        var addinteres = new Domain.CommandModels.UserInterest
                        {
                            UserInterestId = _helper.GenerateNewGuid(),
                            InterestId = (Guid)us.InterestId,
                            UserId = getuser.UserId,
                            UserStatusId = (Guid)us.UserStatusId,
                            CreatedAt = DateTime.Now
                        };
                        await _context.UserInterests.AddAsync(addinteres);
                    }
                    else
                    {
                        existing.UserStatusId = (Guid)us.UserStatusId;
                        existing.UpdatedAt = DateTime.Now;
                        var updateinteres = _mapper.Map<Domain.CommandModels.UserInterest>(existing);
                        _context.UserInterests.Update(updateinteres);
                    }
                }

                var removeitem = userinteres.Where(x => !request.UserInterests.Any(y => y.InterestId == x.InterestId)).ToList();
                foreach (var item in removeitem)
                {
                    var interesrm = _mapper.Map<Domain.CommandModels.UserInterest>(item);
                    _context.UserInterests.Remove(interesrm);
                }
            }

            if (request.WorkPlaces.Count > 0)
            {
                foreach (var us in request.WorkPlaces)
                {
                    var existing = userwork.FirstOrDefault(x => x.WorkPlaceId == us.WorkPlaceId);
                    if (existing == null)
                    {
                        var addwork = new Domain.CommandModels.WorkPlace
                        {
                            WorkPlaceId = _helper.GenerateNewGuid(),
                            WorkPlaceName = us.WorkPlaceName,
                            UserId = getuser.UserId,
                            UserStatusId = (Guid)us.UserStatusId,
                            CreatedAt = DateTime.Now
                        };
                        await _context.WorkPlaces.AddAsync(addwork);
                    }
                    else
                    {
                        existing.WorkPlaceName = us.WorkPlaceName;
                        existing.UserStatusId = (Guid)us.UserStatusId;
                        existing.UpdatedAt = DateTime.Now;
                        var updatework = _mapper.Map<Domain.CommandModels.WorkPlace>(existing);
                        _context.WorkPlaces.Update(updatework);
                    }
                }

                var removeitem = userwork.Where(x => !request.WorkPlaces.Any(y => y.WorkPlaceId == x.WorkPlaceId)).ToList();
                foreach (var item in removeitem)
                {
                    var workrm = _mapper.Map<Domain.CommandModels.WorkPlace>(item);
                    _context.WorkPlaces.Remove(workrm);
                }
            }

            if (request.WebAffiliations.Count > 0)
            {
                foreach (var us in request.WebAffiliations)
                {
                    var existing = userweb.FirstOrDefault(x => x.WebAffiliationId == us.WebAffiliationId);
                    if (existing == null)
                    {
                        var adduserweb = new Domain.CommandModels.WebAffiliation
                        {
                            WebAffiliationId = _helper.GenerateNewGuid(),
                            WebAffiliationUrl = us.WebAffiliationUrl,
                            UserId = getuser.UserId,
                            UserStatusId = (Guid)us.UserStatusId,
                            CreatedAt = DateTime.Now
                        };
                        await _context.WebAffiliations.AddAsync(adduserweb);
                    }
                    else
                    {
                        existing.WebAffiliationUrl = us.WebAffiliationUrl;
                        existing.UserStatusId = (Guid)us.UserStatusId;
                        existing.UpdatedAt = DateTime.Now;
                        var updateweb = _mapper.Map<Domain.CommandModels.WebAffiliation>(existing);
                        _context.WebAffiliations.Update(updateweb);
                    }
                }

                var removeitem = userwork.Where(x => !request.WebAffiliations.Any(y => y.WebAffiliationId == x.WorkPlaceId)).ToList();
                foreach (var item in removeitem)
                {
                    var webrm = _mapper.Map<Domain.CommandModels.WebAffiliation>(item);
                    _context.WebAffiliations.Remove(webrm);
                }
            }
            await _context.SaveChangesAsync();

            //mapping
            var result = _mapper.Map<UpdateUserCommandResult>(request);
            result.UpdatedAt = DateTime.Now;
            return Result<UpdateUserCommandResult>.Success(result);
        }
    }
}
