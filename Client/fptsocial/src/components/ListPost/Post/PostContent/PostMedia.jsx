import { useEffect, useRef, useState, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { POST_TYPES } from '~/utils/constants'

function PostMedia({ postData, postType }) {
  // console.log('🚀 ~ PostMedia ~ postType:', postType)
  // console.log('🚀 ~ PostMedia ~ postData:', postData)
  const mediaList = postType == POST_TYPES.PROFILE_POST
    ? [
      ...(postData?.userPostPhotos || postData?.userPostPhoto)?.map(e => ({ type: 'image', owner: 'subPost', media: e, typePost: POST_TYPES.PHOTO_POST })) ?? [],
      ...(postData?.userPostVideos || postData?.userPostVideo)?.map(e => ({ type: 'video', owner: 'subPost', media: e, typePost: POST_TYPES.VIDEO_POST })) ?? []
    ]
    : [
      ...postData?.groupPostPhoto?.map(e => ({ type: 'image', owner: 'subPost', media: e, typePost: POST_TYPES.GROUP_PHOTO_POST })) ?? [],
      ...postData?.groupPostVideo?.map(e => ({ type: 'video', owner: 'subPost', media: e, typePost: POST_TYPES.GROUP_VIDEO_POST })) ?? []
    ]

  if (postType == POST_TYPES.PROFILE_POST) {
    if (postData?.photo) mediaList.unshift({ type: 'image', owner: 'mainPost', media: postData?.photo, typePost: POST_TYPES.PROFILE_POST })
    if (postData?.video) mediaList.push({ type: 'video', owner: 'mainPost', media: postData?.video, typePost: POST_TYPES.PROFILE_POST })
  } else {
    if (postData?.groupPhoto) mediaList.unshift({ type: 'image', owner: 'mainPost', media: postData?.groupPhoto, typePost: POST_TYPES.GROUP_POST })
    if (postData?.groupVideo) mediaList.push({ type: 'video', owner: 'mainPost', media: postData?.groupVideo, typePost: POST_TYPES.GROUP_POST })
  }

  // console.log('🚀 ~ PostMedia ~ mediaList:', mediaList)

  const imgRefs = useRef([])
  const [stopIndex, setStopIndex] = useState(null)
  const [isStop, setIsStop] = useState(false)
  const [loadedCount, setLoadedCount] = useState(0)

  const handleLoad = useCallback(() => {
    setLoadedCount((prev) => prev + 1)
  }, [])

  const [mediaheight, setMediaHeight] = useState(500)
  useEffect(() => {
    const mediaScale = document.getElementById('media-container')?.offsetWidth
    // console.log('🚀 ~ useEffect ~ mediaScale:', mediaScale)
    // console.log('🚀 ~ useEffect ~ imgRefs.current.length:', imgRefs.current.length, mediaScale * 2)

    setMediaHeight(mediaScale)
    if (loadedCount === mediaList.length) {
      let totalHeight = 0
      for (let i = 0; i < imgRefs.current.length; i++) {
        const img = imgRefs.current[i]
        if (img) {
          totalHeight += img.clientHeight
          // console.log('🚀 ~ useEffect ~ img.clientHeight:', img.clientHeight)
          // console.log('🚀 ~ useEffect ~ totalHeight:', totalHeight)
          if (totalHeight > mediaScale * 2 + 30) {
            // console.log(i - 1);
            setStopIndex(i - 1)
            break
          }
          else if (i == (imgRefs.current.length - 1)) {
            setIsStop(true)
          }
        }
      }
    }
  }, [loadedCount, mediaList.length])

  return (
    <div className="flex justify-center items-center w-full">
      {mediaList.length > 0 && (
        <div
          id='media-container'
          className={` w-full overflow-clip flex 
           ${mediaList.length > 2 ? 'flex-col flex-wrap' : 'flex-row'}`}
          style={{
            height: mediaList?.length > 2 ? (mediaheight) + 'px'
              : mediaList?.length == 2 ? (mediaheight) / 2 + 'px'
                : ''
          }}
        >
          {mediaList.map((e, i) => {
            if (stopIndex !== null && i > stopIndex) {
              return null
            }
            const media = e?.media
            if (e.type === 'image') {
              return (
                <Link
                  to={e?.owner == 'subPost' ? `/photo/${media?.userPostPhotoId || media?.groupPostPhotoId}?type=${e?.typePost}`
                    : `/media/${postData?.userPostId || postData?.groupPostId || postData?.postId}?type=${e?.typePost}`}
                  className={`relative grow w-1/2 ${(mediaList?.length <= 2 || (isStop && loadedCount == 3 && i == 1)) ? 'h-full' : 'max-h-[50%]'}`}
                  style={{ order: i % 2 }}
                  key={i}
                  ref={(el) => (imgRefs.current[i] = el)}
                >
                  <img
                    src={media?.photo?.photoUrl || media?.photoUrl || media?.groupPhoto?.photoUrl}
                    alt="post-img"
                    loading="lazy"
                    onLoad={handleLoad}
                    className="object-cover w-full h-full border"
                  />
                  {i === stopIndex && (
                    <div className="bg-[rgba(0,0,0,0.5)] absolute right-0 top-0 bottom-0 left-0 text-white text-3xl font-bold flex justify-center items-center">
                      <span>+{mediaList.length - i - 1}</span>
                    </div>
                  )}
                </Link>
              )
            } else {
              return (
                <Link
                  to={e?.owner == 'subPost' ? `/video/${media?.userPostVideoId || media?.groupPostVideoId}?type=${e?.typePost}`
                    : `/media/${postData.userPostId || postData?.groupPostId || postData?.postId}?type=${e?.typePost}`}
                  className={`relative grow w-1/2 ${(mediaList?.length <= 2 || (isStop && loadedCount == 3 && i == 1)) ? 'h-full' : 'max-h-[50%]'}`}
                  style={{ order: i % 2 }}
                  key={i}
                  ref={(el) => (imgRefs.current[i] = el)}
                >
                  <video
                    controls
                    src={media?.video?.videoUrl || media?.videoUrl || media?.groupVideo?.videoUrl}
                    onLoadedData={handleLoad}
                    className=" object-cover h-full border"
                  />
                  {i === stopIndex && (mediaList?.length - i - 1) != 0 && (
                    <div className="bg-[rgba(0,0,0,0.5)] absolute right-0 top-0 bottom-0 left-0 text-white text-3xl font-bold flex justify-center items-center">
                      <span>+{mediaList.length - i - 1}</span>
                    </div>
                  )}
                </Link>
              )
            }
          })}
        </div>
      )
      }
    </div >
  )
}

export default PostMedia