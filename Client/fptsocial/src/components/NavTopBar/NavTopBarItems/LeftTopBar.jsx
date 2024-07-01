import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import FPTUen from '~/assets/img/FPTUen.png'
import { mockSearchData } from '~/apis/mock-data'
import { IconCaretLeftFilled, IconSearch } from '@tabler/icons-react'

function LeftTopBar() {
  const [isSearch, setIsSearch] = useState(false)
  const [searchHistoryData, setSearchHistoryData] = useState(mockSearchData.data)
  const [searchData, setSearchData] = useState([])
  const [textSearch, setTextSearch] = useState('')
  const refModal = useRef()
  const checkClickOutSide = (e) => {
    if (isSearch && !refModal.current.contains(e.target)) setIsSearch(!isSearch)
  }

  useEffect(() => {
    document.addEventListener('click', checkClickOutSide)
    return () => document.removeEventListener('click', checkClickOutSide)
  }, [isSearch])

  const handleClickSearch = () => {
    if (isSearch) return
    setIsSearch(!isSearch)
  }

  const handleSearch = (e) => {
    // console.log(textSearch)
    setTextSearch(e.target.value.trim())
    setSearchData(mockSearchData.data.filter(item => item.text.trim().toLowerCase().includes(e.target.value.toLowerCase())))
  }

  return <div id='left-top-bar'
    ref={refModal}
    className="flex gap-1 md:gap-5 justify-around items-center"
  >
    {!isSearch &&
      <Link to={'/home'} className="flex items-center">
        <img
          src={FPTUen}
          alt="home-img"
          className="w-[85px]"
        />
      </Link>
    }
    {
      isSearch && (
        <div id='search-modal'
          className='absolute top-0 left-0 h-fit w-full sm:w-[400px] bg-white shadow-4edges rounded-lg z-20'>

          <div id='search-data'
            className='flex justify-center mt-[60px]'>
            <div className='w-[90%] flex flex-col items-center'>
              {textSearch.length == 0 && (
                <div className='w-full flex  justify-between'>
                  <span className='text-md font-semibold font-sans p-2'>Recent</span>
                  <span className='text-md font-semibold font-sans text-[rgb(0,100,209)] cursor-pointer hover:bg-fbWhite p-2'>Edit</span>
                </div>
              )}

              <div className='w-full flex flex-col items-center'>
                {
                  (textSearch.length === 0 ? searchHistoryData : searchData)?.length === 0 ? (
                    textSearch.length === 0 ? <div className='font-semibold font-mb text-gray-500'>Recent History Search Data Not Found!</div> :
                      <div className='font-semibold font-mb text-gray-500'>Data Not Found!</div>
                  ) : (
                    (textSearch.length === 0 ? searchHistoryData : searchData)?.slice(0, 7).map(data => (
                      <div id='search-history-item'
                        key={data?.id}
                        className='h-[60px] w-full rounded-lg flex items-center gap-3 hover:bg-fbWhite cursor-pointer'>
                        <div className='basis-2/12'>
                          <img src={data?.avatar} className='w-10 rounded-[50%]' />
                        </div>
                        <div className='basis-9/12'>
                          {data?.text}
                        </div>
                        {textSearch.length === 0 && (
                          <div className='basis-1/12 cursor-pointer p-2 hover:bg-[rgb(249,216,138)] rounded-[50%]'
                            onClick={() => setSearchHistoryData(searchHistoryData.filter(d => d.id !== data.id))}
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
                              <path fillRule="evenodd" d="M5.47 5.47a.75.75 0 0 1 1.06 0L12 10.94l5.47-5.47a.75.75 0 1 1 1.06 1.06L13.06 12l5.47 5.47a.75.75 0 1 1-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 0 1-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
                            </svg>
                          </div>
                        )}
                      </div>
                    ))
                  )
                }
              </div>
            </div>
          </div>

        </div>
      )
    }
    <div className='relative z-20 flex items-center justify-start sm:justify-between'>
      {isSearch &&
        <div id='back-icon'
          className='h-[55px] w-fit xs:w-[120px] flex justify-start items-center xs:translate-x-10'>
          <div className='p-2 bg-orangeFpt text-white rounded-full cursor-pointer'
            onClick={() => setIsSearch(!isSearch)}>
            <IconCaretLeftFilled className='size-6' />
          </div>
        </div>
      }

      <div id="search-box"
        className={`relative p-2 h-fit w-fit lg:h-9 lg:w-[240px] ${isSearch ? '' : ''} flex items-center bg-fbWhite text-xs text-gray-600 rounded-3xl z-20`}
        onClick={handleClickSearch}
      >
        <div className={`p-1 left-6 ${isSearch && 'hidden w-0'}`}
        >
          <IconSearch className='size-5 text-orangeFpt' />
        </div>

        <input
          type="text"
          className={`hidden md:!block ${isSearch && '!block '} w-[196px] h-[24px] bg-fbWhite p-2 text-base focus:outline-none `}
          placeholder="Search..."
          onChange={handleSearch}
        />
      </div>
    </div>


  </div>
}

export default LeftTopBar
