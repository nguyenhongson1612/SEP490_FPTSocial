import { Button, Modal } from '@mui/material'
import { IconX } from '@tabler/icons-react'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import { commentPost, getComment, getUserPostById } from '~/apis/postApis'
import { getAllReactType } from '~/apis/reactApis'
// import Post from '~/components/ListPost/Post/Post'
import PostComment from '~/components/ListPost/Post/PostContent/PostComment/PostComment'
import PostContents from '~/components/ListPost/Post/PostContent/PostContents'
import PostMedia from '~/components/ListPost/Post/PostContent/PostMedia'
import PostReactStatus from '~/components/ListPost/Post/PostContent/PostReactStatus'
import PostTitle from '~/components/ListPost/Post/PostContent/PostTitle'
import NavTopBar from '~/components/NavTopBar/NavTopBar'
import Tiptap from '~/components/TitTap/TitTap'
import CurrentUserAvatar from '~/components/UI/UserAvatar'
import { clearAndHireCurrentActivePost, reLoadComment, selectCurrentActivePost, selectIsShowModalActivePost, showModalActivePost, triggerReloadComment } from '~/redux/activePost/activePostSlice'
import { addListReactType } from '~/redux/sideData/sideDataSlice'
import { selectCurrentUser } from '~/redux/user/userSlice'

function Post() {
  const { postId } = useParams()
  const dispatch = useDispatch()
  const { handleSubmit } = useForm()
  const [content, setContent] = useState('')
  const currentUser = useSelector(selectCurrentUser)
  const [listPhotos, setListPhotos] = useState([])
  const [listVideos, setListVideos] = useState([])
  const [listComment, setListComment] = useState([])
  const reloadComment = useSelector(reLoadComment)
  const [postData, setPostData] = useState({})

  useEffect(() => {
    getUserPostById(postId).then(data => { setPostData(data), setContent(data?.content) })
    getComment(postId).then(data => setListComment(data?.posts))
    getAllReactType().then(data => dispatch(addListReactType(data)))
  }, [reloadComment])
  // console.log(currentActivePost)
  const handleCommentPost = () => {
    const submitData = {
      'userPostId': postId,
      'userId': currentUser?.userId,
      'content': content,
      'parentCommentId': null
    }
    toast.promise(
      commentPost(submitData),
      { pending: 'Updating is in progress...' }
    ).then(() => {
      toast.success('Commented')
    })

  }

  return (
    <>
      <NavTopBar />
      <div className="flex justify-center bg-fbWhite">
        <div className='flex flex-col items-center gap-3 w-[95%] sm:w-[500px] bg-white shadow-md rounded-lg mt-4'>
          <div
            className="w-full flex flex-col items-center gap-2 border overflow-y-auto overflow-x-clip scrollbar-none-track">
            <PostTitle postData={postData} />
            <PostContents postData={postData} />
            <PostMedia postData={postData} />
            <PostReactStatus postData={postData} />
            <PostComment comment={listComment} />
          </div>
          <form onSubmit={handleSubmit(handleCommentPost)} className='mb-4 w-full flex gap-2 px-4'>
            <CurrentUserAvatar />
            <div className='rounded-lg pt-2 w-full'>
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
        </div>
      </div>

    </>
  )
}

export default Post