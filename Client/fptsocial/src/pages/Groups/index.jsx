import ListPost from '~/components/ListPost/ListPost'
import NavTopBar from '~/components/NavTopBar/NavTopBar'
import GroupSideBar from './GroupSideBar/GroupSideBar'
import { useLocation } from 'react-router-dom'
import GroupCreate from './GroupCreate/GroupCreate'
import { useEffect, useState } from 'react'
import { getAllPost } from '~/apis/postApis'


function Groups() {
  const location = useLocation()
  const isCreate = location.pathname === '/groups/create'
  const isFeed = location.pathname === '/groups' || location.pathname === '/groups/feed'
  const [listPost, setListPost] = useState(null)
  useEffect(() => {
    // Call API
    getAllPost().then(data => {
      // console.log('🚀 ~ getAllPost ~ data:', data)
      setListPost(data)
    })
  }, [])
  return (
    <>
      <NavTopBar />
      <div className='flex h-[calc(100vh_-_55px)] bg-fbWhite'>
        <GroupSideBar />
        {isFeed && <div className='max-h-[calc(100vh_-_55px)]  basis-11/12 md:basis-8/12 lg:basis-6/12 overflow-y-auto scrollbar-none-track'>
          <ListPost listPost={listPost} />
        </div>}
        {isCreate && <GroupCreate />}
      </div>
    </>
  )
}

export default Groups
