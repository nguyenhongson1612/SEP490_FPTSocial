import { TextInput } from '@mantine/core'
import { useForm } from 'react-hook-form'
import { IoMdClose } from 'react-icons/io'
import { useSelector } from 'react-redux'
import { selectCurrentUser } from '~/redux/user/userSlice'
import { FIELD_REQUIRED_MESSAGE, WHITESPACE_MESSAGE, WHITESPACE_RULE } from '~/utils/validators'

function UpdateProfile({ onClose }) {
  const currentUser = useSelector(selectCurrentUser)
  const yesterday = new Date(new Date().getTime() - (24 * 60 * 60 * 1000)).toISOString().split('T')[0]
  const { register, setValue, handleSubmit, formState: { errors } } = useForm()
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

  const submitUpdateProfile = (data) => {
    console.log(data)
  }

  return (
    <form onSubmit={handleSubmit(submitUpdateProfile)}
      id='update-profile'
      className='min-w-[300px] md:w-[700px] flex flex-col px-4 py-2'>
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
          defaultValue={currentUser?.firstName}
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
          defaultValue={currentUser?.lastName}
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
          defaultValue={currentUser?.homeTown}
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
          defaultValue={new Date(currentUser?.birthDay).toISOString().split('T')[0]}
          placeholder="Birthday"
          error={!!errors['birthDay'] && `${errors['birthDay']?.message}`}
          {...register('birthDay', {})}
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
