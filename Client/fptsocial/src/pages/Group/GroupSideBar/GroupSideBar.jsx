import { Link } from 'react-router-dom';

function GroupSideBar() {
  return (
    <div className="max-h-[calc(100vh_-_55px)] w-[380px] flex flex-col overflow-y-auto scrollbar-none-track">


      <div className="ml-3 mt-8 mb-5">
        <div id="explore"
          className="flex flex-col items-start gap-4 mb-8"
        >
          <Link to={'/groups/feed'} className="text-gray-500 hover:text-gray-950 flex items-center justify-center gap-3 cursor-pointer ">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5m-9-6h.008v.008H12v-.008ZM12 15h.008v.008H12V15Zm0 2.25h.008v.008H12v-.008ZM9.75 15h.008v.008H9.75V15Zm0 2.25h.008v.008H9.75v-.008ZM7.5 15h.008v.008H7.5V15Zm0 2.25h.008v.008H7.5v-.008Zm6.75-4.5h.008v.008h-.008v-.008Zm0 2.25h.008v.008h-.008V15Zm0 2.25h.008v.008h-.008v-.008Zm2.25-4.5h.008v.008H16.5v-.008Zm0 2.25h.008v.008H16.5V15Z" />
            </svg>
            <span className="font-semibold text-gray-900">Feeds</span>
          </Link>
          <Link to={'/groups/discover'} className="text-gray-500 hover:text-gray-950 flex items-center justify-center gap-3 cursor-pointer">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 0 0 1.5-.189m-1.5.189a6.01 6.01 0 0 1-1.5-.189m3.75 7.478a12.06 12.06 0 0 1-4.5 0m3.75 2.383a14.406 14.406 0 0 1-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 1 0-7.517 0c.85.493 1.509 1.333 1.509 2.316V18" />
            </svg>
            <span className="font-semibold text-gray-900">Discover</span>
          </Link>

          <Link to={'/groups/joins'}
            className="text-gray-500 hover:text-gray-950 flex items-center justify-center gap-3 cursor-pointer">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z" />
            </svg>

            <span className="font-semibold text-gray-900">Your Group</span>
          </Link>
          <Link to={'/groups/create'}
            className="text-gray-500 flex items-center justify-center gap-3 cursor-pointer bg-blue-100 p-2 rounded-md">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="blue" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            <span className=" text-blue-500">Create New Group</span>
          </Link>

        </div>

        <div id="group-owner"
          className="flex flex-col items-start gap-4 mb-5"
        >
          <p className="text-gray-500">Group Admin</p>
          <a className="text-gray-500 hover:text-gray-950 flex items-center justify-center gap-3 cursor-pointer">
            <img
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQuatIJXhoIyk41rXuz9n3cHerAI8OdrNUjzBvvYALViA&s"
              alt="group-img"
              className="rounded-md aspect-square object-cover w-10"
            />

            <span className="font-semibold text-gray-900">New Feeds</span>
          </a>
        </div>
        <div id="group-joins"
          className="flex flex-col items-start gap-4 mb-5"
        >
          <p className="text-gray-500">Group Joined</p>
          <a className="text-gray-500 hover:text-gray-950 flex items-center justify-center gap-3 cursor-pointer">
            <img
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQuatIJXhoIyk41rXuz9n3cHerAI8OdrNUjzBvvYALViA&s"
              alt="group-img"
              className="rounded-md aspect-square object-cover w-10"
            />

            <span className="font-semibold text-gray-900">New Feeds</span>
          </a>

          <a className="text-gray-500 hover:text-gray-950 flex items-center justify-center gap-3 cursor-pointer">
            <img
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQuatIJXhoIyk41rXuz9n3cHerAI8OdrNUjzBvvYALViA&s"
              alt="group-img"
              className="rounded-md aspect-square object-cover w-10"
            />

            <span className="font-semibold text-gray-900">New Feeds</span>
          </a>
          <a className="text-gray-500 hover:text-gray-950 flex items-center justify-center gap-3 cursor-pointer">
            <img
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQuatIJXhoIyk41rXuz9n3cHerAI8OdrNUjzBvvYALViA&s"
              alt="group-img"
              className="rounded-md aspect-square object-cover w-10"
            />

            <span className="font-semibold text-gray-900">New Feeds</span>
          </a>
        </div>
      </div>


    </div>
  )
}

export default GroupSideBar;
