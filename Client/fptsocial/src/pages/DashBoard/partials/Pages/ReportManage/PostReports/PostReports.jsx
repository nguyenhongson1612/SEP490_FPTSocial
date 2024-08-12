import { Button, Pagination } from '@mui/material'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getReportPost } from '~/apis/adminApis/reportsApis'
import blogIcon from '~/assets/img/blog.png'
import ActivePost from '~/components/Modal/ActivePost/ActivePost'
import { selectIsShowModalActivePost } from '~/redux/activePost/activePostSlice'
import ReportDetailModal from './ReportDetailModal'
import { selectIsReload } from '~/redux/ui/uiSlice'
import SearchNotFound from '~/components/UI/SearchNotFound'

function PostReports() {
  const [listPostReport, setListPostReport] = useState([])
  const [page, setPage] = useState(1)
  const [totalPage, setTotalPage] = useState(1)
  const isReload = useSelector(selectIsReload)
  const isOpenActivePost = useSelector(selectIsShowModalActivePost)
  const [open, setOpen] = useState(false)
  const handleOpen = () => setOpen(true)
  const [postReportDetail, setPostReportDetail] = useState(null)

  useEffect(() => {
    getReportPost({ page: page }).then(data => {
      setListPostReport(data?.result)
      setTotalPage(data?.totalPage)
    })
  }, [page, isReload])

  const handleViewDetailReport = (report) => {
    setPostReportDetail(report)
    handleOpen()
  }

  return (
    <div className="relative overflow-x-auto shadow-md sm:rounded-lg h-full p-2 flex flex-col justify-between">
      {isOpenActivePost && <ActivePost isReportPost={true} />}
      {open && <ReportDetailModal postReport={postReportDetail} open={open} setOpen={setOpen}
        page={page} setPage={setPage} totalPage={totalPage} />}
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
              Reported Post
            </th>
            <th scope="col" className="">
              Number of reports
            </th>
            <th className="">
            </th>
          </tr>
        </thead>

        <tbody className=''>
          {
            listPostReport?.map((report, index) => (
              <tr key={index} className="bg-white border-b hover:bg-gray-50 h-[100px]">
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
                  <div className='flex flex-col cursor-pointer'
                    // onClick={() => handleReviewReportedPost(report)}
                    onClick={() => handleViewDetailReport(report)}
                  >
                    <img src={blogIcon} className='size-10' />
                    <span className='font-semibold text-xs capitalize '>Click to view</span>
                  </div>
                </td>
                <td className="">{report?.numberReporter} reports</td>
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
      {
        listPostReport?.length == 0 && <SearchNotFound isNoneData={true} />
      }

      <nav
        className="flex items-center justify-center flex-column flex-wrap md:flex-row pt-4"
        aria-label="Table navigation"
      >
        <Pagination count={totalPage} variant="outlined" shape="rounded" page={page} onChange={(e, v) => setPage(v)} />
      </nav>
    </div>

  )
}

export default PostReports
