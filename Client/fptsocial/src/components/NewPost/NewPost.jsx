// import React from 'react'
import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Tiptap from '../TitTap/TitTap'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import { useDispatch, useSelector } from 'react-redux'
import { selectCurrentUser } from '~/redux/user/userSlice'
import { getStatus } from '~/apis'
import { IconCaretDownFilled, IconX } from '@tabler/icons-react'
import { createPost } from '~/apis/postApis'
import UserAvatar from '../UI/UserAvatar'
import { POST_TYPES } from '~/utils/constants'
import { createGroupPost } from '~/apis/groupPostApis'
import { triggerReload } from '~/redux/ui/uiSlice'
import StatusSelect from './StatusSelect'
import { getGroupStatusForCreate } from '~/apis/groupApis'


function NewPost({ type, groupId }) {
  const [isCreate, setIsCreate] = useState(false)
  const [isChosePostAudience, setIsChosePostAudience] = useState(false)
  const { handleSubmit } = useForm()
  const [content, setContent] = useState('')
  const currentUser = useSelector(selectCurrentUser)
  const [listPhotos, setListPhotos] = useState([])
  const [listVideos, setListVideos] = useState([])
  const [listStatus, setListStatus] = useState([])
  const [choseStatus, setChoseStatus] = useState()
  const dispatch = useDispatch()

  const handleSelectAudience = () => setIsChosePostAudience(!isChosePostAudience)
  const handleSelectStatus = e => { setChoseStatus(JSON.parse(e.target.value)) }

  useEffect(() => {
    if (type === POST_TYPES.MAIN_POST) {
      getStatus().then(data => setListStatus(data))
    } else if (type === POST_TYPES.MAIN_GROUP_POST) {
      getGroupStatusForCreate().then(data => setListStatus(data))
    }
  }, [])

  useEffect(() => {
    setChoseStatus(listStatus?.find(e => {
      if (type === POST_TYPES.MAIN_POST)
        return e?.statusName?.toLowerCase() == 'public'
      else if (type === POST_TYPES.MAIN_GROUP_POST)
        return e?.groupStatusName?.toLowerCase() == 'public'
    }))
  }, [listStatus])

  const navigate = useNavigate()
  const submitPost = () => {
    let submitData = {}
    if (type === POST_TYPES.MAIN_POST) {
      submitData = {
        'userId': currentUser?.userId,
        'content': content,
        'userStatusId': choseStatus?.userStatusId,
        'photos': listPhotos,
        'videos': listVideos
      }
    } else if (type == POST_TYPES.MAIN_GROUP_POST) {
      submitData = {
        'userId': currentUser?.userId,
        'groupId': groupId,
        'content': content,
        'groupStatusId': choseStatus?.groupStatusId,
        'photos': listPhotos,
        'videos': listVideos
      }
    }

    toast.promise(
      type === POST_TYPES.MAIN_POST
        ? createPost(submitData)
        : createGroupPost(submitData)
      ,
      { pending: 'Created is in progress...' }
    ).then(() => {
      dispatch(triggerReload())
      toast.success('Create post successfully')
    })
  }
  return (
    <div id="new-post"
      className="w-full sm:w-[500px] flex flex-col mt-8 gap-2 border border-gray-300 p-4 rounded-lg shadow-lg bg-white"
    >
      <div className="flex gap-4 items-center w-full ">
        <Link
          to={`/profile?id=${currentUser?.userId}`}
          className=" hover:text-gray-950 flex items-center justify-center gap-3">
          <UserAvatar />
        </Link>
        <div className="w-[90%] bg-fbWhite rounded-3xl hover:bg-fbWhite-500 cursor-pointer"
          onClick={() => setIsCreate(!isCreate)}
        >
          <p className="px-3 py-3 max-sm:text-sm font-medium text-gray-500">What&apos;s on your mind, {currentUser?.firstName + ' ' + currentUser?.lastName}?</p>
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
                      <IconX className='bg-orangeFpt text-white rounded-full size-9 cursor-pointer hover:bg-orange-700' onClick={() => setIsCreate(!isCreate)} />
                    </div>
                    <div className='mx-4'>
                      <div className='flex items-center h-[40] gap-2 '>
                        <UserAvatar />
                        <div className='flex flex-col w-full cursor-pointer'>
                          <span className='font-bold'>{currentUser?.firstName + ' ' + currentUser?.lastName}</span>
                          <div
                            onClick={() => setIsChosePostAudience(!isChosePostAudience)}
                            className='flex items-center gap-1 text-xs text-white font-bold py-1 px-2 bg-orangeFpt w-fit rounded-lg'>
                            {/* <FaLock /> */}
                            <span className=''>{type === POST_TYPES.MAIN_POST
                              ? choseStatus?.userStatusName
                              : choseStatus?.groupStatusName}
                            </span>
                            <IconCaretDownFilled className='size-4' />
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

                    <div className='interceptor-loading py-4 flex justify-center items-center'>
                      <button className='h-9 w-full  mx-4 bg-orangeFpt font-bold text-white rounded-lg cursor-pointer'
                      >
                        Post
                      </button>
                    </div>
                  </div >
                </form >
              ) : (
                <StatusSelect handleSelectAudience={handleSelectAudience} handleSelectStatus={handleSelectStatus}
                  listStatus={listStatus} selectedStatus={choseStatus} type={type} />
              )}
            </div >
          </div >
        )
      }
    </div >
  )
}

export default NewPost