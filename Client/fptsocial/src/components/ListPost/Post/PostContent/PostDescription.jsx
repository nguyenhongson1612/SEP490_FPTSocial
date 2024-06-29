import DOMPurify from 'dompurify';
import React from 'react'
import LazyImage from '~/components/LazyImage'
import parse from 'html-react-parser'

function PostDescription({ postData }) {
  const cleanHtml = parse(DOMPurify.sanitize(postData?.content))

  return (
    <div id="post-description"
      className="flex flex-col w-full gap-3"
    >
      <div className="">
        {cleanHtml}
      </div>
      <div className="w-full h-fit flex justify-center items-center">
        {/* <LazyImage placeholderSrc={'./src/assets/img/alphabuilding_long.jpg'} placeholderClassName={'w-fit h-fit'} dataSrc={postData?.image} alt={'group-img'} className={'w-[200px] h-[200px]'} /> */}
        <div className={`bg-[url${postData?.image}]`}>
          <img
            src={`${postData?.image}`}
            alt="post-img"
            loading="lazy"
            className=" w-fit h-fit"
          />
        </div>

      </div>
    </div>
  )
}

export default PostDescription