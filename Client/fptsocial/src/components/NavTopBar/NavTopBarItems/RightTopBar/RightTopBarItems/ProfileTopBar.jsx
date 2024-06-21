import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { logoutCurrentUser, selectCurrentUser } from '~/redux/user/userSlice'
import { useAuth } from 'oidc-react'

function ProfileTopBar() {
  const navigate = useNavigate()
  const [isOpenProfile, setIsOpenProfile] = useState(false)
  const dispatch = useDispatch()
  const { signOutRedirect } = useAuth()

  const handleLogout = async () => {
    try {
      dispatch(logoutCurrentUser())
      console.log('signout')
      await signOutRedirect()
    } catch (error) {
      console.error('Error during logout:', error)
    }
  }
  const user = useSelector(selectCurrentUser)
  const handleClickProfile = () => {
    setIsOpenProfile(!isOpenProfile)
  }
  return <li id='profile-top-bar'
    className="relative"
  >
    <a className="text-gray-500 hover:text-gray-950 flex items-center justify-center gap-3" href='#' onClick={handleClickProfile}>
      <img
        src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQuatIJXhoIyk41rXuz9n3cHerAI8OdrNUjzBvvYALViA&s"
        alt="group-img"
        className="rounded-[50%] aspect-square object-cover max-w-[40px]"
      />
    </a>

    {
      isOpenProfile && (
        <div className='absolute top-11 right-0 flex justify-center items-center gap-3 h-fit w-[90vw] sm:w-[360px] bg-white rounded-lg shadow-4edges z-20'>
          <div className='w-[90%] py-4'>
            <Link to={`/profile?id=${user?.userId}`} className='mb-4 border-b-2 shadow-sm' >
              <div className="icon-side-bar flex justify-start items-center mb-2 text-gray-500 hover:text-gray-950 gap-3" href='#'>
                <img
                  src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQuatIJXhoIyk41rXuz9n3cHerAI8OdrNUjzBvvYALViA&s"
                  alt="group-img"
                  className="rounded-[50%] aspect-square object-cover w-10"
                />
                <span>{user?.firstName + ' ' + user?.lastName}</span>
              </div>
            </Link>
            <ul className='flex flex-col gap-3'>
              <li className='icon-side-bar flex gap-3'>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                  <path fillRule="evenodd" d="M11.828 2.25c-.916 0-1.699.663-1.85 1.567l-.091.549a.798.798 0 0 1-.517.608 7.45 7.45 0 0 0-.478.198.798.798 0 0 1-.796-.064l-.453-.324a1.875 1.875 0 0 0-2.416.2l-.243.243a1.875 1.875 0 0 0-.2 2.416l.324.453a.798.798 0 0 1 .064.796 7.448 7.448 0 0 0-.198.478.798.798 0 0 1-.608.517l-.55.092a1.875 1.875 0 0 0-1.566 1.849v.344c0 .916.663 1.699 1.567 1.85l.549.091c.281.047.508.25.608.517.06.162.127.321.198.478a.798.798 0 0 1-.064.796l-.324.453a1.875 1.875 0 0 0 .2 2.416l.243.243c.648.648 1.67.733 2.416.2l.453-.324a.798.798 0 0 1 .796-.064c.157.071.316.137.478.198.267.1.47.327.517.608l.092.55c.15.903.932 1.566 1.849 1.566h.344c.916 0 1.699-.663 1.85-1.567l.091-.549a.798.798 0 0 1 .517-.608 7.52 7.52 0 0 0 .478-.198.798.798 0 0 1 .796.064l.453.324a1.875 1.875 0 0 0 2.416-.2l.243-.243c.648-.648.733-1.67.2-2.416l-.324-.453a.798.798 0 0 1-.064-.796c.071-.157.137-.316.198-.478.1-.267.327-.47.608-.517l.55-.091a1.875 1.875 0 0 0 1.566-1.85v-.344c0-.916-.663-1.699-1.567-1.85l-.549-.091a.798.798 0 0 1-.608-.517 7.507 7.507 0 0 0-.198-.478.798.798 0 0 1 .064-.796l.324-.453a1.875 1.875 0 0 0-.2-2.416l-.243-.243a1.875 1.875 0 0 0-2.416-.2l-.453.324a.798.798 0 0 1-.796.064 7.462 7.462 0 0 0-.478-.198.798.798 0 0 1-.517-.608l-.091-.55a1.875 1.875 0 0 0-1.85-1.566h-.344ZM12 15.75a3.75 3.75 0 1 0 0-7.5 3.75 3.75 0 0 0 0 7.5Z" clipRule="evenodd" />
                </svg>
                <span>Setting</span>
              </li>
              <li className='icon-side-bar flex gap-3'>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                  <path d="M1.5 8.67v8.58a3 3 0 0 0 3 3h15a3 3 0 0 0 3-3V8.67l-8.928 5.493a3 3 0 0 1-3.144 0L1.5 8.67Z" />
                  <path d="M22.5 6.908V6.75a3 3 0 0 0-3-3h-15a3 3 0 0 0-3 3v.158l9.714 5.978a1.5 1.5 0 0 0 1.572 0L22.5 6.908Z" />
                </svg>
                <span>Feed Back</span>
              </li>
              <li className='icon-side-bar ' onClick={handleLogout}>
                <div className='flex gap-3'>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                    <path fillRule="evenodd" d="M16.5 3.75a1.5 1.5 0 0 1 1.5 1.5v13.5a1.5 1.5 0 0 1-1.5 1.5h-6a1.5 1.5 0 0 1-1.5-1.5V15a.75.75 0 0 0-1.5 0v3.75a3 3 0 0 0 3 3h6a3 3 0 0 0 3-3V5.25a3 3 0 0 0-3-3h-6a3 3 0 0 0-3 3V9A.75.75 0 1 0 9 9V5.25a1.5 1.5 0 0 1 1.5-1.5h6ZM5.78 8.47a.75.75 0 0 0-1.06 0l-3 3a.75.75 0 0 0 0 1.06l3 3a.75.75 0 0 0 1.06-1.06l-1.72-1.72H15a.75.75 0 0 0 0-1.5H4.06l1.72-1.72a.75.75 0 0 0 0-1.06Z" clipRule="evenodd" />
                  </svg>
                  <span >Log Out</span>
                </div>
              </li>
            </ul>
          </div>
        </div>
      )
    }
  </li>
}

export default ProfileTopBar
