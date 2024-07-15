import { IconHeart, IconMessageCircle, IconMoodAngry, IconShare3, IconThumbDownFilled, IconThumbUp, IconThumbUpFilled } from '@tabler/icons-react'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import { createReactPhotoPost, createReactPost, createReactVideoPost, getAllReactByPhotoPostId, getAllReactByPostId, getAllReactByVideoPostId, getAllReactType } from '~/apis/reactApis'
import { showModalActivePost, updateCurrentActivePost } from '~/redux/activePost/activePostSlice'
import { selectListReactType } from '~/redux/sideData/sideDataSlice'
import { selectCurrentUser } from '~/redux/user/userSlice'
import connectionSignalR from '~/utils/signalRConnection'
import likeEmoji from '~/assets/img/emojis/like.png'
import angryEmoji from '~/assets/img/emojis/angry.png'

function PostReactStatus({ postData }) {
  const [reload, setReload] = useState(false)
  // console.log(postData);
  const listReact = useSelector(selectListReactType)
  const currentUser = useSelector(selectCurrentUser)
  const dispatch = useDispatch()
  const [postReact, setPostReact] = useState({})

  const handleGetReact = async () => {
    const response = await (
      postData?.mediaType?.toLowerCase() == 'photo' ? getAllReactByPhotoPostId(postData?.userPostMediaId)
        : postData?.mediaType?.toLowerCase() == 'video' ? getAllReactByVideoPostId(postData?.userPostMediaId)
          : postData?.userPostId && getAllReactByPostId(postData?.userPostId)
    )
    setPostReact(response)
  }
  useEffect(() => {
    handleGetReact()
  }, [postData, reload])

  const handleOpenCurrenPostModal = () => {
    dispatch(showModalActivePost())
    dispatch(updateCurrentActivePost(postData))
  }

  const handleReactPost = (type) => {
    const reactData = postData?.userPostPhotoId ? {
      'userId': currentUser?.userId,
      'userPostPhotoId': postData?.userPostPhotoId,
      'reactTypeId': type
    }
      :
      postData?.userPostVideoId ? {
        'userId': currentUser?.userId,
        'userPostVideoId': postData?.userPostVideoId,
        'reactTypeId': type
      }
        : {
          'userId': currentUser?.userId,
          'userPostId': postData?.userPostId,
          'reactTypeId': type
        }
    toast.promise(
      (async () => {
        const data = await (postData?.userPostPhotoId
          ? createReactPhotoPost(reactData)
          : postData?.userPostVideoId
            ? createReactVideoPost(reactData)
            : createReactPost(reactData))
        // if (data) {
        //   const signalRData = {
        //     MsgCode: 'User-004',
        //     Receiver: `${postData?.userId}`,
        //     Url: `http://localhost:3000/profile?id=${currentUser?.userId}`,
        //     AdditionsMsd: ''
        //   }
        //   connectionSignalR.invoke('SendNotify', JSON.stringify(signalRData))
        // }
      })(),
      { pending: '' }
    ).then(() => setReload(!reload))
  }

  return (
    <div id="post-react"
      className="w-full flex flex-col items-start border-t-2 px-4">
      <div id="post-react-status"
        className="w-full flex items-center justify-between py-1">
        <div className="flex items-center gap-1"
        >
          <img className='size-6' src={likeEmoji} />
          <span className="text-sm font-thin text-gray-500">{postReact?.sumOfReact}</span>
        </div >
        <div className='flex items-center gap-4'>
          <div className="flex items-center" onClick={handleOpenCurrenPostModal}>
            <IconMessageCircle stroke={1} />
            <span className="text-sm text-gray-500">200</span>
          </div>
          <div className="flex items-center ">
            <IconShare3 stroke={1} />
            <span className="text-sm text-gray-500">20</span>
          </div>
        </div>
      </div>

      <div id="post-react-action"
        className="w-full flex items-center justify-between border-t">
        <div className="flex items-center justify-center hover:bg-fbWhite cursor-pointer py-1 rounded-md relative  [&>#react-action]:hover:!opacity-100 basis-1/3"
        >
          <div className="flex items-center">
            {
              postReact?.isReact
                ? <IconThumbUpFilled className={'text-blue-500'} stroke={1} />
                : <IconThumbUp stroke={1} />
            }
            <span className="text-sm text-gray-500">Like</span>
          </div>
          <div id='react-action' className='absolute flex gap-1 opacity-0 transition-opacity duration-300 delay-500 top-0 -translate-y-10
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
        </div >
        <div className="flex items-center justify-center hover:bg-fbWhite cursor-pointer py-1 rounded-md basis-1/3" onClick={handleOpenCurrenPostModal}>
          <IconMessageCircle stroke={1} />
          <span className="text-sm text-gray-500">Comment</span>
        </div>
        <div className="flex items-center justify-center hover:bg-fbWhite cursor-pointer py-1 rounded-md  basis-1/3">
          <IconShare3 stroke={1} />
          <span className="text-sm text-gray-500">Share</span>
        </div>
      </div>
    </div>
  )
}

export default PostReactStatus