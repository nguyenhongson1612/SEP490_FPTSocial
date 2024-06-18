import { NativeSelect, TextInput, Textarea } from '@mantine/core'
import { useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { IoMdClose } from 'react-icons/io'
import { getGender, getStatus, updateUserProfile } from '~/apis'
import { EMAIL_RULE, EMAIL_MESSAGE, FIELD_REQUIRED_MESSAGE, PHONE_NUMBER_MESSAGE, PHONE_NUMBER_RULE, WHITESPACE_MESSAGE, WHITESPACE_RULE } from '~/utils/validators'

function UpdateProfile({ onClose, user }) {
  const yesterday = new Date(new Date().getTime() - (24 * 60 * 60 * 1000)).toISOString().split('T')[0]
  const { control, register, setValue, handleSubmit, formState: { errors } } = useForm()
  const [listGender, setListGender] = useState([])
  const [listStatus, setListStatus] = useState([])

  useEffect(() => {
    setValue('status', user?.userGender?.userStatusId)
    setValue('gender', user?.userGender?.genderId)
  }, [listGender, listStatus])
  useEffect(() => {
    getGender().then(data => data?.data?.map(e => ({ label: e?.genderName, value: e?.genderId }))).then(data => setListGender(data))
    getStatus().then(data => data?.data?.map(e => ({ label: e?.statusName, value: e?.userStatusId }))).then(data => { console.log(data); setListStatus(data) })
  }, [])
  // useEffect(() => {
  //   getGender().then(data => setListGender(data?.data))
  //   getStatus().then(data => setListStatus(data?.data))
  // }, [])

  const handleUpdateAvatar = (e) => {
    const file = e.target.files[0]
    setValue('fileAvatar', file)
    const imgAvatar = document.getElementById('imgAvatar')

    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        imgAvatar.src = event.target.result
      }
      reader.readAsDataURL(file)
    }
  }

  const handleUpdateCover = (e) => {
    const imgCover = document.getElementById('profile-cover')
    const file = e.target.files[0]
    setValue('fileCover', file)
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        imgCover.style.backgroundImage = `url(${event.target.result})`
      }
      reader.readAsDataURL(file)
    }
  }

  const validateData = (data) => {
    return data?.trim() || null
  }

  const submitUpdateProfile = (data) => {
    const submitData = {
      'userId': null,
      'firstName': validateData(data?.firstName),
      'lastName': validateData(data?.lastName),
      'birthDay': data?.birthDay,
      'gender': {
        'genderId': data?.gender,
        'userStatusId': data?.status
      },
      contactInfor: {
        'secondEmail': validateData(data?.secondEmail),
        'primaryNumber': validateData(data?.primaryNumber),
        'secondNumber': validateData(data?.primaryNumber),
        'userStatusId': data?.status
      },
      'relationship': {
        'relationshipId': '3fa85f64-5717-4562-b3fc-2c963f66afa6',
        'userStatusId': data?.status
      },
      'aboutMe': data?.aboutMe,
      'homeTown': data?.homeTown,
      'coverImage': data?.coverImage,
      'avataphoto': data?.avataphoto,
      'interes': [
        {
          'interestId': '3fa85f64-5717-4562-b3fc-2c963f66afa6',
          'userStatusId': data?.status
        }
      ],
      'workPlace': [
        {
          'workPlaceId': '3fa85f64-5717-4562-b3fc-2c963f66afa6',
          'workPlaceName': 'string',
          'userStatusId': data?.status
        }
      ],
      'webAffilication': [
        {
          'webAffiliationId': '3fa85f64-5717-4562-b3fc-2c963f66afa6',
          'webAffiliationUrl': 'string',
          'userStatusId': data?.status
        }
      ]
    }
    updateUserProfile(submitData).then(() => console.log('log'))
  }

  return (
    <form onSubmit={handleSubmit(submitUpdateProfile)}
      id='update-profile'
      className='w-full md:w-[700px] flex flex-col px-4 py-2'>
      <div className='flex justify-between items-center pb-2 border-b-2'>
        <span></span>
        <span className='text-xl font-bold'>Edit Profile</span>
        <IoMdClose className='bg-orangeFpt text-white rounded-full size-8 cursor-pointer hover:bg-orange-600' onClick={onClose} />
      </div>

      <div className='flex flex-col mt-2'>
        <div className='flex justify-between items-center '>
          <span className='text-xl font-bold'>Avatar</span>
          <input type='file' id='avatarUpload' className='hidden' accept="image/*"
            {...register('fileAvatar', {
              onChange: handleUpdateAvatar
            })
            } />
          <label htmlFor='avatarUpload' className='text-white px-4 py-2 rounded-md cursor-pointer bg-blue-500 hover:bg-blue-700'>Upload file</label>
        </div>
        <div className='flex justify-center items-center '>
          <div className='w-[170px] bg-white rounded-[50%] aspect-square flex justify-center items-center'>
            <img
              id="imgAvatar"
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQuatIJXhoIyk41rXuz9n3cHerAI8OdrNUjzBvvYALViA&s"
              alt="group-img"
              className="rounded-[50%] aspect-square object-cover w-[95%]"
            />
          </div>
        </div>
      </div>

      <div className='flex flex-col'>
        <div className='flex justify-between items-center '>
          <span className='text-xl font-bold'>Cover </span>
          <input type='file' id='coverUpload' className='hidden' accept="image/*"
            {...register('fileCover', {
              onChange: handleUpdateCover
            })
            } />
          <label htmlFor='coverUpload' className='text-white px-4 py-2 rounded-md cursor-pointer bg-blue-500 hover:bg-blue-700'>Upload file</label>
        </div>
        <div className='flex justify-center items-center '>
          <div id='profile-cover'
            className='w-full lg:w-[940px] aspect-[74/27] rounded-md
                           bg-[url(https://thumbs.dreamstime.com/b/incredibly-beautiful-sunset-sun-lake-sunrise-landscape-panorama-nature-sky-amazing-colorful-clouds-fantasy-design-115177001.jpg)] bg-cover bg-center bg-no-repeat'
          >
          </div>
        </div>
      </div>

      <div className='grid grid-cols-1 xs:grid-cols-2 gap-3 my-4'>
        <div className='col-span-1 xs:col-span-2'>
          <div className='flex items-center '>
            <span className='text-xl font-bold'>Information</span>
          </div>
        </div>

        <TextInput
          label="First name"
          defaultValue={user?.firstName}
          placeholder="First name"
          error={!!errors['firstName'] && `${errors['firstName']?.message}`}
          {...register('firstName', {
            required: FIELD_REQUIRED_MESSAGE,
            pattern: {
              value: WHITESPACE_RULE,
              message: WHITESPACE_MESSAGE
            }
          })}
        />
        <TextInput
          label="Last name"
          defaultValue={user?.lastName}
          placeholder="Last name"
          error={!!errors['lastName'] && `${errors['lastName']?.message}`}
          {...register('lastName', {
            required: FIELD_REQUIRED_MESSAGE,
            pattern: {
              value: WHITESPACE_RULE,
              message: WHITESPACE_MESSAGE
            }
          })}
        />

        <TextInput
          label="Hometown"
          defaultValue={user?.homeTown}
          placeholder="Hometown"
          error={!!errors['homeTown'] && `${errors['homeTown']?.message}`}
          {...register('homeTown', {
            pattern: {
              value: WHITESPACE_RULE,
              message: WHITESPACE_MESSAGE
            }
          })}
        />

        <TextInput
          label="Birthday"
          type="date"
          max={yesterday}
          defaultValue={new Date(user?.birthDay).toISOString().split('T')[0]}
          placeholder="Birthday"
          error={!!errors['birthDay'] && `${errors['birthDay']?.message}`}
          {...register('birthDay', {})}
        />

        <TextInput
          label="Primary number"
          defaultValue={user?.contactInfo?.primaryNumber}
          placeholder="Primary number"
          error={!!errors['primaryNumber'] && `${errors['primaryNumber']?.message}`}
          {...register('primaryNumber', {
            pattern: {
              value: PHONE_NUMBER_RULE,
              message: PHONE_NUMBER_MESSAGE
            }
          })}
        />

        <TextInput
          label="Second number"
          defaultValue={user?.contactInfo?.secondNumber}
          placeholder="Second number"
          error={!!errors['secondNumber'] && `${errors['secondNumber']?.message}`}
          {...register('secondNumber', {
            pattern: {
              value: PHONE_NUMBER_RULE,
              message: PHONE_NUMBER_MESSAGE
            }
          })}
        />

        <TextInput
          label="Second email"
          defaultValue={user?.contactInfo?.secondEmail}
          placeholder="Second email"
          error={!!errors['secondEmail'] && `${errors['secondEmail']?.message}`}
          {...register('secondEmail', {
            pattern: {
              value: EMAIL_RULE,
              message: EMAIL_MESSAGE
            }
          })}
        />

        <NativeSelect
          label="Profile status"
          data={listStatus}
          {...register('status')}
        />
        {/* <NativeSelect
          label="Profile status"
          data={listStatus}
          {...register('status')}
        >
          <optgroup label="Select status">
            {
              listStatus?.map(status => (
                <option key={status?.userStatusId} value={status?.userStatusId}>{status?.statusName}</option>
              ))
            }
          </optgroup>
        </NativeSelect> */}

        <NativeSelect
          label="Gender"
          data={listGender}
          {...register('gender')}
        />

        {/* <Controller
            name="gender"
            defaultValue={user?.userGender?.genderId}
            control={control}
            render={({ field }) => (
              <NativeSelect
                {...field}
                value={field.value}
                label="Gender"
                onChange={(value) => field.onChange(value)}
              >
                <optgroup label="Select gender">
                  {
                    listGender?.map(gender => (
                      <option key={gender?.genderId} value={gender?.genderId}>{gender?.genderId}{user?.userGender?.genderId}</option>
                    ))
                  }
                </optgroup>
              </NativeSelect>
            )}
          /> */}

        <Textarea
          className='xs:col-span-2'
          label="About me"
          defaultValue={user?.aboutMe}
          placeholder="About me"
          error={!!errors['aboutMe'] && `${errors['aboutMe']?.message}`}
          {...register('aboutMe', {
            pattern: {
              value: WHITESPACE_RULE,
              message: WHITESPACE_MESSAGE
            }
          })}
        />
      </div>

      <div>
        <div className="w-full">
          <button id="button" type="submit"
            className=" w-full p-4 font-medium bg-orangeFpt  text-white rounded-md hover:bg-orange-600"
          >
            Update Profile
          </button>
        </div>
      </div>
    </form>
  )
}

export default UpdateProfile;
