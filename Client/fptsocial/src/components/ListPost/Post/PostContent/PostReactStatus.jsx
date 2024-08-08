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
import { useCallback } from 'react'

function PostReactStatus({ postData, postType, postShareData, postShareType, isCanShare = true }) {
  const currentActiveListPost = useSelector(selectCurrentActiveListPost)
  const currentActivePost = useSelector(selectCurrentActivePost)
  const listReact = useSelector(selectListReactType)
  const updateTopReact = useCallback(() => {
    let top2React = cloneDeep(postData?.reactCount?.top2React) || []
    listReact?.forEach(item => {

      if (!top2React?.some(e => e?.reactTypeId == item?.reactTypeId))
        top2React.push({ ...item, numberReact: 0 })
    })
    return top2React
  }, [listReact, postData])

  let postReact = cloneDeep({ ...postData?.reactCount, top2React: updateTopReact() })
  // console.log('🚀 ~ PostReactStatus ~ postType:', postReact)

  const currentUser = useSelector(selectCurrentUser)
  const isYourPost = currentUser?.userId == postData?.userId
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
        // const isInListReact = newPostReact?.listReact?.some(e => e?.reactTypeId == reaction?.reactTypeId)
        if (newPostReact?.isReact) {
          currentReact = newPostReact?.userReactType
          if (currentReact?.reactTypeId == reaction?.reactTypeId) {
            console.log(currentReact?.reactTypeId == reaction?.reactTypeId);
            newPostReact = {
              ...newPostReact,
              reactNumber: newPostReact.reactNumber - 1,
              userReactType: null,
              isReact: false,
              top2React: newPostReact?.top2React?.map(react => {
                if (react?.reactTypeId == reaction?.reactTypeId) return { ...react, numberReact: react?.numberReact - 1 }
                return react
              }),
            }
          }
          else {
            console.log(currentReact?.reactTypeId == reaction?.reactTypeId);

            newPostReact = {
              ...newPostReact,
              isReact: true,
              userReactType: { ...reaction },
              top2React: newPostReact?.top2React?.map(react => {
                if (react?.reactTypeId == currentReact?.reactTypeId)
                  return { ...react, numberReact: react?.numberReact - 1 }
                else if (react?.reactTypeId == reaction?.reactTypeId)
                  return { ...react, numberReact: react?.numberReact + 1 }
                else return react
              })
            }
          }
        }
        else {
          newPostReact = {
            ...newPostReact,
            reactNumber: newPostReact.reactNumber + 1,
            isReact: true,
            userReactType: { ...reaction },
            top2React: newPostReact?.top2React?.map(react => {
              if (react?.reactTypeId == reaction?.reactTypeId)
                return { ...react, numberReact: react?.numberReact + 1 }
              else return react
            })
          }
        }
        console.log(newPostReact);

        let newPostData = cloneDeep(postData)
        newPostData = { ...newPostData, reactCount: newPostReact }
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
            postReact?.top2React?.sort((a, b) => b?.numberReact - a?.numberReact)?.slice(0, 2)?.map((react, i) => {
              if (react?.numberReact > 0) {
                if (react?.reactTypeName == 'like')
                  return <img key={i} className={`size-6 ${i != 0 ? '-ml-2' : 'z-10'} interceptor-loading rounded-full outline outline-2 outline-white`} src={likeEmoji} />
                else return <img key={i} className={`size-6 ${i != 0 ? '-ml-2' : 'z-10'} interceptor-loading rounded-full outline outline-2 outline-white`} src={angryEmoji} />
              }
            })
          }
          <span className="text-sm text-gray-500">{postReact?.reactNumber !== 0 && postReact?.reactNumber}</span>
        </div >
        <div className='flex items-center gap-4'>
          <div className="flex items-center" onClick={handleOpenCurrenPostModal}>
            <IconMessageCircle stroke={1} />
            <span className="text-sm text-gray-500">{postReact?.commentNumber ?? 0}</span>
          </div>
          <div className="flex items-center ">
            <IconShare3 stroke={1} />
            <span className="text-sm text-gray-500">{postReact?.shareNumber ?? 0}</span>
          </div>
        </div>
      </div>

      <div id="post-react-action"
        className="w-full flex items-center justify-between border-t">
        <div className="flex items-center justify-center hover:bg-fbWhite cursor-pointer py-1 rounded-md relative  [&>#react-action]:hover:!opacity-100 basis-1/3"
        >
          <div className="flex items-center gap-1">
            {
              postReact?.isReact
                ? postReact?.userReactType?.reactTypeName == 'like'
                  ? <img className={`size-6 interceptor-loading rounded-full outline outline-2 outline-white`} src={likeEmoji} />
                  : <img className={`size-6 interceptor-loading rounded-full outline outline-2 outline-white`} src={angryEmoji} />
                : <IconThumbUp stroke={1} />
            }
            <span className={`text-sm font-semibold capitalize 
              ${postReact?.userReactType?.reactTypeName == 'like' ? 'text-blue-500' : postReact?.userReactType?.reactTypeName == 'dislike' ? 'text-orange-500' : 'text-gray-500'}`}>
              {postReact?.userReactType?.reactTypeName || 'like'}
            </span>
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
        {
          (!isYourPost || isShare || isGroupShare) && isCanShare &&
          <div className="flex items-center justify-center hover:bg-fbWhite cursor-pointer py-1 rounded-md  basis-1/3"
            onClick={() => {
              dispatch(showModalSharePost())
              dispatch(updateCurrentActivePost(
                (isShare || isGroupShare) ? { ...postShareData, postType: postShareType }
                  : { ...postData, postType: postType }
              ))
            }}
          >
            <IconShare3 stroke={1} />
            <span className="text-sm text-gray-500">Share</span>
          </div>
        }

      </div>
    </div >
  )
}

export default PostReactStatus