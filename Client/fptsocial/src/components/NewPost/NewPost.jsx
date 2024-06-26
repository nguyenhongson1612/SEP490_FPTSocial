// import React from 'react'
import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { IoMdClose, IoMdArrowBack } from 'react-icons/io'
import { FaLock } from 'react-icons/fa6'
import { IoMdArrowDropdown } from 'react-icons/io'
import Tiptap from '../TitTap/TitTap'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import { useSelector } from 'react-redux'
import { selectCurrentUser } from '~/redux/user/userSlice'
import { motion } from 'framer-motion'
import { createPost, getStatus } from '~/apis'
import { Group, Radio, Stack, Text } from '@mantine/core'
function NewPost() {
  const [isCreate, setIsCreate] = useState(false)
  const [isChosePostAudience, setIsChosePostAudience] = useState(false)
  const { handleSubmit } = useForm()
  const [content, setContent] = useState('')
  const user = useSelector(selectCurrentUser)
  const [listPhotos, setListPhotos] = useState([])
  const [listVideos, setListVideos] = useState([])
  const [listStatus, setListStatus] = useState([])
  const [choseStatus, setChoseStatus] = useState({})

  useEffect(() => {
    getStatus().then(data => setListStatus(data))
  }, [])
  useEffect(() => {
    setChoseStatus(listStatus?.find(e => e.statusName.toLowerCase() == 'public')?.userStatusId)
  }, [listStatus])
  const navigate = useNavigate()
  const submitPost = () => {
    console.log(content)
    console.log(listPhotos, listVideos);
    console.log(choseStatus)
    const submitCreatePostData = {

      'userId': user?.userId,
      'content': content,
      'userStatusId': choseStatus,
      'photos': listPhotos,
      'videos': listVideos
    }
    toast.promise(
      createPost(submitCreatePostData),
      { pending: 'Created is in progress...' }
    ).then(() => {
      navigate('/')
      toast.success('Create post successfully')
    })
  }

  const currentUser = useSelector(selectCurrentUser)

  return (
    <div id="new-post"
      className="w-full sm:w-[500px] flex flex-col mt-8 gap-2 border border-gray-300 p-4 rounded-lg shadow-lg bg-white"
    >
      <div className="flex gap-4 items-center w-full ">
        <Link
          to={`/profile?id=${currentUser?.userId}`}
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
                <form onSubmit={handleSubmit(submitPost)} >
                  <div className='flex flex-col'>
                    <div className='h-[60px] flex justify-between items-center px-2 border-b '>
                      <span></span>
                      <span className='text-2xl font-bold'>Create post</span>
                      <IoMdClose className='bg-orangeFpt text-white rounded-full size-9 cursor-pointer hover:bg-orange-700' onClick={() => setIsCreate(!isCreate)} />
                    </div>
                    <div className='mx-4'>
                      <div className='flex items-center h-[40] p-4 gap-2 '>
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
                            {/* <FaLock /> */}
                            <span className=''>{listStatus?.find(e => e.userStatusId == choseStatus)?.statusName}</span>
                            <IoMdArrowDropdown className='size-4' />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className='pb-1 text-2xl' >
                      <Tiptap
                        setContent={setContent}
                        content={content}
                        listPhotos={listPhotos}
                        setListPhotos={setListPhotos}
                        listVideos={listVideos}
                        setListVideos={setListVideos}
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
                  <div className='flex flex-col'>
                    <div className='h-[60px]  flex justify-between items-center px-5 border-b '>
                      <IoMdArrowBack className='bg-orangeFpt text-white rounded-full size-9 cursor-pointer hover:bg-orange-700' onClick={() => setIsChosePostAudience(!isChosePostAudience)} />
                      <span className='text-2xl font-bold'>Post Audience</span>
                      <span></span>
                    </div>

                    <div className='px-4 pb-10 ' >
                      <div>
                        <div className='font-bold '>Who can see your post?</div>
                        <div className='text-sm'>
                          Your post will show up in Feed, on your profile and in search results.<br /><br />
                          Your default audience is set to Public, but you can change the audience of this specific post.
                        </div>
                      </div>
                      <div>
                        <Radio.Group
                          value={choseStatus}
                          onChange={setChoseStatus}
                          label="Pick one package to install"
                          description="Choose a package that you will need in your application"
                        >
                          <Stack pt="md" gap="xs">
                            {listStatus?.map((status) => (
                              <Radio.Card radius="md" value={status.userStatusId} key={status.userStatusId}>
                                <Group wrap="nowrap" align="flex-start">
                                  <Radio.Indicator />
                                  <div>
                                    <Text className={''}>{status.statusName}</Text>
                                  </div>
                                </Group>
                              </Radio.Card>
                            ))}
                          </Stack>
                        </Radio.Group>
                      </div>

                    </div >

                    {/* <div className='py-4 flex justify-center items-center'>
                      <button className='h-9 w-full  mx-4 bg-orangeFpt font-bold text-white rounded-lg cursor-pointer'
                      >
                        Done
                      </button>
                    </div> */}
                  </div >
                </motion.div>

              )}
            </div >
          </div >
        )
      }
    </div >
  )
}

export default NewPost