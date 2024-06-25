import { useEffect, useState } from 'react'
import { getButtonFriend, sendFriend, updateFriendStatus } from '~/apis'
import { IconUserCheck, IconUserPlus, IconEdit, IconUserX } from '@tabler/icons-react'
import { modals } from '@mantine/modals';
import { Text } from '@mantine/core';
function TopProfile({ open, user, currentUser, buttonProfile, forceUpdate }) {
  const handleAddFriend = () => {
    sendFriend({ userId: currentUser?.userId, friendId: user?.userId }).then(forceUpdate)
  }

  const handleResponse = (data_) => {
    const data = {
      'userId': currentUser?.userId,
      'friendId': user?.userId,
      ...data_
    }
    updateFriendStatus(data).then(forceUpdate)
  }

  const openDeleteModal = () =>
    modals.openConfirmModal({
      title: 'Unfriend this account?',
      centered: true,
      children: (
        <Text size="sm" >
          Are you sure want to remove this account from friend list?
        </Text>
      ),
      labels: { confirm: 'Not anymore', cancel: 'Continue friend forever' },
      confirmProps: { color: 'red' },
      // onCancel: () => console.log('Cancel'),
      onConfirm: () => handleResponse({
        'confirm': false,
        'cancle': false,
        'reject': true
      }),
    })

  return (
    <div id='top-profile'
      className='bg-white shadow-md w-full flex flex-col items-center'
    >
      <div id=''
        className='w-full lg:w-[940px] aspect-[74/27] rounded-md
                bg-[url(https://thumbs.dreamstime.com/b/incredibly-beautiful-sunset-sun-lake-sunrise-landscape-panorama-nature-sky-amazing-colorful-clouds-fantasy-design-115177001.jpg)] 
                bg-cover bg-center bg-no-repeat'></div>
      <div id='avatar-profile'
        className='w-full flex justify-center pb-4 border-b'
      >
        <div className='flex flex-col lg:flex-row items-center lg:items-end justify-center gap-4'>
          <div id='avatar'>
            <div className='relative w-[170px] h-[90px] lg:h-0'>
              <div className='absolute bottom-0 w-[170px] bg-white rounded-[50%] aspect-square flex justify-center items-center'>
                <img
                  src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQuatIJXhoIyk41rXuz9n3cHerAI8OdrNUjzBvvYALViA&s"
                  alt="group-img"
                  className="rounded-[50%] aspect-square object-cover w-[95%]"
                />
              </div>
            </div>
          </div>

          <div id='name-friend'
            className='flex flex-col items-center lg:items-start justify-end mb-4 gap-1'
          >
            <span className='text-gray-900 font-bold text-3xl'>{user?.firstName + ' ' + user?.lastName}</span>
            <span className='text-gray-500 font-bold'> 999 Friends</span>

            <div className='flex items-center [&>img:not(:first-child)]:-ml-4'>
              <img
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQuatIJXhoIyk41rXuz9n3cHerAI8OdrNUjzBvvYALViA&s"
                alt="group-img"
                className="rounded-[50%] aspect-square object-cover w-10 border-2 border-white"
              />
              <img
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQuatIJXhoIyk41rXuz9n3cHerAI8OdrNUjzBvvYALViA&s"
                alt="group-img"
                className="rounded-[50%] aspect-square object-cover w-10 border-2 border-white"
              />
              <img
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQuatIJXhoIyk41rXuz9n3cHerAI8OdrNUjzBvvYALViA&s"
                alt="group-img"
                className="rounded-[50%] aspect-square object-cover w-10 border-2 border-white"
              />
              <img
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQuatIJXhoIyk41rXuz9n3cHerAI8OdrNUjzBvvYALViA&s"
                alt="group-img"
                className="rounded-[50%] aspect-square object-cover w-10 border-2 border-white"
              />
              <img
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQuatIJXhoIyk41rXuz9n3cHerAI8OdrNUjzBvvYALViA&s"
                alt="group-img"
                className="rounded-[50%] aspect-square object-cover w-10 border-2 border-white"
              />
            </div>
          </div>
          {user?.userId == currentUser?.userId
            ? (
              <div onClick={open}
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
