import { IconUserCircle } from '@tabler/icons-react'

function About({ user }) {
  return <div id=''
    className='flex flex-col items-center lg:flex-row lg:justify-center lg:items-start w-full gap-3 bg-fbWhite'>
    <div
      id='info'
      className='w-full sm:w-[500px] lg:basis-3/12 h-fit bg-white mt-8 rounded-md shadow-md'>
      <div className='flex flex-col p-4'>
        <h3 className='text-xl font-bold'>Profile</h3>
        <div><IconUserCircle /><span className='font-bold'>{user?.firstName + ' ' + user?.lastName || 'No information'}</span></div>
        <p>From&nbsp;&nbsp;<span className='font-bold'>{user?.homeTown || 'No information'}</span></p>
        {/* <p>Campus&nbsp;&nbsp;<span className='font-bold'>Hoa Lac</span></p> */}
        <p>Gender&nbsp;&nbsp;<span className='font-bold'>{user?.userGender?.genderId || 'No information'}</span></p>
        <p>Relationship&nbsp;&nbsp;<span className='font-bold'>{user?.userRelationship?.userRelationshipId || 'No information'}</span></p>
        <p>Birthday&nbsp;&nbsp;<span className='font-bold'>{new Date(user?.birthDay).toLocaleDateString() || 'No information'}</span></p>
      </div>
    </div>
  </div >
}

export default About;
