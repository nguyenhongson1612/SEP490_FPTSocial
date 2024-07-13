import ListPost from '~/components/ListPost/ListPost'
import NavTopBar from '~/components/NavTopBar/NavTopBar'
import GroupSideBar from './GroupSideBar/GroupSideBar'
import { Link, useLocation, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import GroupCreate from './GroupCreate/GroupCreate'
import { useEffect, useState } from 'react'
import { getAllFriend, getAllFriendOtherProfile, getButtonFriend, getOtherUserByUserId, sendFriend, updateFriendStatus } from '~/apis'
import { useConfirm } from 'material-ui-confirm'
import { useSelector } from 'react-redux'
import { selectCurrentUser } from '~/redux/user/userSlice'
import { IconArticle, IconCake, IconChevronDown, IconChevronUp, IconEdit, IconFriends, IconHeartFilled, IconHomeFilled, IconManFilled, IconPhoto, IconPlus, IconStack, IconUser, IconUserCheck, IconUserCircle, IconUserPlus, IconUserX } from '@tabler/icons-react'
import { Box, Button, Modal, Tab } from '@mui/material'
import ContentProfile from '../Profile/ContentProfile/ContentProfile'
import { TabContext, TabList, TabPanel } from '@mui/lab'
import ProfilePosts from '../Profile/ContentProfile/ProfilePosts'
import About from '../Profile/ContentProfile/About'
import NewPost from '~/components/NewPost/NewPost'
import GroupAvatar from '~/components/UI/GroupAvatar'
import { getGroupByGroupId } from '~/apis/groupApis'
import { handleCoverImg } from '~/utils/formatters'
import UserAvatar from '~/components/UI/UserAvatar'


function Group() {
  const [update, setUpdate] = useState(false)
  const [listPost, setListPost] = useState(null)
  const [userProfile, setUserProfile] = useState(null)
  const [buttonProfile, setButtonProfile] = useState({})
  const [isOpenModalUpdateProfile, setIsOpenModalUpdateProfile] = useState(false)
  const [listFriend, setListFriend] = useState([])
  const [isOpenSetting, setIsOpenSetting] = useState(false)

  const currentUser = useSelector(selectCurrentUser)
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const currentUserId = currentUser?.userId
  const paramUserId = searchParams.get('id')

  const { groupId } = useParams()
  const [group, setGroup] = useState({})

  useEffect(() => {
    getGroupByGroupId(groupId).then(data => setGroup(data))
  }, [groupId])

  const [value, setValue] = useState('1')
  const [value2, setValue2] = useState('manage')

  const handleChange = (event, newValue) => {
    setValue(newValue)
  }
  console.log(group);
  const forceUpdate = () => setUpdate(!update)
  useEffect(() => {

  }, [paramUserId])

  // const coverImage = currentUser?.coverImage;
  const backgroundStyle = handleCoverImg(group?.coverImage)

  const handleResponse = (data_) => {
    const data = {
      'userId': currentUser?.userId,
      'friendId': currentUser?.userId,
      ...data_
    }
    updateFriendStatus(data).then(forceUpdate)
  }

  const confirmUnfriend = useConfirm()
  const openDeleteModal = () =>
    confirmUnfriend({
      title: 'Unfriend this account?',
      description: ('Are you sure want to remove this account from friend list?'),
      confirmationText: 'Not anymore',
      cancellationText: 'Continue friend forever'
    }).then(() => handleResponse({
      'confirm': false,
      'cancle': false,
      'reject': true
    })).catch(() => { })

  return (
    <>
      <NavTopBar />
      <div className='flex h-[calc(100vh_-_55px)] overflow-clip'>
        <div className=" w-[380px] flex flex-col overflow-y-auto scrollbar-none-track border-r-4 shadow-xl bg-white z-10">
          <div className="flex items-center gap-2 border-b p-3">
            <div className=''>
              <GroupAvatar />
            </div>
            <div className='flex flex-col font-bold'>
              <span>
                {group?.groupName}
              </span>
              <div className='flex text-gray-500 text-sm gap-2'>
                <span className='font-thin'>private .</span>
                <span className=''>{group?.memberCount} member</span>
              </div>
            </div>
          </div>
          <div className="">
            <Box sx={{
              width: '100%',
              typography: 'body1',
              '.MuiTabs-flexContainer': { backgroundColor: 'white', display: 'flex', justifyContent: 'center' },
              '.MuiButtonBase-root': { display: 'flex', justifyContent: 'center' }
            }}>
              <TabContext value={value2}>
                <div>
                  <TabList onChange={(e, v) => setValue2(e.target.value)} >
                    <Tab iconPosition="start" label="Chat" value="chat" />
                    <Tab iconPosition="start" label="Manage" value="manage" />
                  </TabList>
                </div>
                <TabPanel value="chat">
                  chat
                </TabPanel>
                <TabPanel value="manage">
                  <div className=''>
                    <div className='border-b'>
                      <div className='w-full flex items-center gap-2 font-bold text-blue-500 bg-blue-100 py-3 px-2 rounded-md'>
                        <IconHomeFilled />
                        Group home
                      </div>
                      <div className='w-full flex items-center gap-2 font-bold py-3 px-2 rounded-md'>
                        <IconStack />
                        Overview
                      </div>
                    </div>
                    <div>
                      <div>
                        <div className='w-full flex justify-between items-center gap-2 font-bold py-3 px-2 rounded-md'>
                          <span className='text-gray-500'>Admin tools</span>
                          <IconChevronDown />
                        </div>
                      </div>

                      <div className='flex flex-col'>
                        <div className='w-full flex justify-between items-center gap-2 font-bold py-3 px-2 rounded-md cursor-pointer'
                          onClick={() => setIsOpenSetting(!isOpenSetting)}
                        >
                          <span className='text-gray-500'>Setting</span>
                          {isOpenSetting ? <IconChevronUp /> : <IconChevronDown />}
                        </div>
                        {
                          isOpenSetting && (
                            <div>
                              <div className='w-full flex items-center gap-2 font-bold py-3 px-2 rounded-md'>
                                <IconStack />
                                Overview
                              </div>
                              <div className='w-full flex items-center gap-2 font-bold py-3 px-2 rounded-md'>
                                <IconStack />
                                Overview
                              </div>
                              <div className='w-full flex items-center gap-2 font-bold py-3 px-2 rounded-md'>
                                <IconStack />
                                Overview
                              </div>
                            </div>
                          )
                        }
                      </div>
                    </div>
                  </div>
                </TabPanel>
              </TabContext>
            </Box>
          </div>
        </div>

        <div className="relative overflow-y-auto w-full">
          <div className="">
            <div id='top-profile'
              className='bg-white shadow-md w-full flex flex-col items-center'
            >
              <div
                id="holderCover"
                className="w-full lg:w-[940px] aspect-[74/27] rounded-md bg-cover bg-center bg-no-repeat"
                style={backgroundStyle}
              >
              </div>
              <div id=''
                className='w-full flex justify-center pb-4 border-b'
              >
                <div className='w-[70%] flex flex-col lg:flex-row items-center lg:items-end justify-center gap-4'>
                  <div id='name-friend'
                    className='w-full flex flex-col items-center lg:items-start justify-end mb-4 gap-1 px-4'
                  >
                    <span className='text-gray-900 font-bold text-3xl'>{group?.groupName}</span>
                    <div className='flex gap-3'>
                      <span className='text-gray-500 font-bold'>{group?.groupSettings?.find(e => e?.groupSettingName?.toLowerCase() == 'group status')?.groupStatusName}.</span>
                      <span className='text-gray-500 font-bold'>{group?.memberCount} member</span>
                    </div>
                    <div className="flex w-full justify-between items-center">
                      <div className='flex items-center [&>img:not(:first-child)]:-ml-4'>
                        {group?.groupMember?.map(member => (
                          <Link to={''} key={member?.userId}>
                            <UserAvatar isOther={true} avatarSrc={member?.avata} />
                          </Link>
                        ))}
                      </div>
                      <div>
                        <Button variant="contained" size="medium" startIcon={<IconPlus />}>
                          Invite
                        </Button>
                      </div>
                    </div>

                  </div>
                </div>
              </div>
            </div>
            <div
              id='content-profile'
              className='flex flex-col items-center lg:flex-row lg:justify-center lg:items-start w-full gap-3 bg-fbWhite'
            >
              <Box sx={{
                width: '100%',
                typography: 'body1',
                '.MuiTabs-flexContainer': { backgroundColor: 'white', display: 'flex', justifyContent: 'center' },
                '.MuiButtonBase-root': { display: 'flex', justifyContent: 'center' }
              }}>
                <TabContext value={value}>
                  <div>
                    <TabList onChange={handleChange} >
                      <Tab iconPosition="start" label="Discussion" value="1" />
                      <Tab iconPosition="start" label="Members" value="2" />
                      <Tab iconPosition="start" label="Events" value="3" />
                      <Tab iconPosition="start" label="Media" value="4" />
                    </TabList>
                  </div>
                  <TabPanel value="1">
                    <div id=''
                      className='flex flex-col items-center lg:flex-row lg:justify-center lg:items-start w-full gap-3 bg-fbWhite'>
                      <div className=' flex flex-col gap-3'>
                        <NewPost />
                        <ListPost listPost={listPost} />
                      </div>
                      <div
                        id='info'
                        className='w-full sm:w-[500px] lg:basis-3/12 h-fit bg-white mt-8 rounded-md shadow-md'>
                        <div className='flex flex-col p-4 gap-3'>
                          <h3 className='text-xl font-bold'>About</h3>
                          <div className='flex gap-1'><IconUser stroke={2} color='#c8d3e1' /><span className='font-semibold'>a</span></div>
                          <div className='flex gap-1'><IconHomeFilled stroke={2} color='#c8d3e1' /><span>Lives in&nbsp;</span><span className='font-semibold'>c</span></div>
                          <div className='flex gap-1'><IconManFilled stroke={2} color='#c8d3e1' />Gender&nbsp;&nbsp;<span className='font-semibold'>d</span></div>
                          <div className='flex gap-1'><IconHeartFilled stroke={2} color='#c8d3e1' /> Relationship&nbsp;&nbsp;<span className='font-semibold'>j</span></div>
                          <div className='flex gap-1'><IconCake stroke={2} color='#c8d3e1' /> Birthday&nbsp;&nbsp;<span className='font-semibold'>k</span></div>
                        </div>
                      </div>
                    </div >
                  </TabPanel>
                  <TabPanel value="2">
                    {/* <About user={currentUser} /> */}
                  </TabPanel>
                  <TabPanel value="3">Item Three</TabPanel>
                  <TabPanel value="4">Item Three</TabPanel>
                </TabContext>
              </Box>
            </div>

          </div>
          {/* <Modal
            open={isOpenModalUpdateProfile}
            onClose={() => setIsOpenModalUpdateProfile(false)}
            sx={{ overflowY: 'auto' }}
          >
            <div className='bg-white w-full md:w-fit absolute rounded-md  left-1/2 -translate-x-1/2 mt-5 '>
              <UpdateProfile user={userProfile} onClose={close} navigate={navigate} setIsOpenModalUpdateProfile={setIsOpenModalUpdateProfile} />
            </div>
          </Modal> */}
        </div >
      </div>

    </>
  )
}

export default Group
