import ProfileTopBar from './RightTopBarItems/ProfileTopBar'
import { Link } from 'react-router-dom'
import { IconBell, IconBrandMessenger, IconCategoryFilled } from '@tabler/icons-react';

function RightTopBar() {
  return (
    <div className=''>

      <ul className="flex items-center gap-1 md:gap-3">
        <li className='sm:hidden'>
          <IconCategoryFilled className='size-10 p-2 text-white bg-[#F27125] rounded-full' />
        </li>
        <li id='message-top-bar'
          className="">
          <Link to={'/home'} className="flex items-center">
            <IconBrandMessenger className='size-10 p-2 text-white bg-[#F27125] rounded-full' />
          </Link>
        </li>

        <li id='notification-top-bar '
          className="mr-2">
          <a href="#" className="flex items-center relative">
            <IconBell className='size-10 p-2 text-white bg-[#F27125] rounded-full' />
            <span className="absolute -right-3 text-center -top-1 font-bold px-1 bg-red-600 text-white rounded-full border ">10</span>
          </a>
        </li>
        <ProfileTopBar />
      </ul>
    </div>

  )
}

export default RightTopBar;
