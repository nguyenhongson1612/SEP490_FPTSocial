import { Popover } from '@mui/material'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import { commentPost } from '~/apis'
import Tiptap from '~/components/TitTap/TitTap'
import { reLoadComment, triggerReloadComment } from '~/redux/activePost/activePostSlice'
import { selectCurrentUser } from '~/redux/user/userSlice'
import { cleanAndParseHTML, compareDateTime } from '~/utils/formatters'

function Comment({ comment }) {
  const { handleSubmit } = useForm()
  const [content, setContent] = useState('')
  const [listPhotos, setListPhotos] = useState([])
  const [listVideos, setListVideos] = useState([])
  const [listStatus, setListStatus] = useState([])
  const [choseStatus, setChoseStatus] = useState({})
  const dispatch = useDispatch()

  const [anchorEl, setAnchorEl] = useState(null)
  const user = useSelector(selectCurrentUser)
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget)
  };

  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleRelyComment = () => {
    const submitData = {
      'userPostId': comment?.userPostId,
      'userId': user?.userId,
      'content': content,
      'parentCommentId': comment?.userId
    }

    toast.promise(
      commentPost(submitData),
      { pending: 'Updating is in progress...' }
    ).then(() => {
      toast.success('Comment successfully')
    }).finally(() => { dispatch(triggerReloadComment()); setAnchorEl(null) })
  }

  const open = Boolean(anchorEl)
  const id = open ? 'simple-popover' : undefined
  return (
    // <div className={`${comment?.level !== 1 && 'pl-14'}`}>
    <div className={`${''}`}>
      <div className='flex gap-2'>
        <img
          src={'./src/assets/img/user_holder.jpg'}
          className="rounded-[50%] aspect-square object-cover size-10"
        />
        <div className='flex flex-col gap-1'>
          <div className='bg-fbWhite flex flex-col py-2 px-3 rounded-md'>
            <span className='font-bold'>{comment?.userName}</span>
            <div>{cleanAndParseHTML(comment?.content)}</div>
          </div>
          <div className='flex gap-2 items-center text-xs'>
            <span className='font-thin cursor-pointer'>{compareDateTime(comment?.createdDate)}</span>
            <span className='font-semibold cursor-pointer'>Like</span>
            <span id='comment-filter' className='font-semibold cursor-pointer' onClick={handleClick}>Rely</span>
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
                <img
                  // src={user?.avataPhotos?.find(e => e.isUsed == true).avataPhotosUrl || './src/assets/img/user_holder.jpg'}
                  src={'./src/assets/img/user_holder.jpg'}
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
            </Popover>
          </div>
        </div>
      </div>
      {/* {
        comment?.replies?.map(e => (
          <Comment key={e?.userId} comment={e} />
        ))
      } */}
    </div>


  )
}

export default Comment;
