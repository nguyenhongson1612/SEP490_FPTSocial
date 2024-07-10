import NavTopBar from '~/components/NavTopBar/NavTopBar'
import { useLocation } from 'react-router-dom'
import { useEffect, useState } from 'react'
import FriendRequests from './FriendRequests/FriendRequests'
import FriendSuggestions from './FriendSuggestions/FriendSuggestions'
import FriendList from './FriendList/FriendList'
import FriendsSideBar from './FriendsSideBar/FriendsSideBar'
import { getAllPost } from '~/apis/postApis'


function Friends() {
  const location = useLocation()
  const isRequests = location.pathname === '/friends/requests'
  const isSuggestions = location.pathname === '/friends/suggestions'
  const isFriendList = location.pathname === '/friends/list'
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
      <div className='flex h-[calc(100vh_-_55px)] bg-whites'>
        <FriendsSideBar isFriendList={isFriendList} isRequests={isRequests} isSuggestions={isSuggestions} />
        <div className='flex h-[calc(100vh_-_55px)] bg-fbWhite w-full overflow-y-auto'>
          {isRequests && <FriendRequests />}
          {isSuggestions && <FriendSuggestions />}
          {isFriendList && <FriendList />}
        </div>
      </div>
    </>
  )
}

export default Friends
