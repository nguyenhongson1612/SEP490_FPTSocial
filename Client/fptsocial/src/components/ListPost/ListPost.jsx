import { useDispatch, useSelector } from 'react-redux'
import ActivePost from '../Modal/ActivePost/ActivePost'
import Post from './Post/Post'
import { selectCurrentUser } from '~/redux/user/userSlice'
import { useLocation, useParams, useSearchParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { getStatus } from '~/apis'
import { getAllReactByPhotoPostId, getAllReactByPostId, getAllReactBySharePostId, getAllReactByVideoPostId, getAllReactType } from '~/apis/reactApis'
import UpdatePost from '../Modal/ActivePost/UpdatePost'
import { selectIsShowModalActivePost, selectIsShowModalSharePost, selectIsShowModalUpdatePost } from '~/redux/activePost/activePostSlice'
import { addListReactType, addListUserStatus } from '~/redux/sideData/sideDataSlice'
import SharePost from '../Modal/ActivePost/SharePost'
import PageLoadingSpinner from '../Loading/PageLoadingSpinner'
import InfiniteScroll from '../IntersectionObserver/InfiniteScroll'
import { addCurrentActiveListPost, clearCurrentActiveListPost, selectCurrentActiveListPost, selectTotalPage, updateCurrentActiveListPost } from '~/redux/activeListPost/activeListPostSlice'
import { POST_TYPES } from '~/utils/constants'
import { getAllPost, getOtherUserPost, getUserPostByUserId } from '~/apis/postApis'
import { getAllReactByGroupPhotoPostId, getAllReactByGroupPostId, getAllReactByGroupSharePostId, getAllReactByGroupVideoPostId, getGroupPostByGroupId } from '~/apis/groupPostApis'
import { selectIsReload } from '~/redux/ui/uiSlice'
import Report from '../Modal/Report/Report'
import { selectIsOpenReport } from '~/redux/report/reportSlice'

function ListPost() {
  const currentUser = useSelector(selectCurrentUser)
  const currentActiveListPost = useSelector(selectCurrentActiveListPost)
  const dispatch = useDispatch()
  const location = useLocation()
  const [searchParams] = useSearchParams()
  const { groupId } = useParams()

  const [page, setPage] = useState(1)
  const totalPage = useSelector(selectTotalPage)

  const isInProfilePath = location.pathname === '/profile'
  const isInHomePath = location.pathname === '/homepage'
  const isInGroupPath = /^\/groups\/\w+\/?.*$/.test(location.pathname)

  const paramUserId = isInProfilePath && searchParams.get('id')
  const isYourProfile = currentUser?.userId === paramUserId

  const isShowActivePost = useSelector(selectIsShowModalActivePost)
  const isShowUpdatePost = useSelector(selectIsShowModalUpdatePost)
  const isShowSharePost = useSelector(selectIsShowModalSharePost)
  const isShowModalReport = useSelector(selectIsOpenReport)
  const isReload = useSelector(selectIsReload)
  useEffect(() => {
    getStatus().then(data => dispatch(addListUserStatus(data)))
    getAllReactType().then(data => dispatch(addListReactType(data)))
  }, [])

  useEffect(() => {
    dispatch(clearCurrentActiveListPost())
  }, [isInHomePath, isInGroupPath, isInProfilePath])

  const handleGetReact = async (postData) => {
    let postType = ''
    if (currentActiveListPost?.isGroupPost || isInGroupPath || currentActiveListPost?.groupId) {
      if (currentActiveListPost?.isShare) postType = POST_TYPES.GROUP_SHARE_POST
      else postType = POST_TYPES.GROUP_POST
    } else if (currentActiveListPost?.isShare) postType = POST_TYPES.SHARE_POST
    else postType = POST_TYPES.PROFILE_POST
    const isProfile = postType == POST_TYPES.PROFILE_POST
    const isShare = postType == POST_TYPES.SHARE_POST
    const isPhoto = postType == POST_TYPES.PHOTO_POST
    const isVideo = postType == POST_TYPES.VIDEO_POST
    const isGroup = postType == POST_TYPES.GROUP_POST
    const isGroupShare = postType == POST_TYPES.GROUP_SHARE_POST
    const isGroupPhoto = postType == POST_TYPES.GROUP_PHOTO_POST
    const isGroupVideo = postType == POST_TYPES.GROUP_VIDEO_POST

    const response = await (
      isPhoto ? getAllReactByPhotoPostId(postData?.userPostMediaId)
        : isVideo ? getAllReactByVideoPostId(postData?.userPostMediaId)
          : isProfile ? getAllReactByPostId(postData?.userPostId || postData?.postId)
            : isShare ? getAllReactBySharePostId(postData?.sharePostId || postData?.postId)
              : isGroup ? getAllReactByGroupPostId(postData?.groupPostId || postData?.postId)
                : isGroupShare ? getAllReactByGroupSharePostId(postData?.groupSharePostId || postData?.postId)
                  : isGroupPhoto ? getAllReactByGroupPhotoPostId(postData?.groupPostMediaId)
                    : isGroupVideo && getAllReactByGroupVideoPostId(postData?.groupPostMediaId)
    )
    return response
  }

  useEffect(() => {
    (async () => {
      let response
      if (isInHomePath) {
        response = await getAllPost(page, 10)
      } else if (isInGroupPath) {
        console.log(page);
        response = await getGroupPostByGroupId({ groupId: groupId, page: page })
      } else if (isInProfilePath) {
        if (currentUser?.userId === paramUserId) response = await getUserPostByUserId()
        else response = await getOtherUserPost(paramUserId)
      }
      let dataListPost = response?.result?.map(post =>
        handleGetReact(post).then((status) => ({ ...post, postReactStatus: status }))
      )
      Promise.all(dataListPost)
        .then(results => {
          // console.log('🚀 ~ results:', results)
          if (isReload != 0)
            dispatch(updateCurrentActiveListPost(results))
          else
            dispatch(addCurrentActiveListPost({ result: results, totalPage: response?.totalPage }))
        })
        .catch(error => {
          console.error('Error processing posts:', error)
        })

    })()
  }, [page, isReload])


  return (
    <div id="post-list"
      className="relative min-h-[1000px]"
    >
      {isShowActivePost && <ActivePost />}
      {isShowUpdatePost && <UpdatePost />}
      {isShowSharePost && <SharePost />}
      {isShowModalReport && <Report />}

      {!currentActiveListPost &&
        <div className='absolute flex items-center top-[100px] left-1/2 -translate-x-1/2 '>
          <PageLoadingSpinner />
        </div>
      }
      {
        currentActiveListPost &&
        <InfiniteScroll
          // className="w-[800px] mx-auto my-10"
          className=""
          fetchMore={() => setPage((prev) => prev + 1)}
          hasMore={page < totalPage}
          endMessage={'You have seen it all'}
        >
          <div className='flex flex-col items-center gap-3'>
            {currentActiveListPost?.map((post, key) => {
              return <Post
                key={key}
                postData={post} />
            })}
          </div>
        </InfiniteScroll>
      }


    </div>
  )
}

export default ListPost