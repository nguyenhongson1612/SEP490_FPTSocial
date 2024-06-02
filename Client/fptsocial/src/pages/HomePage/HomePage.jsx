import { useEffect, useState } from 'react'
import { getAllPost } from '~/apis'
import ListPost from '~/components/ListPost/ListPost'
import NavTopBar from '~/components/NavTopBar/NavTopBar'
import HomeLeftSideBar from './HomeLeftSideBar/HomeLeftSideBar'
import HomeRightSideBar from './HomeRightSideBar/HomeRightSideBar'

function HomePage() {
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
      <div className='flex bg-fbWhite justify-center lg:justify-around'>
        <HomeLeftSideBar />
        <div className='max-h-[calc(100vh_-_55px)]  basis-11/12 md:basis-8/12 lg:basis-6/12 overflow-y-auto scrollbar-none-track'>
          <ListPost listPost={listPost} />
        </div>
        <HomeRightSideBar />
      </div>
    </>


  )
}

export default HomePage