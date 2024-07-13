import { useEffect, useRef, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';

function PostMedia({ postData }) {
  const mediaList = [
    ...postData?.userPostPhotos?.map(e => ({ type: 'image', owner: 'subPost', media: e })) ?? [],
    ...postData?.userPostVideos?.map(e => ({ type: 'video', owner: 'subPost', media: e })) ?? []
  ]

  if (postData?.photo) mediaList.unshift({ type: 'image', owner: 'mainPost', media: postData?.photo })
  if (postData?.video) mediaList.push({ type: 'video', owner: 'mainPost', media: postData?.video })

  const imgRefs = useRef([])
  const [stopIndex, setStopIndex] = useState(null)
  const [loadedCount, setLoadedCount] = useState(0)

  const handleLoad = useCallback(() => {
    setLoadedCount((prev) => prev + 1)
  }, [])

  useEffect(() => {
    if (loadedCount === mediaList.length) {
      let totalHeight = 0
      for (let i = 0; i < imgRefs.current.length; i++) {
        const img = imgRefs.current[i]
        if (img) {
          totalHeight += img.clientHeight
          if (totalHeight > 1000) {
            setStopIndex(i - 1)
            break
          }
        }
      }
    }
  }, [loadedCount, mediaList.length])

  return (
    <div className="h-fit flex justify-center items-center">
      {mediaList.length > 0 && (
        <div
          className={`max-h-[380px] w-[380px] sm:max-h-[500px] sm:w-[500px] overflow-clip flex 
            ${mediaList.length > 2 ? 'flex-col h-[500px] flex-wrap' : 'flex-row'} `}
        >
          {mediaList.map((e, i) => {
            if (stopIndex !== null && i > stopIndex) {
              return null
            }
            if (e.type === 'image') {
              return (
                <Link
                  to={e?.owner == 'subPost' ? `/photo/${e?.media?.userPostPhotoId}` : `/media/${postData?.userPostId}`}
                  className={`relative grow order-${i % 2}`}
                  key={i}
                  // key={e?.media?.userPostPhotoId || e?.media?.photoId}
                  ref={(el) => (imgRefs.current[i] = el)}
                >
                  <img
                    src={e?.media?.photo?.photoUrl || e?.media?.photoUrl}
                    alt="post-img"
                    loading="lazy"
                    onLoad={handleLoad}
                    className={`${mediaList.length >= 2 && 'max-w-[189px] sm:max-w-[249px]'} object-cover h-full p-[1px] border`}
                  />
                  {i === stopIndex && (
                    <div className="bg-[rgba(0,0,0,0.5)] absolute right-0 top-0 bottom-0 left-0 text-white text-3xl font-bold flex justify-center items-center">
                      <span>+{mediaList.length - i + 1}</span>
                    </div>
                  )}
                </Link>
              );
            } else {
              return (
                <Link
                  to={e?.owner == 'subPost' ? `/video/${e?.media?.userPostVideoId}` : `/media/${postData.userPostId}`}
                  className={`relative grow order-${i % 2}`}
                  key={i}
                  // key={e?.media?.userPostVideoId || e?.media?.videoId}
                  ref={(el) => (imgRefs.current[i] = el)}
                >
                  <video
                    controls
                    src={e?.media?.video?.videoUrl || e?.media?.videoUrl}
                    onLoadedData={handleLoad}
                    className={`${mediaList.length >= 2 ? 'max-w-[189px] sm:max-w-[249px]' : 'w-full'} object-cover h-full p-[1px] border`}
                  />
                  {i === stopIndex && (
                    <div className="bg-[rgba(0,0,0,0.5)] absolute right-0 top-0 bottom-0 left-0 text-white text-3xl font-bold flex justify-center items-center">
                      <span>+{mediaList.length - i + 1}</span>
                    </div>
                  )}
                </Link>
              )
            }
          })}
        </div>
      )}
    </div>
  )
}

export default PostMedia