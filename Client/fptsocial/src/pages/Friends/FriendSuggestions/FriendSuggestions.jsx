import { Button, Card, CardActions, CardContent, CardMedia, Typography } from '@mui/material'
import { Link } from 'react-router-dom'

function FriendSuggestions() {
  return (
    <div className='w-full bg-fbWhite'>
      <div className='p-4'>
        <div className='mb-4'>
          <span className='text-xl font-bold'>People you may know</span>
        </div>
        <div className='grid grid-cols-12 gap-x-2'>

          <div className='bg-white col-span-3 h-[380px] rounded-md flex flex-col'>
            <Link to={'/profile?id=65cd438c-25c9-4642-a178-4425c2042310'}>
              <img
                className='w-full h-[205px] object-cover rounded-t-md'
                src={'https://scontent.fhan18-1.fna.fbcdn.net/v/t1.6435-1/65284411_427387984775080_1947637054485561344_n.jpg?stp=dst-jpg_s240x240&_nc_cat=105&ccb=1-7&_nc_sid=e4545e&_nc_eui2=AeHkE_88RC1X9bLXiBcFM54iIY9dU_utxS4hj11T-63FLrLDMVcdNDF8mQeQEnOcUjYeHpayaA7Nbk4OW1qAqoMv&_nc_ohc=LZyhC0sZUxEQ7kNvgHqW7bl&_nc_ht=scontent.fhan18-1.fna&oh=00_AYDjyEweRxRmHHbAsQdVFcXbuVlKHT3XKmGQoVpUPhIbiw&oe=66A9BE95'}
              />
            </Link>
            <div className='p-3 h-full flex flex-col'>
              <span className='font-bold'>hoan2</span>
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
          <div className='bg-white col-span-3 h-[380px] rounded-md flex flex-col'>
            <Link to={'/profile?id=2e7325d4-37ae-4606-b88a-eba05ec6dc82'}>
              <img
                className='w-full h-[205px] object-cover rounded-t-md'
                src={'https://scontent.fhan18-1.fna.fbcdn.net/v/t1.6435-1/65284411_427387984775080_1947637054485561344_n.jpg?stp=dst-jpg_s240x240&_nc_cat=105&ccb=1-7&_nc_sid=e4545e&_nc_eui2=AeHkE_88RC1X9bLXiBcFM54iIY9dU_utxS4hj11T-63FLrLDMVcdNDF8mQeQEnOcUjYeHpayaA7Nbk4OW1qAqoMv&_nc_ohc=LZyhC0sZUxEQ7kNvgHqW7bl&_nc_ht=scontent.fhan18-1.fna&oh=00_AYDjyEweRxRmHHbAsQdVFcXbuVlKHT3XKmGQoVpUPhIbiw&oe=66A9BE95'}
              />
            </Link>
            <div className='p-3 h-full flex flex-col'>
              <span className='font-bold'>hoan5</span>
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

        </div>
      </div>

    </div>
  )
}

export default FriendSuggestions
