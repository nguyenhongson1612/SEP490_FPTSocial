import { TabContext, TabList, TabPanel } from '@mui/lab'
import { Box, Button, Checkbox, FormControlLabel, Menu, MenuItem, Modal, Tab } from '@mui/material'
import { IconDoorExit, IconDotsVertical, IconMessageReport, IconPlus, IconSearch, IconUsersPlus, IconX } from '@tabler/icons-react'
import { useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useLocation, useParams } from 'react-router-dom'
import { getAllFriend } from '~/apis'
import { cancelRequestJoin, getListFriendInvited, invitesFriend, leftGroup, requestJoinGroup } from '~/apis/groupApis'
import UserAvatar from '~/components/UI/UserAvatar'
import { triggerReload } from '~/redux/ui/uiSlice'
import { selectCurrentUser } from '~/redux/user/userSlice'
import { handleCoverImg } from '~/utils/formatters'
import GroupHomeDiscussions from './GroupHomeDiscussions/GroupHomeDiscussions'
import { getGroupPostByGroupId, getGroupPostByGroupPostId } from '~/apis/groupPostApis'
import { useConfirm } from 'material-ui-confirm'
import AutoCompleteSearch from '~/components/Search/AutoCompleteSearch'
import SearchInGroup from './Search/SearchInGroup'
import { addReport, openModalReport } from '~/redux/report/reportSlice'
import { REPORT_TYPES } from '~/utils/constants'
import GroupMember from './GroupMember/GroupMember'

