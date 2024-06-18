import ListPost from '~/components/ListPost/ListPost'
import NewPost from '~/components/NewPost/NewPost';

function ContentProfile({ listPost, user }) {
  return (
    <div id='content-profile'
      className='flex flex-col items-center lg:flex-row lg:justify-center lg:items-start w-full gap-3'>
      <div
        id='info'
        className='w-full sm:w-[500px] lg:basis-3/12 h-fit bg-white mt-8 rounded-md shadow-md'>
        <div className='flex flex-col p-4'>
          <h3 className='text-xl font-bold'>Profile</h3>
          <p>Full name&nbsp;&nbsp;<span className='font-bold'>{user?.firstName + ' ' + user?.lastName || 'No information'}</span></p>
          <p>From&nbsp;&nbsp;<span className='font-bold'>{user?.homeTown || 'No information'}</span></p>
          {/* <p>Campus&nbsp;&nbsp;<span className='font-bold'>Hoa Lac</span></p> */}
          <p>Gender&nbsp;&nbsp;<span className='font-bold'>{user?.genderName || 'No information'}</span></p>
          <p>Relationship&nbsp;&nbsp;<span className='font-bold'>{user?.relationship || 'No information'}</span></p>
          <p>Birthday&nbsp;&nbsp;<span className='font-bold'>{new Date(user?.birthDay).toLocaleDateString() || 'No information'}</span></p>
        </div>
      </div>
      <div className=' flex flex-col gap-3'>
        <NewPost />
        <ListPost listPost={listPost} />
      </div>
    </div>
  )
}

export default ContentProfile;
