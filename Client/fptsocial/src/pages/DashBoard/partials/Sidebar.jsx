import React, { useState, useEffect, useRef } from "react"
import { Link, NavLink, useLocation } from "react-router-dom"

import SidebarLinkGroup from "./SidebarLinkGroup"
import { IconChevronDown, IconChevronUp, IconLayoutDashboardFilled, IconMessageReport, IconUsers } from '@tabler/icons-react'
import { useTranslation } from 'react-i18next'

function Sidebar({
  sidebarOpen,
  setSidebarOpen,
  variant = 'default'
}) {
  const location = useLocation()
  const { pathname } = location
  const { t } = useTranslation()
  const trigger = useRef(null)
  const sidebar = useRef(null)

  return (

    <div className="min-w-fit relative">

      {/* Sidebar backdrop (mobile only) */}
      <div
        className={`fixed inset-0 bg-gray-900 bg-opacity-30 z-40  transition-opacity duration-200 ${sidebarOpen ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
        aria-hidden="true"
      ></div>
      {
        !sidebarOpen && (
          <div className="absolute top-5 left-5 z-60">
            {/* Hamburger button */}
            <button
              className="text-white hover:bg-orange-600 bg-orangeFpt rounded-full p-1"
              aria-controls="sidebar"
              aria-expanded={sidebarOpen}
              onClick={(e) => { e.stopPropagation(); setSidebarOpen(!sidebarOpen); }}
            >
              <span className="sr-only">Open sidebar</span>
              <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <rect x="4" y="5" width="16" height="2" />
                <rect x="4" y="11" width="16" height="2" />
                <rect x="4" y="17" width="16" height="2" />
              </svg>
            </button>

          </div>
        )
      }

      {/* Sidebar */}
      <div
        id="sidebar"
        ref={sidebar}
        className={`flex flex-col absolute z-40 left-0 top-0 h-[100dvh] overflow-y-scroll  no-scrollbar w-64  2xl:!w-64 shrink-0 bg-white dark:bg-gray-800 p-4 transition-all duration-200 ease-in-out ${sidebarOpen ? "translate-x-0" : "-translate-x-64"}  shadow-sm`}
      >

        {/* Sidebar header */}
        <div className="flex justify-between mb-10 pr-3 sm:px-2">
          {/* Close button */}
          <button
            ref={trigger}
            className="text-gray-500 hover:text-gray-400"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            aria-controls="sidebar"
            aria-expanded={sidebarOpen}
          >
            <span className="sr-only">Close sidebar</span>
            <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M10.7 18.7l1.4-1.4L7.8 13H20v-2H7.8l4.3-4.3-1.4-1.4L4 12z" />
            </svg>
          </button>
        </div>

        {/* Links */}
        <div className="space-y-8">
          {/* Pages group */}
          <div>
            <h3 className="text-xs uppercase text-gray-400 dark:text-gray-500 font-semibold pl-3">
              <span className="hidden lg:block lg:sidebar-expanded:hidden 2xl:hidden text-center w-6" aria-hidden="true">
                •••
              </span>
              <span className=" 2xl:block">{t('admin.sidebar.manage')}</span>
            </h3>
            <ul className="mt-3">
              {/* Dashboard */}
              <SidebarLinkGroup activecondition={pathname === "/" || pathname.includes("dashboard")}>
                {(handleClick, open) => {
                  return (
                    <React.Fragment>
                      <a
                        href="#0"
                        className={`transition duration-150 ${pathname === "/" || pathname.includes("dashboard") ? "" : "hover:text-gray-900 dark:hover:text-white"
                          }`}
                        onClick={(e) => {
                          e.preventDefault();
                          handleClick();
                          // setSidebarExpanded(true);
                        }}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <IconLayoutDashboardFilled />
                            <span className="text-sm font-medium ml-4  2xl:opacity-100 duration-200">
                              Dashboard
                            </span>
                          </div>
                          <div className="flex shrink-0 ml-2">
                            {open ? <IconChevronDown /> : <IconChevronUp />}
                          </div>
                        </div>
                      </a>
                      <div className=" 2xl:block">
                        {/* <div className="lg:hidden lg:sidebar-expanded:block 2xl:block"> */}
                        <ul className={` mt-1 ${!open && "hidden"}`}>
                          <li className="mb-1 last:mb-0">
                            <NavLink
                              end
                              to="/"
                              className={({ isActive }) =>
                                "block transition duration-150 truncate p-2 rounded-md font-semibold " + (isActive ? "text-violet-500" : "text-gray-500/90 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200")
                              }
                            >
                              <span className="text-sm 2xl:opacity-100 duration-200">
                                Main
                              </span>
                            </NavLink>
                          </li>
                        </ul>
                      </div>
                    </React.Fragment>
                  );
                }}
              </SidebarLinkGroup>

              {/* User */}
              <SidebarLinkGroup activecondition={pathname.includes("users")}>
                {(handleClick, open) => {
                  return (
                    <React.Fragment>
                      <Link
                        className={`transition duration-150 
                        ${pathname.includes("users") ? "" : ""}`}
                        onClick={(e) => {
                          handleClick();
                        }}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <IconUsers className='text-fp' />
                            <span className="text-sm font-medium ml-4  2xl:opacity-100 duration-200">
                              Users Manager
                            </span>
                          </div>
                          <div className="flex shrink-0 ml-2">
                            {open ? <IconChevronDown /> : <IconChevronUp />}
                          </div>
                        </div>
                      </Link>
                      <div className="">
                        <ul className={` mt-1 ${!open && "hidden"}`}>
                          <li className="mb-1 last:mb-0">
                            <NavLink
                              to="/dashboard/users"
                              className={({ isActive }) =>
                                "block transition duration-150 truncate p-2 rounded-md font-semibold " + (isActive ? "bg-blue-50 text-blue-500" : "")
                              }
                            >
                              <span className="text-sm 2xl:opacity-100 duration-200">
                                List users
                              </span>
                            </NavLink>
                          </li>
                        </ul>
                      </div>
                    </React.Fragment>
                  );
                }}
              </SidebarLinkGroup>

              {/* Report */}
              <SidebarLinkGroup activecondition={pathname.includes("reports")}>
                {(handleClick, open) => {
                  return (
                    <React.Fragment>
                      <Link
                        className={`transition duration-150 
                        ${pathname.includes("users") ? "" : ""}`}
                        onClick={(e) => {
                          handleClick();
                        }}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <IconMessageReport className='text-fp' />
                            <span className="text-sm font-medium ml-4  2xl:opacity-100 duration-200">
                              {t('admin.sidebar.report.report_manage')}
                            </span>
                          </div>
                          <div className="flex shrink-0 ml-2">
                            {open ? <IconChevronDown /> : <IconChevronUp />}
                          </div>
                        </div>
                      </Link>
                      {/* User reports */}
                      <div className="">
                        <ul className={` mt-1 ${!open && "hidden"}`}>
                          <li className="mb-1 last:mb-0">
                            <NavLink
                              to="/dashboard/reports/users"
                              className={({ isActive }) =>
                                "block transition duration-150 truncate p-2 rounded-md font-semibold " + (isActive ? "bg-blue-50 text-blue-500" : "")
                              }
                            >
                              <span className="text-sm 2xl:opacity-100 duration-200">
                                User Report
                              </span>
                            </NavLink>
                          </li>
                        </ul>
                      </div>
                      {/* Post reports */}
                      <div className="">
                        <ul className={` mt-1 ${!open && "hidden"}`}>
                          <li className="mb-1 last:mb-0">
                            <NavLink
                              to="/dashboard/reports"
                              className={({ isActive }) =>
                                "block transition duration-150 truncate p-2 rounded-md font-semibold " + (isActive ? "bg-blue-50 text-blue-500" : "")
                              }
                            >
                              <span className="text-sm 2xl:opacity-100 duration-200">
                                Group Reports
                              </span>
                            </NavLink>
                          </li>
                        </ul>
                      </div>
                      {/* Group reports */}
                      <div className="">
                        <ul className={` mt-1 ${!open && "hidden"}`}>
                          <li className="mb-1 last:mb-0">
                            <NavLink
                              to="/dashboard/reports/posts"
                              className={({ isActive }) =>
                                "block transition duration-150 truncate p-2 rounded-md font-semibold " + (isActive ? "bg-blue-50 text-blue-500" : "")
                              }
                            >
                              <span className="text-sm 2xl:opacity-100 duration-200">
                                Post Reports
                              </span>
                            </NavLink>
                          </li>
                        </ul>
                      </div>
                      {/* comment reports */}
                      <div className="">
                        <ul className={` mt-1 ${!open && "hidden"}`}>
                          <li className="mb-1 last:mb-0">
                            <NavLink
                              to="/dashboard/reports"
                              className={({ isActive }) =>
                                "block transition duration-150 truncate p-2 rounded-md font-semibold " + (isActive ? "bg-blue-50 text-blue-500" : "")
                              }
                            >
                              <span className="text-sm 2xl:opacity-100 duration-200">
                                Comment Reports
                              </span>
                            </NavLink>
                          </li>
                        </ul>
                      </div>
                    </React.Fragment>
                  );
                }}
              </SidebarLinkGroup>
            </ul>
          </div>

          {/* More group */}
          <div>
            <h3 className="text-xs uppercase text-gray-400 dark:text-gray-500 font-semibold pl-3">
              <span className="hidden lg:block lg:sidebar-expanded:hidden 2xl:hidden text-center w-6" aria-hidden="true">
                •••
              </span>
              <span className=" 2xl:block">More</span>
            </h3>
            <ul className="mt-3">
              {/* Authentication */}
              <SidebarLinkGroup>
                {(handleClick, open) => {
                  return (
                    <React.Fragment>
                      <a
                        href="#0"
                        className={`block text-gray-800 dark:text-gray-100 truncate transition duration-150 ${open ? "" : "hover:text-gray-900 dark:hover:text-white"}`}
                        onClick={(e) => {
                          e.preventDefault();
                          handleClick();
                          // setSidebarExpanded(true);
                        }}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <svg className={`shrink-0 fill-current text-gray-400 dark:text-gray-500`} xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16">
                              <path d="M11.442 4.576a1 1 0 1 0-1.634-1.152L4.22 11.35 1.773 8.366A1 1 0 1 0 .227 9.634l3.281 4a1 1 0 0 0 1.59-.058l6.344-9ZM15.817 4.576a1 1 0 1 0-1.634-1.152l-5.609 7.957a1 1 0 0 0-1.347 1.453l.656.8a1 1 0 0 0 1.59-.058l6.344-9Z" />
                            </svg>
                            <span className="text-sm font-medium ml-4  2xl:opacity-100 duration-200">
                              Authentication
                            </span>
                          </div>
                          {/* Icon */}
                          <div className="flex shrink-0 ml-2">
                            <svg className={`w-3 h-3 shrink-0 ml-1 fill-current text-gray-400 dark:text-gray-500 ${open && "rotate-180"}`} viewBox="0 0 12 12">
                              <path d="M5.9 11.4L.5 6l1.4-1.4 4 4 4-4L11.3 6z" />
                            </svg>
                          </div>
                        </div>
                      </a>
                      <div className=" 2xl:block">
                        <ul className={` mt-1 ${!open && "hidden"}`}>
                          <li className="mb-1 last:mb-0">
                            <Link to="">
                              <span className="text-sm 2xl:opacity-100 duration-200">
                                Sign in
                              </span>
                            </Link>
                          </li>
                        </ul>
                      </div>
                    </React.Fragment>
                  )
                }}
              </SidebarLinkGroup>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
