// import React from 'react'

import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { getGroupByUserId } from '~/apis/groupApis'
import GroupAvatar from '~/components/UI/GroupAvatar'
import CurrentUserAvatar from '~/components/UI/UserAvatar'
import { selectCurrentUser } from '~/redux/user/userSlice'

function HomeLeftSideBar({ user, isShowHomeLeftSideBar }) {
  const [isMore, setIsMore] = useState(false)
  const [listGroup, setListGroup] = useState([])
  const currentUser = useSelector(selectCurrentUser)
  useEffect(() => {
    getGroupByUserId().then(data => setListGroup([...data?.listGroupAdmin || [], ...data?.listGroupMember || []]))
  }, [])


  return (
    <div className={`h-[calc(100vh_-_55px)] ${!isShowHomeLeftSideBar && 'hidden'} lg:!flex lg:basis-3/12 flex-col overflow-y-auto scrollbar-none-track text-lg font-semibold`}>
      <div className="ml-3 mt-8 mb-5">
        <div id="explore"
          className=" flex flex-col items-start mb-8 border-b-2 border-gray-300"
        >
          <Link to={`/profile?id=${currentUser?.userId}`}
            className="w-full px-2 rounded-md py-3 hover:bg-orangeFpt hover:text-white flex items-center gap-3 cursor-pointer">
            <CurrentUserAvatar />
            <span className="font-semibold">{user?.firstName + ' ' + user?.lastName}</span>
          </Link>
          <Link className="w-full px-2 rounded-md py-3 hover:bg-orangeFpt hover:text-white flex items-center gap-3 cursor-pointer ">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5m-9-6h.008v.008H12v-.008ZM12 15h.008v.008H12V15Zm0 2.25h.008v.008H12v-.008ZM9.75 15h.008v.008H9.75V15Zm0 2.25h.008v.008H9.75v-.008ZM7.5 15h.008v.008H7.5V15Zm0 2.25h.008v.008H7.5v-.008Zm6.75-4.5h.008v.008h-.008v-.008Zm0 2.25h.008v.008h-.008V15Zm0 2.25h.008v.008h-.008v-.008Zm2.25-4.5h.008v.008H16.5v-.008Zm0 2.25h.008v.008H16.5V15Z" />
            </svg>
            <span className="font-semibold">Feeds</span>
          </Link>
          <Link to={'/friends'} className="w-full px-2 rounded-md py-3 hover:bg-orangeFpt hover:text-white flex items-center gap-3 cursor-pointer">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" />
            </svg>
            <span className="font-semibold">Friends</span>
          </Link>

          <Link to={'/groups'}
            className="w-full px-2 rounded-md py-3 hover:bg-orangeFpt hover:text-white flex items-center gap-3 cursor-pointer">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z" />
            </svg>

            <span className="font-semibold">Groups</span>
          </Link>
        </div>

        <div id="group"
          className="flex flex-col items-start mb-5"
        >
          <p className="text-gray-500">Group</p>
          {
            listGroup?.map(group => (
              <Link
                to={`/groups/${group?.groupId}`}
                key={group?.groupId}
                className="w-full px-2 rounded-md py-3 hover:bg-orangeFpt hover:text-white flex items-center gap-3 cursor-pointer">
                <GroupAvatar
                  avatarSrc={group?.coverImage}
                  className="rounded-md aspect-square object-cover w-8"
                />

                <span className="font-semibold capitalize">{group?.groupName}</span>
              </Link>
            ))
          }


          {/* <a
            onClick={() => setIsMore(!isMore)}
            className="w-full px-2 rounded-md py-3 hover:bg-orangeFpt hover:text-white flex items-center gap-3 cursor-pointer">
            {!isMore ?
              (<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
                <path fillRule="evenodd" d="M12.53 16.28a.75.75 0 0 1-1.06 0l-7.5-7.5a.75.75 0 0 1 1.06-1.06L12 14.69l6.97-6.97a.75.75 0 1 1 1.06 1.06l-7.5 7.5Z" clipRule="evenodd" />
              </svg>)
              :
              (<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
                <path fillRule="evenodd" d="M11.47 7.72a.75.75 0 0 1 1.06 0l7.5 7.5a.75.75 0 1 1-1.06 1.06L12 9.31l-6.97 6.97a.75.75 0 0 1-1.06-1.06l7.5-7.5Z" clipRule="evenodd" />
              </svg>
              )
            }
            <span className="font-semibold">{isMore ? 'Hide' : 'More'}</span>
          </a> */}
        </div>
      </div>


    </div>
  )
}

export default HomeLeftSideBar