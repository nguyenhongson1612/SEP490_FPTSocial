import { toast } from 'react-toastify'
import { singleFileValidator } from '~/utils/validators'

function Step3({ register, setValue }) {
  const handleUpdateAvatar = (e) => {
    const file = e.target.files[0]
    const error = singleFileValidator(file)
    if (error) {
      toast.error(error)
      return
    }

    const imgAvatar = document.getElementById('holderAvatar')

    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        imgAvatar.src = event.target.result
      }
      reader.readAsDataURL(file)
      setValue('avataphoto', reader.readAsDataURL(file))
    }
  }

  const handleUpdateCover = (e) => {
    const imgCover = document.getElementById('holderCover')
    const file = e.target.files[0]
    const error = singleFileValidator(file)
    if (error) {
      toast.error(error)
      return
    }
    setValue('coverImage', file)
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        imgCover.style.backgroundImage = `url(${event.target.result})`
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <div className='flex flex-col h-full'>
      <div className='h-[50px] flex items-center px-5 border-b '>
        <span className='text-xl font-bold'>Avatar & cover</span>
      </div>
      <div className='px-4 pb-10 text-md font-semibold font-semibold' >
        <div className='grid grid-cols-12 gap-x-5 py-4'>
          <div className='col-span-12 xl:col-span-4 flex flex-col'>
            <div className='flex justify-between items-center '>
              <span className='text-xl font-bold'>Avatar</span>
              <input type='file' id='avataphoto' className='hidden' accept="image/*"
                {...register('avataphoto', {
                  onChange: handleUpdateAvatar
                })
                } />
              <label htmlFor='avataphoto' className='text-white px-4 py-2 rounded-md cursor-pointer bg-blue-500 hover:bg-blue-700'>Upload file</label>
            </div>
            <div className='flex justify-center items-center pt-2'>
              <div className='w-[8rem] xl:w-[10rem] bg-white rounded-[50%] aspect-square flex justify-center items-center'>
                <img
                  id="holderAvatar"
                  src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQuatIJXhoIyk41rXuz9n3cHerAI8OdrNUjzBvvYALViA&s"
                  alt="group-img"
                  className="rounded-[50%] aspect-square object-cover w-[95%]"
                />
              </div>
            </div>
          </div>

          <div className='col-span-12 xl:col-span-8 flex flex-col '>
            <div className='flex justify-between items-center '>
              <span className='text-xl font-bold'>Cover </span>
              <input type='file' id='coverImage' className='hidden' accept="image/*"
                {...register('coverImage', {
                  onChange: handleUpdateCover
                })
                } />
              <label htmlFor='coverImage' className='text-white px-4 py-2 rounded-md cursor-pointer bg-blue-500 hover:bg-blue-700'>Upload file</label>
            </div>
            <div className='flex justify-center items-center pt-2'>
              <div id='holderCover'
                className='w-full lg:w-[940px] aspect-[74/27] rounded-md
                           bg-[url(https://thumbs.dreamstime.com/b/incredibly-beautiful-sunset-sun-lake-sunrise-landscape-panorama-nature-sky-amazing-colorful-clouds-fantasy-design-115177001.jpg)] bg-cover bg-center bg-no-repeat'
              >
              </div>
            </div>
          </div>

        </div>
      </div >
    </div >
  )
}

export default Step3
