import { Button } from '@mui/material'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getRequestJoin, memberJoinStatus } from '~/apis/groupApis'
import UserAvatar from '~/components/UI/UserAvatar'
import { selectIsReload, triggerReload } from '~/redux/ui/uiSlice'
import { selectCurrentUser } from '~/redux/user/userSlice'

function GroupManage({ group }) {
  const currentUser = useSelector(selectCurrentUser)
  const dispatch = useDispatch()


  const handleRemoveMember = (memberId) => {
    const submitData = {
      'managerId': currentUser?.userId,
      'userId': memberId,
      'groupId': group?.groupId,
      'isJoin': false
    }
    memberJoinStatus(submitData).then(() => dispatch(triggerReload()))
  }

  return (
    <div className='bg-fbWhite w-full '>
      <div className='h-[150px] p-6 bg-white'>
      </div>
      <div className='flex flex-col items-center mt-4'>
        <div className='flex flex-col gap-4 w-[90%] md:w-[70%]'>
          {
            group?.groupMember?.map(member => (
              <div key={member?.userId} className='flex justify-between items-center bg-white p-4 rounded-lg'>
                <div className='flex gap-2 items-center'>
                  <UserAvatar avatarSrc={member?.avata} isOther={true} />
                  <div className='flex flex-col'>
                    <span className='font-semibold'>{member?.memberName}</span>
                    <span
                      className={`font-semibold text-sm 
                      ${member?.groupRoleName?.toLowerCase() == 'admin' ? 'text-blue-700' : 'text-gray-500'}`}>
                      {member?.groupRoleName}</span>
                  </div>
                </div>
                {member?.groupRoleName?.toLowerCase() !== 'admin' &&
                  <div className='flex items-center gap-2'>
                    <Button className='interceptor-loading' variant="contained" color='warning' onClick={() => handleRemoveMember(member?.userId)}>
                      Remove
                    </Button>
                  </div>
                }

              </div>
            ))
          }
        </div>
      </div>
    </div>
  )
}

export default GroupManage
