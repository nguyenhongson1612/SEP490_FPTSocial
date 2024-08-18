import { useEffect, useState } from 'react'
import { getBlockedUserList, getButtonFriend, sendFriend, updateFriendStatus } from '~/apis'
import { useConfirm } from 'material-ui-confirm'
import { IconBookmark, IconDots, IconDotsVertical, IconEdit, IconMessageReport, IconUser, IconUserCancel, IconUserCheck, IconUserFilled, IconUserPlus, IconUserX } from '@tabler/icons-react'
import { Link } from 'react-router-dom'
import connectionSignalR from '~/utils/signalRConnection'
import { Avatar, Button, Menu, MenuItem, Popover } from '@mui/material'
import { toast } from 'react-toastify'
import { handleCoverImg } from '~/utils/formatters'
import { useDispatch } from 'react-redux'
import { addReport, openModalReport } from '~/redux/report/reportSlice'
import { FRONTEND_ROOT, REPORT_TYPES } from '~/utils/constants'
import { useTranslation } from 'react-i18next'
import { addBlock, openModalBlock } from '~/redux/block/blockSlice'
import Block from '~/components/Modal/Block/Block'

function TopProfile({ setIsOpenModalUpdateProfile, user, currentUser, buttonProfile, forceUpdate, listFriend }) {

  const backgroundStyle = handleCoverImg(user?.coverImage)
  const dispatch = useDispatch()
  const [anchorEl, setAnchorEl] = useState(null)
  const [hoveredFriendId, setHoveredFriendId] = useState(null)
  const { t } = useTranslation()

  const handlePopoverOpen = (event, friendId) => {
    setAnchorEl(event.currentTarget)
    setHoveredFriendId(friendId)
  }

  const handlePopoverClose = () => {
    setAnchorEl(null)
    setHoveredFriendId(null)
  }

  const [anchorEl2, setAnchorEl2] = useState(null)
  const open = Boolean(anchorEl2)
  const handleClick = (event) => {
    setAnchorEl2(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl2(null)
  }

  const handleAddFriend = async () => {
    try {
      const response = await sendFriend({ userId: currentUser?.userId, friendId: user?.userId })
      forceUpdate()
      if (response) {
        const signalRData = {
          MsgCode: 'User-001',
          Receiver: user?.userId,
          Url: `${FRONTEND_ROOT}/profile?id=${currentUser?.userId}`,
          AdditionsMsd: '',
          ActionId: 'true'
        }
        console.log(signalRData)
        await connectionSignalR.invoke('SendNotify', JSON.stringify(signalRData))
      }
    } catch (err) {
      console.error('Error while starting connection: ', err)
    }
  }

  const handleResponse = (data_) => {
    const data = {
      userId: currentUser?.userId,
      friendId: user?.userId,
      ...data_
    }
    updateFriendStatus(data)
      .then((data) => {
        if (data?.confirm) {
          const signalRData = {
            MsgCode: 'User-002',
            Receiver: `${user?.userId}`,
            Url: `${FRONTEND_ROOT}/profile?id=${currentUser?.userId}`,
            AdditionsMsd: ''
          }
          connectionSignalR.invoke('SendNotify', JSON.stringify(signalRData))
        }
      })
      .then(forceUpdate)
  }

  const confirmUnfriend = useConfirm()
  const openDeleteModal = () =>
    confirmUnfriend({
      title: 'Unfriend this account?',
      description: 'Are you sure want to remove this account from friend list?',
      confirmationText: 'Not anymore',
      cancellationText: 'Continue friend forever'
    })
      .then(() =>
        handleResponse({
          confirm: false,
          cancle: false,
          reject: true
        })
      )
      .catch(() => { })

  return (
    <div id="top-profile" className="bg-white shadow-md w-full flex flex-col items-center">
      <div
        id="holderCover"
        className="w-full lg:w-[940px] aspect-[74/27] rounded-md bg-cover bg-center bg-no-repeat"
        style={backgroundStyle}
      ></div>
      <div id="avatar-profile" className="w-full flex justify-center pb-4 border-b">
        <div className="flex flex-col lg:flex-row items-center lg:items-end justify-center gap-4">
          <div id="avatar">
            <div className="relative w-[170px] h-[90px] lg:h-0">
              <div className="absolute bottom-0">
                <Avatar
                  alt="Remy Sharp"
                  src={user?.avataPhotos?.find((e) => e.isUsed)?.avataPhotosUrl}
                  sx={{ width: 170, height: 170, border: '6px solid white' }}
                />
              </div>
            </div>
          </div>

          <div id="name-friend" className="flex flex-col items-center lg:items-start justify-end mb-4 gap-1">
            <span className="text-gray-900 font-bold text-3xl capitalize">
              {user?.firstName + ' ' + user?.lastName}
            </span>
            <span className="text-gray-500 font-bold">
              {listFriend?.count} friend{listFriend?.count > 1 && 's'}
            </span>

            <div className="flex items-center [&>img:not(:first-child)]:-ml-4">
              {listFriend?.allFriend?.map((friend) => (
                <Link
                  to={`/profile?id=${friend?.friendId}`}
                  key={friend?.friendId}
                  aria-owns={hoveredFriendId === friend?.friendId ? `mouse-over-popover-${friend?.friendId}` : undefined}
                  onMouseEnter={(event) => handlePopoverOpen(event, friend?.friendId)}
                  onMouseLeave={handlePopoverClose}
                >
                  <img
                    src={friend?.avata || './src/assets/img/avatar_holder.png'}
                    className="rounded-[50%] aspect-square object-cover w-10 border-2 border-white"
                  />
                  <Popover
                    id={`mouse-over-popover-${friend?.friendId}`}
                    sx={{
                      pointerEvents: 'none'
                    }}
                    open={hoveredFriendId === friend?.friendId}
                    anchorEl={anchorEl}
                    anchorOrigin={{
                      vertical: 'bottom',
                      horizontal: 'left'
                    }}
                    transformOrigin={{
                      vertical: 'top',
                      horizontal: 'left'
                    }}
                    onClose={handlePopoverClose}
                    disableRestoreFocus
                  >
                    <div key={friend?.friendId} className="flex items-center gap-2 p-2">
                      <Avatar src={friend?.avata || './src/assets/img/avatar_holder.png'} alt="user-avatar" sx={{ width: 50, height: 50 }} />
                      <div className="flex flex-col w-full items-center">
                        <span className='font-bold text-lg'>{friend?.friendName}</span>
                        <span className='text-sm flex items-center'>{friend?.mutualFriends + ' mutual friends'}</span>
                      </div>
                    </div>
                  </Popover>
                </Link>
              ))}
            </div>
          </div>

          {user?.userId == currentUser?.userId ? (
            <div
              onClick={() => setIsOpenModalUpdateProfile(true)}
              className="flex flex-col justify-end mb-4 cursor-pointer"
            >
              <span></span>
              <span className="font-bold text-lg text-white p-2 rounded-md bg-orangeFpt hover:bg-orange-600 flex items-center gap-2">
                <IconEdit />
                {t('standard.profile.updateProfile')}
              </span>
            </div>
          ) : buttonProfile?.friend ? (
            <div className="flex flex-col justify-end mb-4 cursor-pointer">
              <span
                onClick={openDeleteModal}
                className="font-bold text-lg text-white p-2 rounded-md bg-blue-500 hover:bg-blue-700 flex items-center gap-2"
              >
                <IconUserCheck stroke={3} />
                {t('standard.profile.friend')}
              </span>
            </div>
          ) : buttonProfile?.request ? (
            <div
              onClick={() =>
                handleResponse({
                  confirm: false,
                  cancle: true,
                  reject: false
                })
              }
              className="interceptor-loading flex flex-col justify-end mb-4 cursor-pointer"
            >
              <span className="font-bold text-lg text-white p-2 rounded-md  bg-blue-500 hover:bg-blue-700 flex items-center gap-2">
                <IconUserX stroke={3} />
                {t('standard.profile.cancelRequest')}
              </span>
            </div>
          ) : !buttonProfile?.confirm ? (
            <div onClick={handleAddFriend} className="flex flex-col justify-end mb-4 cursor-pointer">
              <span className="interceptor-loading font-bold text-lg text-white p-2 rounded-md bg-blue-500 hover:bg-blue-700 flex items-center gap-2">
                <IconUserPlus stroke={3} />
                {t('standard.profile.addFriend')}
              </span>
            </div>
          ) : (
            <div className="flex flex-col justify-end mb-4 cursor-pointer">
              <div className="flex gap-2">
                <span
                  onClick={() =>
                    handleResponse({
                      confirm: true,
                      cancle: false,
                      reject: false
                    })
                  }
                  className="interceptor-loading font-bold text-lg text-white p-2 rounded-md bg-blue-500 hover:bg-blue-700"
                >
                  {t('standard.profile.confirmRequest')}
                </span>
                <span
                  onClick={() =>
                    handleResponse({
                      confirm: false,
                      cancle: false,
                      reject: true
                    })
                  }
                  className="font-bold text-lg text-gray-900 p-2 rounded-md bg-fbWhite hover:bg-fbWhite-500"
                >
                  {t('standard.profile.deleteRequest')}
                </span>
              </div>
            </div>
          )}
          {
            user?.userId !== currentUser?.userId &&
            <div className='flex flex-col justify-end mb-5 cursor-pointer'>
              <div
                className="rounded-md size-[40px] flex justify-center items-center bg-fbWhite cursor-pointer p-2"
                onClick={handleClick}
              ><IconDotsVertical /></div>
              <Menu
                anchorEl={anchorEl2}
                id="account-menu"
                open={open}
                onClose={handleClose}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
              >
                <MenuItem
                  onClick={() => {
                    dispatch(addReport({ reportData: { ...user }, reportType: REPORT_TYPES.PROFILE }))
                    dispatch(openModalReport())
                    handleClose()
                  }}
                  sx={{ gap: '5px' }}>
                  <IconMessageReport />{t('standard.profile.report')}
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    dispatch(addBlock(user))
                    dispatch(openModalBlock())
                    handleClose()
                  }}
                  sx={{ gap: '5px' }}>
                  <IconUserCancel />{t('standard.profile.block')}
                </MenuItem>
              </Menu>
            </div>
          }
        </div>
      </div>
      <Block />
    </div>
  )
}

export default TopProfile