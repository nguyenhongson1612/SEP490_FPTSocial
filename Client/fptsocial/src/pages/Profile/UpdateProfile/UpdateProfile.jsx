import { Button, MultiSelect, NativeSelect, Text, TextInput, Textarea } from '@mantine/core'
import { useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { IoMdClose } from 'react-icons/io'
import { FaPlus } from 'react-icons/fa'
import { getGender, getInterest, getRelationships, getStatus, updateUserProfile } from '~/apis'
import { EMAIL_RULE, EMAIL_MESSAGE, FIELD_REQUIRED_MESSAGE, PHONE_NUMBER_MESSAGE, PHONE_NUMBER_RULE, WHITESPACE_MESSAGE, WHITESPACE_RULE, URL_RULE, URl_MESSAGE } from '~/utils/validators'
import { inputRegex } from '@tiptap/extension-image'
import Contact from './Contact'
import Information from './Information'
import Gender from './Gender'
import Relationship from './Relationship'
import Interests from './Interests'
import Workspace from './Workspace'
import WebAffiliations from './WebAffiliations'
import ImageArea from './ImageArea'

function UpdateProfile({ onClose, user }) {
  const { control, register, setValue, handleSubmit, formState: { errors } } = useForm()
  const [listGender, setListGender] = useState([])
  const [listStatus, setListStatus] = useState([])
  const [listInterest, setListInterest] = useState([])
  const [listRelationship, setListRelationship] = useState([])
  const [inputs, setInputs] = useState(user?.webAffiliations.length === 0 ? [''] : user?.webAffiliations)
  console.log(inputs);
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



  const validateData = (data) => {
    return data?.trim() || null
  }

  const submitUpdateProfile = (data) => {
    console.log(data, 'formdata');
    const submitData = {
      'userId': null,
      'firstName': validateData(data?.firstName),
      'lastName': validateData(data?.lastName),
      'birthDay': data?.birthDay,
      'gender': {
        'genderId': data?.gender,
        'userStatusId': data?.genderStatus
      },
      'contactInfo': {
        'secondEmail': validateData(data?.secondEmail),
        'primaryNumber': validateData(data?.primaryNumber),
        'secondNumber': validateData(data?.secondNumber),
        'userStatusId': data?.contactStatus
      },
      'userRelationship': {
        'relationshipId': data?.relationship,
        'userStatusId': data?.relationshipStatus
      },
      'aboutMe': data?.aboutMe,
      'homeTown': data?.homeTown,
      'coverImage': data?.coverImage,
      'avataphoto': data?.avataphoto,
      'userInterests': data?.interest?.map(e => ({ interestId: e, userStatusId: data?.interestStatus })),
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
      }, [])
    }
    console.log(submitData, 'submitdata')
    updateUserProfile(submitData).then(() => console.log('log'))
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
          className=" w-full p-4 font-medium bg-orangeFpt  text-white rounded-md hover:bg-orange-600">Update Profile</button>
      </div>
    </form>
  )
}

export default UpdateProfile;
