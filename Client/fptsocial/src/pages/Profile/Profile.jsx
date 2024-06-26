import { useEffect, useState } from 'react'
import { getAllPost, getButtonFriend, getOtherUserByUserId, getUserByUserId, getUserPostByUserId } from '~/apis'
import NavTopBar from '~/components/NavTopBar/NavTopBar'
import TopProfile from './TopProfile/TopProfile'
import ContentProfile from './ContentProfile/ContentProfile'
import UpdateProfile from './UpdateProfile/UpdateProfile'
import { useSelector } from 'react-redux'
import { selectCurrentUser } from '~/redux/user/userSlice'
import { useDisclosure } from '@mantine/hooks'
import { Modal, ScrollArea } from '@mantine/core'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { set } from 'lodash'

function Profile() {
  const [update, setUpdate] = useState(false)
  const [listPost, setListPost] = useState(null)
  const [userProfile, setUserProfile] = useState(null)
  const [opened, { open, close }] = useDisclosure(false)
  const currentUser = useSelector(selectCurrentUser)
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const userIdCurrent = currentUser?.userId
  const userIdPram = searchParams.get('id')
  const [buttonProfile, setButtonProfile] = useState({})

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
          <TopProfile open={open} user={userProfile} currentUser={currentUser} buttonProfile={buttonProfile} forceUpdate={forceUpdate} />
          <ContentProfile listPost={listPost} user={userProfile} />
          <Modal
            classNames={{
              // inner: 'xs:p-0 flex  xs:!items-center',
              content: '!overflow-y-clip'
            }}
            opened={opened}
            onClose={close}
            withCloseButton={false}
            padding={0}
            scrollAreaComponent={ScrollArea.Autosize}
          >
            <UpdateProfile user={userProfile} onClose={close} navigate={navigate} />
          </Modal>
        </div>
      </div>
    </>
  );
}

export default Profile;