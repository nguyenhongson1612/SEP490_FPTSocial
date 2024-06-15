import React from 'react'
import LazyImage from '~/components/LazyImage'

function PostDescription({ postData }) {
  // console.log('🚀 ~ PostDescription ~ postData?.image:', postData?.image)
  return (
    <div id="post-description"
      className="flex flex-col w-full gap-3"
    >
      <div className="">
        {postData?.description}
      </div>
      <div className="w-full h-fit flex justify-center items-center">
        {/* <LazyImage placeholderSrc={'./src/assets/img/alphabuilding_long.jpg'} placeholderClassName={'w-fit h-fit'} dataSrc={postData?.image} alt={'group-img'} className={'w-[200px] h-[200px]'} /> */}
        <div className={`bg-[url${postData?.image}]`}>
          <img
            src={`${postData?.image}`}
            alt="group-img"
            loading="lazy"
            className=" w-fit h-fit"
          />
        </div>

      </div>
    </div>
  )
}

export default PostDescription