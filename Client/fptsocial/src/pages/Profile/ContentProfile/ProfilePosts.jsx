import { IconCake, IconHeartFilled, IconHomeFilled, IconManFilled, IconUser } from '@tabler/icons-react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { getOtherUserPost, getUserPostByUserId } from '~/apis/postApis'
import ListPost from '~/components/ListPost/ListPost'
import NewPost from '~/components/Modal/NewPost/NewPost'
import { selectCurrentUser } from '~/redux/user/userSlice'
import { POST_TYPES } from '~/utils/constants'

function ProfilePosts({ user }) {
  const { t } = useTranslation()
  const currentUser = useSelector(selectCurrentUser)
  const isYourProfile = user?.userId == currentUser?.userId

  return (
    <div id=''
      className='flex flex-col items-center lg:flex-row lg:justify-center lg:items-start w-full gap-3 bg-fbWhite'>
      <div
        id='info'
        className='w-full mt-8 lg:w-[600px] lg:basis-3/12 h-fit bg-white  rounded-md shadow-md'>
        <div className='flex flex-col p-4 gap-3'>
          <h3 className='text-xl font-bold'>{t('standard.profile.about')}</h3>
          <div className='flex gap-1'><IconUser stroke={2} color='#c8d3e1' /><span className='font-semibold'>{user?.firstName + ' ' + user?.lastName || 'No information'}</span></div>
          <div className='flex gap-1'><IconHomeFilled stroke={2} color='#c8d3e1' /><span>Lives in&nbsp;</span><span className='font-semibold'>{user?.homeTown || 'No information'}</span></div>
          <div className='flex gap-1'><IconManFilled stroke={2} color='#c8d3e1' />Gender&nbsp;&nbsp;<span className='font-semibold'>{user?.userGender?.genderName || 'No information'}</span></div>
          <div className='flex gap-1'><IconHeartFilled stroke={2} color='#c8d3e1' /> Relationship&nbsp;&nbsp;<span className='font-semibold'>{user?.userRelationship?.relationshipName || 'No information'}</span></div>
          <div className='flex gap-1'><IconCake stroke={2} color='#c8d3e1' /> Birthday&nbsp;&nbsp;<span className='font-semibold'>{new Date(user?.birthDay).toLocaleDateString() || 'No information'}</span></div>
        </div>
      </div>
      <div className='flex flex-col items-center gap-3 w-full lg:w-fit'>
        <NewPost postType={POST_TYPES.PROFILE_POST} />
        <ListPost getListPostFn={user && (isYourProfile && user ? getUserPostByUserId : ({ page, pageSize }) => getOtherUserPost({ userId: user?.userId, page, pageSize }))} />
      </div>
    </div >
  )
}

export default ProfilePosts
