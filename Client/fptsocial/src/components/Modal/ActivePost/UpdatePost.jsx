// import React from 'react'
import { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import { useDispatch, useSelector } from 'react-redux'
import { selectCurrentUser } from '~/redux/user/userSlice'
import { motion } from 'framer-motion'
import { getStatus } from '~/apis'
import { FormControl, FormControlLabel, FormLabel, Modal, Popover, Radio, RadioGroup } from '@mui/material'
import { IconCaretDownFilled, IconChevronLeft, IconX } from '@tabler/icons-react'
import { createPost, updateSharePost, updateUserPost } from '~/apis/postApis'
import { clearAndHireCurrentActivePost, selectCurrentActivePost, selectIsShowModalUpdatePost } from '~/redux/activePost/activePostSlice'
import Tiptap from '~/components/TitTap/TitTap'
import UserAvatar from '~/components/UI/UserAvatar'
import TipTapUpdatePost from '~/components/TitTap/TipTapUpdatePost'
import { triggerReload } from '~/redux/ui/uiSlice'
import { EDITOR_TYPE, POST_TYPES, PUBLIC, UPDATE } from '~/utils/constants'
import { getGroupByGroupId, selectCurrentActiveGroup } from '~/redux/activeGroup/activeGroupSlice'
import PostMedia from '~/components/ListPost/Post/PostContent/PostMedia'
import PostTitle from '~/components/ListPost/Post/PostContent/PostTitle'
import PostContents from '~/components/ListPost/Post/PostContent/PostContents'
import { updateGroupPost, updateGroupSharePost } from '~/apis/groupPostApis'


function UpdatePost() {
  const isShowUpdatePost = useSelector(selectIsShowModalUpdatePost)
  const currentActivePost = useSelector(selectCurrentActivePost)
  const currentActiveGroup = useSelector(selectCurrentActiveGroup)

  const postType = currentActivePost?.postType
  const isProfile = postType == POST_TYPES.PROFILE_POST
  const isShare = postType == POST_TYPES.SHARE_POST
  const isGroup = postType == POST_TYPES.GROUP_POST
  const isGroupShare = postType == POST_TYPES.GROUP_SHARE_POST

  console.log('🚀 ~ UpdatePost ~ currentActivePost:', currentActivePost)
  const dispatch = useDispatch()
  const [isEdit, setIsEdit] = useState(false)

  const { handleSubmit } = useForm()
  const [content, setContent] = useState(currentActivePost?.content)
  const currentUser = useSelector(selectCurrentUser)

  let postShareType = ''
  let postShareData = ''
  if (currentActivePost?.isShare) {
    if (currentActivePost?.userPostShareId) {
      postShareType = POST_TYPES.PROFILE_POST
      postShareData = { ...currentActivePost?.userPostShare, userNameShare: currentActivePost?.userNameShare, userAvatarShare: currentActivePost?.userAvatarShare }
    } else if (currentActivePost?.userPostVideoShareId) {
      postShareType = POST_TYPES.VIDEO_POST
      postShareData = { ...currentActivePost?.userPostVideoShare, userNameShare: currentActivePost?.userNameShare, userAvatarShare: currentActivePost?.userAvatarShare }
    } else if (currentActivePost?.userPostPhotoShareId) {
      postShareType = POST_TYPES.PHOTO_POST
      postShareData = { ...currentActivePost?.userPostPhotoShare, userNameShare: currentActivePost?.userNameShare, userAvatarShare: currentActivePost?.userAvatarShare }
    } else if (currentActivePost?.groupPostShareId) {
      postShareType = POST_TYPES.GROUP_SHARE_POST
      postShareData = { ...currentActivePost?.groupPostShare, userNameShare: currentActivePost?.userNameShare, userAvatarShare: currentActivePost?.userAvatarShare }
    } else if (currentActivePost?.groupPostPhotoShareId) {
      postShareType = POST_TYPES.GROUP_PHOTO_POST
      postShareData = { ...currentActivePost?.groupPostPhotoShare, userNameShare: currentActivePost?.userNameShare, userAvatarShare: currentActivePost?.userAvatarShare }
    } else {
      postShareType = POST_TYPES.GROUP_VIDEO_POST
      postShareData = { ...currentActivePost?.groupPostVideoShare, userNameShare: currentActivePost?.userNameShare, userAvatarShare: currentActivePost?.userAvatarShare }
    }
  }

  const [listMedias, setListMedias] = useState(() => {
    let photos = []
    let videos = []
    if (isProfile) {
      photos = (currentActivePost?.userPostPhotos || currentActivePost?.userPostPhoto)?.map(e => ({ type: 'image', owner: 'subPost', url: e?.photo?.photoUrl }))
      videos = (currentActivePost?.userPostVideos || currentActivePost?.userPostVideo)?.map(e => ({ type: 'video', owner: 'subPost', url: e?.video?.videoUrl }))
      if (currentActivePost?.photo) photos.unshift({ type: 'image', owner: 'mainPost', url: currentActivePost?.photo?.photoUrl })
      if (currentActivePost?.video) videos.push({ type: 'video', owner: 'mainPost', url: currentActivePost?.video?.videoUrl })
    }
    else if (isGroup) {
      photos = currentActivePost?.groupPostPhoto?.map(e => ({ type: 'image', owner: 'subPost', url: e?.groupPhoto?.photoUrl }))
      videos = currentActivePost?.groupPostVideo?.map(e => ({ type: 'video', owner: 'subPost', url: e?.groupVideo?.videoUrl }))
      if (currentActivePost?.groupPhoto) photos.unshift({ type: 'image', owner: 'mainPost', url: currentActivePost?.groupPhoto?.photoUrl })
      if (currentActivePost?.groupVideo) videos.push({ type: 'video', owner: 'mainPost', url: currentActivePost?.groupVideo?.videoUrl })
    }
    return [...photos, ...videos]
  })
  // console.log('🚀 ~ const[listMedias,setListMedias]=useState ~ listMedias:', listMedias)

  const [anchorEl, setAnchorEl] = useState(null)

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget)
  };

  const handleClose = () => {
    setAnchorEl(null)
  };

  const open = Boolean(anchorEl)
  const id = open ? 'simple-popover' : undefined


  // const handleUpdateListMedia = () => {

  // }

  const [listStatus, setListStatus] = useState([])
  const [choseStatus, setChoseStatus] = useState({})

  useEffect(() => {
    if (isProfile || isShare)
      getStatus().then(data => setListStatus(data))
    else if (isGroup || isGroupShare) {
      if (!currentActiveGroup) {
        dispatch(getGroupByGroupId(currentActivePost?.groupId))
      }
      setChoseStatus(currentActiveGroup?.groupSettings?.find(e => e?.groupSettingName == 'Group Status'))
    }
  }, [currentActiveGroup])

  useEffect(() => {
    if (isProfile || isShare) {
      const { userStatusId, userStatusName } = currentActivePost?.userStatus ?? {}
      setChoseStatus({ userStatusId: userStatusId, statusName: userStatusName })
    }
  }, [listStatus])

  const handleEdit = () => {
    setIsEdit(!isEdit)
  }

  const handleRemove = (index) => {
    setListMedias(listMedias?.filter((e, i) => i !== index))
  }
  useEffect(() => {
    if (listMedias.length == 0 && isEdit)
      setIsEdit(false)
  }, [listMedias])
  const submitPost = () => {
    // console.log(listMedias)
    const submitData = isProfile ? {
      'userId': currentUser?.userId,
      'userPostId': currentActivePost?.postId || currentActivePost?.userPostId,
      'content': content,
      'userStatusId': choseStatus?.userStatusId,
      'photos': listMedias?.filter(e => e.type == 'image')?.map(e => e?.url),
      'videos': listMedias?.filter(e => e.type == 'video')?.map(e => e?.url)
    } : isGroup ? {
      'userId': currentUser?.userId,
      'groupPostId': currentActivePost?.postId,
      'groupId': currentActivePost?.groupId,
      'content': content,
      'groupStatusId': choseStatus?.groupStatusId,
      'photos': listMedias?.filter(e => e.type == 'image')?.map(e => e?.url),
      'videos': listMedias?.filter(e => e.type == 'video')?.map(e => e?.url)
    } : isShare ? {
      'sharePostId': currentActivePost?.postId || currentActivePost?.userPostId,
      'userId': currentUser?.userId,
      'userStatusId': choseStatus?.userStatusId,
      'content': content
    } : isGroupShare && {
      'groupSharePostId': currentActivePost?.postId,
      'groupId': currentActivePost?.groupId,
      'userId': currentUser?.userId,
      'content': content
    }
    // console.log('🚀 ~ submitPost ~ submitData:', submitData)

    toast.promise(
      isProfile ? updateUserPost(submitData)
        : isShare ? updateSharePost(submitData)
          : isGroup ? updateGroupPost(submitData)
            : isGroupShare && updateGroupSharePost(submitData),
      { pending: 'Updating...' }
    ).then(() => {
      dispatch(triggerReload())
      dispatch(clearAndHireCurrentActivePost())
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
          {!isEdit ? (
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
                    <div className='flex flex-col w-full'>
                      <span className='font-bold'>{currentUser?.firstName + ' ' + currentUser?.lastName}</span>
                      <div
                        onClick={(e) => { if (isProfile || isShare) handleClick(e) }}
                        className={`flex items-center gap-1 text-xs ${(isShare || isProfile) ? 'cursor-pointer bg-orangeFpt' : 'bg-orange-400 '} text-white font-bold py-1 px-2  w-fit rounded-lg`}>
                        <span className=''>{choseStatus?.statusName || choseStatus?.userStatusName || choseStatus?.groupStatusName}</span>
                        {(isProfile || isShare) && <IconCaretDownFilled className='size-4' />}
                      </div>
                      <Popover
                        id={id}
                        open={open}
                        anchorEl={anchorEl}
                        onClose={handleClose}
                        anchorOrigin={{
                          vertical: 'bottom',
                          horizontal: 'left'
                        }}
                      >
                        {/* <div className='flex flex-col p-2'> */}
                        <FormControl>
                          <RadioGroup
                            aria-labelledby="demo-radio-buttons-group-label"
                            value={JSON.stringify(choseStatus) || ''}
                            onChange={e => { setChoseStatus(JSON.parse(e.target.value)) }}
                            name="radio-buttons-group"
                            className='p-2 '
                          >
                            {listStatus?.map((status) =>
                              <FormControlLabel
                                key={status?.userStatusId || status?.groupStatusId}
                                value={JSON.stringify(status)}
                                control={<Radio />}
                                label={status?.statusName || status?.groupStatusName} />
                            )}
                          </RadioGroup>
                        </FormControl>
                        {/* </div> */}
                      </Popover>
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
                  {/* <Tiptap
                    setContent={setContent}
                    content={content}
                    editorType={(isShare || isGroupShare) && EDITOR_TYPE.SHARE}
                    actionType={UPDATE}
                  /> */}
                </div >
                {(isShare || isGroupShare) &&
                  <div className='px-2'>
                    <div
                      id='media-share'
                      className='h-[300px] overflow-y-auto no-scrollbar flex justify-center border-2 rounded-lg'>
                      <div className='pointer-events-none rounded-lg w-full'>
                        <PostMedia postData={postShareData} postType={postShareType} />
                        <PostTitle postData={postShareData} />
                        <PostContents postData={postShareData} />
                      </div>
                    </div>
                  </div>

                }

                <div className='interceptor-loading py-4 flex justify-center items-center'>
                  <button className='h-9 w-full  mx-4 bg-orangeFpt font-bold text-white rounded-lg cursor-pointer'
                  >
                    Save
                  </button>
                </div>
              </div >
            </form >
          )
            : isEdit && (
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
                      <div key={i} className={`col-span-12 md:col-span-6 lg:col-span-4 ${listMedias?.length <= 2 && '!col-span-12'} 
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

          }
        </div >
      </div >
    </Modal>
  )
}

export default UpdatePost