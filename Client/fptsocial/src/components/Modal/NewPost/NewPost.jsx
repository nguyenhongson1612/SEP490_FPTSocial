// import React from 'react'
import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Tiptap from '../../TitTap/TitTap'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import { useDispatch, useSelector } from 'react-redux'
import { selectCurrentUser } from '~/redux/user/userSlice'
import { getStatus } from '~/apis'
import { IconCaretDownFilled, IconX } from '@tabler/icons-react'
import { createPost } from '~/apis/postApis'
import UserAvatar from '../../UI/UserAvatar'
import { POST_TYPES } from '~/utils/constants'
import { createGroupPost } from '~/apis/groupPostApis'
import { triggerReload } from '~/redux/ui/uiSlice'
import { FormControl, FormControlLabel, Modal, Popover, Radio, RadioGroup } from '@mui/material'
import { clearAndHireCurrentActivePost, selectIsShowModalCreatePost, showModalCreatePost } from '~/redux/activePost/activePostSlice'
import { selectCurrentActiveGroup } from '~/redux/activeGroup/activeGroupSlice'


function NewPost({ postType, groupId }) {
  const { handleSubmit } = useForm()
  const [content, setContent] = useState('')
  const currentUser = useSelector(selectCurrentUser)
  const currentActiveGroup = useSelector(selectCurrentActiveGroup)
  const [listPhotos, setListPhotos] = useState([])
  const [listVideos, setListVideos] = useState([])
  const [listStatus, setListStatus] = useState([])
  const [choseStatus, setChoseStatus] = useState()
  const isProfile = postType === POST_TYPES.PROFILE_POST
  const isGroup = postType === POST_TYPES.GROUP_POST

  const [anchorEl, setAnchorEl] = useState(null)

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget)
  };

  const handleClose = () => {
    setAnchorEl(null)
  };

  const open = Boolean(anchorEl)
  const id = open ? 'simple-popover' : undefined

  const dispatch = useDispatch()
  const isShowModalCreatePost = useSelector(selectIsShowModalCreatePost)

  useEffect(() => {
    if (isProfile) {
      getStatus().then(data => setListStatus(data))
    } else if (isGroup) {
      console.log('🚀 ~ useEffect ~ currentActiveGroup:', currentActiveGroup)
      setChoseStatus(currentActiveGroup?.groupSettings?.find(e => e?.groupSettingName == 'Group Status'))
    }
  }, [currentActiveGroup, postType])

  useEffect(() => {
    if (isProfile)
      setChoseStatus(listStatus?.find(e => e?.statusName?.toLowerCase() == 'public'))
  }, [listStatus])

  const navigate = useNavigate()
  const submitPost = () => {
    let submitData = {}
    if (isProfile) {
      submitData = {
        'userId': currentUser?.userId,
        'content': content,
        'userStatusId': choseStatus?.userStatusId,
        'photos': listPhotos,
        'videos': listVideos
      }
    } else if (isGroup) {
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
      isProfile
        ? createPost(submitData)
        : createGroupPost(submitData)
      ,
      { pending: 'Posting...' }
    ).then(() => {
      dispatch(triggerReload())
      dispatch(clearAndHireCurrentActivePost())
      toast.success('Posted!')
    })
  }
  return (
    <div id="new-post"
      className="w-full mt-8 sm:w-[700px] flex flex-col gap-2 p-4 rounded-lg shadow-lg bg-white"
    >
      <div className="flex gap-4 items-center w-full ">
        <Link
          to={`/profile?id=${currentUser?.userId}`}
          className=" hover:text-gray-950 flex items-center justify-center gap-3">
          <UserAvatar />
        </Link>
        <div className="w-[90%] bg-fbWhite rounded-3xl hover:bg-fbWhite-500 cursor-pointer"
          onClick={() => dispatch(showModalCreatePost())}
        >
          <p className="px-3 py-3 max-sm:text-sm font-medium text-gray-500">What&apos;s on your mind, {currentUser?.firstName + ' ' + currentUser?.lastName}?</p>
        </div>
      </div>

      <Modal
        open={isShowModalCreatePost}
        onClose={() => dispatch(clearAndHireCurrentActivePost())}
      >
        <div className='absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2'>
          <div className='w-full xs:w-[420px] md:w-[500px] bg-white shadow-4edges rounded-lg '>
            {(
              <form onSubmit={handleSubmit(submitPost)} >
                <div className='flex flex-col'>
                  <div className='h-[60px] flex justify-between items-center px-2 border-b '>
                    <span></span>
                    <span className='text-2xl font-bold'>Create post</span>
                    <IconX className='bg-orangeFpt text-white rounded-full size-9 cursor-pointer hover:bg-orange-700' onClick={() => dispatch(clearAndHireCurrentActivePost())} />
                  </div>
                  <div className='mx-4'>
                    <div className='flex items-center h-[40] gap-2 '>
                      <UserAvatar />
                      <div className='flex flex-col w-full cursor-pointer'>
                        <span className='font-bold'>{currentUser?.firstName + ' ' + currentUser?.lastName}</span>
                        <div
                          onClick={(e) => isProfile && handleClick(e)}
                          className={`flex items-center gap-1 text-xs ${(isProfile) ? 'cursor-pointer bg-orangeFpt' : 'bg-orange-400 '} text-white font-bold py-1 px-2  w-fit rounded-lg`}>
                          <span className=''>{choseStatus?.statusName || choseStatus?.groupStatusName}</span>
                          {(isProfile) && <IconCaretDownFilled className='size-4' />}
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
                    <Tiptap
                      setContent={setContent}
                      content={content}
                      listPhotos={listPhotos}
                      setListPhotos={setListPhotos}
                      listVideos={listVideos}
                      setListVideos={setListVideos}
                      postType={postType}
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
            )}
          </div >
        </div >
      </Modal>
    </div >
  )
}

export default NewPost