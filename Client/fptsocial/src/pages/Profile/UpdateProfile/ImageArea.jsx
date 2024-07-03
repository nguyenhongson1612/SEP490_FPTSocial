import { Avatar } from '@mui/material'
import { useConfirm } from 'material-ui-confirm'
import { toast } from 'react-toastify'
import { uploadImage } from '~/apis'
import { singleFileValidator } from '~/utils/validators'

function ImageArea({ register, setValue, watch, user }) {
  const coverImage = user?.coverImage
  const backgroundStyle = coverImage
    ? { backgroundImage: `url(${coverImage})` }
    : {
      background: 'linear-gradient(to bottom, #E9EBEE 80%, #8b9dc3 100%)'
    }

  const confirmFile = useConfirm()
  const handleUploadFile = (e, type) => {
    const fileData = new FormData()
    const file = e.target.files[0]
    const error = singleFileValidator(file)
    if (error) {
      toast.error(error)
      return
    }
    fileData.append('file', file)
    const url = URL.createObjectURL(file)
    confirmFile({
      title: (<div>Confirm using this file?<img src={url} /></div>),
      description: ('Are you sure you want to add this file? This file will be add into cloud if you click Confirm and cannot undo? '),
      confirmationText: 'Confirm',
      cancellationText: 'Cancel'
    }).then(() => {
      uploadImage({ userId: null, data: fileData }).then(data => setValue(type == 'avataphoto' ? 'avataphoto' : 'coverImage', data?.url))
    }).catch(() => { })
    e.target.value = ''
  }


  return (
    <div className=' border-2 border-blue-500 p-2 rounded-md'>
      <div className='flex flex-col mt-2'>
        <div className='flex justify-between items-center '>
          <span className='text-xl font-bold'>Avatar</span>
          <input type='file' id='avatarUpload' className='hidden' accept="image/*"
            {...register('avataphoto', {
              onChange: (e) => handleUploadFile(e, 'avataphoto')
            })
            } />
          <label htmlFor='avatarUpload' className='text-white px-4 py-2 rounded-md cursor-pointer bg-blue-500 hover:bg-blue-700'>Upload file</label>
        </div>
        <div className='flex justify-center items-center '>
          <div className='w-[170px] bg-white rounded-[50%] aspect-square flex justify-center items-center'>
            <Avatar alt="avatar" src={user?.avataPhotos?.find(e => e.isUsed == true)?.avataPhotosUrl} sx={{ width: 170, height: 170, border: '6px solid white' }} />
          </div>
        </div>
      </div>

      <div className='flex flex-col'>
        <div className='flex justify-between items-center '>
          <span className='text-xl font-bold'>Cover </span>
          <input type='file' id='coverUpload' className='hidden' accept="image/*"
            {...register('coverImage', {
              onChange: (e) => handleUploadFile(e, 'coverImage')
            })
            } />
          <label htmlFor='coverUpload' className='text-white px-4 py-2 rounded-md cursor-pointer bg-blue-500 hover:bg-blue-700'>Upload file</label>
        </div>
        <div className='flex justify-center items-center '>
          <div id='profile-cover'
            className='w-full lg:w-[940px] aspect-[74/27] rounded-md
                       bg-cover bg-center bg-no-repeat'
            style={backgroundStyle}
          >
          </div>
        </div>
      </div>
    </div>
  )
}

export default ImageArea
