import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import FPTUen from '~/assets/img/FPTUen.png'
import IconGoogle from '~/assets/svg/iconGoogle'
import { logoutCurrentUser } from '~/redux/user/userSlice'

function Login() {
  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(logoutCurrentUser())
  }, [])
  return (
    <div
      className='bg-gradient-to-r from-[rgba(242,113,36,0.7)] to-[rgb(242,113,36)]  w-screen h-screen flex items-center justify-center'>
      <div className='w-[90%] h-[60%] md:w-[70%] lg:w-[55%] bg-white rounded-2xl shadow-4edges grid grid-cols-12'>
        <div className='img-bg col-span-8'>
        </div>
        <div className='flex flex-col items-center gap-3 col-span-4'>
          <div className='flex flex-col items-center gap-3'>
            <img
              src={FPTUen}
              alt="home-img"
              className="w-[50%]"
            />
            <span className='font-bold text-2xl text-[rgb(242,113,36)] font-serif relative'>
              Société Place
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 absolute -top-3 -right-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 0 1-2.555-.337A5.972 5.972 0 0 1 5.41 20.97a5.969 5.969 0 0 1-.474-.065 4.48 4.48 0 0 0 .978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25Z" />
              </svg>

            </span>
          </div>
          <div className='flex flex-col items-center justify-center gap-5 w-full h-full'>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login