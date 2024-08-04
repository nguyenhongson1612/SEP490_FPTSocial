import { IconMessageCircle, IconShare3, IconThumbUp, IconThumbUpFilled } from '@tabler/icons-react'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import { createReactPhotoPost, createReactPost, createReactSharePost, createReactVideoPost } from '~/apis/reactApis'
import { selectCurrentActivePost, showModalActivePost, showModalSharePost, updateCurrentActivePost } from '~/redux/activePost/activePostSlice'
import { selectListReactType } from '~/redux/sideData/sideDataSlice'
import { selectCurrentUser } from '~/redux/user/userSlice'
import connectionSignalR from '~/utils/signalRConnection'
import likeEmoji from '~/assets/img/emojis/like.png'
import angryEmoji from '~/assets/img/emojis/angry.png'
import { POST_TYPES } from '~/utils/constants'
import { createReactGroupPhotoPost, createReactGroupPost, createReactGroupSharePost, createReactGroupVideoPost } from '~/apis/groupPostApis'
import { cloneDeep } from 'lodash'
import { selectCurrentActiveListPost, updateCurrentActiveListPost } from '~/redux/activeListPost/activeListPostSlice'

function PostReactStatus({ postData, postType }) {
  const currentActiveListPost = useSelector(selectCurrentActiveListPost)
  const currentActivePost = useSelector(selectCurrentActivePost)
  const postReact = cloneDeep(postData?.postReactStatus)
  // console.log('🚀 ~ PostReactStatus ~ postType:', postData)
  const listReact = useSelector(selectListReactType)
  const currentUser = useSelector(selectCurrentUser)
  const dispatch = useDispatch()
  // const [postReact, setPostReact] = useState({})
  const isProfile = postType == POST_TYPES.PROFILE_POST
  const isShare = postType == POST_TYPES.SHARE_POST
  const isPhoto = postType == POST_TYPES.PHOTO_POST
  const isVideo = postType == POST_TYPES.VIDEO_POST
  const isGroup = postType == POST_TYPES.GROUP_POST
  const isGroupShare = postType == POST_TYPES.GROUP_SHARE_POST
  const isGroupPhoto = postType == POST_TYPES.GROUP_PHOTO_POST
  const isGroupVideo = postType == POST_TYPES.GROUP_VIDEO_POST

  const handleOpenCurrenPostModal = () => {
    dispatch(showModalActivePost())
    // dispatch(updatePostReactStatus(postReact))
    dispatch(updateCurrentActivePost({ ...postData, postType: postType }))
  }

  const handleReactPost = (reaction) => {
    const reactData = isPhoto ? {
      'userId': currentUser?.userId,
      'userPostPhotoId': postData?.userPostMediaId,
      'reactTypeId': reaction?.reactTypeId
    }
      : isVideo ? {
        'userId': currentUser?.userId,
        'userPostVideoId': postData?.userPostMediaId,
        'reactTypeId': reaction?.reactTypeId
      }
        : isProfile ? {
          'userId': currentUser?.userId,
          'userPostId': postData?.userPostId || postData?.postId,
          'reactTypeId': reaction?.reactTypeId
        }
          : isShare ? {
            'userId': currentUser?.userId,
            'sharePostId': postData?.sharePostId || postData?.postId,
            'reactTypeId': reaction?.reactTypeId
          }
            : isGroup ? {
              'userId': currentUser?.userId,
              'groupPostId': postData?.groupPostId || postData?.postId,
              'reactTypeId': reaction?.reactTypeId
            }
              : isGroupShare ? {
                'userId': currentUser?.userId,
                'groupSharePostId': postData?.groupSharePostId || postData?.postId,
                'reactTypeId': reaction?.reactTypeId
              }
                : isGroupPhoto ? {
                  'userId': currentUser?.userId,
                  'groupPostPhotoId': postData?.groupPostMediaId,
                  'reactTypeId': reaction?.reactTypeId
                }
                  : isGroupVideo && {
                    'userId': currentUser?.userId,
                    'groupPostVideoId': postData?.groupPostMediaId,
                    'reactTypeId': reaction?.reactTypeId
                  }
    toast.promise(
      (async () => {
        console.log(reactData);
        const data = await (
          isPhoto ? createReactPhotoPost(reactData)
            : isVideo ? createReactVideoPost(reactData)
              : isProfile ? createReactPost(reactData)
                : isShare ? createReactSharePost(reactData)
                  : isGroup ? createReactGroupPost(reactData)
                    : isGroupShare ? createReactGroupSharePost(reactData)
                      : isGroupPhoto ? createReactGroupPhotoPost(reactData)
                        : isGroupVideo && createReactGroupVideoPost(reactData)
        )
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
    ).then(
      // () => setReload(!reload)
      () => {
        let newPostReact = cloneDeep(postReact)
        let currentReact = ''
        const isInListReact = newPostReact?.listReact?.some(e => e?.reactTypeId == reaction?.reactTypeId)
        if (newPostReact?.isReact) {
          currentReact = newPostReact?.listUserReact?.find(e => e.userId == currentUser?.userId)
          if (currentReact?.reactTypeId == reaction?.reactTypeId) {
            newPostReact = {
              isReact: false,
              listUserReact: newPostReact?.listUserReact?.filter(e => e.userId !== currentUser?.userId),
              listReact: newPostReact?.listReact?.map(react => {
                if (react?.reactTypeId == reaction?.reactTypeId) return { ...react, numberReact: react?.numberReact - 1 }
                else return react
              }),
              sumOfReact: newPostReact?.sumOfReact - 1,
            }
          }
          else {
            console.log('🚀 ~ handleReactPost ~ isInListReact:', isInListReact)
            !isInListReact && newPostReact?.listReact?.push({ reactTypeId: reaction?.reactTypeId, reactTypeName: reaction?.reactTypeName, numberReact: 0 })
            newPostReact = {
              ...newPostReact,
              listUserReact: newPostReact?.listUserReact?.map(userReact => {
                if (userReact.userId == currentUser?.userId)
                  return { ...userReact, reactTypeId: reaction?.reactTypeId }
                else return userReact
              }),
              listReact: newPostReact?.listReact?.map(react => {
                if (react?.reactTypeId == currentReact?.reactTypeId)
                  return { ...react, numberReact: react?.numberReact - 1 }
                else if (react?.reactTypeId == reaction?.reactTypeId)
                  return { ...react, numberReact: react?.numberReact + 1 }
                else return react
              }),
            }
          }
        }
        else {
          if (isInListReact) {
            newPostReact = {
              ...newPostReact,
              listReact: newPostReact?.listReact?.map(react => {
                if (react?.reactTypeId == reaction?.reactTypeId)
                  return { ...react, numberReact: react?.numberReact + 1 }
                else return react
              })
            }
          }
          else newPostReact?.listReact?.push({ reactTypeId: reaction?.reactTypeId, numberReact: 1, reactTypeName: reaction?.reactTypeName })
          newPostReact?.listUserReact?.push({ reactTypeId: reaction?.reactTypeId, userName: currentUser?.firstName, userId: currentUser?.userId })
          newPostReact = {
            ...newPostReact,
            isReact: true,
            sumOfReact: newPostReact?.sumOfReact + 1,
            // , listUserReact: newPostReact?.listUserReact?.filter(e => e.userId == currentUser?.userId)
          }
        }
        let newPostData = cloneDeep(postData)
        newPostData = { ...newPostData, postReactStatus: newPostReact }
        console.log('🚀 ~ handleReactPost ~ newPostReact:', newPostReact)

        if (currentActivePost) {
          dispatch(updateCurrentActivePost(newPostData))
        }
        dispatch(updateCurrentActiveListPost(currentActiveListPost?.map(e => e?.postId == newPostData.postId ? newPostData : e)))
      }
    )
  }

  return (
    <div id="post-react"
      className="w-full flex flex-col items-start border-t-2 px-4">
      <div id="post-react-status"
        className="w-full flex items-center justify-between py-1">
        <div className="flex items-center gap-1"
        >
          {
            postReact?.listReact?.sort((a, b) => b?.numberReact - a?.numberReact)?.slice(0, 2)?.map((react, i) => {
              if (react?.numberReact > 0) {
                if (react?.reactTypeName == 'like')
                  return <img key={i} className={`size-6 ${i != 0 ? '-ml-2' : 'z-10'} interceptor-loading rounded-full outline outline-2 outline-white`} src={likeEmoji} />
                else return <img key={i} className={`size-6 ${i != 0 ? '-ml-2' : 'z-10'} interceptor-loading rounded-full outline outline-2 outline-white`} src={angryEmoji} />
              }
            })
          }
          <span className="text-sm font-thin text-gray-500">{postReact?.sumOfReact !== 0 && postReact?.sumOfReact}</span>
        </div >
        <div className='flex items-center gap-4'>
          <div className="flex items-center" onClick={handleOpenCurrenPostModal}>
            <IconMessageCircle stroke={1} />
            <span className="text-sm text-gray-500">{postData?.reactCount?.commentNumber ?? 0}</span>
          </div>
          <div className="flex items-center ">
            <IconShare3 stroke={1} />
            <span className="text-sm text-gray-500">{postData?.reactCount?.shareNumber ?? 0}</span>
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
                <div key={reaction?.reactTypeId} className="text-4xl" onClick={() => handleReactPost(reaction)}>
                  {reaction?.reactTypeName?.toLowerCase() == 'like' ?
                    <img className='size-8 hover:scale-[1.2] cursor-pointer' src={likeEmoji} />
                    : reaction?.reactTypeName?.toLowerCase() == 'dislike'
                    && <img className='size-8 hover:scale-[1.2] cursor-pointer' src={angryEmoji} />}
                </div>
              ))
            }
          </div>
        </div >
        <div className="flex items-center justify-center hover:bg-fbWhite cursor-pointer py-1 rounded-md basis-1/3"
          onClick={handleOpenCurrenPostModal}
        >
          <IconMessageCircle stroke={1} />
          <span className="text-sm text-gray-500">Comment</span>
        </div>
        <div className="flex items-center justify-center hover:bg-fbWhite cursor-pointer py-1 rounded-md  basis-1/3"
          onClick={() => {
            dispatch(showModalSharePost())
            dispatch(updateCurrentActivePost({ ...postData, postType: postType }))
          }}
        >
          <IconShare3 stroke={1} />
          <span className="text-sm text-gray-500">Share</span>
        </div>
      </div>
    </div>
  )
}

export default PostReactStatus