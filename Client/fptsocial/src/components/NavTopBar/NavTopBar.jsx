import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import LeftTopBar from './NavTopBarItems/LeftTopBar'
import RightTopBar from './NavTopBarItems/RightTopBar/RightTopBar'

function NavTopBar() {

  return (
    <div className="relative h-[55px] w-full flex items-center bg-white border-b-2 shadow-gray-300 ">
      <div
        className="mx-3 flex w-full justify-evenly xs:justify-between items-center">
        <LeftTopBar />
        <RightTopBar />
      </div>
    </div>

  )
}

export default NavTopBar