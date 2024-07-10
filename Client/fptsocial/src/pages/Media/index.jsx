import { Link, useLocation, useParams } from 'react-router-dom'
import NavTopBar from '~/components/NavTopBar/NavTopBar'
import { Button, FormControl, FormControlLabel, Modal, Radio, RadioGroup } from '@mui/material'
import { IconArticle } from '@tabler/icons-react'
import { useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import { getStatus } from '~/apis'
import { commentPhotoPost, commentPost, commentVideoPost, getComment, getPhotoComment, getUserPostById, getUserPostPhoto, getUserPostVideo, getVideoComment } from '~/apis/postApis'
import PostComment from '~/components/ListPost/Post/PostContent/PostComment/PostComment'
import PostReactStatus from '~/components/ListPost/Post/PostContent/PostReactStatus'
import PostTitle from '~/components/ListPost/Post/PostContent/PostTitle'
import Tiptap from '~/components/TitTap/TitTap'
import UserAvatar from '~/components/UI/UserAvatar'
import { reLoadComment, triggerReloadComment } from '~/redux/activePost/activePostSlice'
import { selectCurrentUser } from '~/redux/user/userSlice'
import PostContents from '~/components/ListPost/Post/PostContent/PostContents'
import { getAllReactType } from '~/apis/reactApis'
import { addListReactType } from '~/redux/sideData/sideDataSlice'

function Media() {
  const { photoId, videoId, postId } = useParams()
  const location = useLocation()
  const isPhoto = location.pathname?.includes('/photo')
  const isPostMedia = location.pathname?.includes('/media')

  const [photo, setPhoto] = useState({})
  const [video, setVideo] = useState({})
  const [postMedia, setPostMedia] = useState({})

  const [content, setContent] = useState('')
  const currentUser = useSelector(selectCurrentUser)
  const dispatch = useDispatch()
  const [listStatus, setListStatus] = useState([])
  const [listPhotos, setListPhotos] = useState([])
  const [listVideos, setListVideos] = useState([])
  const [listComment, setListComment] = useState([])
  const reloadComment = useSelector(reLoadComment)
  const [isYourPost, setIsYourPost] = useState(false)

  const { register, setValue, clearErrors, control, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
    }
  })

  useEffect(() => {
    if (isPhoto) {
      getUserPostPhoto(photoId).then(data => { setPhoto(data), setContent(data?.content) })
      getPhotoComment(photoId).then(data => setListComment(data?.posts))
    }
    else if (isPostMedia) {
      getUserPostById(postId).then(data => { setPostMedia(data), setContent(data?.content) })
      getComment(postId).then(data => setListComment(data?.posts))
    }
    else {
      getUserPostVideo(videoId).then(data => { setVideo(data), setContent(data?.content) })
      getVideoComment(videoId).then(data => setListComment(data?.posts))
    }
    getStatus().then(data => setListStatus(data))
    getAllReactType().then(data => dispatch(addListReactType(data)))
  }, [reloadComment, isPhoto, photoId, videoId])

  useEffect(() => {
    if (isPhoto) setIsYourPost(currentUser?.userId == photo?.userId)
    else if (isPostMedia) setIsYourPost(currentUser?.userId == postMedia?.userId)
    else setIsYourPost(currentUser?.userId == video?.userId)
  }, [isPhoto, isPostMedia, photo, video, postMedia])

  const handleCommentPost = () => {
    const submitData = isPhoto ?
      {
        'userPostPhotoId': photo?.userPostPhotoId,
        'userId': currentUser?.userId,
        'content': content,
        'parentCommentId': null
      }
      : isPostMedia ? {
        'userPostId': postMedia?.userPostId,
        'userId': currentUser?.userId,
        'content': content,
        'parentCommentId': null
      }
        : {
          'userPostVideoId': video?.userPostVideoId,
          'userId': currentUser?.userId,
          'content': content,
          'parentCommentId': null
        }
    toast.promise(isPostMedia ? commentPost(submitData) : isPhoto ? commentPhotoPost(submitData) : commentVideoPost(submitData),
      { pending: 'Updating is in progress...' })
      .then(() => toast.success('Commented'))
      .finally(() => {
        dispatch(triggerReloadComment()), setContent('')
      })

  }

  return (
    <>
      <NavTopBar />
      <div className='flex flex-col lg:flex-row h-[calc(100vh_-_55px)]'>
        <div className='max-lg:h-1/2 lg:basis-8/12 bg-black flex justify-center'>
          {isPostMedia
            ? postMedia?.photo
              ? <img
                src={postMedia?.photo?.photoUrl}
                className='object-contain'
              />
              : <video
                src={postMedia.video?.videoUrl}
                className='object-contain'
                controls
                disablePictureInPicture
              />
            : isPhoto

              ? <img
                src={photo?.photo?.photoUrl}
                className='object-contain'
              />
              : <video
                src={video?.video?.videoUrl}
                className='object-contain'
                controls
                disablePictureInPicture
              />
          }

        </div>
        <div className='max-lg:h-1/2 lg:basis-4/12 overflow-y-auto overflow-x-clip no-scrollbar'>
          <div className='h-[80%] overflow-y-auto scrollbar-none-track overflow-x-clip'>
            {
              !postId &&
              <div className="flex flex-wrap items-center justify-between border-b px-4 pt-4 pb-3">
                <span className="text-sm text-gray-500 flex items-center gap-1"><IconArticle />This photo is from a post</span>
                <Link to={`/post/${photo?.userPostId || video?.userPostId}`} className="font-semibold text-sm">View post</Link>
              </div>
            }
            <PostTitle postData={isPostMedia ? postMedia : isPhoto ? photo : video} isYourPost={isYourPost} listStatus={listStatus} />
            {
              isPostMedia
                ? <PostContents postData={postMedia} />
                : <div className="px-4 pb-3">
                  <div>content</div>
                  {isYourPost && <Button variant="contained">Edit</Button>}
                </div>
            }

            <PostReactStatus postData={isPostMedia ? postMedia : isPhoto ? photo : video} />
            <PostComment comment={listComment} />
          </div>
          <form onSubmit={handleSubmit(handleCommentPost)} className='pb-4 pt-2 border-t w-full flex gap-2 px-4'>
            {/* <form className='mb-4 w-full flex gap-2 px-4'> */}
            <UserAvatar />
            <div className='rounded-lg pt-2 w-full bg-fbWhite'>
              <Tiptap
                setContent={setContent}
                content={content}
                listPhotos={listPhotos}
                setListPhotos={setListPhotos}
                listVideos={listVideos}
                setListVideos={setListVideos}
                type="comment"
              />
            </div>
          </form>
        </div>
      </div>
    </>
  )
}

export default Media
