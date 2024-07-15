import { Button } from '@mui/material'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getRequestJoin, memberJoinStatus } from '~/apis/groupApis'
import UserAvatar from '~/components/UI/UserAvatar'
import { selectIsReload, triggerReload } from '~/redux/ui/uiSlice'
import { selectCurrentUser } from '~/redux/user/userSlice'

function GroupRequest({ group }) {
  const [listMemberRequest, setListMemberRequest] = useState([])
  const currentUser = useSelector(selectCurrentUser)
  const isReload = useSelector(selectIsReload)
  const dispatch = useDispatch()

  useEffect(() => {
    getRequestJoin(group?.groupId).then(data => setListMemberRequest(data?.requestJoinGroups))
  }, [group, isReload])

  const handleApproveJoinRequest = (reqId) => {
    const submitData = {
      'managerId': currentUser?.userId,
      'userId': reqId,
      'groupId': group?.groupId,
      'isJoin': true
    }
    memberJoinStatus(submitData).then(() => dispatch(triggerReload()))
  }

  const handleDeclineJoinRequest = (reqId) => {
    const submitData = {
      'managerId': currentUser?.userId,
      'userId': reqId,
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
            listMemberRequest?.map(request => (
              <div key={request?.userId} className='flex justify-between items-center bg-white p-4 rounded-lg'>
                <div className='flex gap-2'>
                  <UserAvatar avatarSrc={request?.userAvata} isOther={true} />
                  <div>{request?.userName}</div>
                </div>
                <div className='flex items-center gap-2'>
                  <Button className='interceptor-loading' variant="contained" onClick={() => handleApproveJoinRequest(request?.userId)}>
                    Approve
                  </Button>
                  <Button className='interceptor-loading' variant="contained" color='warning'
                    onClick={() => handleDeclineJoinRequest(request?.userId)}>
                    Decline
                  </Button>
                </div>
              </div>
            ))
          }
        </div>
      </div>
    </div>
  )
}

export default GroupRequest
