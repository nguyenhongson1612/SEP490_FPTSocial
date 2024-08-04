import { IconMessage } from '@tabler/icons-react'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, useLocation, useSearchParams } from 'react-router-dom'
import { searchAll } from '~/apis'
import UserAvatar from '~/components/UI/UserAvatar'
import { SEARCH_TYPE } from '~/utils/constants'
import NotFound from '~/assets/img/not_found.png'

function UserSearch() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [searchResults, setSearchResults] = useState([])
  const query = searchParams.get('q')
  const { t } = useTranslation()
  useEffect(() => {
    searchAll({ search: query, type: SEARCH_TYPE.USER })
      .then(res => {
        setSearchResults(res.userProfiles)
      })
  }, [query])
  return (
    <div className='bg-fbWhite h-full overflow-y-auto scrollbar-none-track flex justify-center'>
      <div className='flex flex-col gap-4 w-[80%] lg:w-[700px] p-8'>
        {
          searchResults?.map(user => (
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
          searchResults.length == 0 && <div className=' flex flex-col justify-center items-center'>
            <img src={NotFound} className='size-20' />
            <div className=' capitalize text-center text-gray-500 leading-relaxed'>
              <p className='font-bold'>Chúng tôi không tìm thấy kết quả nào</p>
              <p className='font-light'>Đảm bảo tất cả các từ đều đúng chính tả hoặc thử từ khóa khác.</p>
            </div>
          </div>
        }
      </div>
    </div>
  )
}

export default UserSearch
