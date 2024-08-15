import { IconMessage } from '@tabler/icons-react'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, useLocation, useSearchParams } from 'react-router-dom'
import { searchAll } from '~/apis'
import GroupAvatar from '~/components/UI/GroupAvatar'
import { SEARCH_TYPE } from '~/utils/constants'
import NotFound from '~/assets/img/not_found.png'
import SearchNotFound from '~/components/UI/SearchNotFound'
import InfiniteScroll from '~/components/IntersectionObserver/InfiniteScroll'

function GroupSearch() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [page, setPage] = useState(1)
  const [totalPage, setTotalPage] = useState(1)
  const [searchResults, setSearchResults] = useState([])
  const query = searchParams.get('q')
  const { t } = useTranslation()
  useEffect(() => {
    searchAll({ search: query, type: SEARCH_TYPE.GROUP, page })
      .then(res => {
        setSearchResults([...searchResults, ...res.groups])
      })
  }, [query])
  return (
    <div className='bg-fbWhite h-full overflow-y-auto scrollbar-none-track flex justify-center'>
      <div className='w-[80%] lg:w-[600px] p-8'>
        <InfiniteScroll
          className={'flex flex-col gap-4'}
          fetchMore={() => setPage((prev) => prev + 1)}
          hasMore={page < totalPage}>
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
        </InfiniteScroll>

        {
          searchResults.length == 0 && <SearchNotFound />
        }
      </div>
    </div>
  )
}

export default GroupSearch
