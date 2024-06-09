import ListPost from '~/components/ListPost/ListPost'

function ContentProfile({ listPost, user }) {
  return (
    <div id='content-profile'
      className='flex flex-col items-center lg:flex-row lg:justify-center lg:items-start w-full'>
      <div
        id='info'
        className='w-[90%] lg:basis-3/12 h-fit bg-white mt-8 rounded-md shadow-md'>
        <div className='flex flex-col p-4'>
          <h3 className='text-xl font-bold'>Profile</h3>
          <p>From&nbsp;&nbsp;<span className='font-bold'>{user?.homeTown}</span></p>
          <p>Campus&nbsp;&nbsp;<span className='font-bold'>Hoa Lac</span></p>
          <p>Gender&nbsp;&nbsp;<span className='font-bold'>{user?.gender}</span></p>
          {/* <p>Campus&nbsp;&nbsp;<span className='font-bold'>Hoa Lac</span></p> */}
        </div>
      </div>
      <div className='basis-11/12 lg:basis-5/12 '>
        <ListPost listPost={listPost} />
      </div>
    </div>
  )
}

export default ContentProfile;
