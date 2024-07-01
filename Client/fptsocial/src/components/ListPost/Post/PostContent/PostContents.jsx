import DOMPurify from 'dompurify';
import React from 'react'
import LazyImage from '~/components/LazyImage'
import parse from 'html-react-parser'

function PostContents({ postData }) {
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
        <div className='grid grid-cols-2'>
          {
            postData?.userPostPhotos?.map(e => (
              <img
                key={e?.userPostPhotoId}
                src={`${e?.photo?.photoUrl}`}
                alt="post-img"
                loading="lazy"
                className="col-span-1"
              />
            ))
          }
          {
            postData?.userPostVideos?.map(e => (
              <video
                controls
                key={e?.userPostVideoId}
                src={`${e?.video?.videoUrl}`}
                className="col-span-1"
              />
            ))
          }

        </div>

      </div>
    </div>
  )
}

export default PostContents