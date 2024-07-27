import NavTopBar from '~/components/NavTopBar/NavTopBar'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Controller, useForm } from 'react-hook-form'
import GroupManageSideBar from './GroupManageSideBar/GroupManageSideBar.jsx'
import { selectIsReload } from '~/redux/ui/uiSlice'
import GroupRequest from './GroupManage/GroupRequest'
import { getGroupByGroupId, selectCurrentActiveGroup } from '~/redux/activeGroup/activeGroupSlice.js'
import GroupHome from './GroupHome/GroupHome.jsx'
import GroupSetting from './GroupManage/GroupSettings.jsx'
import GroupManageMember from './GroupManage/GroupManageMember/GroupManageMember.jsx'
import GroupPostApproval from './GroupManage/GroupPostApproval.jsx'


function Group() {
  const location = useLocation()
  const isMemberRequest = /^\/groups\/[a-zA-Z0-9-]+\/member-requests\/?$/.test(location.pathname)
  const isMemberManage = /^\/groups\/[a-zA-Z0-9-]+\/member-manage\/?$/.test(location.pathname)
  const isHomeGroup = /^\/groups\/[a-zA-Z0-9-]+\/?$/.test(location.pathname)
  const isPostDetail = /^\/groups\/[a-zA-Z0-9-]+\/post\/[a-zA-Z0-9-]+\/?$/.test(location.pathname)
  const isSetting = /^\/groups\/[a-zA-Z0-9-]+\/settings\/?$/.test(location.pathname)
  const isPendingPost = /^\/groups\/[a-zA-Z0-9-]+\/pending-posts\/?$/.test(location.pathname)

  const { register, watch, getValues, setValue, control, handleSubmit, formState: { errors } } = useForm()

  const isReload = useSelector(selectIsReload)
  const dispatch = useDispatch()
  const { groupId } = useParams()
  const group = useSelector(selectCurrentActiveGroup)

  useEffect(() => {
    dispatch(getGroupByGroupId(groupId))
  }, [groupId, isReload])

  return (
    <>
      <NavTopBar />
      <div className='flex h-[calc(100vh_-_55px)] overflow-clip'>
        {
          (group?.isAdmin || group?.isCensor) && (
            <>
              <GroupManageSideBar group={group} />
              {isMemberRequest && <GroupRequest group={group} />}
              {isPendingPost && <GroupPostApproval group={group} />}
              {isMemberManage && <GroupManageMember group={group} />}
              {isSetting && <GroupSetting group={group} />}
            </>
          )
        }
        {(isHomeGroup || isPostDetail) && <GroupHome group={group} />}
      </div>

    </>
  )
}

export default Group
