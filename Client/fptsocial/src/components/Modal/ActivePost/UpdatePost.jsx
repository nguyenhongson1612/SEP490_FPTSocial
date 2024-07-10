// import React from 'react'
import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import { useDispatch, useSelector } from 'react-redux'
import { selectCurrentUser } from '~/redux/user/userSlice'
import { motion } from 'framer-motion'
import { getStatus } from '~/apis'
import { FormControl, FormControlLabel, FormLabel, Modal, Radio, RadioGroup } from '@mui/material'
import { IconCaretDownFilled, IconChevronLeft, IconX } from '@tabler/icons-react'
import { createPost, updateUserPost } from '~/apis/postApis'
import { clearAndHireCurrentActivePost, selectCurrentActivePost, selectIsShowModalUpdatePost } from '~/redux/activePost/activePostSlice'
import Tiptap from '~/components/TitTap/TitTap'
import UserAvatar from '~/components/UI/UserAvatar'
import TipTapUpdatePost from '~/components/TitTap/TipTapUpdatePost'
import { triggerReload } from '~/redux/ui/uiSlice'


function UpdatePost() {
  const isShowUpdatePost = useSelector(selectIsShowModalUpdatePost)
  const currentActivePost = useSelector(selectCurrentActivePost)
  const dispatch = useDispatch()
  const [isChosePostAudience, setIsChosePostAudience] = useState(false)
  const [isEdit, setIsEdit] = useState(false)

  const { handleSubmit } = useForm()
  const [content, setContent] = useState(currentActivePost?.content)
  const user = useSelector(selectCurrentUser)

  const [listMedias, setListMedias] = useState(() => {
    const photos = currentActivePost?.userPostPhotos?.map(e => ({ type: 'image', url: e?.photo?.photoUrl })) || []
    const videos = currentActivePost?.userPostVideos?.map(e => ({ type: 'video', url: e?.video?.videoUrl })) || []
    if (currentActivePost?.photo) photos.push({ type: 'image', url: currentActivePost?.photo?.photoUrl })
    if (currentActivePost?.video) videos.push({ type: 'video', url: currentActivePost?.video?.videoUrl })
    return [...photos, ...videos]
  })

  // const handleUpdateListMedia = () => {

  // }

  const [listStatus, setListStatus] = useState([])
  const [choseStatus, setChoseStatus] = useState({})

  useEffect(() => {
    getStatus().then(data => setListStatus(data))
  }, [])

  const handleEdit = () => {
    setIsEdit(!isEdit)
  }

  const handleRemove = (index) => {
    setListMedias(listMedias?.filter((e, i) => i !== index))
  }

  useEffect(() => {
    setChoseStatus(listStatus?.find(e => e.statusName.toLowerCase() == 'public')?.userStatusId)
  }, [listStatus])

  const submitPost = () => {
    // console.log(listMedias)
    const submitData = {
      'userId': user?.userId,
      'userPostId': currentActivePost?.userPostId,
      'content': content,
      'userStatusId': choseStatus,
      'photos': listMedias?.filter(e => e.type == 'image')?.map(e => e?.url),
      'videos': listMedias?.filter(e => e.type == 'video')?.map(e => e?.url)
    }
    // console.log('🚀 ~ submitPost ~ submitData:', submitData)

    toast.promise(
      updateUserPost(submitData),
      { pending: 'Updating...' }
    ).then(() => {
      dispatch(triggerReload())
      toast.success('Update post successfully!')
    })
  }

  // const currentUser = useSelector(selectCurrentUser)

  return (
    <Modal
      open={isShowUpdatePost}
      onClose={() => dispatch(clearAndHireCurrentActivePost())}
    >
      <div className={`flex w-[90%] sm:w-70% md:w-[60%] ${isEdit ? 'w-[90%] h-[90%]' : ''} justify-center items-center absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2`}>
        <div className='w-full h-full bg-white shadow-4edges rounded-lg flex flex-col'>
          {!isEdit && !isChosePostAudience ? (
            <form onSubmit={handleSubmit(submitPost)} >
              <div className='flex flex-col'>
                <div className='h-[40px] flex justify-between items-center px-2 border-b '>
                  <span></span>
                  <span className='text-xl font-bold'>Edit post</span>
                  <IconX
                    onClick={() => dispatch(clearAndHireCurrentActivePost())}
                    className='bg-orangeFpt text-white rounded-full  cursor-pointer hover:bg-orange-700' />
                </div>
                <div className='mx-4'>
                  <div className='flex items-center h-[40] py-2 gap-2 '>
                    <UserAvatar />
                    <div className='flex flex-col w-full cursor-pointer'>
                      <span className='font-bold'>{user?.firstName + ' ' + user?.lastName}</span>
                      <div
                        onClick={() => setIsChosePostAudience(!isChosePostAudience)}
                        className='flex items-center gap-1 text-xs text-white font-bold py-1 px-2 bg-orangeFpt w-fit rounded-lg'>
                        <span className=''>{listStatus?.find(e => e.userStatusId == choseStatus)?.statusName}</span>
                        <IconCaretDownFilled className='size-4' />
                      </div>
                    </div>
                  </div>
                </div>
                <div className='pb-1 text-2xl' >
                  <TipTapUpdatePost
                    setContent={setContent}
                    content={content}
                    setListMedia={setListMedias}
                    listMedia={listMedias}
                    handleEdit={handleEdit}
                  />

                </div >

                <div className='interceptor-loading py-4 flex justify-center items-center'>
                  <button className='h-9 w-full  mx-4 bg-orangeFpt font-bold text-white rounded-lg cursor-pointer'
                  >
                    Save
                  </button>
                </div>
              </div >
            </form >
          )
            : isEdit ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className='flex flex-col h-full'
              >
                <div className='h-[10%] flex justify-between items-center border-b p-4'>
                  <IconChevronLeft className='bg-orangeFpt text-white rounded-full size-9 cursor-pointer hover:bg-orange-700' onClick={handleEdit} />
                  <span className='text-2xl font-bold'>Edit photo</span>
                  <span></span>
                </div>
                <div className='h-[90%] overflow-y-auto no-scrollbar px-4 pb-10 grid grid-cols-12 bg-fbWhite gap-1 py-1' >
                  {
                    listMedias?.map((e, i) => (
                      <div key={e?.url} className={`col-span-12 md:col-span-6 lg:col-span-4 ${listMedias?.length <= 2 && '!col-span-12'} 
                      relative bg-white rounded-md`}>
                        <IconX
                          onClick={() => { handleRemove(i) }}
                          className='absolute z-20 right-1 top-1 bg-orangeFpt text-white rounded-full cursor-pointer hover:bg-orange-700' />
                        {
                          e?.type == 'image'
                            ? <img src={e?.url} className='h-full w-full object-contain' />
                            : <video src={e?.url} className='h-full w-full object-contain ' controls />
                        }
                      </div>
                    ))
                  }
                </div >
              </motion.div>)
              : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <div className='flex flex-col'>
                    <div className='h-[60px]  flex justify-between items-center border-b p-4'>
                      <IconChevronLeft className='bg-orangeFpt text-white rounded-full size-9 cursor-pointer hover:bg-orange-700' onClick={() => setIsChosePostAudience(!isChosePostAudience)} />
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
                        <FormControl>
                          <RadioGroup
                            aria-labelledby="demo-radio-buttons-group-label"
                            value={choseStatus}
                            onChange={e => setChoseStatus(e.target.value)}
                            name="radio-buttons-group"
                          >
                            {listStatus?.map((status) => (
                              <FormControlLabel key={status.userStatusId} value={status.userStatusId} control={<Radio />} label={status.statusName} />
                            ))}
                          </RadioGroup>
                        </FormControl>
                      </div>
                    </div >
                  </div >
                </motion.div>
              )}
        </div >
      </div >
    </Modal>
  )
}

export default UpdatePost