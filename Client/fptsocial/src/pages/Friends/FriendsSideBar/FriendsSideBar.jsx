import { IconUserPlus, IconUserShare, IconUsersGroup } from '@tabler/icons-react';
import { Link } from 'react-router-dom';

function FriendsSideBar({ isRequests, isSuggestions, isFriendList }) {
  return (
    <div className="max-h-[calc(100vh_-_55px)] w-[380px] flex flex-col overflow-y-auto scrollbar-none-track border-r shadow-lg">
      <div className="ml-3 mt-8 mb-5">
        <span className='text-2xl font-bold'>Friends</span>
        <div
          className="flex flex-col items-start mb-8"
        >
          <Link to={'/friends/requests'}
            className={`w-full hover:text-white hover:bg-fbWhite ${isRequests && 'text-white bg-fbWhite'} flex items-center rounded-md gap-3 p-2 cursor-pointer`}>
            <IconUserShare className='text-white bg-orangeFpt size-9 p-1 rounded-full' />
            <span className="font-semibold text-gray-900 ">Friend Requests</span>
          </Link>
          <Link to={'/friends/suggestions'}
            className={`w-full hover:text-white hover:bg-fbWhite ${isSuggestions && 'text-white bg-fbWhite'} flex items-center rounded-md gap-3 p-2 cursor-pointer`}>
            <IconUserPlus className='text-white bg-orangeFpt size-9 p-1 rounded-full' />
            <span className="font-semibold text-gray-900 ">Friend suggestions</span>
          </Link>
          <Link to={'/friends/list'}
            className={`w-full hover:text-white hover:bg-fbWhite ${isFriendList && 'text-white bg-fbWhite'} flex items-center rounded-md gap-3 p-2 cursor-pointer`}>
            <IconUsersGroup className='text-white bg-orangeFpt size-9 p-1 rounded-full' />
            <span className="font-semibold text-gray-900 ">Friend list</span>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default FriendsSideBar
