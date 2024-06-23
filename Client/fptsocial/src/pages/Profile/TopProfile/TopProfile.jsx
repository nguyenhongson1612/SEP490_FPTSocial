import { sendFriend } from '~/apis'

function TopProfile({ open, user, currentUser }) {
  console.log('🚀 ~ TopProfile ~ currentUser?.userId:', currentUser?.userId)
  console.log('🚀 ~ TopProfile ~ user?.userId:', user?.userId)
  const handleAddFriend = () => {
    sendFriend({ userId: user?.userId, friendId: currentUser?.userId }).then(data => console.log(data))
  }

  return (
    <div id='top-profile'
      className='bg-white shadow-md w-full flex flex-col items-center'
    >
      <div id=''
        className='w-full lg:w-[940px] aspect-[74/27] rounded-md
                bg-[url(https://thumbs.dreamstime.com/b/incredibly-beautiful-sunset-sun-lake-sunrise-landscape-panorama-nature-sky-amazing-colorful-clouds-fantasy-design-115177001.jpg)] 
                bg-cover bg-center bg-no-repeat'></div>
      <div id='avatar-profile'
        className='w-full flex justify-center pb-4 border-b'
      >
        <div className='flex flex-col lg:flex-row items-center lg:items-end justify-center gap-4'>
          <div id='avatar'>
            <div className='relative w-[170px] h-[90px] lg:h-0'>
              <div className='absolute bottom-0 w-[170px] bg-white rounded-[50%] aspect-square flex justify-center items-center'>
                <img
                  src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQuatIJXhoIyk41rXuz9n3cHerAI8OdrNUjzBvvYALViA&s"
                  alt="group-img"
                  className="rounded-[50%] aspect-square object-cover w-[95%]"
                />
              </div>
            </div>
          </div>

          <div id='name-friend'
            className='flex flex-col items-center lg:items-start justify-end mb-4 gap-1'
          >
            <span className='text-gray-900 font-bold text-3xl'>{user?.firstName + ' ' + user?.lastName}</span>
            <span className='text-gray-500 font-bold'> 999 Friends</span>

            <div className='flex items-center [&>img:not(:first-child)]:-ml-4'>
              <img
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQuatIJXhoIyk41rXuz9n3cHerAI8OdrNUjzBvvYALViA&s"
                alt="group-img"
                className="rounded-[50%] aspect-square object-cover w-10 border-2 border-white"
              />
              <img
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQuatIJXhoIyk41rXuz9n3cHerAI8OdrNUjzBvvYALViA&s"
                alt="group-img"
                className="rounded-[50%] aspect-square object-cover w-10 border-2 border-white"
              />
              <img
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQuatIJXhoIyk41rXuz9n3cHerAI8OdrNUjzBvvYALViA&s"
                alt="group-img"
                className="rounded-[50%] aspect-square object-cover w-10 border-2 border-white"
              />
              <img
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQuatIJXhoIyk41rXuz9n3cHerAI8OdrNUjzBvvYALViA&s"
                alt="group-img"
                className="rounded-[50%] aspect-square object-cover w-10 border-2 border-white"
              />
              <img
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQuatIJXhoIyk41rXuz9n3cHerAI8OdrNUjzBvvYALViA&s"
                alt="group-img"
                className="rounded-[50%] aspect-square object-cover w-10 border-2 border-white"
              />
            </div>
          </div>
          {user?.userId == currentUser?.userId ? (
            <div id='update'
              onClick={open}
              className='flex flex-col justify-end mb-4 cursor-pointer'
            >
              <span className='font-bold text-lg text-gray-900 p-2 rounded-md bg-fbWhite hover:bg-fbWhite-500'>Update Your Profile</span>
            </div>) : (
            <div id='update'
              // onClick={handleAddFriend}
              className='flex flex-col justify-end mb-4 cursor-pointer'
            >
              <span className='font-bold text-lg text-gray-900 p-2 rounded-md bg-fbWhite hover:bg-fbWhite-500'>Add friend</span>
            </div>
          )}

        </div>
      </div>
    </div>
  )
}

export default TopProfile;
