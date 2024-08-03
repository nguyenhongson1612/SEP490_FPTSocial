import React from "react";
import { useLocation } from 'react-router-dom';
import UserReports from './UserReports';
import PostReports from './PostReports';

function ReportManage() {

  const location = useLocation()
  const { pathname } = location
  console.log('🚀 ~ ReportManage ~ pathname:', pathname)

  return (
    <div className="relative overflow-x-auto shadow-md sm:rounded-lg py-3 px-4 h-full">
      {
        pathname.includes('/reports/users') && <UserReports />
      }
      {
        pathname.includes('/reports/posts') && <PostReports />
      }

    </div>

  )
}

export default ReportManage;
