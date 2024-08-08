import { IconFileDescription, IconUsersGroup } from '@tabler/icons-react'
import { useEffect, useState } from 'react'
import { getListMemberGroup } from '~/apis/groupApis'
import Member from './Member'

function GroupMember({ group }) {
  const [listGroupMember, setListGroupMember] = useState([])

  useEffect(() => {
    group &&
      getListMemberGroup(group?.groupId).then(data => setListGroupMember(data))
  }, [group])

  return <div className='flex justify-center'>

    <div
      className='w-[90%] md:w-[600px] h-fit rounded-md flex flex-col gap-5 '>
      <div className='flex flex-col p-4 gap-3 bg-white shadow-lg rounded-lg'>
        <h3 className='text-xl font-bold'>About</h3>
        <div>
          <div className='flex gap-1'><IconUsersGroup stroke={1} /><span className=''>{group?.groupName}</span></div>
          <div className='flex gap-1'><IconFileDescription stroke={1} /><span className=''>{group?.groupDescription}</span></div>
        </div>
      </div>
      <div className='flex h-[calc(100vh_-_100px)] flex-col gap-3 items-center mt-4  bg-white shadow-lg rounded-lg'>
        <div className='border-b w-full p-2 text-sm font-semibold '>
          Member<span className='text-gray-500 p-2 text-pretty'>.</span><span className='text-gray-500'>{group?.memberCount}</span>
        </div>
        <Member listMember={listGroupMember?.groupAdmin} roleType={'Admin'} />
        <Member listMember={listGroupMember?.groupMangager} roleType={'Manager'} />
        <Member listMember={listGroupMember?.groupMember} roleType={'Member'} />
      </div>
    </div>
  </div>
}

export default GroupMember
