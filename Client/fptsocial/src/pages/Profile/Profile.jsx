import React, { useEffect, useState } from 'react'
import { set } from 'react-hook-form'
import { getAllPost } from '~/apis'
import ListPost from '~/components/ListPost/ListPost'
import NavTopBar from '~/components/NavTopBar/NavTopBar'

function Profile() {
  const [listPost, setListPost] = useState(null)
  const [openProfile, setOpenProfile] = useState(false)
  useEffect(() => {
    // Call API
    getAllPost().then(data => {
      // console.log('🚀 ~ getAllPost ~ data:', data)
      setListPost(data)
    })
  }, [])

  return (
    <>

      <div className='relative'>
        {/* <NavTopBar /> */}
        <div id='top-profile'
          className='bg-white shadow-md w-full flex flex-col items-center'
        >
          <div id='profile-cover'
            className='w-full lg:w-[940px] aspect-[74/27] rounded-md
          bg-[url(https://thumbs.dreamstime.com/b/incredibly-beautiful-sunset-sun-lake-sunrise-landscape-panorama-nature-sky-amazing-colorful-clouds-fantasy-design-115177001.jpg)] bg-cover bg-center bg-no-repeat'
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

                <div className='flex items-center'>
                  <img
                    src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQuatIJXhoIyk41rXuz9n3cHerAI8OdrNUjzBvvYALViA&s"
                    alt="group-img"
                    className="rounded-[50%] aspect-square object-cover w-10"
                  />
                  <img
                    src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQuatIJXhoIyk41rXuz9n3cHerAI8OdrNUjzBvvYALViA&s"
                    alt="group-img"
                    className="rounded-[50%] aspect-square object-cover w-10"
                  />
                  <img
                    src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQuatIJXhoIyk41rXuz9n3cHerAI8OdrNUjzBvvYALViA&s"
                    alt="group-img"
                    className="rounded-[50%] aspect-square object-cover w-10"
                  />
                  <img
                    src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQuatIJXhoIyk41rXuz9n3cHerAI8OdrNUjzBvvYALViA&s"
                    alt="group-img"
                    className="rounded-[50%] aspect-square object-cover w-10"
                  />
                  <img
                    src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQuatIJXhoIyk41rXuz9n3cHerAI8OdrNUjzBvvYALViA&s"
                    alt="group-img"
                    className="rounded-[50%] aspect-square object-cover w-10"
                  />
                </div>
              </div>

              <div id='update'
                onClick={() => setOpenProfile(!openProfile)}
                className='flex flex-col justify-end mb-4'
              >
                <span className='font-bold text-lg text-gray-900 p-2 rounded-md bg-fbWhite'>Update Your Profile</span>
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
            <div className='bg-white opacity-85 absolute top-0 left-0 bottom-0 right-0  flex justify-center items-center'>
              <div className='w-[90%] md:w-[60%] bg-gray-700 h-[2000px]'>
                abc
              </div>
            </div>
          )
        }
      </div>


    </>
  )
}

export default Profile