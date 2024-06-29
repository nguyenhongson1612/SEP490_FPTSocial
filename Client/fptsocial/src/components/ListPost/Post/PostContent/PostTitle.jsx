

function PostTitle({ postData }) {
  return (
    <div id="post-title"
      className="w-full flex gap-4">
      <a className="w-fit relative text-gray-500 hover:text-gray-950 flex items-center justify-start gap-3">
        <img
          src={`${postData?.image}`}
          loading='lazy'
          className="rounded-md aspect-square object-cover w-10"
        />
        <img
          src={`${postData?.image}`}
          loading='lazy'
          className="absolute -bottom-1 -right-1 rounded-[50%] aspect-squa  re object-cover w-7"
        />
      </a>

      <div id="group-author-name" className="flex flex-col gap-1">
        <div id="group-name" className="font-semibold font-sans">{postData?.title}</div>
        <div id="author-name" className="flex justify-start gap-2 text-gray-500 font-semibold text-sm">
          <span>{postData?.category}</span>.
          <span>12 h</span>
        </div>
      </div>
    </div>
  )
}

export default PostTitle