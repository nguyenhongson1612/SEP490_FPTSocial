import { useEffect, useState } from 'react'
import NavTopBar from '~/components/NavTopBar/NavTopBar'
import TopProfile from './TopProfile/TopProfile'
import ContentProfile from './ContentProfile/ContentProfile'
import UpdateProfile from './UpdateProfile/UpdateProfile'
import { useSelector } from 'react-redux'
import { selectCurrentUser } from '~/redux/user/userSlice'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Modal } from '@mui/material'
import { getAllFriend, getAllFriendOtherProfile, getButtonFriend, getOtherUserByUserId } from '~/apis'
import { getOtherUserPost, getUserPostByUserId } from '~/apis/postApis'
import { selectIsReload } from '~/redux/ui/uiSlice'

function Profile() {
  const [update, setUpdate] = useState(false)
  const [listPost, setListPost] = useState(null)
  const [userProfile, setUserProfile] = useState(null)
  const [buttonProfile, setButtonProfile] = useState({})
  const [isOpenModalUpdateProfile, setIsOpenModalUpdateProfile] = useState(false)
  const [listFriend, setListFriend] = useState([])

  const currentUser = useSelector(selectCurrentUser)
  const isReload = useSelector(selectIsReload)
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const currentUserId = currentUser?.userId
  const paramUserId = searchParams.get('id')

  const forceUpdate = () => setUpdate(!update)
  useEffect(() => {
    if (currentUserId === paramUserId) {
      setUserProfile(currentUser)
      getAllFriend().then(data => setListFriend(data))
      getUserPostByUserId().then((data) => setListPost(data?.result))
    }
    else {
      getOtherUserByUserId({ userId: currentUserId, viewUserId: paramUserId })
        .then(res => setUserProfile(res))
        .catch(() => navigate('/notavailable'))
      getOtherUserPost(paramUserId).then((data) => setListPost(data?.result))
      getAllFriendOtherProfile(paramUserId).then(data => setListFriend(data))
    }
  }, [paramUserId, isReload, currentUser])

  useEffect(() => {
    userProfile && getButtonFriend(currentUser?.userId, userProfile.userId)
      .then(res => setButtonProfile(res))
  }, [update, userProfile])

  return (
    <>
      <div className="relative">
        <NavTopBar />
        <div className="">
          <TopProfile listFriend={listFriend} setIsOpenModalUpdateProfile={setIsOpenModalUpdateProfile} user={userProfile} currentUser={currentUser} buttonProfile={buttonProfile} forceUpdate={forceUpdate} />
          <ContentProfile listPost={listPost} user={userProfile} />
        </div>
        <Modal
          open={isOpenModalUpdateProfile}
          onClose={() => setIsOpenModalUpdateProfile(false)}
          sx={{ overflowY: 'auto' }}
        >
          <div className='bg-white w-full md:w-fit absolute rounded-md  left-1/2 -translate-x-1/2 mt-5 '>
            <UpdateProfile user={userProfile} onClose={close} setIsOpenModalUpdateProfile={setIsOpenModalUpdateProfile} />
          </div>
        </Modal>
      </div >
    </>
  )
}

export default Profile;