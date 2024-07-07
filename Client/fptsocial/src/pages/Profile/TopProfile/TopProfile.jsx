import { useEffect, useState } from 'react'
import { getButtonFriend, sendFriend, updateFriendStatus } from '~/apis'
import { useConfirm } from 'material-ui-confirm'
import { IconEdit, IconUserCheck, IconUserPlus, IconUserX } from '@tabler/icons-react'
import { Link } from 'react-router-dom';
import connectionSignalR from '~/utils/signalRConnection';
import { Avatar } from '@mui/material';
import { toast } from 'react-toastify';
// import Avatar from '~/components/UI/Avatar';

function TopProfile({ setIsOpenModalUpdateProfile, user, currentUser, buttonProfile, forceUpdate, listFriend }) {
  const coverImage = user?.coverImage
  const backgroundStyle = coverImage
    ? { backgroundImage: `url(${coverImage})` }
    : {
      background: 'linear-gradient(to bottom, #E9EBEE 80%, #8b9dc3 100%)'
    }


  const handleAddFriend = async () => {
    try {
      const response = await sendFriend({ userId: currentUser?.userId, friendId: user?.userId })
      forceUpdate()
      if (response) {
        const signalRData = {
          MsgCode: 'User-001',
          Receiver: user?.userId,
          Url: `http://localhost:3000/profile?id=${currentUser?.userId}`,
          AdditionsMsd: ''
        }
        console.log(signalRData);
        await connectionSignalR.invoke('SendNotify', JSON.stringify(signalRData))
      }
    } catch (err) {
      console.error('Error while starting connection: ', err)
    }
  }
  const handleResponse = (data_) => {
    const data = {
      'userId': currentUser?.userId,
      'friendId': user?.userId,
      ...data_
    }
    updateFriendStatus(data)
      .then((data) => {
        if (data?.confirm) {
          const signalRData = {
            MsgCode: 'User-002',
            Receiver: `${user?.userId}`,
            Url: `http://localhost:3000/profile?id=${currentUser?.userId}`,
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
      description: ('Are you sure want to remove this account from friend list?'),
      confirmationText: 'Not anymore',
      cancellationText: 'Continue friend forever'
    }).then(() => handleResponse({
      'confirm': false,
      'cancle': false,
      'reject': true
    })).catch(() => { })

  return (
    <div id='top-profile'
      className='bg-white shadow-md w-full flex flex-col items-center'
    >
      <div
        id="holderCover"
        className="w-full lg:w-[940px] aspect-[74/27] rounded-md bg-cover bg-center bg-no-repeat"
        style={backgroundStyle}
      >
      </div>
      <div id='avatar-profile'
        className='w-full flex justify-center pb-4 border-b'
      >
        <div className='flex flex-col lg:flex-row items-center lg:items-end justify-center gap-4'>
          <div id='avatar'>
            <div className='relative w-[170px] h-[90px] lg:h-0'>
              <div className='absolute bottom-0'>
                <Avatar alt="Remy Sharp" src={user?.avataPhotos?.find(e => e.isUsed == true)?.avataPhotosUrl} sx={{ width: 170, height: 170, border: '6px solid white' }} />
              </div>
            </div>
          </div>

          <div id='name-friend'
            className='flex flex-col items-center lg:items-start justify-end mb-4 gap-1'
          >
            <span className='text-gray-900 font-bold text-3xl'>{user?.firstName + ' ' + user?.lastName}</span>
            <span className='text-gray-500 font-bold'> {listFriend?.count} Friend{listFriend?.count > 1 && 's'}</span>

            <div className='flex items-center [&>img:not(:first-child)]:-ml-4'>
              {
                listFriend?.allFriend?.map(friend => (
                  <Link to={`/profile?id=${friend?.friendId}`} key={friend?.friendId}>
                    <img
                      src={friend?.avata}
                      className="rounded-[50%] aspect-square object-cover w-10 border-2 border-white"
                    />
                  </Link>

                ))
              }

            </div>
          </div>
          {user?.userId == currentUser?.userId
            ? (
              <div onClick={() => setIsOpenModalUpdateProfile(true)}
                className='flex flex-col justify-end mb-4 cursor-pointer'>
                <span></span>
                <span className='font-bold text-lg text-white p-2 rounded-md bg-orangeFpt hover:bg-orange-600 flex items-center gap-2'><IconEdit />Update Your Profile</span>
              </div>
            )
            : buttonProfile?.friend
              ? (
                <div className='flex flex-col justify-end mb-4 cursor-pointer'>
                  <span
                    onClick={openDeleteModal}
                    className='font-bold text-lg text-white p-2 rounded-md bg-blue-500 hover:bg-blue-700 flex items-center gap-2'><IconUserCheck stroke={3} />Friend</span>
                </div>
              )
              : buttonProfile?.request
                ? <div
                  onClick={() => handleResponse({
                    'confirm': false,
                    'cancle': true,
                    'reject': false
                  })}
                  className='interceptor-loading flex flex-col justify-end mb-4 cursor-pointer'>
                  <span className='font-bold text-lg text-white p-2 rounded-md  bg-blue-500 hover:bg-blue-700 flex items-center gap-2'><IconUserX stroke={3} />Cancel request</span>
                </div>
                : !buttonProfile?.confirm
                  ? (
                    <div
                      onClick={handleAddFriend}
                      className='flex flex-col justify-end mb-4 cursor-pointer'>
                      <span className='interceptor-loading font-bold text-lg text-white p-2 rounded-md bg-blue-500 hover:bg-blue-700 flex items-center gap-2'><IconUserPlus stroke={3} />Add friend</span>
                    </div>
                  )
                  : (
                    <div
                      // onClick={handleAddFriend}
                      className='flex flex-col justify-end mb-4 cursor-pointer'>
                      <div className='flex gap-2'>
                        <span
                          onClick={() => handleResponse({
                            'confirm': true,
                            'cancle': false,
                            'reject': false
                          })}
                          className='interceptor-loading font-bold text-lg text-white p-2 rounded-md bg-blue-500 hover:bg-blue-700'>Confirm request</span>
                        <span
                          onClick={() => handleResponse({
                            'confirm': false,
                            'cancle': false,
                            'reject': true
                          })}
                          className='font-bold text-lg text-gray-900 p-2 rounded-md bg-fbWhite hover:bg-fbWhite-500'>Delete request</span>
                      </div>
                    </div>
                  )
          }

        </div>
      </div>
    </div>
  )
}

export default TopProfile;
