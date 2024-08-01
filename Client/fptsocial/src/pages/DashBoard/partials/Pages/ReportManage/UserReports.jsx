import { Avatar, Button, Pagination } from '@mui/material';
import { useEffect, useState } from 'react';
import { getListReportUser } from '~/apis/adminApis/reportsApis';

function UserReports() {
  const [listUserReport, setListUserReport] = useState([])
  const [page, setPage] = useState(1)
  const [totalPage, setTotalPage] = useState(1)

  useEffect(() => {
    getListReportUser({ page: page }).then(data => {
      setListUserReport(data?.result)
      setTotalPage(data?.totalPage)
    })
  }, [page])

  return (
    <div className="relative overflow-x-auto shadow-md sm:rounded-lg h-full p-2 flex flex-col justify-between">
      <table className="w-full text-sm text-left text-gray-500 ">
        <thead className="text-xs text-gray-700 uppercase bg-fbWhite">
          <tr>
            <th scope="col" className="p-4">
              <div className="flex items-center">
                <input
                  id="checkbox-all-search"
                  type="checkbox"
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                />
                <label htmlFor="checkbox-all-search" className="sr-only">
                  checkbox
                </label>
              </div>
            </th>
            <th scope="col" className="">
              Reported User
            </th>
            <th scope="col" className="">
              Reported By
            </th>
            <th scope="col" className="">
              Reason
            </th>
            <th className="">
            </th>
          </tr>
        </thead>

        <tbody className=''>
          {
            listUserReport?.map(report => (
              <tr key={report?.reportId} className="bg-white border-b hover:bg-gray-50 h-[100px]">
                <td className="w-4 p-4">
                  <div className="flex items-center">
                    <input
                      id="checkbox-table-search-1"
                      type="checkbox"
                      className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                    />
                    <label htmlFor="checkbox-table-search-1" className="sr-only">
                      checkbox
                    </label>
                  </div>
                </td>

                <td className="">
                  <div className='flex items-center gap-2'>
                    <Avatar src={report?.avatarUrl} />
                    <span className='font-semibold capitalize text-black'>{report?.userName}</span>
                  </div>
                </td>
                <td className="">Silver</td>
                <td className="">{report?.reportTypeId}</td>
                <td className="">
                  <div className='flex justify-center gap-2'>
                    <Button variant='contained' color='error' size='small' >Block</Button>
                    <Button variant='contained' color='primary' size='small'>UnBlock</Button>
                  </div>
                </td>
              </tr>
            ))
          }
        </tbody>
      </table>

      <nav
        className="flex items-center justify-center flex-column flex-wrap md:flex-row pt-4"
        aria-label="Table navigation"
      >
        <Pagination count={totalPage} variant="outlined" shape="rounded" page={page} onChange={(e, v) => setPage(v)} />
      </nav>
    </div>

  )
}

export default UserReports;
