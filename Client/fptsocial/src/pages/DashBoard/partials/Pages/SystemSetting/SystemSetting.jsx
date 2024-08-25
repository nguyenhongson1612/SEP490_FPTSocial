import { useEffect, useState } from 'react'
import { getGender, getInterest } from '~/apis'
import { getGroupType } from '~/apis/groupApis'

function SystemSetting() {
  const [listGender, setListGender] = useState([])
  const [listInterest, setListInterest] = useState([])
  const [listGroupType, setListGroupType] = useState([])

  useEffect(() => {
    getGender().then(data => setListGender(data))
    getInterest().then(data => setListInterest(data))
    getGroupType().then(data => setListGroupType(data))
  }, [])

  return <div className='bg-white flex justify-center items-center h-full'>
    <div className='w-[95%] h-[90%] border rounded-md shadow-xl p-1'>
      <div className='grid grid-cols-12 gap-2'>
        <div className='col-span-12 md:col-span-6'>
          <div className='flex flex-col'>
            <div>User</div>
          </div>
          <div className='w-full bg-fbWhite rounded-lg p-2'>
            {listGender?.map(gender => (
              <div key={gender?.genderId} className='border-b p-1'>{gender?.genderName}</div>
            ))}
          </div>
        </div>
        <div>

        </div>

      </div>
    </div>
  </div>
}
export default SystemSetting
