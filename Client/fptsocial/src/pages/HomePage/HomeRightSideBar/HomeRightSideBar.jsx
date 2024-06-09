// import { useState } from 'react'
// import { Link } from 'react-router-dom'

function HomeRightSideBar() {
  // const [isMore, setIsMore] = useState(false)
  return (
    <div className="max-h-[calc(100vh_-_55px)] w-[380px] hidden lg:!flex flex-col overflow-y-auto scrollbar-none-track text-lg font-semibold">

      <div className="ml-3 mt-8 mb-5">
        <div id="people"
          className="flex flex-col items-start "
        >
          <p className=" text-gray-500">Contacts</p>
          <a className="w-full px-2 py-3 hover:bg-orangeFpt hover:text-white flex items-center gap-3 cursor-pointer rounded-md">
            <img
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQuatIJXhoIyk41rXuz9n3cHerAI8OdrNUjzBvvYALViA&s"
              alt="group-img"
              className=" aspect-square rounded-[50%] object-cover w-8"
            />

            <span className="font-semibold">New Feeds</span>
          </a>
          <a className="w-full px-2 py-3 hover:bg-orangeFpt hover:text-white flex items-center gap-3 cursor-pointer rounded-md">
            <img
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQuatIJXhoIyk41rXuz9n3cHerAI8OdrNUjzBvvYALViA&s"
              alt="group-img"
              className=" aspect-square rounded-[50%] object-cover w-8"
            />
            <span className="font-semibold">New Feeds</span>
          </a>

        </div>
      </div>


    </div>
  )
}

export default HomeRightSideBar