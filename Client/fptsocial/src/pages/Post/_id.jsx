import { Button, Modal } from '@mui/material'
import { IconX } from '@tabler/icons-react'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import { commentPost, getComment, getUserPostById } from '~/apis/postApis'
import { getAllReactByPostId, getAllReactType } from '~/apis/reactApis'
// import Post from '~/components/ListPost/Post/Post'
import PostComment from '~/components/ListPost/Post/PostContent/PostComment/PostComment'
import PostContents from '~/components/ListPost/Post/PostContent/PostContents'
import PostMedia from '~/components/ListPost/Post/PostContent/PostMedia'
import PostReactStatus from '~/components/ListPost/Post/PostContent/PostReactStatus'
import PostTitle from '~/components/ListPost/Post/PostContent/PostTitle'
import SharePost from '~/components/Modal/ActivePost/SharePost'
import Report from '~/components/Modal/Report/Report'
import NavTopBar from '~/components/NavTopBar/NavTopBar'
import Tiptap from '~/components/TitTap/TitTap'
import CurrentUserAvatar from '~/components/UI/UserAvatar'
import { clearAndHireCurrentActivePost, reLoadComment, selectCurrentActivePost, selectIsShowModalActivePost, selectIsShowModalSharePost, showModalActivePost, triggerReloadComment, updateCurrentActivePost } from '~/redux/activePost/activePostSlice'
import { selectIsOpenReport } from '~/redux/report/reportSlice'
import { addListReactType } from '~/redux/sideData/sideDataSlice'
import { selectCurrentUser } from '~/redux/user/userSlice'
import { EDITOR_TYPE, POST_TYPES } from '~/utils/constants'

function Post() {
  const { postId } = useParams()
  const dispatch = useDispatch()
  const { handleSubmit } = useForm()
  const [content, setContent] = useState('')
  const currentUser = useSelector(selectCurrentUser)
  const isShowModalReport = useSelector(selectIsOpenReport)
  const isShowModalShare = useSelector(selectIsShowModalSharePost)
  const currentActivePost = useSelector(selectCurrentActivePost)
  const [listPhotos, setListPhotos] = useState([])
  const [listVideos, setListVideos] = useState([])
  const [listComment, setListComment] = useState([])
  const reloadComment = useSelector(reLoadComment)
  const postType = POST_TYPES.PROFILE_POST

  useEffect(() => {
    (async () => {
      getAllReactType().then(data => dispatch(addListReactType(data)))
      const postData = await getUserPostById(postId)
      const postReact = await getAllReactByPostId(postId)
      dispatch(updateCurrentActivePost({ ...postData, postReactStatus: postReact }))
    })()
  }, [isShowModalShare])

  useEffect(() => {
    getComment(postId).then(data => setListComment(data?.posts))
  }, [reloadComment])

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
      dispatch(triggerReloadComment())
      toast.success('Commented')
    })

  }

  return (
    <>
      <NavTopBar />
      {isShowModalShare && <SharePost />}
      {isShowModalReport && <Report />}
      <div className="flex justify-center bg-fbWhite">
        <div className='flex flex-col items-center gap-3 w-[95%] sm:w-[500px] bg-white shadow-md rounded-lg mt-4'>
          <div
            className="w-full flex flex-col items-center gap-2 border overflow-y-auto overflow-x-clip scrollbar-none-track">
            <PostTitle postData={currentActivePost} postType={postType} />
            <PostContents postData={currentActivePost} postType={postType} />
            <PostMedia postData={currentActivePost} postType={postType} />
            <PostReactStatus postData={currentActivePost} postType={postType} />
            <PostComment comment={listComment} postType={postType} />
          </div>
          <form onSubmit={handleSubmit(handleCommentPost)} className='mb-4 w-full flex gap-2 px-4'>
            <CurrentUserAvatar isOther={false} />
            <div className='rounded-lg pt-2 w-full'>
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

export default Post