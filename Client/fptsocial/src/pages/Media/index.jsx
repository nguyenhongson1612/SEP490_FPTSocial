import { Link, useLocation, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import NavTopBar from '~/components/NavTopBar/NavTopBar'
import { Box, Button, FormControl, FormControlLabel, IconButton, Modal, Radio, RadioGroup, TextField } from '@mui/material'
import { IconArticle, IconChevronLeft, IconChevronRight } from '@tabler/icons-react'
import { useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import { getStatus } from '~/apis'
import { commentPhotoPost, commentPost, commentVideoPost, getChildPostById, getComment, getPhotoComment, getUserPostById, getVideoComment, updatePhotoPost, updateVideoPost } from '~/apis/postApis'
import PostComment from '~/components/ListPost/Post/PostContent/PostComment/PostComment'
import PostReactStatus from '~/components/ListPost/Post/PostContent/PostReactStatus'
import PostTitle from '~/components/ListPost/Post/PostContent/PostTitle'
import Tiptap from '~/components/TitTap/TitTap'
import UserAvatar from '~/components/UI/UserAvatar'
import { reLoadComment, selectCurrentActivePost, triggerReloadComment, updateCurrentActivePost } from '~/redux/activePost/activePostSlice'
import { selectCurrentUser } from '~/redux/user/userSlice'
import PostContents from '~/components/ListPost/Post/PostContent/PostContents'
import { getAllReactByPhotoPostId, getAllReactByPostId, getAllReactBySharePostId, getAllReactByVideoPostId, getAllReactType } from '~/apis/reactApis'
import { addListReactType } from '~/redux/sideData/sideDataSlice'
import { EDITOR_TYPE, POST_TYPES } from '~/utils/constants'
import { commentGroupPhotoPost, commentGroupPost, commentGroupVideoPost, getAllReactByGroupPhotoPostId, getAllReactByGroupPostId, getAllReactByGroupSharePostId, getAllReactByGroupVideoPostId, getChildGroupPost, getGroupPhotoPostComment, getGroupPostByGroupPostId, getGroupPostComment, getGroupVideoPostComment, updateGroupPhotoPost, updateGroupVideoPost } from '~/apis/groupPostApis'
import { selectCurrentActiveListPost } from '~/redux/activeListPost/activeListPostSlice'
import Report from '~/components/Modal/Report/Report'
import { selectIsOpenReport } from '~/redux/report/reportSlice'

function Media() {
  const [searchParams] = useSearchParams()
  const postType = searchParams.get('type')
  const { photoId, videoId, postId } = useParams()
  const isPhoto = postType === POST_TYPES.PHOTO_POST
  const isVideo = postType === POST_TYPES.VIDEO_POST
  const isProfile = postType === POST_TYPES.PROFILE_POST
  const isGroup = postType === POST_TYPES.GROUP_POST
  const isGroupPhoto = postType === POST_TYPES.GROUP_PHOTO_POST
  const isGroupVideo = postType === POST_TYPES.GROUP_VIDEO_POST
  const isInStory = [POST_TYPES.PHOTO_POST, POST_TYPES.VIDEO_POST].includes(postType)
  // const isInGroup = [POST_TYPES.GROUP_PHOTO_POST, POST_TYPES.GROUP_VIDEO_POST].includes(postType)
  const currentActivePost = useSelector(selectCurrentActivePost)
  // const [currentActivePost, setPostData] = useState({})
  const [isEditContent, setIsEditContent] = useState(false)
  const [content, setContent] = useState('')
  const currentUser = useSelector(selectCurrentUser)
  const dispatch = useDispatch()
  const [listStatus, setListStatus] = useState([])
  const [listPhotos, setListPhotos] = useState([])
  const [listVideos, setListVideos] = useState([])
  const [listComment, setListComment] = useState([])
  const reloadComment = useSelector(reLoadComment)
  const [isYourPost, setIsYourPost] = useState(false)
  const { register, getValues, handleSubmit, setValue } = useForm()
  const navigate = useNavigate()
  const isShowModalReport = useSelector(selectIsOpenReport)
  const handleGetReact = async (postData) => {
    const response = await (
      isPhoto ? getAllReactByPhotoPostId(postData?.userPostMediaId)
        : isVideo ? getAllReactByVideoPostId(postData?.userPostMediaId)
          : isProfile ? getAllReactByPostId(postData?.userPostId || postData?.postId)
            : isGroup ? getAllReactByGroupPostId(postData?.groupPostId || postData?.postId)
              : isGroupPhoto ? getAllReactByGroupPhotoPostId(postData?.groupPostMediaId)
                : isGroupVideo && getAllReactByGroupVideoPostId(postData?.groupPostMediaId)
    )
    return response
  }

  useEffect(() => {
    if (postType) {
      (async () => {
        try {
          let responsePostData
          let responseCommentData
          let postReactStatus
          if (isProfile) {
            responsePostData = await getUserPostById(postId)
            responseCommentData = await getComment(postId)

          } else if (isPhoto || isVideo) {
            responsePostData = await getChildPostById(videoId || photoId)
            responseCommentData = await (isPhoto ? getPhotoComment(photoId)
              : isVideo && getVideoComment(videoId))
          } else if (isGroup) {
            responsePostData = await getGroupPostByGroupPostId(postId)
            responseCommentData = await getGroupPostComment(postId)
          } else if (isGroupPhoto || isGroupVideo) {
            responsePostData = await getChildGroupPost(videoId || photoId)
            responseCommentData = await (isGroupPhoto ? getGroupPhotoPostComment(photoId)
              : isGroupVideo && getGroupVideoPostComment(videoId))
          }
          if (responsePostData) {
            postReactStatus = await handleGetReact(responsePostData)
          }

          if (responseCommentData?.length == 0 || !responseCommentData) navigate('/notavailable')
          dispatch(updateCurrentActivePost({ ...responsePostData, postReactStatus: postReactStatus }))
          setListComment(responseCommentData?.posts)
          setValue('content', responsePostData?.content)
        } catch (error) {
          navigate('/notavailable')
        }
      })()
    } else navigate('/notavailable')
    getStatus().then(data => setListStatus(data))
    getAllReactType().then(data => dispatch(addListReactType(data)))
    setIsEditContent(false)
  }, [reloadComment, postType, photoId, videoId, postId])

  useEffect(() => {
    setIsYourPost(currentUser?.userId == currentActivePost?.userId)
  }, [currentActivePost, postType])

  const handleCommentPost = () => {
    const submitData = isPhoto ?
      {
        'userPostPhotoId': currentActivePost?.userPostMediaId,
        'userId': currentUser?.userId,
        'content': content,
        'parentCommentId': null
      }
      : isProfile ? {
        'userPostId': currentActivePost?.userPostId,
        'userId': currentUser?.userId,
        'content': content,
        'parentCommentId': null
      }
        : isVideo ? {
          'userPostVideoId': currentActivePost?.userPostMediaId,
          'userId': currentUser?.userId,
          'content': content,
          'parentCommentId': null
        } : isGroup ? {
          'groupPostId': currentActivePost?.groupPostId,
          'userId': currentUser?.userId,
          'content': content,
          'parentCommentId': null
        } : isGroupPhoto ? {
          'groupPostPhotoId': currentActivePost?.groupPostMediaId,
          'userId': currentUser?.userId,
          'content': content,
          'parentCommentId': null
        } : isGroupVideo && {
          'groupPostVideoId': currentActivePost?.groupPostMediaId,
          'userId': currentUser?.userId,
          'content': content,
          'parentCommentId': null
        }
    toast.promise(isProfile ? commentPost(submitData)
      : isPhoto ? commentPhotoPost(submitData)
        : isVideo ? commentVideoPost(submitData)
          : isGroup ? commentGroupPost(submitData)
            : isGroupPhoto ? commentGroupPhotoPost(submitData)
              : isGroupVideo && commentGroupVideoPost(submitData),
      { pending: 'Updating is in progress...' })
      .then(() => toast.success('Commented'))
      .finally(() => {
        dispatch(triggerReloadComment()), setContent('')
      })

  }
  const handleUpdateChildPostContent = () => {
    const submitData = {
      ...(isPhoto ? {
        'userPostPhotoId': photoId,
        'userPostId': currentActivePost?.userPostId
      }
        : isVideo ? {
          'userPostVideoId': videoId,
          'userPostId': currentActivePost?.userPostId
        }
          : isGroupPhoto ? {
            'groupPostPhotoId': photoId,
            'groupPostId': currentActivePost?.groupPostId
          }
            : isGroupVideo && {
              'groupPostVideoId': videoId,
              'groupPostId': currentActivePost?.groupPostId
            }
      ),
      'userId': currentUser?.userId,
      'content': getValues('content')
    }

    toast.promise(
      isPhoto ? updatePhotoPost(submitData)
        : isVideo ? updateVideoPost(submitData)
          : isGroupPhoto ? updateGroupPhotoPost(submitData)
            : isGroupVideo && updateGroupVideoPost(submitData),
      { pending: 'Updating...' })
      .then(() => toast.success('Updated!'))
      .finally(() => {
        dispatch(triggerReloadComment())
        setIsEditContent(false)
      })
  }

  return (
    <>
      <NavTopBar />
      {isShowModalReport && <Report />}
      <div className='flex flex-col lg:flex-row h-[calc(100vh_-_55px)]'>
        <div className='max-lg:h-1/2 lg:basis-8/12 bg-black flex justify-center relative'>
          {(isProfile || isGroup)
            ? (currentActivePost?.photo || currentActivePost?.groupPhoto)
              ? <img
                src={currentActivePost?.photo?.photoUrl || currentActivePost?.groupPhoto?.photoUrl}
                className='object-contain'
              />
              : <video
                src={currentActivePost?.video?.videoUrl || currentActivePost?.groupVideo?.videoUrl}
                className='object-contain'
                controls
                disablePictureInPicture
              />
            : (isPhoto || isGroupPhoto)
              ? <img
                src={currentActivePost?.photo?.photoUrl || currentActivePost?.groupPhoto?.photoUrl}
                className='object-contain'
              />
              : (isVideo || isGroupVideo)
              && <video
                src={isVideo ? currentActivePost?.video?.videoUrl : currentActivePost?.groupVideo?.videoUrl}
                className='object-contain'
                controls
                disablePictureInPicture
              />
          }
          {
            currentActivePost?.previousType && <Link
              className='absolute left-2 top-1/2 -translate-y-1/2 text-orangeFpt bg-white hover:bg-orange-100 rounded-full flex justify-center items-center'
              to={currentActivePost?.previousType?.toLowerCase() == 'photo'
                ? `/photo/${currentActivePost?.previousId}?type=${isInStory ? POST_TYPES.PHOTO_POST : POST_TYPES.GROUP_PHOTO_POST}`
                : `/video/${currentActivePost?.previousId}?type=${isInStory ? POST_TYPES.VIDEO_POST : POST_TYPES.GROUP_VIDEO_POST}`}
            >
              <IconChevronLeft className='size-9' />
            </Link>
          }
          {
            currentActivePost?.nextType && <Link
              className='absolute right-2 top-1/2 -translate-y-1/2 text-orangeFpt bg-white hover:bg-orange-100 rounded-full flex justify-center items-center'
              to={currentActivePost?.nextType?.toLowerCase() == 'photo'
                ? `/photo/${currentActivePost?.nextId}?type=${isInStory ? POST_TYPES.PHOTO_POST : POST_TYPES.GROUP_PHOTO_POST}`
                : `/video/${currentActivePost?.nextId}?type=${isInStory ? POST_TYPES.VIDEO_POST : POST_TYPES.GROUP_VIDEO_POST}`}
            >
              <IconChevronRight className='size-9' />
            </Link>
          }
        </div>
        <div className='max-lg:h-1/2 lg:basis-4/12 overflow-y-auto overflow-x-clip no-scrollbar'>
          <div className='h-[80%] overflow-y-auto scrollbar-none-track overflow-x-clip'>
            {
              !postId &&
              <div className="flex flex-wrap items-center justify-between border-b px-4 pt-4 pb-3">
                <span className="text-sm text-gray-500 flex items-center gap-1"><IconArticle />This photo is from a post</span>
                <Link to={currentActivePost?.groupPostId ? `/groups/${currentActivePost?.groupId}/post/${currentActivePost?.groupPostId}` : `/post/${currentActivePost?.userPostId}`} className="font-semibold text-sm">View post</Link>
              </div>
            }
            <PostTitle postData={currentActivePost} isYourPost={isYourPost} postType={postType} />
            {
              isProfile
                ? <PostContents postData={currentActivePost} />
                : <div className="px-4 pb-3">
                  {!isEditContent && <div className='mb-3'>{currentActivePost?.content}</div>}
                  {isEditContent && <Box >
                    <TextField
                      defaultValue={currentActivePost?.content}
                      multiline variant="standard" sx={{ width: '100%', marginBottom: '12px' }}
                      placeholder='Type something...'
                      {...register('content')}
                    />
                    <div className='flex gap-2'>
                      <Button variant="contained" color='warning' onClick={handleUpdateChildPostContent}>Save</Button>
                      <Button variant="contained" color='inherit' onClick={() => setIsEditContent(!isEditContent)}>Cancel</Button>
                    </div>
                  </Box>}
                  {isYourPost && !isEditContent && <Button variant="contained" color='warning' onClick={() => setIsEditContent(!isEditContent)}>Edit</Button>}
                </div>
            }
            <PostReactStatus postData={currentActivePost} postType={postType} />
            <PostComment comment={listComment} postType={postType} />
          </div>
          <form onSubmit={handleSubmit(handleCommentPost)} className='pb-4 pt-2 border-t w-full flex gap-2 px-4'>
            {/* <form className='mb-4 w-full flex gap-2 px-4'> */}
            <UserAvatar isOther={false} />
            <div className='rounded-lg pt-2 w-full bg-fbWhite'>
              <Tiptap
                setContent={setContent}
                content={content}
                listPhotos={listPhotos}
                setListPhotos={setListPhotos}
                listVideos={listVideos}
                setListVideos={setListVideos}
                editorType={EDITOR_TYPE.COMMENT}
              />
            </div>
          </form>
        </div>
      </div>
    </>
  )
}

export default Media
