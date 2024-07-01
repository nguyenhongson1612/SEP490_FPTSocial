import { IconCake, IconHeartFilled, IconHomeFilled, IconManFilled, IconUser } from '@tabler/icons-react'
import ListPost from '~/components/ListPost/ListPost'
import NewPost from '~/components/NewPost/NewPost'

function ProfilePosts({ listPost, user }) {
  return (
    <div id=''
      className='flex flex-col items-center lg:flex-row lg:justify-center lg:items-start w-full gap-3 bg-fbWhite'>
      <div
        id='info'
        className='w-full sm:w-[500px] lg:basis-3/12 h-fit bg-white mt-8 rounded-md shadow-md'>
        <div className='flex flex-col p-4 gap-3'>
          <h3 className='text-xl font-bold'>Profile</h3>
          <div className='flex gap-1'><IconUser stroke={2} color='#c8d3e1' /><span className='font-semibold'>{user?.firstName + ' ' + user?.lastName || 'No information'}</span></div>
          <div className='flex gap-1'><IconHomeFilled stroke={2} color='#c8d3e1' /><span>Lives in&nbsp;</span><span className='font-semibold'>{user?.homeTown || 'No information'}</span></div>
          <div className='flex gap-1'><IconManFilled stroke={2} color='#c8d3e1' />Gender&nbsp;&nbsp;<span className='font-semibold'>{user?.userGender?.genderName || 'No information'}</span></div>
          <div className='flex gap-1'><IconHeartFilled stroke={2} color='#c8d3e1' /> Relationship&nbsp;&nbsp;<span className='font-semibold'>{user?.userRelationship?.relationshipName || 'No information'}</span></div>
          <div className='flex gap-1'><IconCake stroke={2} color='#c8d3e1' /> Birthday&nbsp;&nbsp;<span className='font-semibold'>{new Date(user?.birthDay).toLocaleDateString() || 'No information'}</span></div>
        </div>
      </div>
      <div className=' flex flex-col gap-3'>
        <NewPost />
        <ListPost listPost={listPost} />
      </div>
    </div >
  )
}

export default ProfilePosts
