import { useEffect, useState } from 'react'
import { getButtonFriend, getOtherUserByUserId, getUserPostByUserId } from '~/apis'
import NavTopBar from '~/components/NavTopBar/NavTopBar'
import TopProfile from './TopProfile/TopProfile'
import ContentProfile from './ContentProfile/ContentProfile'
import UpdateProfile from './UpdateProfile/UpdateProfile'
import { useSelector } from 'react-redux'
import { selectCurrentUser } from '~/redux/user/userSlice'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Modal } from '@mui/material'

function Profile() {
  const [update, setUpdate] = useState(false)
  const [listPost, setListPost] = useState(null)
  const [userProfile, setUserProfile] = useState(null)
  const currentUser = useSelector(selectCurrentUser)
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const userIdCurrent = currentUser?.userId
  const userIdPram = searchParams.get('id')
  const [buttonProfile, setButtonProfile] = useState({})
  const [isOpenModalUpdateProfile, setIsOpenModalUpdateProfile] = useState(false)

  const forceUpdate = () => setUpdate(!update)
  useEffect(() => {
    if (userIdCurrent === userIdPram)
      setUserProfile(currentUser)
    else
      getOtherUserByUserId({ userId: userIdCurrent, viewUserId: userIdPram })
        .then(res => setUserProfile(res))
        .catch(() => navigate('/notavailable'))
    getUserPostByUserId(userIdCurrent).then((data) => setListPost(data))
  }, [])

  useEffect(() => {
    userProfile && getButtonFriend(currentUser?.userId, userProfile.userId)
      .then(res => setButtonProfile(res))
  }, [update, userProfile])

  return (
    <>
      <div className="relative">
        <NavTopBar />
        <div className="">
          <TopProfile setIsOpenModalUpdateProfile={setIsOpenModalUpdateProfile} user={userProfile} currentUser={currentUser} buttonProfile={buttonProfile} forceUpdate={forceUpdate} />
          <ContentProfile listPost={listPost} user={userProfile} />

        </div>
        <Modal
          open={isOpenModalUpdateProfile}
          onClose={() => setIsOpenModalUpdateProfile(false)}
          sx={{ overflowY: 'auto' }}
        >
          <div className='bg-white w-full md:w-fit absolute rounded-md  left-1/2 -translate-x-1/2 mt-5 '>
            <UpdateProfile user={userProfile} onClose={close} navigate={navigate} setIsOpenModalUpdateProfile={setIsOpenModalUpdateProfile} />
          </div>
        </Modal>
      </div >
    </>
  )
}

export default Profile;