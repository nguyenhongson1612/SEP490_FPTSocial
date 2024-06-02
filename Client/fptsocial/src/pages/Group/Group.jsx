import ListPost from '~/components/ListPost/ListPost'
import NavTopBar from '~/components/NavTopBar/NavTopBar'
import GroupSideBar from './GroupSideBar/GroupSideBar'
import { useLocation } from 'react-router-dom'
import GroupCreate from './GroupCreate/GroupCreate'


function Group() {
  const location = useLocation()
  const isCreate = location.pathname === '/groups/create'
  const isFeed = location.pathname === '/groups' || location.pathname === '/groups/feed'

  return (
    <>
      <NavTopBar />
      <div className='flex h-[calc(100vh_-_55px)] bg-white'>
        {!isCreate && <GroupSideBar />}
        {isFeed && <ListPost />}
        {isCreate && <GroupCreate />}
      </div>
    </>
  )
}

export default Group
