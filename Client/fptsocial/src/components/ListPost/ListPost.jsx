import { useSelector } from 'react-redux'
import ActivePost from '../Modal/ActivePost/ActivePost'
import Post from './Post/Post'
import { selectCurrentUser } from '~/redux/user/userSlice'
import { useLocation, useSearchParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { getStatus } from '~/apis'

function ListPost({ listPost }) {
  const currentUser = useSelector(selectCurrentUser)
  const location = useLocation()
  const [searchParams] = useSearchParams()
  const [listStatus, setListStatus] = useState([])

  const isProfile = location.pathname === '/profile'
  const paramUserId = isProfile && searchParams.get('id')
  const isYourProfile = currentUser?.userId === paramUserId
  useEffect(() => {
    if (isYourProfile)
      getStatus().then(data => setListStatus(data))
  }, [])


  return (
    <div id="post-list"
      className="flex flex-col items-center gap-3 w-full sm:w-[500px]"
    >
      <ActivePost />
      {
        listPost?.map((post, key) => {
          return <Post
            isYourProfile={isYourProfile}
            listStatus={listStatus}
            key={key}
            postData={post} />
        })
      }
    </div>
  )
}

export default ListPost