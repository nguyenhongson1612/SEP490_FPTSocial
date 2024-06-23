import { Button, MultiSelect, NativeSelect, Text, TextInput, Textarea } from '@mantine/core'
import { useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { IoMdClose } from 'react-icons/io'
import { getGender, getInterest, getRelationships, getStatus, updateUserProfile } from '~/apis'
import Contact from './Contact'
import Information from './Information'
import Gender from './Gender'
import Relationship from './Relationship'
import Interests from './Interests'
import Workspace from './Workspace'
import WebAffiliations from './WebAffiliations'
import ImageArea from './ImageArea'
import { useDispatch } from 'react-redux'
import { toast } from 'react-toastify'
import { getUserByUserId } from '~/redux/user/userSlice'

function UpdateProfile({ onClose, user, navigate }) {
  const { control, reset, register, setValue, handleSubmit, formState: { errors } } = useForm()
  const [listGender, setListGender] = useState([])
  const [listStatus, setListStatus] = useState([])
  const [listInterest, setListInterest] = useState([])
  const [listRelationship, setListRelationship] = useState([])
  const [inputs, setInputs] = useState(user?.webAffiliations.length === 0 ? [''] : user?.webAffiliations)
  const dispatch = useDispatch()
  const handleAddInput = () => {
    if (inputs.length == 3) return
    setInputs([...inputs, ''])
  }

  useEffect(() => {
    getGender().then(data => setListGender(data))
    getStatus().then(data => setListStatus(data))
    getInterest()
      .then(data => (data?.map(e => ({ label: e?.interestName, value: e?.interestId }))))
      .then(data => setListInterest(data))
    getRelationships().then(data => setListRelationship(data))
  }, [])

  useEffect(() => reset({
    workplaceStatus: user?.workPlaces[0]?.userStatusId ?? listStatus.find(e => e?.statusName?.toLowerCase() === 'public')?.userStatusId,
    contactStatus: user?.contactInfo?.userStatusId ?? listStatus.find(e => e?.statusName?.toLowerCase() === 'public')?.userStatusId,
    genderStatus: user?.userGender?.userStatusId ?? listStatus.find(e => e?.statusName?.toLowerCase() === 'public')?.userStatusId,
    webAffiliationsStatus: user?.webAffiliations[0]?.userStatusId ?? listStatus.find(e => e?.statusName?.toLowerCase() === 'public')?.userStatusId,
    relationshipStatus: user?.userRelationship?.userStatusId ?? listStatus.find(e => e?.statusName?.toLowerCase() === 'public')?.userStatusId,
    interestStatus: user?.userInterests[0]?.userStatusId ?? listStatus.find(e => e?.statusName?.toLowerCase() === 'public')?.userStatusId
  }), [listStatus])


  const validateData = (data) => {
    return data?.trim() || null
  }

  const submitUpdateProfile = (data) => {
    console.log(data, 'formdata')
    const submitData = {
      'userId': null,
      'firstName': data?.firstName,
      'lastName': data?.lastName,
      'birthDay': data?.birthDay,
      'userGender': {
        'genderId': data?.gender,
        'userStatusId': data?.genderStatus
      },
      'contactInfo': {
        'secondEmail': data?.secondEmail,
        'primaryNumber': data?.primaryNumber,
        'secondNumber': data?.secondNumber,
        'userStatusId': data?.contactStatus
      },
      'userRelationship': data?.relationship ? {
        'relationshipId': data?.relationship,
        'userStatusId': data?.relationshipStatus
      } : null,
      'aboutMe': data?.aboutMe,
      'homeTown': data?.homeTown,
      'coverImage': data?.coverImage,
      'avataphoto': data?.avataphoto,
      'userInterests': data?.interest?.map(e => ({ interestId: e, userStatusId: data?.interestStatus })).length == 0 ?
        null : data?.interest?.map(e => ({ interestId: e, userStatusId: data?.interestStatus })),
      'workPlaces': [
        {
          'workPlaceId': user?.workPlaces[0]?.workPlaceId ?? null,
          'workPlaceName': data?.workPlace,
          'userStatusId': data?.workplaceStatus
        }
      ],
      'webAffiliations': inputs?.reduce((acc, e, i) => {
        if (data[`webAffiliations_${i}`].length == 0) return acc
        acc.push({
          webAffiliationId: user?.webAffiliations[i]?.webAffiliationId ?? null,
          webAffiliationUrl: data[`webAffiliations_${i}`],
          userStatusId: data?.webAffiliationsStatus
        })
        return acc
      }, []).length == 0 ? null : inputs?.reduce((acc, e, i) => {
        if (data[`webAffiliations_${i}`].length == 0) return acc
        acc.push({
          webAffiliationId: user?.webAffiliations[i]?.webAffiliationId ?? null,
          webAffiliationUrl: data[`webAffiliations_${i}`],
          userStatusId: data?.webAffiliationsStatus
        })
        return acc
      }, [])
    }
    console.log(submitData, 'submitdata')
    toast.promise(
      updateUserProfile(submitData),
      { pending: 'Updating is in progress...' }
    ).then(() => {
      onClose()
      dispatch(getUserByUserId())
      navigate('/')
      toast.success('Account updated successfully')
    })
  }

  return (
    <form onSubmit={handleSubmit(submitUpdateProfile)}
      id='update-profile'
      className='w-full md:w-[700px] flex flex-col gap-2 px-4 py-2'>
      <div className='flex justify-between items-center pb-2 border-b-2'>
        <span></span>
        <span className='text-xl font-bold'>Edit Profile</span>
        <IoMdClose className='bg-orangeFpt text-white rounded-full size-8 cursor-pointer hover:bg-orange-600' onClick={onClose} />
      </div>
      <ImageArea register={register} setValue={setValue} />
      <Information register={register} user={user} errors={errors} />
      <Contact control={control} errors={errors} listStatus={listStatus} register={register} user={user} />
      <Gender control={control} listGender={listGender} listStatus={listStatus} user={user} />
      <Relationship control={control} listRelationship={listRelationship} listStatus={listStatus} user={user} />
      <Interests control={control} listInterest={listInterest} listStatus={listStatus} user={user} />
      <Workspace control={control} errors={errors} listStatus={listStatus} register={register} user={user} />
      <WebAffiliations control={control} errors={errors} handleAddInput={handleAddInput} inputs={inputs} listStatus={listStatus} register={register} user={user} />

      <div className="w-full">
        <button id="button" type="submit"
          className="interceptor-loading w-full p-4 font-medium bg-orangeFpt text-white rounded-md hover:bg-orange-600">Update Profile</button>
      </div>
    </form>
  )
}

export default UpdateProfile;
