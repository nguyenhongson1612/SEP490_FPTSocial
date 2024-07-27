import { Button } from '@mui/material'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getGroupRole, getListMemberByRole, getRequestJoin, memberJoinStatus, updateOrRemoveMember } from '~/apis/groupApis'
import UserAvatar from '~/components/UI/UserAvatar'
import { selectIsReload, triggerReload } from '~/redux/ui/uiSlice'
import { selectCurrentUser } from '~/redux/user/userSlice'
import ListMemberByRole from './ListMemberByRole'
import { ADMIN, CENSOR, MEMBER } from '~/utils/constants'
import { useConfirm } from 'material-ui-confirm'
import AutoCompleteSearch from '~/components/Search/AutoCompleteSearch'

function GroupManageMember({ group }) {
  const currentUser = useSelector(selectCurrentUser)
  const dispatch = useDispatch()
  const [listMemberByRole, setListMemberByRole] = useState()
  const [listGroupRole, setListGroupRole] = useState([])
  const [currentUserType, setCurrentUserType] = useState('')

  useEffect(() => {
    getListMemberByRole(group?.groupId).then(data => setListMemberByRole(data))
    getGroupRole().then(data => setListGroupRole(data))
  }, [group])
  useEffect(() => {
    if (listMemberByRole)
      setCurrentUserType(listMemberByRole?.groupAdmin?.some(e => e?.userId == currentUser?.userId) ? ADMIN :
        listMemberByRole?.groupMangager?.some(e => e?.userId == currentUser?.userId) ? CENSOR : MEMBER
      )
  }, [listMemberByRole])

  const confirmFile = useConfirm()
  const handleUpdateMember = (type, user, role) => {
    confirmFile({
      title: (<div className={type == 1 ? 'text-blue-600' : 'text-red-500'}>
        {type == 1 ? <span>Promote {user?.memberName} become a <span className='font-bold text-red-700'>{role?.groupRoleName}</span></span>
          : `Kick ${user?.memberName} out of group?`}</div>),
      description: (
        type == 1 ? `Are you sure you want to promote this member to become a ${role?.groupRoleName} of this group?`
          : 'Are you sure you want to remove this member out of this group?'
      ),
      confirmationText: 'Confirm',
      cancellationText: 'Cancel'
    }).then(() => {
      const submitData = {
        'userId': currentUser?.userId,
        'groupId': user?.groupId,
        'memberId': user?.userId,
        'groupRoleId': type == 1 ? role?.groupRoleId : null,
        'action': type
      }
      updateOrRemoveMember(submitData).then(() => dispatch(triggerReload()))
    }).catch(() => { })
  }

  return (
    <div className='bg-fbWhite w-full '>
      <div className='h-[100px] p-6 bg-white flex justify-center'>
        <AutoCompleteSearch />
      </div>
      <div className='flex h-[calc(100vh_-_100px)] flex-col gap-3 items-center mt-4 overflow-y-auto scrollbar-none-track'>
        <ListMemberByRole listMember={listMemberByRole?.groupAdmin} roleType={ADMIN}
          currentUserType={currentUserType} handleUpdateMember={handleUpdateMember} listGroupRole={listGroupRole} />
        <ListMemberByRole listMember={listMemberByRole?.groupMangager} roleType={CENSOR}
          currentUserType={currentUserType} handleUpdateMember={handleUpdateMember} listGroupRole={listGroupRole} />
        <ListMemberByRole listMember={listMemberByRole?.groupMember} roleType={MEMBER}
          currentUserType={currentUserType} handleUpdateMember={handleUpdateMember} listGroupRole={listGroupRole} />
      </div>
    </div>
  )
}

export default GroupManageMember
