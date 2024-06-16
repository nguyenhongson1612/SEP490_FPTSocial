// import React from 'react'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { IoMdClose, IoMdArrowBack } from 'react-icons/io'
import { FaLock } from 'react-icons/fa6'
import { IoMdArrowDropdown } from 'react-icons/io'
import Tiptap from '../TitTap/TitTap'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import { useSelector } from 'react-redux'
import { selectCurrentUser } from '~/redux/user/userSlice'
import { motion } from 'framer-motion'

function NewPost() {
  const [isCreate, setIsCreate] = useState(false)
  const [isChosePostAudience, setIsChosePostAudience] = useState(false)
  const { register, handleSubmit, formState: { errors } } = useForm()
  const [content, setContent] = useState('')
  const user = useSelector(selectCurrentUser)
  const createPost = () => {
    console.log(content)
    toast.success('Create post successfully')
  }

  return (
    <div id="new-post"
      className="w-full sm:w-[500px] flex flex-col mt-8 gap-2 border border-gray-300 p-4 rounded-lg shadow-lg bg-white"
    >
      <div className="flex gap-4 items-center w-full ">
        <Link
          to={'/profile'}
          className=" hover:text-gray-950 flex items-center justify-center gap-3">
          <img
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQuatIJXhoIyk41rXuz9n3cHerAI8OdrNUjzBvvYALViA&s"
            alt="group-img"
            className="rounded-[50%] aspect-square object-cover w-10"
          />
        </Link>
        <div className="w-[90%] bg-fbWhite rounded-3xl hover:bg-fbWhite-500 cursor-pointer"
          onClick={() => setIsCreate(!isCreate)}
        >
          <p className="px-3 py-3 max-sm:text-sm font-medium text-gray-500">What&apos;s on your mind, {user?.firstName + ' ' + user?.lastName}?</p>
        </div>
      </div>

      {
        isCreate && (
          <div className='fixed inset-0 z-30 bg-[rgba(252,252,252,0.5)] flex justify-center items-center'>
            <div className='w-full xs:w-[420px] md:w-[500px] bg-white shadow-4edges rounded-lg '>
              {!isChosePostAudience ? (
                <form onSubmit={handleSubmit(createPost)} >
                  <div className='flex flex-col'>
                    <div className='h-[60px] flex justify-between items-center px-5 border-b '>
                      <span></span>
                      <span className='text-2xl font-bold'>Create post</span>
                      <IoMdClose className='bg-orangeFpt text-white rounded-full size-9 cursor-pointer hover:bg-orange-700' onClick={() => setIsCreate(!isCreate)} />
                    </div>
                    <div className='mx-4'>
                      <div className='flex items-center h-[40] py-4 gap-2 '>
                        <img
                          src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQuatIJXhoIyk41rXuz9n3cHerAI8OdrNUjzBvvYALViA&s"
                          alt="group-img"
                          className="rounded-[50%] aspect-square object-cover w-10"
                        />
                        <div className='flex flex-col w-full cursor-pointer'>
                          <span className='font-bold'>{user?.firstName + ' ' + user?.lastName}</span>
                          <div
                            onClick={() => setIsChosePostAudience(!isChosePostAudience)}
                            className='flex items-center gap-1 text-xs text-white font-bold py-1 px-2 bg-orangeFpt w-fit rounded-lg'>
                            <FaLock />
                            <span className=''>Only me</span>
                            <IoMdArrowDropdown className='size-4' />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className='px-4 pb-10 text-2xl' >
                      <Tiptap
                        setContent={setContent}
                        content={content}
                      // {...register('postContent', {
                      //   required: true,
                      // })
                      // }
                      />
                    </div >

                    <div className='py-4 flex justify-center items-center'>
                      <button className='h-9 w-full  mx-4 bg-orangeFpt font-bold text-white rounded-lg cursor-pointer'
                      >
                        Post
                      </button>
                    </div>
                  </div >
                </form >
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <form onSubmit={handleSubmit(createPost)} >
                    <div className='flex flex-col'>
                      <div className='h-[60px] flex justify-between items-center px-5 border-b '>
                        <IoMdArrowBack className='bg-orangeFpt text-white rounded-full size-9 cursor-pointer hover:bg-orange-700' onClick={() => setIsChosePostAudience(!isChosePostAudience)} />
                        <span className='text-2xl font-bold'>Post Audience</span>
                        <span></span>
                      </div>

                      <div className='px-4 pb-10 text-2xl' >
                      </div >

                      <div className='py-4 flex justify-center items-center'>
                        <button className='h-9 w-full  mx-4 bg-orangeFpt font-bold text-white rounded-lg cursor-pointer'
                        >
                          Done
                        </button>
                      </div>
                    </div >
                  </form >
                </motion.div>

              )}


            </div >
          </div >
        )
      }

      {/* <div className="flex justify-between items-center w-full">
        <a className=" hover:text-gray-950 flex items-center justify-center gap-3">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="m15.75 10.5 4.72-4.72a.75.75 0 0 1 1.28.53v11.38a.75.75 0 0 1-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 0 0 2.25-2.25v-9a2.25 2.25 0 0 0-2.25-2.25h-9A2.25 2.25 0 0 0 2.25 7.5v9a2.25 2.25 0 0 0 2.25 2.25Z" />
          </svg>
          <span>Live</span>
        </a>
        <a className=" hover:text-gray-950 flex items-center justify-center gap-3">
          <div className=" hover:text-gray-950 flex items-center justify-center gap-3">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
            </svg>
          </div>
          <span>Photos/Videos</span>
        </a>
        <a className=" hover:text-gray-950 flex items-center justify-center gap-3">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.182 15.182a4.5 4.5 0 0 1-6.364 0M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0ZM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75Zm-.375 0h.008v.015h-.008V9.75Zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75Zm-.375 0h.008v.015h-.008V9.75Z" />
          </svg>
          <span>Feeling/Activity</span>
        </a>
      </div> */}
    </div >
  )
}

export default NewPost