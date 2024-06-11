import ProfileTopBar from './RightTopBarItems/ProfileTopBar'
import { AiOutlineMessage } from 'react-icons/ai'
import { IoIosNotificationsOutline } from 'react-icons/io'
import { FaAlignJustify } from 'react-icons/fa6'
import { Link } from 'react-router-dom'
// import React from "react";
function RightTopBar() {
  return (
    <div className=''>

      <ul className="flex items-center gap-1 md:gap-3">
        <li className='sm:hidden'>
          <FaAlignJustify className='size-10 p-2 text-white bg-[#F27125] rounded-full' />
        </li>
        <li id='message-top-bar'
          className="">
          <Link to={'/home'} className="flex items-center">
            <AiOutlineMessage className='size-10 p-2 text-white bg-[#F27125] rounded-full' />
          </Link>
        </li>

        <li id='notification-top-bar '
          className="mr-2">
          <a href="#" className="flex items-center relative">
            <IoIosNotificationsOutline className='size-10 p-2 text-white bg-[#F27125] rounded-full' />
            <span className="absolute -right-3 text-center -top-1 font-bold px-1 bg-red-600 text-white rounded-full border ">10</span>
          </a>
        </li>
        <ProfileTopBar />
      </ul>
    </div>

  )
}

export default RightTopBar;
