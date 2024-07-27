import { IconSearch } from '@tabler/icons-react';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { getAllFriend, getAllFriendOtherProfile, searchFriendByName } from '~/apis';
import GroupAvatar from '~/components/UI/GroupAvatar';
import UserAvatar from '~/components/UI/UserAvatar';
import { useDebounceFn } from '~/customHooks/useDebounceFn';
import { selectCurrentUser } from '~/redux/user/userSlice';

function FriendProfile({ user }) {
  const [listFriend, setListFriend] = useState([])
  const currentUser = useSelector(selectCurrentUser)
  const isYourProfile = currentUser?.userId == user?.userId
  const [loading, setLoading] = useState(false)


  const handleInputSearchChange = (event) => {
    const searchValue = event.target?.value
    if (!searchValue) return

    // const searchPath = `?${createSearchParams({ 'q[title]': searchValue })}`

    setLoading(true)
    searchFriendByName({ search: searchValue, accUserId: user?.userId, userId: currentUser?.userId })
      .then(res => {
        console.log('🚀 ~ handleInputSearchChange ~ res:', res.getFriendByName)

        setListFriend(res?.getFriendByName)
      })
      .finally(() => {
        setLoading(false)
      })
  }
  const debounceSearchBoard = useDebounceFn(handleInputSearchChange, 1000)


  useEffect(() => {
    isYourProfile ? getAllFriend().then(data => setListFriend(data?.allFriend))
      : getAllFriendOtherProfile(user?.userId).then(data => setListFriend(data?.allFriend))
  }, [user])

  return (
    <div className=' w-full flex justify-center'>
      <div className='w-[95%] sm:w-[600px] bg-white rounded-md p-2'>
        <div className='flex flex-col gap-6'>
          <div className='flex justify-between'>
            <span className='font-bold text-lg'>Friends</span>
            <div className="relative text-gray-600" >
              <input className="w-full bg-fbWhite h-10 px-5 pr-16 rounded-xl text-sm font-light focus:outline-none"
                type="search" placeholder="Search friend"
                onChange={debounceSearchBoard}
              />
              <span className='absolute right-2 top-1/2 -translate-y-1/2'><IconSearch className='text-orangeFpt' /></span>
            </div>
          </div>
          <div className='grid grid-cols-2 gap-2'>
            {listFriend?.map((friend) => (
              <Link
                to={`/profile?id=${friend?.friendId}`}
                key={friend?.friendId}
                className='col-span-2 sm:col-span-1 flex gap-4 p-2 border rounded-lg hover:bg-fbWhite'
              >
                <GroupAvatar
                  avatarSrc={friend?.avata || './src/assets/img/avatar_holder.png'}
                  isOther={true}
                  size={20}
                />
                <div className='flex flex-col gap-2'>
                  <span className='capitalize font-semibold'>{friend?.friendName}</span>
                  <span>{friend?.mutualFriends} mutualFriends</span>
                </div>
              </Link>
            ))}
          </div>
        </div>

      </div>

    </div>
  )
}

export default FriendProfile;
