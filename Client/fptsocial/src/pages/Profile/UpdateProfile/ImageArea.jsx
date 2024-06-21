
function ImageArea({ register, setValue }) {
  const handleUpdateAvatar = (e) => {
    const file = e.target.files[0]
    const imgAvatar = document.getElementById('imgAvatar')
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        imgAvatar.src = event.target.result
        setValue('fileAvatar', file)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleUpdateCover = (e) => {
    const imgCover = document.getElementById('profile-cover')
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        imgCover.style.backgroundImage = `url(${event.target.result})`
        setValue('fileCover', file)
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <div className=' border-2 border-blue-500 p-2 rounded-md'>
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
    </div>
  )
}

export default ImageArea
