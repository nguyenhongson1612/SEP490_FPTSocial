import NavTopBar from '~/components/NavTopBar/NavTopBar'
import { useLocation } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { getAllPost } from '~/apis'
import FriendRequests from './FriendRequests/FriendRequests'
import FriendSuggestions from './FriendSuggestions/FriendSuggestions'
import FriendList from './FriendList/FriendList'
import FriendsSideBar from './FriendsSideBar/FriendsSideBar'


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
      <div className='flex h-[calc(100vh_-_55px)] bg-white'>
        <FriendsSideBar isFriendList={isFriendList} isRequests={isRequests} isSuggestions={isSuggestions} />
        {isRequests && <div className='max-h-[calc(100vh_-_55px)]  basis-11/12 md:basis-8/12 lg:basis-6/12 overflow-y-auto scrollbar-none-track'>
          <FriendRequests />
        </div>}
        {isSuggestions && <FriendSuggestions />}
        {isFriendList && <FriendList />}
      </div>
    </>
  )
}

export default Friends
