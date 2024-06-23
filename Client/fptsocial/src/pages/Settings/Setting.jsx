import { Switch } from '@mantine/core'
import { useEffect, useState } from 'react'
import { Form, useNavigate } from 'react-router-dom'
import NavTopBar from '~/components/NavTopBar/NavTopBar'
import { IconLock, IconWorld } from '@tabler/icons-react';
import { getListSettings, getStatus, getUserSettings, updateSettings } from '~/apis';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';

function Setting() {
  const [listSetting, setListSetting] = useState([])
  const [listStatus, setListStatus] = useState([])
  const [userSetting, setUserSetting] = useState([])
  const privateId = listStatus?.find(e => e.statusName.toLowerCase() == 'private')?.userStatusId
  const publicId = listStatus?.find(e => e.statusName.toLowerCase() == 'public')?.userStatusId
  const navigate = useNavigate()

  const { register, control, watch, setValue, handleSubmit, formState: { errors, isValid } } = useForm({})
  useEffect(() => {
    getListSettings().then(data => setListSetting(data))
    getStatus().then(data => setListStatus(data))
    getUserSettings().then(data => setUserSetting(data?.usersettings))
  }, [])

  const handleUpdateStatus = (settingId, currentStatusId) => {
    setUserSetting(prev => prev.map(e => {
      if (e?.settingId == settingId)
        return { ...e, userStatusId: currentStatusId == publicId ? privateId : publicId }
      return e
    }))
  }

  const submitSetting = (data) => {
    const submitData = {
      'userId': userSetting[0]?.userId,
      'userSettings': userSetting?.map(e => {
        const { userId, ...rest } = e
        return rest
      })
    }
    toast.promise(
      updateSettings(submitData),
      { pending: 'Updating is in progress...' }
    ).then(() => {
      navigate('/')
      toast.success('Setting updated successfully')
    })
  }

  return (
    <div className='bg-fbWhite'>
      <NavTopBar />
      <div className='h-[calc(100vh_-_55px)] flex justify-center'>
        <div className='bg-white w-[90%] md:w-[500px] h-fit mt-8 rounded-xl shadow-md'>
          <div className='flex flex-col p-4'>
            <div className='flex justify-between items-center pb-2 border-b-2'>
              <span></span>
              <span className='text-xl font-bold'>User settings</span>
              <span></span>
            </div>
            <form className='flex flex-col gap-5' onSubmit={handleSubmit(submitSetting)}>
              {
                listSetting?.map(setting => (
                  <div key={setting?.settingId}>
                    <div className='font-bold text-lg'>{setting?.settingName}</div>
                    <div className='flex gap-3 font-semibold'>
                      <Switch size="lg"
                        checked={userSetting?.find(e => e.settingId == setting?.settingId)?.userStatusId == publicId}
                        onClick={() => handleUpdateStatus(
                          setting?.settingId,
                          userSetting?.find(e => e.settingId == setting?.settingId)?.userStatusId
                        )}
                        offLabel={<IconLock />} onLabel={<IconWorld />}
                        {...register(`setting_${setting?.settingName.replace(/\s/g, '_').toLowerCase()}`)}
                      />
                      {
                        userSetting?.find(e => e.settingId == setting?.settingId)?.userStatusId == publicId ?
                          <span><span className='text-blue-500 font-bold'>Public</span>. Everyone can see you</span> :
                          <span><span className='text-red-500 font-bold'>Private</span>. No one can see you </span>
                      }
                    </div>
                  </div>
                ))
              }
              <div className="w-full">
                <button id="button" type="submit"
                  className="interceptor-loading w-full p-4 font-bold bg-orangeFpt text-white rounded-md hover:bg-orange-600">Update Setting</button>
              </div>
            </form>

          </div>
        </div>
      </div>
    </div>

  )
}

export default Setting
