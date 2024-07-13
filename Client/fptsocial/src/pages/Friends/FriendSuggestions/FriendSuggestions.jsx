import { Button, Card, CardActions, CardContent, CardMedia, Typography } from '@mui/material'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { suggestionFriend } from '~/apis'

function FriendSuggestions() {
  const [listSuggestedFriend, setListSuggestedFriend] = useState([])
  useEffect(() => {
    suggestionFriend().then(data => setListSuggestedFriend(data?.allFriend))
  })

  return (
    <div className='w-full'>
      <div className='p-4'>
        <div className='mb-4'>
          <span className='text-xl font-bold'>People you may know</span>
        </div>
        <div className='grid grid-cols-12 gap-x-2'>
          {
            listSuggestedFriend?.map(suggestion => (
              <div key={suggestion?.friendId} className='bg-white col-span-12 md:col-span-6 lg:col-span-4 xl:col-span-3 h-[380px] rounded-md flex flex-col'>
                <Link to={`/profile?id=${suggestion?.friendId}`}>
                  <img
                    className='w-full h-[205px] object-cover rounded-t-md'
                    src={suggestion?.avata || '../src/assets/img/avatar_holder.png'}
                  />
                </Link>
                <div className='p-3 h-full flex flex-col'>
                  <span className='font-bold'>{suggestion?.friendName}</span>
                  <div className=' flex flex-col gap-2 h-full justify-end items-center'>
                    <div className='text-blue-500 bg-blue-100 hover:bg-blue-200 cursor-pointer w-full flex justify-center rounded-md'>
                      <span className='my-2 font-bold'>Add friend</span>
                    </div>
                    <div className='text-red-500 bg-red-100 hover:bg-red-200 cursor-pointer w-full flex justify-center rounded-md'>
                      <span className='my-2 font-bold'>Remove</span>
                    </div>
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

export default FriendSuggestions
