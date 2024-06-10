import { useEffect, useRef, useState } from 'react'
import Post from '../Post/Post'


function PostOverLay({ postData }) {
  const [isOpen, setIsOpen] = useState(false)
  const refModal = useRef()

  const checkClickOutSide = (e) => {
    if (isOpen && refModal.current && !refModal.current.contains(e.target))
      setIsOpen(!isOpen)

  }

  useEffect(() => {
    document.addEventListener('mousedown', checkClickOutSide)

    return () => document.removeEventListener('mousedown', checkClickOutSide)
  }, [isOpen])

  return <>
    {isOpen ?
      <div id="post-overlay"
        className=" fixed top-0 left-0 right-0 bottom-0 bg-[rgba(252,252,252,0.5)] flex justify-center items-center z-20  "
      >
        <div
          ref={refModal}
          id='post-container'
          className="max-w-[55%] max-h-[90%] bg-white flex flex-col items-center overflow-auto scrollbar-none-track shadow-4edges rounded-lg"
        >
          <div id='post-detail-author'
            className='min-h-[60px] w-full flex justify-between items-center'>
            <div></div>
            <span className='font-bold font-sans text-lg'>
              Article by {postData?.category}
            </span>
            <div className='cursor-pointer' onClick={() => setIsOpen(!isOpen)}>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
              </svg>
            </div>
          </div>
          <Post isOpen={isOpen} setIsOpen={setIsOpen} postData={postData} />
        </div>
      </div>
      :
      <Post isOpen={isOpen} setIsOpen={setIsOpen} postData={postData} />
    }
  </>
}

export default PostOverLay