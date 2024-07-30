import ProfileTopBar from './RightTopBarItems/ProfileTopBar'
import { Link } from 'react-router-dom'
import { IconBell, IconBrandMessenger, IconCategoryFilled } from '@tabler/icons-react'
import { useDispatch, useSelector } from 'react-redux'
import { triggerHomeLeftSideBar } from '~/redux/ui/uiSlice'
import { Avatar, Popover } from '@mui/material'
import { useRef, useState } from 'react'
import { selectLatestNotification } from '~/redux/notification/notificationSlice'
import { compareDateTime } from '~/utils/formatters'
import UserAvatar from '~/components/UI/UserAvatar'
import { updateReadNotification } from '~/apis'

function RightTopBar() {
  const dispatch = useDispatch()
  const listLatestNotification = useSelector(selectLatestNotification)
  const notificationRef = useRef()
  const [isOpenPopover, setIsOpenPopover] = useState(false)

  const handleClick = () => {
    setIsOpenPopover(!isOpenPopover)
  }

  const handleCheckReadNotification = (notificationId) => {
    updateReadNotification(notificationId)
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
            <IconBrandMessenger className='size-10 p-1 text-white rounded-full' />
          </Link>
        </li>

        <li id='notification-top-bar '
          className="mr-2">
          <div className="flex items-center relative cursor-pointer" onClick={handleClick} ref={notificationRef}>
            <IconBell className='size-10 p-1 text-white rounded-full' />
            <span className="absolute right-2 top-1 font-bold bg-red-600 text-white rounded-full border size-2 flex justify-center">
              {/* <span className='text-xs'>{listLatestNotification?.length ?? 0}</span> */}
            </span>
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
                    listLatestNotification?.map((notification, i) => (
                      <Link to={notification?.Url} onClick={() => handleCheckReadNotification(notification?.NotificationId)} key={i} className='flex items-center gap-2 min-h-12 hover:bg-fbWhite-500 rounded-md p-1 w-full'>
                        <UserAvatar avatarSrc={notification?.SenderAvatar} size='2' isOther='true' />
                        <div className='flex flex-col w-full'>
                          <div className='flex gap-1 text-xs justify-between items-center'>
                            <span>
                              <span className='font-bold capitalize'>{notification?.SenderName}</span>
                              {notification?.Message}
                            </span>
                            {!notification?.IsRead && <div className='size-2 min-w-2 bg-blue-500 rounded-full'></div>}
                          </div>
                          <span className='text-blue-500 font-semibold text-xs'>{compareDateTime(notification?.CreatedAt)}</span>
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
