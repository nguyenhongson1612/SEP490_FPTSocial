import { IconFileDescription, IconLockFilled, IconUsersGroup } from '@tabler/icons-react'
import ListPost from '~/components/ListPost/ListPost'
import NewPost from '~/components/NewPost/NewPost'
import { POST_TYPES } from '~/utils/constants'

function GroupHomeDiscussions({ group, listPost }) {
  return (
    <div id=''
      className='flex flex-col items-center lg:flex-row lg:justify-center lg:items-start w-full gap-3 bg-fbWhite'>
      <div className=' flex flex-col gap-3'>
        <NewPost type={POST_TYPES.MAIN_GROUP_POST} groupId={group?.groupId} />
        {/* <ListPost listPost={listPost} /> */}
      </div>
      <div
        id='info'
        className='w-full sm:w-[500px] lg:basis-3/12 h-fit bg-white mt-8 rounded-md shadow-md'>
        <div className='flex flex-col p-4 gap-3'>
          <h3 className='text-xl font-bold'>About</h3>
          <div>
            <div className='flex gap-1'><IconUsersGroup stroke={1} /><span className=''>{group?.groupName}</span></div>
            <div className='flex gap-1'><IconFileDescription stroke={1} /><span className=''>{group?.groupDescription}</span></div>
          </div>
        </div>
      </div>
    </div >
  )
}

export default GroupHomeDiscussions
