import ProfileTopBar from './RightTopBarItems/ProfileTopBar'
import { Link } from 'react-router-dom'
import { IconBell, IconBrandMessenger, IconCategoryFilled } from '@tabler/icons-react'
import { useDispatch, useSelector } from 'react-redux'
import { triggerHomeLeftSideBar } from '~/redux/ui/uiSlice'
import { Avatar, Popover } from '@mui/material'
import { useRef, useState } from 'react'
import { selectLatestNotification } from '~/redux/notification/notificationSlice'
import { compareDateTime } from '~/utils/formatters'

function RightTopBar() {
  const dispatch = useDispatch()
  const listLatestNotification = useSelector(selectLatestNotification)
  const notificationRef = useRef()
  const [isOpenPopover, setIsOpenPopover] = useState(false)

  const handleClick = () => {
    setIsOpenPopover(!isOpenPopover)
  }

  return (
    <div className=''>
      <ul className="flex items-center gap-1 md:gap-3">
        <li className='lg:hidden'>
          <IconCategoryFilled onClick={() => dispatch(triggerHomeLeftSideBar())} className='size-10 p-2 text-white bg-[#F27125] rounded-full cursor-pointer' />
        </li>
        <li id='message-top-bar'
          className="">
          <Link to={'/home'} className="flex items-center">
            <IconBrandMessenger className='size-10 p-2 text-white bg-[#F27125] rounded-full' />
          </Link>
        </li>

        <li id='notification-top-bar '
          className="mr-2">
          <div className="flex items-center relative cursor-pointer" onClick={handleClick} ref={notificationRef}>
            <IconBell className='size-10 p-2 text-white bg-[#F27125] rounded-full' />
            <span className="absolute -right-3 text-center -top-1 font-bold px-1 bg-red-600 text-white rounded-full border size-6">{listLatestNotification?.length}</span>
          </div>
          <Popover
            open={isOpenPopover}
            anchorEl={notificationRef.current}
            onClose={handleClick}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'left',
            }}
          >
            <div className='w-[360px] min-h-[200px]'>
              <div className='p-3'>
                <div className='font-bold'>Notification</div>
                <div className='py-2 flex flex-col gap-2'>
                  {
                    listLatestNotification?.map(notification => (
                      <Link to={notification?.NotifiUrl} key={notification?.NotificationId} className='flex items-center gap-2'>
                        <Avatar src='' alt="user-avatar" sx={{ width: '50px', height: '50px' }} />
                        <div className='flex flex-col gap-2 w-full'>
                          <div className='flex justify-between items-center'>
                            <span>{notification?.NotiMessage}</span>
                            {!notification?.isRead && <div className='size-2 bg-blue-500 rounded-full'></div>}
                          </div>
                          <span className='text-blue-500 font-semibold text-sm'>{compareDateTime(notification?.CreatedAt)}</span>
                        </div>
                      </Link>
                    ))
                  }
                </div>
              </div>
            </div>
          </Popover>
        </li>
        <ProfileTopBar />
      </ul>
    </div>
  )
}

export default RightTopBar