function GroupHome({ group }) {
  console.log('🚀 ~ GroupHome ~ group:', group)
  const currentUser = useSelector(selectCurrentUser)
  const [listFriend, setListFriend] = useState([])
  const [listPost, setListPost] = useState([])
  const isPostDetail = /^\/groups\/[a-zA-Z0-9-]+\/post\/[a-zA-Z0-9-]+\/?$/.test(location.pathname)
  const { postId } = useParams()


  const { register, watch, getValues, setValue, control, handleSubmit, formState: { errors } } = useForm()

  const [open, setOpen] = useState(false)
  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)
  const dispatch = useDispatch()

  const [anchorEl2, setAnchorEl2] = useState(null)
  const open2 = Boolean(anchorEl2)
  const handleClick2 = (event) => {
    setAnchorEl2(event.currentTarget)
  }
  const handleClose2 = () => {
    setAnchorEl2(null)
  }
  useEffect(() => {
    group &&
      getListFriendInvited(group?.groupId).then(data => setListFriend(data))
  }, [group])

  const [groupContentTabs, setGroupContentTabs] = useState('discussion')

  const sendInvitesFriend = (data) => {
    console.log('🚀 ~ sendInvitesFriend ~ data:', data)
    const submitData = {
      'userId': currentUser?.userId,
      'memberId': data?.inviteFriends?.map(e => e?.userId),
      'groupId': group?.groupId
    }
    console.log('🚀 ~ invitesFriend ~ submitData:', submitData)

    invitesFriend(submitData).then(() => {
      dispatch(triggerReload())
      handleClose()
    })
    // .then((data) => {
    //   if (data) {
    //     data?.inviteFriends?.map(friend => {
    //       const signalRData = {
    //         MsgCode: 'User-001',
    //         Receiver: `${friend?.friendId}`,
    //         Url: `/groups/${groupId}`,
    //         AdditionsMsd: ''
    //       }
    //       connectionSignalR.invoke('SendNotify', JSON.stringify(signalRData))
    //     })
    //   }
    // })
  }

  const handleRequestJointGroup = () => {
    const submitData = {
      'userId': currentUser?.userId,
      'groupId': group?.groupId
    }
    requestJoinGroup(submitData).then(() => dispatch(triggerReload()))
  }
  const handleCancelRequestJoinGroup = () => {
    const submitData = {
      'userId': null,
      'groupId': group?.groupId
    }
    cancelRequestJoin(submitData).then(() => dispatch(triggerReload()))
  }
  const backgroundStyle = handleCoverImg(group?.coverImage)
  const confirmFile = useConfirm()
  const handleLeaveGroup = () => {
    confirmFile({
      title: (
        <div className='flex flex-col gap-2'>
          <div className='font-bold text-[#d22e2e]'>Warning: Leaving Group?</div>
          <div className='text-sm'>
            All content, settings, and members associated with this group will be permanently removed. This includes any posts, files, calendar events, and other data created within the group.<br />
            Once the group is deleted, there is no way to recover it or its contents<br />
            <span className='text-[#d22e2e] font-bold'>Do you still want to permanently leave the group?</span>
          </div>
        </div>
      ),
      description: (''),
      confirmationButtonProps: { color: 'error', variant: 'contained' },
      confirmationText: 'Leave',
      cancellationText: 'Cancel'
    }).then(() => {
      const submitData = {
        'userId': currentUser?.userId,
        'groupId': group?.groupId,
      }
      leftGroup(submitData).then(() => dispatch(triggerReload()))
    }).catch(() => { })
  }

  return (
    <div className="relative overflow-y-auto overflow-x-hidden w-full">
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
                <span className='text-gray-900 font-bold text-3xl capitalize'>{group?.groupName}</span>
                <div className='flex gap-3'>
                  <span className='text-gray-500 font-bold'>{group?.groupSettings?.find(e => e?.groupSettingName?.toLowerCase() == 'group status')?.groupStatusName}.</span>
                  <span className='text-gray-500 font-bold'>{group?.memberCount} member</span>
                </div>
                <div className="flex w-full justify-between items-center">
                  <div className='flex items-center [&>img:not(:first-child)]:-ml-4'>
                    {group?.groupMember?.map((member, i) => (
                      <Link to={''} key={i}>
                        <UserAvatar isOther={true} avatarSrc={member?.avata} />
                      </Link>
                    ))}
                  </div>
                  <div>
                    <div className='flex gap-3 h-[40px]'>
                      {
                        group?.isJoin
                          ? <div className='flex gap-2'>
                            <Button className='interceptor-loading' variant="contained" size="medium" startIcon={<IconPlus />} onClick={handleOpen}>
                              Invite
                            </Button>
                            <Button className='interceptor-loading' variant="contained" size="medium" startIcon={<IconDoorExit />} color='warning'
                              onClick={handleLeaveGroup}>
                              Leave
                            </Button>
                          </div>
                          : group?.isRequest
                            ? <Button className='interceptor-loading' variant="contained" color="warning" size="medium" startIcon={<IconUsersPlus />} onClick={handleCancelRequestJoinGroup}>
                              Cancel request
                            </Button>
                            : <Button className='interceptor-loading' variant="contained" color="success" size="medium" startIcon={<IconUsersPlus />} onClick={handleRequestJointGroup}>
                              Join
                            </Button>
                      }
                      <div
                        className="rounded-md size-[40px] flex justify-center items-center bg-fbWhite cursor-pointer p-2"
                        onClick={handleClick2}
                      ><IconDotsVertical /></div>
                      <Menu
                        anchorEl={anchorEl2}
                        id="account-menu"
                        open={open2}
                        onClose={handleClose2}
                        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                      >
                        <MenuItem
                          onClick={() => {
                            dispatch(addReport({ reportData: group, reportType: REPORT_TYPES.PROFILE }))
                            dispatch(openModalReport())
                            handleClose2()
                          }}
                          sx={{ gap: '5px' }}>
                          <IconMessageReport /> Report
                        </MenuItem>

                      </Menu>
                    </div>

                    <Modal
                      open={open}
                      onClose={handleClose}
                      aria-labelledby="modal-modal-title"
                      aria-describedby="modal-modal-description"
                    >
                      <div className="w-[600px] absolute left-1/2 top-1/2 bg-white
                          -translate-x-1/2 -translate-y-1/2 rounded-lg">
                        {/* <form > */}
                        <form onSubmit={handleSubmit(sendInvitesFriend)} >
                          <div className='flex flex-col'>
                            <div className='h-[60px] flex justify-between items-center px-2 border-b '>
                              <span></span>
                              <span className='text-xl font-bold'>Invite your friends</span>
                              <IconX
                                onClick={handleClose}
                                className='bg-orangeFpt text-white rounded-full  cursor-pointer hover:bg-orange-700' />
                            </div>

                            <div className='md:max-h-[350px] flex overflow-y-auto scrollbar-none-track'>
                              <div className='flex items-center h-[40] py-2 gap-2 basis-8/12'>
                                <div className='flex flex-col gap-2 w-full px-2'>
                                  <div className="relative text-gray-600" >
                                    <input className="w-full bg-fbWhite h-10 px-5 pr-16 rounded-xl text-sm font-light focus:outline-none"
                                      type="search" placeholder="Search friend" />
                                    <span className='absolute right-2 top-1/2 -translate-y-1/2'><IconSearch /></span>
                                  </div>
                                  <Controller
                                    name="inviteFriends"
                                    control={control}
                                    defaultValue={[]}
                                    render={({ field: { value, onChange } }) => (
                                      <Box>
                                        {listFriend.map((e) => (
                                          <FormControlLabel
                                            className=' hover:bg-fbWhite p-1 rounded-lg'
                                            key={e?.userId}
                                            control={
                                              <Checkbox
                                                checked={value.some(friend => friend.userId === e.userId)}
                                                onChange={(event) => {
                                                  if (event.target.checked) {
                                                    onChange([...value, e])
                                                  } else {
                                                    onChange(value.filter((friend) => friend.userId !== e.userId))
                                                  }
                                                }}
                                              />
                                            }
                                            sx={{
                                              display: 'flex',
                                              justifyContent: 'space-between',
                                              width: '100%',
                                              margin: '0'
                                            }}
                                            label={
                                              <div className="flex items-center gap-2">
                                                <UserAvatar avatarSrc={e?.avata} isOther={true} />
                                                <span className='capitalize font-semibold'>{e?.userName}</span>
                                              </div>
                                            }
                                            labelPlacement="start"
                                          />
                                        ))}
                                      </Box>
                                    )}
                                  />
                                </div>
                              </div>
                              <div className='basis-4/12 bg-fbWhite flex flex-col w-full gap-2'>
                                <span className='p-2 text-sm font-semibold'>{watch('inviteFriends')?.length ?? 0} friend selected</span>
                                {
                                  watch('inviteFriends')?.map(friend => (
                                    <div key={friend?.userId} className="flex items-center justify-between gap-2 px-2">
                                      <div className="flex items-center gap-2">
                                        <UserAvatar avatarSrc={friend?.avata} isOther={true} />
                                        <span className='capitalize'>{friend?.userName}</span>
                                      </div>
                                      <IconX
                                        className='text-white size-5 rounded-full cursor-pointer bg-orangeFpt hover:bg-orange-700'
                                        onClick={() => setValue('inviteFriends', getValues('inviteFriends')?.filter(e => e.userId !== friend?.userId))}
                                      />
                                    </div>
                                  ))
                                }
                              </div>
                            </div>

                            <div className='h-[60px] px-4 flex justify-end items-center gap-2 border-t'>
                              <Button variant="contained" color='inherit' onClick={handleClose}>Cancel</Button>
                              <Button type='submit' variant="contained" color='warning' className="interceptor-loading">Send invites</Button>
                            </div>
                          </div >
                        </form >
                      </div>
                    </Modal>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>
        <div
          id='content-profile'
          className='flex items-center lg:flex-row lg:justify-center lg:items-start w-full gap-3 bg-fbWhite'
        >
          <Box sx={{
            width: '100%',
            minHeight: '500px',
            typography: 'body1',
            '.MuiTabs-flexContainer': { backgroundColor: 'white', display: 'flex', justifyContent: 'center' },
            '.MuiButtonBase-root': { display: 'flex', justifyContent: 'center' }
          }}>
            <TabContext
              value={groupContentTabs}
            >
              <div>
                <TabList onChange={(e, v) => setGroupContentTabs(v)} >
                  <Tab iconPosition="start" label="Discussion" value="discussion" />
                  <Tab iconPosition="start" label="Members" value="members" />
                  <Tab iconPosition="start" label="Events" value="events" />
                  <Tab iconPosition="start" label="Media" value="media" />
                  <Tab iconPosition="start" label={<IconSearch />} value="search" />
                </TabList>
              </div>
              <TabPanel value="discussion">
                <GroupHomeDiscussions group={group} listPost={listPost} isPostDetail={isPostDetail} />
              </TabPanel>
              <TabPanel value="members">
                <GroupMember group={group} />
              </TabPanel>
              <TabPanel value="events">Item Three</TabPanel>
              <TabPanel value="media">Item Three</TabPanel>
              <TabPanel value="search"><SearchInGroup /></TabPanel>
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
  )
}

export default GroupHome
