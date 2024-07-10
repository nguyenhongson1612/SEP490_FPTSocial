import { useEffect, useState } from 'react'
import ListPost from '~/components/ListPost/ListPost'
import NavTopBar from '~/components/NavTopBar/NavTopBar'
import HomeLeftSideBar from './HomeLeftSideBar/HomeLeftSideBar'
import HomeRightSideBar from './HomeRightSideBar/HomeRightSideBar'
import { useDispatch, useSelector } from 'react-redux'
import { selectCurrentUser } from '~/redux/user/userSlice'
import PageLoadingSpinner from '~/components/Loading/PageLoadingSpinner'
import NewPost from '~/components/NewPost/NewPost'
import { selectIsShowHomeLeftSideBar } from '~/redux/ui/uiSlice'
import InfiniteScroll from '~/components/IntersectionObserver/InfiniteScroll'
import { getAllPost } from '~/apis/postApis'

function HomePage() {
  const user = useSelector(selectCurrentUser)
  const [listPost, setListPost] = useState([])
  const isShowHomeLeftSideBar = useSelector(selectIsShowHomeLeftSideBar)
  const [page, setPage] = useState(1)
  const [totalRows, setTotalRows] = useState(0)

  useEffect(() => {
    (async () => {
      const response = await getAllPost(page, 10)
      setListPost([...listPost, ...response])
      // setTotalRows(response.pagination._totalRows)
    })()
  }, [page])

  // useEffect(() => {
  //   // Call API
  //   getAllPost().then(data => {
  //     // console.log('🚀 ~ getAllPost ~ data:', data)
  //     setListPost(data)
  //   })
  // }, [])

  // useEffect(() => {
  //   checkUserExist().then(res => console.log(res))
  // }, [dispatch])

  return (
    <>
      <NavTopBar />
      <div className={`flex bg-fbWhite ${!isShowHomeLeftSideBar && 'justify-center'}`}>
        <HomeLeftSideBar isShowHomeLeftSideBar={isShowHomeLeftSideBar} user={user} />
        {
          !isShowHomeLeftSideBar && <>
            <div className='h-[calc(100vh_-_55px)] basis-11/12 md:basis-9/12 xl:basis-6/12 overflow-y-auto scrollbar-none-track
              flex flex-col items-center gap-4'>
              <NewPost />
              {/* {!listPost && <PageLoadingSpinner />} */}
              <InfiniteScroll
                // className="w-[800px] mx-auto my-10"
                className="min-h-[3000px]"
                fetchMore={() => setPage((prev) => prev + 1)}
                // hasMore={listPost.length < totalRows}
                hasMore={true}
                endMessage={<p>You have seen it all</p>}
              >
                <ListPost listPost={listPost} />
              </InfiniteScroll>
            </div>
            <HomeRightSideBar />
          </>
        }
      </div>
    </>


  )
}

export default HomePage