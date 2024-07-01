import { IconHeart, IconMoodAngry, IconThumbDownFilled, IconThumbUpFilled } from '@tabler/icons-react'

function PostReactStatus({ isOpen, setIsOpen, postData }) {

  return (
    <div id="post-react"
      className="w-full flex flex-col gap-2 items-start"
      onClick={() =>
        setIsOpen(!isOpen)
      }
    >
      <div id="post-react-status"
        className=" flex items-center justify-start gap-2">
        <a className="flex items-center relative  [&>#test]:hover:!opacity-100 hover:scale-150"
        >
          <IconThumbUpFilled className="text-gray-500 size-6" />
          <span className="text-sm text-gray-500">100</span>

          <div id='test' className='absolute flex gap-1 opacity-0 transition-opacity duration-300 delay-500 top-0 -translate-y-10 bg-white shadow-4edges rounded-3xl px-2 py-1'>
            <IconThumbUpFilled className="text-blue-700 size-10 hover:scale-[1.2]" />
            <IconHeart className="text-pink-500 size-10 hover:scale-[1.2]" />
            <IconMoodAngry className="text-red-500 size-10 hover:scale-[1.2]" />
            <IconThumbDownFilled className="text-black size-10 hover:scale-[1.2]" />
          </div>

        </a >
        <a className="flex items-center text-blue-500">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.444 3 12c0 2.104.859 4.023 2.273 5.48.432.447.74 1.04.586 1.641a4.483 4.483 0 0 1-.923 1.785A5.969 5.969 0 0 0 6 21c1.282 0 2.47-.402 3.445-1.087.81.22 1.668.337 2.555.337Z" />
          </svg>
          <span className="text-sm text-gray-500">100</span>
        </a>
        <a className="flex items-center text-gray-900">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 1 0 0 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186 9.566-5.314m-9.566 7.5 9.566 5.314m0 0a2.25 2.25 0 1 0 3.935 2.186 2.25 2.25 0 0 0-3.935-2.186Zm0-12.814a2.25 2.25 0 1 0 3.933-2.185 2.25 2.25 0 0 0-3.933 2.185Z" />
          </svg>
          <span className="text-sm text-gray-500">100</span>
        </a>
      </div>
      <div id="post-react-action">
      </div>
    </div>
  )
}

export default PostReactStatus