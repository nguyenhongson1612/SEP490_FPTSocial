import { IconMessage } from '@tabler/icons-react'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, useLocation, useSearchParams } from 'react-router-dom'
import { searchAll } from '~/apis'
import GroupAvatar from '~/components/UI/GroupAvatar'
import SearchNotFound from '~/components/UI/SearchNotFound'
import UserAvatar from '~/components/UI/UserAvatar'
import { SEARCH_TYPE } from '~/utils/constants'

function SearchAll() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [searchResults, setSearchResults] = useState([])
  const query = searchParams.get('q')
  const { t } = useTranslation()
  useEffect(() => {
    searchAll({ search: query, type: SEARCH_TYPE.ALL })
      .then(res => {
        setSearchResults(res)
      })
  }, [query])
  return (
    <div className='bg-fbWhite h-full overflow-y-auto scrollbar-none-track flex justify-center'>
      <div className='flex flex-col gap-4 w-[80%] lg:w-[600px] p-8'>
        {
          searchResults?.userProfiles?.map(user => (
            <div key={user?.userId} className='flex gap-2 bg-white py-2 px-3 rounded-md shadow-lg'>
              <Link to={`/profile?id=${user?.userId}`}>
                <UserAvatar avatarSrc={user?.avataUrl} isOther={true} />
              </Link>

              <span className='grow capitalize'>{user?.userName}</span>
              <div className='flex item-center justify-start bg-blue-50 text-blue-500 p-2 rounded-md cursor-pointer'><IconMessage />Message</div>
            </div>
          ))
        }
        {
          searchResults?.groups?.map(group => (
            <div key={group?.groupId} className='flex gap-2 bg-white py-2 px-3 rounded-md shadow-lg'>
              <Link to={`/profile?id=${group?.groupId}`}>
                <GroupAvatar avatarSrc={group?.coverImage} />
              </Link>
              <div className='grow'>
                <span className='capitalize'>{group?.groupName}</span>
                <div className='first-letter:uppercase text-sm font-light'>{group?.groupDescription}</div>
              </div>

              <div className='flex item-center justify-start bg-blue-50 hover:bg-blue-100 text-blue-500 p-2 rounded-md cursor-pointer'>Join</div>
            </div>
          ))
        }
        {
          searchResults?.groups?.length == 0 && searchResults?.userPosts?.length == 0 && searchResults?.userProfiles?.length == 0 && <SearchNotFound />
        }
      </div>
    </div>
  )
}

export default SearchAll
