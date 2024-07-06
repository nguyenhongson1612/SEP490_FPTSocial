// import { useState } from 'react'
// import { Link } from 'react-router-dom'

import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getAllFriend } from '~/apis'

function HomeRightSideBar() {
  const [listFriend, setListFriend] = useState([])

  useEffect(() => {
    getAllFriend().then(data => setListFriend(data?.allFriend))
  }, [])

  return (
    <div className="max-h-[calc(100vh_-_55px)] w-[380px] hidden lg:!flex flex-col overflow-y-auto scrollbar-none-track text-lg font-semibold">

      <div className="ml-3 mt-8 mb-5">
        <div id="people"
          className="flex flex-col items-start "
        >
          <p className=" text-gray-500">Contacts</p>
          {
            listFriend?.map(friend => (
              <Link key={friend?.friendId} to={`/profile?id=${friend?.friendId}`} className="w-full px-2 py-3 hover:bg-orangeFpt hover:text-white flex items-center gap-3 cursor-pointer rounded-md">
                <img
                  src={friend?.avata || './src/assets/img/avatar_holder.png'}
                  className=" aspect-square rounded-[50%] object-cover w-10 border border-gray-500"
                />

                <span className="font-semibold">{friend?.friendName}</span>
              </Link>
            ))
          }

        </div>
      </div>


    </div>
  )
}

export default HomeRightSideBar