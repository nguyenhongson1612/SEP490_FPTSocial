import { Button, Modal } from '@mui/material'
import { IconX } from '@tabler/icons-react'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import { commentPost, getComment } from '~/apis'
import Post from '~/components/ListPost/Post/Post'
import PostComment from '~/components/ListPost/Post/PostContent/PostComment/PostComment'
import PostContents from '~/components/ListPost/Post/PostContent/PostContents'
import PostReactStatus from '~/components/ListPost/Post/PostContent/PostReactStatus'
import PostTitle from '~/components/ListPost/Post/PostContent/PostTitle'
import Tiptap from '~/components/TitTap/TitTap'
import { clearAndHireCurrentActivePost, reLoadComment, selectCurrentActivePost, selectIsShowModalActivePost, showModalActivePost, triggerReloadComment } from '~/redux/activePost/activePostSlice'
import { selectCurrentUser } from '~/redux/user/userSlice'

function ActivePost() {
  const isShowActivePost = useSelector(selectIsShowModalActivePost)
  const currentActivePost = useSelector(selectCurrentActivePost)
  const dispatch = useDispatch()

  const { handleSubmit } = useForm()
  const [content, setContent] = useState('')
  const user = useSelector(selectCurrentUser)
  const [listPhotos, setListPhotos] = useState([])
  const [listVideos, setListVideos] = useState([])
  const [listComment, setListComment] = useState([])
  const reloadComment = useSelector(reLoadComment)
  console.log(reloadComment)

  useEffect(() => {
    isShowActivePost && getComment(currentActivePost?.userPostId).then(data => setListComment(data?.posts))
  }, [isShowActivePost, reloadComment])
  // console.log(currentActivePost)
  const handleCommentPost = () => {
    const submitData = {
      'userPostId': currentActivePost?.userPostId,
      'userId': user?.userId,
      'content': content,
      'parentCommentId': null
    }
    toast.promise(
      commentPost(submitData),
      { pending: 'Updating is in progress...' }
    ).then(() => {
      toast.success('Comment successfully')
    }).finally(() => { dispatch(triggerReloadComment()), setContent('') })

  }

  return (
    <>
      <Modal
        open={isShowActivePost}
        onClose={() => dispatch(clearAndHireCurrentActivePost())}
      >
        <div className='flex flex-col items-center gap-3 w-[95%] sm:w-[600px] max-h-[90%] absolute left-1/2 top-1/2 -translate-y-1/2 -translate-x-1/2
        h-[90%] bg-white border-gray-300 shadow-md rounded-md'>
          <div id='post-detail-author'
            className='h-[60px] w-full flex justify-between items-center px-4'>
            <div></div>
            <span className='font-bold font-sans text-xl'>
              {(currentActivePost?.fullName?.split(/\s+/)[0] || currentActivePost?.fullName)}&apos; Post
            </span>
            <div className='cursor-pointer' onClick={() => dispatch(clearAndHireCurrentActivePost())}>
              <IconX className='text-white bg-orangeFpt rounded-full' />
            </div>
          </div>
          <div
            className="w-full h-[80%] flex flex-col items-center gap-2 border p-4  overflow-y-auto scrollbar-none-track">
            <PostTitle postData={currentActivePost} />
            <PostContents postData={currentActivePost} />
            <PostReactStatus postData={currentActivePost} />
            <PostComment comment={listComment} />
          </div>
          <form onSubmit={handleSubmit(handleCommentPost)} className='mb-4 w-full flex gap-2 px-4'>
            <img
              src={user?.avataPhotos?.find(e => e.isUsed == true).avataPhotosUrl || './src/assets/img/user_holder.jpg'}
              className="rounded-[50%] aspect-square object-cover size-10"
            />
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
      </Modal>
    </>
  )
}

export default ActivePost