import React from 'react'
import FPTUen from '~/assets/img/FPTUen.png'
import IconGoogle from '~/assets/svg/iconGoogle'

function Login() {
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
            <a className='w-[90%] px-2 py-1 rounded-md bg-[#dd4b39] flex gap-5  items-center min-h-14'
              href='#'
            >
              <IconGoogle />
              <span className='text-white font-semibold font-sans '>Login With Google</span>
            </a>
            <a className='w-[90%] px-2 py-1 rounded-md bg-[#2672ec] flex gap-5  items-center  min-h-14'
              href='#'
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="white" viewBox="0 0 24 24" strokeWidth={0.3} stroke="currentColor" className="w-10 h-10">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
              </svg >
              <span className='text-white font-semibold font-sans '>Login With FeID</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login