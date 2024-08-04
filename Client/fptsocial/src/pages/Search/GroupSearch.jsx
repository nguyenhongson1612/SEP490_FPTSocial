import { IconMessage } from '@tabler/icons-react'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, useLocation, useSearchParams } from 'react-router-dom'
import { searchAll } from '~/apis'
import GroupAvatar from '~/components/UI/GroupAvatar'
import { SEARCH_TYPE } from '~/utils/constants'
import NotFound from '~/assets/img/not_found.png'

function GroupSearch() {
  const [searchParams, setSearchParams] = useSearchParams()
  const location = useLocation()
  const [searchResults, setSearchResults] = useState([])
  const query = searchParams.get('q')
  const { t } = useTranslation()
  useEffect(() => {
    searchAll({ search: query, type: SEARCH_TYPE.GROUP })
      .then(res => {
        setSearchResults(res.groups)
      })
  }, [query])
  return (
    <div className='bg-fbWhite h-full overflow-y-auto scrollbar-none-track flex justify-center'>
      <div className='flex flex-col gap-4 w-[80%] lg:w-[700px] p-8'>
        {
          searchResults?.map(group => (
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

export default GroupSearch
