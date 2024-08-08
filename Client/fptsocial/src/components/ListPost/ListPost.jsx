import { useDispatch, useSelector } from 'react-redux'
import ActivePost from '../Modal/ActivePost/ActivePost'
import Post from './Post/Post'
import { useEffect, useState } from 'react'
import UpdatePost from '../Modal/ActivePost/UpdatePost'
import { selectIsShowModalActivePost, selectIsShowModalSharePost, selectIsShowModalUpdatePost } from '~/redux/activePost/activePostSlice'
import SharePost from '../Modal/ActivePost/SharePost'
import PageLoadingSpinner from '../Loading/PageLoadingSpinner'
import InfiniteScroll from '../IntersectionObserver/InfiniteScroll'
import { addCurrentActiveListPost, clearCurrentActiveListPost, selectCurrentActiveListPost, selectTotalPage } from '~/redux/activeListPost/activeListPostSlice'
import Report from '../Modal/Report/Report'
import { selectIsOpenReport } from '~/redux/report/reportSlice'
import { selectIsReload } from '~/redux/ui/uiSlice'
import { getStatus } from '~/apis'
import { getAllReactType } from '~/apis/reactApis'
import { addListReactType, addListUserStatus } from '~/redux/sideData/sideDataSlice'
import SearchNotFound from '../UI/SearchNotFound'

function ListPost({ getListPostFn }) {
  const currentActiveListPost = useSelector(selectCurrentActiveListPost)
  const [page, setPage] = useState(1)
  const totalPage = useSelector(selectTotalPage)
  const dispatch = useDispatch()
  const isReload = useSelector(selectIsReload)
  // const [isLoading, setIsLoading] = useSelector(true)

  const isShowActivePost = useSelector(selectIsShowModalActivePost)
  const isShowUpdatePost = useSelector(selectIsShowModalUpdatePost)
  const isShowSharePost = useSelector(selectIsShowModalSharePost)
  const isShowModalReport = useSelector(selectIsOpenReport)

  useEffect(() => {
    getStatus().then(data => dispatch(addListUserStatus(data)))
    getAllReactType().then(data => dispatch(addListReactType(data)))
  }, [])

  useEffect(() => {
    getListPostFn &&
      getListPostFn({ page: page }).then((res) => dispatch(addCurrentActiveListPost({ result: res?.result || res.userPosts, totalPage: res?.totalPage })))
  }, [isReload, getListPostFn, page,])

  return (
    <div id="post-list"
      className="relative min-h-[1000px]"
    >
      {isShowActivePost && <ActivePost />}
      {isShowUpdatePost && <UpdatePost />}
      {isShowSharePost && <SharePost />}
      {isShowModalReport && <Report />}

      {!currentActiveListPost ?
        <div className='absolute flex items-center top-[100px] left-1/2 -translate-x-1/2 '>
          <PageLoadingSpinner />
        </div>
        : currentActiveListPost?.length == 0 && <SearchNotFound isNoneData={true} />
      }
      {
        currentActiveListPost?.length > 0 &&
        <InfiniteScroll
          // className="w-[800px] mx-auto my-10"
          className=""
          fetchMore={() => setPage((prev) => prev + 1)}
          hasMore={page < totalPage}
          endMessage={'You have seen it all'}
        >
          <div className='flex flex-col items-center gap-5'>
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