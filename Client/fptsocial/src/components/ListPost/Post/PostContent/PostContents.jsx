import React from 'react'
import LazyImage from '~/components/LazyImage'
import { cleanAndParseHTML } from '~/utils/formatters'

function PostContents({ postData }) {
  const cleanHtml = cleanAndParseHTML(postData?.content)

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
            !!postData?.photo
              ? (<img
                key={postData?.photo?.photoId}
                src={postData?.photo?.photoUrl}
                alt="post-img"
                loading="lazy"
                className="col-span-2"
              />)
              : postData?.userPostPhotos?.map(e => (
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
            !!postData?.video
              ? (<video
                controls
                key={postData?.video?.videoId}
                src={postData?.video?.videoUrl}
                className="col-span-2"
              />)
              : postData?.userPostVideos?.map(e => (
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