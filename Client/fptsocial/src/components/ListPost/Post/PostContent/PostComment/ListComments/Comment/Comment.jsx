import { Popover } from '@mui/material'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import { commentPhotoPost, commentPost, commentVideoPost } from '~/apis/postApis'
import { createReactCommentUserPhotoPost, createReactCommentUserPost, createReactCommentUserVideoPost, getAllReactByCommentId, getAllReactByCommentPhotoId, getAllReactByCommentVideoId } from '~/apis/reactApis'
import Tiptap from '~/components/TitTap/TitTap'
import UserAvatar from '~/components/UI/UserAvatar'
import { triggerReloadComment } from '~/redux/activePost/activePostSlice'
import { selectListReactType } from '~/redux/sideData/sideDataSlice'
import { selectCurrentUser } from '~/redux/user/userSlice'
import { cleanAndParseHTML, compareDateTime } from '~/utils/formatters'
import likeEmoji from '~/assets/img/emojis/like.png'
import angryEmoji from '~/assets/img/emojis/angry.png'

function Comment({ comment }) {
  const { handleSubmit } = useForm()
  const listReact = useSelector(selectListReactType)
  const [content, setContent] = useState('')
  const [listPhotos, setListPhotos] = useState([])
  const [listVideos, setListVideos] = useState([])
  const [listCommentReact, setListCommentReact] = useState()
  const [reload, setReload] = useState(false)
  // const [listStatus, setListStatus] = useState([])
  // const [choseStatus, setChoseStatus] = useState({})
  const dispatch = useDispatch()

  const [anchorEl, setAnchorEl] = useState(null)
  const currentUser = useSelector(selectCurrentUser)
  const isPost = comment?.userPostId
  const isVideoPost = comment?.userPostVideoId

  const getReactOfComment = async () => {
    let response
    if (isPost) response = await getAllReactByCommentId(comment?.commentId)
    else if (isVideoPost) response = await getAllReactByCommentVideoId(comment?.commentVideoPostId)
    else response = await getAllReactByCommentPhotoId(comment?.commentPhotoPostId)
    setListCommentReact(response)
  }

  useEffect(() => {
    getReactOfComment()
  }, [reload])

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  // const isPhotoPost = comment?.userPostVideoId

  const handleRelyComment = () => {
    const submitData = isPost ?
      {
        'userPostId': comment?.userPostId,
        'userId': currentUser?.userId,
        'content': content,
        'parentCommentId': comment?.commentId
      }
      : isVideoPost ?
        {
          'userPostVideoId': comment?.userPostVideoId,
          'userId': currentUser?.userId,
          'content': content,
          'parentCommentId': comment?.commentVideoPostId
        }
        : {
          'userPostPhotoId': comment?.userPostPhotoId,
          'userId': currentUser?.userId,
          'content': content,
          'parentCommentId': comment?.commentPhotoPostId
        }

    toast.promise(
      isPost ? commentPost(submitData) : isVideoPost ? commentVideoPost(submitData) : commentPhotoPost(submitData),
      { pending: 'Updating is in progress...' }
    ).then(() => {
      toast.success('Commented')
    }).finally(() => { dispatch(triggerReloadComment()); setAnchorEl(null) })
  }

  const handleReactPost = (type) => {
    const reactData = isPost ?
      {
        'userPostId': comment?.userPostId,
        'userId': currentUser?.userId,
        'reactTypeId': type,
        'commentId': comment?.commentId,
      } : isVideoPost ? {
        'userPostVideoId': comment?.userPostVideoId,
        'userId': currentUser?.userId,
        'reactTypeId': type,
        'commentVideoPostId': comment?.commentVideoPostId,
      } : {
        'userPostPhotoId': comment?.userPostPhotoId,
        'userId': currentUser?.userId,
        'reactTypeId': type,
        'commentPhotoPostId': comment?.commentPhotoPostId,
      }

    toast.promise(
      isPost ? createReactCommentUserPost(reactData)
        : isVideoPost ? createReactCommentUserVideoPost(reactData)
          : createReactCommentUserPhotoPost(reactData)
      //   .then((data) => {
      //     if (data) {
      //       const signalRData = {
      //         MsgCode: 'User-004',
      //         Receiver: `${postData?.userId}`,
      //         Url: `http://localhost:3000/profile?id=${currentUser?.userId}`,
      //         AdditionsMsd: ''
      //       }
      //       connectionSignalR.invoke('SendNotify', JSON.stringify(signalRData))
      //     }
      //   })
      , { pending: '' }
    ).finally(() => setReload(!reload))
  }
  const open = Boolean(anchorEl)
  const id = open ? 'simple-popover' : undefined
  return (
    <div className={`${comment?.level !== 1 && 'pl-[15%]'} `}>
      {/* <div className={`${''}`}> */}
      <div className='flex gap-2'>
        <UserAvatar avatarSrc={comment?.url} isOther={true} />
        <div className='flex flex-col gap-1'>
          <div className='bg-gray-100 flex flex-col py-2 px-3 rounded-2xl w-full'>
            <span className='font-bold'>{comment?.userName}</span>
            <div>{cleanAndParseHTML(comment?.content)}</div>
          </div>
          <div className='flex gap-2 items-center text-xs'>
            <span className='font-thin cursor-pointer'>{compareDateTime(comment?.createdDate)}</span>
            <div className={`relative ${listCommentReact?.isReact && 'text-blue-500'} font-semibold cursor-pointer [&>#react-comment]:hover:!opacity-100`}>
              Like
              <div id='react-comment' className='min-w-20 absolute flex gap-1 opacity-0 transition-opacity duration-300 delay-500 top-0 -translate-y-10
           bg-white shadow-4edges rounded-3xl px-2 py-1'>
                {
                  listReact?.map(reaction => (
                    <div key={reaction?.reactTypeId} className="text-4xl" onClick={() => handleReactPost(reaction?.reactTypeId)}>
                      {reaction?.reactTypeName?.toLowerCase() == 'like' ?
                        // <IconThumbUpFilled className="text-blue-500 size-10 hover:scale-[1.2]" />
                        <img className='size-8 hover:scale-[1.2] cursor-pointer' src={likeEmoji} />
                        : reaction?.reactTypeName?.toLowerCase() == 'dislike'
                        && <img className='size-8 hover:scale-[1.2] cursor-pointer' src={angryEmoji} />}
                    </div>
                  ))
                }
                {/* <IconThumbUpFilled className="text-blue-700 size-10 hover:scale-[1.2]" /> */}
                {/* <IconHeart className="text-pink-500 size-10 hover:scale-[1.2]" />
            <IconMoodAngry className="text-red-500 size-10 hover:scale-[1.2]" /> */}
                {/* <IconThumbDownFilled className="text-red-700 size-10 hover:scale-[1.2]" /> */}
              </div>
            </div>
            <span id='comment-filter' className='font-semibold cursor-pointer' onClick={handleClick}>Rely</span>
            {listCommentReact?.sumOfReact > 0 && <span className='font-semibold cursor-pointer flex items-center gap-[1px]'>
              <img className='size-4 cursor-pointer' src={likeEmoji} />
              {listCommentReact?.sumOfReact}</span>}
            <Popover
              id={id}
              open={open}
              anchorEl={anchorEl}
              onClose={handleClose}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
            >
              <form onSubmit={handleSubmit(handleRelyComment)} className='my-4 w-full flex gap-2 px-4'>
                <UserAvatar />
                <div className='rounded-lg pt-2'>
                  <Tiptap
                    setContent={setContent}
                    content={content}
                    listPhotos={listPhotos}
                    setListPhotos={setListPhotos}
                    listVideos={listVideos}
                    setListVideos={setListVideos}
                    type={'comment'}
                  />
                </div>
              </form>
            </Popover>
          </div>
        </div>
      </div>
      {
        comment?.replies?.map(e => (
          <Comment key={e?.commentId} comment={e} />
        ))
      }
    </div>
  )
}

export default Comment
