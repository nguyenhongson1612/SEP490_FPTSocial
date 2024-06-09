import { useEffect, useState } from 'react'
import { getAllPost } from '~/apis'
import ListPost from '~/components/ListPost/ListPost'
import NavTopBar from '~/components/NavTopBar/NavTopBar'
import HomeLeftSideBar from './HomeLeftSideBar/HomeLeftSideBar'
import HomeRightSideBar from './HomeRightSideBar/HomeRightSideBar'
import { useDispatch, useSelector } from 'react-redux'
import { getUserByNumberAPI, selectCurrentUser } from '~/redux/user/userSlice'

function HomePage() {
  const user = useSelector(selectCurrentUser)
  const [listPost, setListPost] = useState(null)
  const dispatch = useDispatch()
  useEffect(() => {
    // Call API
    getAllPost().then(data => {
      // console.log('🚀 ~ getAllPost ~ data:', data)
      setListPost(data)
    })
  }, [])

  useEffect(() => {
    dispatch(getUserByNumberAPI())
  }, [dispatch])
  useEffect(() => {
    console.log(user);
  }, [user])


  return (
    <>
      <NavTopBar />
      <div className='flex bg-fbWhite justify-center lg:justify-around'>
        <HomeLeftSideBar user={user} />
        <div className='max-h-[calc(100vh_-_55px)]  basis-11/12 md:basis-8/12 lg:basis-6/12 overflow-y-auto scrollbar-none-track'>
          <ListPost listPost={listPost} />
        </div>
        <HomeRightSideBar />
      </div>
    </>


  )
}

export default HomePage