import React, { useEffect, useState } from 'react'
import { set, useForm } from 'react-hook-form'
import { getAllPost } from '~/apis'
import ListPost from '~/components/ListPost/ListPost'
import NavTopBar from '~/components/NavTopBar/NavTopBar'
import { IoMdClose } from 'react-icons/io'
import { FIELD_REQUIRED_MESSAGE, WHITESPACE_RULE } from '~/utils/validators'

function Profile() {
  const [listPost, setListPost] = useState(null)
  const [openProfile, setOpenProfile] = useState(false)
  const { register, setValue, handleSubmit, formState: { errors } } = useForm()

  useEffect(() => {
    // Call API
    getAllPost().then(data => {
      // console.log('🚀 ~ getAllPost ~ data:', data)
      setListPost(data)
    })
  }, [])

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
    <>
      <div className='relative'>
        <NavTopBar />
        <div className={` ${openProfile && 'max-h-[calc(100vh_-_55px)] overflow-y-clip'}`}>
          <div id='top-profile'
            className='bg-white shadow-md w-full flex flex-col items-center'
          >
            <div id=''
              className='w-full lg:w-[940px] aspect-[74/27] rounded-md
          bg-[url(https://thumbs.dreamstime.com/b/incredibly-beautiful-sunset-sun-lake-sunrise-landscape-panorama-nature-sky-amazing-colorful-clouds-fantasy-design-115177001.jpg)] 
          bg-cover bg-center bg-no-repeat'
            >
            </div>

            <div id='avatar-profile'
              className='w-full flex justify-center pb-4 border-b'
            >
              <div className='flex flex-col lg:flex-row items-center lg:items-end justify-center gap-4'>
                <div id='avatar'>
                  <div className='relative w-[170px] h-[90px] lg:h-0'>
                    <div className='absolute bottom-0 w-[170px] bg-white rounded-[50%] aspect-square flex justify-center items-center'>
                      <img
                        src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQuatIJXhoIyk41rXuz9n3cHerAI8OdrNUjzBvvYALViA&s"
                        alt="group-img"
                        className="rounded-[50%] aspect-square object-cover w-[95%]"
                      />
                    </div>
                  </div>
                </div>

                <div id='name-friend'
                  className='flex flex-col items-center lg:items-start justify-end mb-4 gap-1'
                >
                  <span className='text-gray-900 font-bold text-3xl'>Hoan Le</span>
                  <span className='text-gray-500 font-bold'> 999 Friends</span>

                  <div className='flex items-center [&>img:not(:first-child)]:-ml-4'>
                    <img
                      src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQuatIJXhoIyk41rXuz9n3cHerAI8OdrNUjzBvvYALViA&s"
                      alt="group-img"
                      className="rounded-[50%] aspect-square object-cover w-10 border-2 border-white"
                    />
                    <img
                      src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQuatIJXhoIyk41rXuz9n3cHerAI8OdrNUjzBvvYALViA&s"
                      alt="group-img"
                      className="rounded-[50%] aspect-square object-cover w-10 border-2 border-white"
                    />
                    <img
                      src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQuatIJXhoIyk41rXuz9n3cHerAI8OdrNUjzBvvYALViA&s"
                      alt="group-img"
                      className="rounded-[50%] aspect-square object-cover w-10 border-2 border-white"
                    />
                    <img
                      src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQuatIJXhoIyk41rXuz9n3cHerAI8OdrNUjzBvvYALViA&s"
                      alt="group-img"
                      className="rounded-[50%] aspect-square object-cover w-10 border-2 border-white"
                    />
                    <img
                      src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQuatIJXhoIyk41rXuz9n3cHerAI8OdrNUjzBvvYALViA&s"
                      alt="group-img"
                      className="rounded-[50%] aspect-square object-cover w-10 border-2 border-white"
                    />
                  </div>
                </div>

                <div id='update'
                  onClick={() => setOpenProfile(!openProfile)}
                  className='flex flex-col justify-end mb-4 cursor-pointer'
                >
                  <span className='font-bold text-lg text-gray-900 p-2 rounded-md bg-fbWhite hover:bg-fbWhite-500'>Update Your Profile</span>
                </div>
              </div>
            </div>
          </div>

          <div id='content-profile'
            className='flex flex-col items-center lg:flex-row lg:justify-center lg:items-start w-full'>
            <div
              id='info'
              className='w-[90%] lg:basis-3/12 h-fit bg-white mt-8 rounded-md shadow-md'>
              <div className='flex flex-col p-4'>
                <h3 className='text-xl font-bold  '>Profile</h3>
                <p>From&nbsp;&nbsp;<span className='font-bold'>Hanoi, Viet Name</span></p>
                <p>Campus&nbsp;&nbsp;<span className='font-bold'>Hoa Lac</span></p>
                <p>Gender&nbsp;&nbsp;<span className='font-bold'>Unknown</span></p>
                {/* <p>Campus&nbsp;&nbsp;<span className='font-bold'>Hoa Lac</span></p> */}
              </div>
            </div>
            <div className='basis-11/12 lg:basis-5/12 '>
              <ListPost listPost={listPost} />
            </div>
          </div>

          {
            openProfile && (
              <form onSubmit={handleSubmit(submitUpdateProfile)}
                id='update-profile'
                className='bg-[rgba(252,252,252,0.5)] fixed top-0 left-0 bottom-0 right-0  flex justify-center z-30 overflow-auto'>
                <div className='w-[90%] md:w-[60%] bg-white my-12 h-fit rounded-md shadow-4edges '>
                  <div className='flex flex-col px-4 py-2'>
                    <div className='flex justify-between items-center pb-2 border-b-2'>
                      <span></span>
                      <span className='text-xl font-bold'>Edit Profile</span>
                      <IoMdClose className='bg-fbWhite-500 rounded-full size-10 cursor-pointer hover:bg-fbWhite-700' onClick={() => setOpenProfile(!openProfile)} />
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

                    <div className='flex flex-col '>
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

                    <div className='grid grid-cols-1 sm:grid-cols-2 gap-3 my-4'>
                      <div className='col-span-1 sm:col-span-2'>
                        <div className='flex items-center '>
                          <span className='text-xl font-bold'>Information</span>
                        </div>
                      </div>
                      <div className="relative ">
                        <input id='nickName'
                          type="text"
                          className={`${errors.nickName && ' !border-red-500 focus:outline-offset-4 focus:outline-red-500'} bg-white peer w-full px-4 pb-3 pt-6 font-medium border border-gray-300 rounded-md placeholder:text-transparent
                          hover:border-gray-900 focus:outline-offset-4 focus:outline-blue-500`}
                          placeholder="mail"
                          // error={!!errors['password']}
                          {...register('nickName', {
                            required: true,
                            pattern: {
                              value: WHITESPACE_RULE,
                            }
                          })}
                        />
                        {errors.nickName && <span className='text-red-500 text-xs'>{FIELD_REQUIRED_MESSAGE}</span>}
                        <label htmlFor="nickName" className={`${errors.nickName && '!text-red-500'} absolute left-0 top-0 ml-3 text-gray-500  duration-100 ease-linear peer-placeholder-shown:translate-y-4
                peer-[:not(:placeholder-shown)]:text-xs  peer-placeholder-shown:text-gray-500 peer-focus:ml-3 peer-focus:translate-y-0 px-1 peer-focus:text-xs peer-focus:text-blue-500 `}
                        >
                          Nick Name
                        </label>
                      </div>
                      <div className="relative ">
                        <input id='address'
                          type="text"
                          className={`${errors.address && ' !border-red-500 focus:outline-offset-4 focus:outline-red-500'} bg-white peer w-full px-4 pb-3 pt-6 font-medium border border-gray-300 rounded-md placeholder:text-transparent
                          hover:border-gray-900 focus:outline-offset-4 focus:outline-blue-500`}
                          placeholder="mail"
                          // error={!!errors['password']}
                          {...register('address', {

                          })}
                        />
                        {errors.address && <span className='text-red-500 text-xs'>{FIELD_REQUIRED_MESSAGE}</span>}
                        <label htmlFor="address" className={`${errors.address && '!text-red-500'} absolute left-0 top-0 ml-3 text-gray-500  duration-100 ease-linear peer-placeholder-shown:translate-y-4
                peer-[:not(:placeholder-shown)]:text-xs  peer-placeholder-shown:text-gray-500 peer-focus:ml-3 peer-focus:translate-y-0 px-1 peer-focus:text-xs peer-focus:text-blue-500 `}
                        >
                          Address
                        </label>
                      </div>

                    </div>
                    <div>
                      <div className="w-full">
                        <button id="button" type="submit"
                          className=" w-full p-4 font-medium bg-[#0866FF] text-white rounded-md hover:bg-opacity-85"
                        >
                          Update Profile
                        </button>
                      </div>
                    </div>

                  </div>

                </div>
              </form>
            )
          }
        </div>
      </div>


    </>
  )
}

export default Profile