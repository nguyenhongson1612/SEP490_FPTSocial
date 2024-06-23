import { Switch } from '@mantine/core'
import { useEffect, useState } from 'react'
import { Form } from 'react-router-dom'
import NavTopBar from '~/components/NavTopBar/NavTopBar'

function Setting() {
  const [listSetting, setListSetting] = useState([])
  const [listStatus, setListSatatus] = useState([])

  useEffect(() => {

  }, [])

  return (
    <div className='bg-fbWhite'>
      <NavTopBar />
      <div className='h-[calc(100vh_-_55px)] flex justify-center'>
        <div className='bg-white w-[90%] md:w-[500px] h-fit mt-8'>
          <div className='flex flex-col p-2'>
            <div className='flex justify-between items-center pb-2 border-b-2'>
              <span></span>
              <span className='text-xl font-bold'>User settings</span>
              <span></span>
            </div>
            <div>
              <Switch size="lg" offLabel="OFF" onLabel="ON" />
            </div>

          </div>
        </div>
      </div>
    </div>

  )
}

export default Setting
