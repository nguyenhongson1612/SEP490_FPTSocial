import { TabContext, TabList } from '@mui/lab'
import { Box, Tab } from '@mui/material'
import React, { useEffect, useState } from "react"
import { Link, useNavigate } from 'react-router-dom'
import { getImageByUserId } from '~/apis'
import { SEARCH_TYPE } from '~/utils/constants'
import notFoundImg from '~/assets/img/not_found.png'

function Photos({ user }) {
  const [listPhotos, setListPhotos] = useState([])
  const [filterType, setFilterType] = useState(SEARCH_TYPE.ALL)
  const [value, setValue] = React.useState('1')

  const handleChange = (event, newValue) => {
    if (newValue == '1')
      setFilterType(SEARCH_TYPE.ALL)
    else setFilterType(SEARCH_TYPE.AVATAR)
    setValue(newValue)
  }

  useEffect(() => {
    user &&
      getImageByUserId({ userId: user?.userId, type: filterType }).then(data => setListPhotos(data?.photos))
  }, [filterType, user])

  const navigate = useNavigate()
  const handleLinkTo = (e) => {
    if (e?.userPostPhotoId)
      navigate(`/photo/${e?.userPostPhotoId}?type=photo`)
    else if (e?.userPostId)
      navigate(`/media/${e?.userPostId}?type=profile`)
  }

  return (
    <div className='flex justify-center min-h-[300px]'>
      <div className='w-[90%] md:w-[80%] bg-white p-4 rounded-xl shadow-xl'>
        <Box sx={{
          marginBottom: '20px',
          '.MuiTabs-scroller': {
            display: 'flex',
          },
          '.MuiButtonBase-root': { fontWeight: '600', fontSize: '0.75rem' }
        }}>
          <TabContext value={value}>
            <TabList onChange={handleChange}>
              <Tab label="All" value="1" />
              <Tab label="Avatar" value="2" />
            </TabList>
          </TabContext>
        </Box>
        <div className='grid grid-cols-12 gap-1 '>
          {
            listPhotos?.map((e, i) => (
              <div
                onClick={() => handleLinkTo(e)} key={i} className='col-span-12 xs:col-span-6 md:col-span-4 lg:col-span-3 cursor-pointer'>
                <img src={e?.photoUrl} className='object-cover h-full rounded-md border w-full' />
              </div>
            ))
          }
        </div>
        {
          listPhotos.length == 0 &&
          <div className='w-full flex justify-center'>
            <div className='flex flex-col items-center font-semibold capitalize text-gray-500'>
              <img loading="lazy" src={notFoundImg} className='size-20' />
              <span>No data</span>
            </div>
          </div>
        }
      </div>
    </div>
  )
}

export default Photos
