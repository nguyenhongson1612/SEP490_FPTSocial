import { IconHeart, IconMessageCircle, IconMoodAngry, IconShare3, IconThumbDownFilled, IconThumbUp, IconThumbUpFilled } from '@tabler/icons-react'
import { useDispatch } from 'react-redux'
import { showModalActivePost, updateCurrentActivePost } from '~/redux/activePost/activePostSlice'

function PostReactStatus({ postData }) {

  const dispatch = useDispatch()
  const handleOpenCurrenPostModal = () => {
    dispatch(showModalActivePost())
    dispatch(updateCurrentActivePost(postData))
  }

  return (
    <div id="post-react"
      className="w-full flex flex-col items-start border-t-2">
      <div id="post-react-status"
        className="w-full flex items-center justify-between py-1">
        <a className="flex items-center"
        >
          <IconThumbUp stroke={1} />
          <span className="text-sm text-gray-500">100</span>
        </a >
        <div className='flex items-center gap-4'>
          <a className="flex items-center" onClick={handleOpenCurrenPostModal}>
            <IconMessageCircle stroke={1} />
            <span className="text-sm text-gray-500">200</span>
          </a>
          <a className="flex items-center ">
            <IconShare3 stroke={1} />
            <span className="text-sm text-gray-500">20</span>
          </a>
        </div>

      </div>
      <div id="post-react-action"
        className="w-full flex items-center justify-between border-t">
        {/* <a className="flex items-center justify-center hover:bg-fbWhite py-1 rounded-md relative  [&>#test]:hover:!opacity-100 hover:scale-150 basis-1/3" */}
        <a className="flex items-center justify-center hover:bg-fbWhite py-1 rounded-md relative  [&>#test]:hover:!opacity-100 basis-1/3"
        >
          <IconThumbUp stroke={1} />
          <span className="text-sm text-gray-500">Like</span>

          <div id='test' className='absolute flex gap-1 opacity-0 transition-opacity duration-300 delay-500 top-0 -translate-y-10 bg-white shadow-4edges rounded-3xl px-2 py-1'>
            <IconThumbUpFilled className="text-blue-700 size-10 hover:scale-[1.2]" />
            <IconHeart className="text-pink-500 size-10 hover:scale-[1.2]" />
            <IconMoodAngry className="text-red-500 size-10 hover:scale-[1.2]" />
            <IconThumbDownFilled className="text-black size-10 hover:scale-[1.2]" />
          </div>

        </a >
        <a className="flex items-center justify-center hover:bg-fbWhite py-1 rounded-md basis-1/3" onClick={handleOpenCurrenPostModal}>
          <IconMessageCircle stroke={1} />
          <span className="text-sm text-gray-500">Comment</span>
        </a>
        <a className="flex items-center justify-center hover:bg-fbWhite py-1 rounded-md  basis-1/3">
          <IconShare3 stroke={1} />
          <span className="text-sm text-gray-500">Share</span>
        </a>
      </div>
    </div>
  )
}

export default PostReactStatus