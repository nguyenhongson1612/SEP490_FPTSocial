import { useEffect, useState } from 'react'
import { getAllPost } from '~/apis'
import NavTopBar from '~/components/NavTopBar/NavTopBar'
import TopProfile from './TopProfile/TopProfile'
import ContentProfile from './ContentProfile/ContentProfile'
import UpdateProfile from './UpdateProfile/UpdateProfile'
import { useSelector } from 'react-redux'
import { selectCurrentUser } from '~/redux/user/userSlice'

function Profile() {
  const [listPost, setListPost] = useState(null)
  const [openProfile, setOpenProfile] = useState(false)
  const user = useSelector(selectCurrentUser)


  useEffect(() => {
    // Call API
    getAllPost().then(data => {
      // console.log('🚀 ~ getAllPost ~ data:', data)
      setListPost(data)
    })
  }, [])

  const handleUpdateProfile = () => {
    setOpenProfile(!openProfile)
  }

  return (
    <>
      <div className='relative'>
        <NavTopBar />
        <div className={` ${openProfile && 'max-h-[calc(100vh_-_55px)] overflow-y-clip'}`}>
          <TopProfile handleUpdateProfile={handleUpdateProfile} user={user} />
          <ContentProfile listPost={listPost} user={user} />
          {
            openProfile && (
              <UpdateProfile handleUpdateProfile={handleUpdateProfile} />
            )
          }
        </div>
      </div>
    </>
  )
}

export default Profile