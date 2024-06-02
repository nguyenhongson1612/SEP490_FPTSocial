import React from 'react'

function PostDescription({ postData }) {
  return (
    <div id="post-description"
      className="flex flex-col w-full gap-3"
    >
      <div className="">
        {postData?.description}
      </div>
      <div className="w-full h-fit flex justify-center items-center">
        <img
          src={`${postData?.image}`}
          alt="group-img"
          loading="lazy"
          className=" w-fit h-fit"
        />
      </div>
    </div>
  )
}

export default PostDescription