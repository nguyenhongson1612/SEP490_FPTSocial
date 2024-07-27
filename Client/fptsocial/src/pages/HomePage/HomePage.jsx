import { useEffect, useState } from 'react'
import ListPost from '~/components/ListPost/ListPost'
import NavTopBar from '~/components/NavTopBar/NavTopBar'
import HomeLeftSideBar from './HomeLeftSideBar/HomeLeftSideBar'
import HomeRightSideBar from './HomeRightSideBar/HomeRightSideBar'
import { useDispatch, useSelector } from 'react-redux'
import { selectCurrentUser } from '~/redux/user/userSlice'
import NewPost from '~/components/Modal/NewPost/NewPost'
import { selectIsShowHomeLeftSideBar } from '~/redux/ui/uiSlice'
import { POST_TYPES } from '~/utils/constants'

function HomePage() {
  const user = useSelector(selectCurrentUser)
  const isShowHomeLeftSideBar = useSelector(selectIsShowHomeLeftSideBar)

  return (
    <>
      <NavTopBar />
      <div className={`flex bg-fbWhite ${!isShowHomeLeftSideBar && 'justify-center'} h-[calc(100vh_-_55px)] overflow-hidden`}>
        <HomeLeftSideBar isShowHomeLeftSideBar={isShowHomeLeftSideBar} user={user} />
        {
          !isShowHomeLeftSideBar && <>
            <div className='h-[calc(100vh_-_55px)] basis-11/12 md:basis-9/12 xl:basis-6/12 overflow-y-auto scrollbar-none-track
              flex flex-col items-center gap-4'>
              <div className='mt-8'>
                <NewPost postType={POST_TYPES.PROFILE_POST} />
              </div>
              <ListPost />
            </div>
            <HomeRightSideBar />
          </>
        }
      </div>
    </>


  )
}

export default HomePage