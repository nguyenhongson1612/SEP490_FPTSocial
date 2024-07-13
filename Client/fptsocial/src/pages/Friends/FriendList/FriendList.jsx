import { IconMessage } from '@tabler/icons-react'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getAllFriend } from '~/apis'

function FriendList() {
  const [listFriend, setListFriend] = useState([])

  useEffect(() => {
    getAllFriend().then(data => setListFriend(data?.allFriend))
  }, [])

  return (
    <div className='w-full'>
      <div className='p-4'>
        <div className='mb-4'>
          <span className='text-xl font-bold'>All friends</span>
        </div>
        <div className='grid grid-cols-12 gap-x-2'>
          {
            listFriend?.map(friend => (
              <div key={friend?.friendId} className='bg-white col-span-12 md:col-span-6 lg:col-span-4 xl:col-span-3 h-[380px] rounded-md flex flex-col'>
                <Link to={`/profile?id=${friend?.friendId}`}>
                  <img
                    className='w-full h-[205px] object-cover rounded-t-md'
                    src={friend?.avata || '../src/assets/img/avatar_holder.png'}
                  />
                </Link>
                <div className='p-3 h-full flex flex-col'>
                  <span className='font-bold'>{friend?.friendName}</span>
                  <div className=' flex flex-col gap-2 h-full justify-end items-center'>
                    <div className='text-blue-500 bg-blue-100 hover:bg-blue-200 cursor-pointer w-full flex justify-center rounded-md'>
                      <span className='my-2 font-bold flex'><IconMessage /> Send message</span>
                    </div>
                    {/* <div className='text-red-500 bg-red-100 hover:bg-red-200 cursor-pointer w-full flex justify-center rounded-md'>
                      <span className='my-2 font-bold'>Remove</span>
                    </div> */}
                  </div>
                </div>
              </div>
            ))
          }
        </div>
      </div>

    </div>
  )
}

export default FriendList
