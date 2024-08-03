import { Avatar, Button, Modal, Pagination } from '@mui/material';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getListReportPost } from '~/apis/adminApis/reportsApis';
import { getChildGroupPost, getGroupPostByGroupPostId } from '~/apis/groupPostApis';
import { getChildPostById, getUserPostById } from '~/apis/postApis';
import blogIcon from '~/assets/img/blog.png'
import ActivePost from '~/components/Modal/ActivePost/ActivePost';
import { selectIsShowModalActivePost, showModalActivePost, updateCurrentActivePost } from '~/redux/activePost/activePostSlice';
import { POST_TYPES } from '~/utils/constants';

function PostReports() {
  const [listPostReport, setListPostReport] = useState([])
  const [page, setPage] = useState(1)
  const [totalPage, setTotalPage] = useState(1)
  const [open, setOpen] = useState(false)
  const dispatch = useDispatch()
  const isOpenActivePost = useSelector(selectIsShowModalActivePost)

  useEffect(() => {
    getListReportPost({ page: page }).then(data => {
      setListPostReport(data?.result)
      setTotalPage(data?.totalPage)
    })
  }, [page])

  const handleReviewReportedPost = (report) => {
    let postType = ''
    let postId = ''
    let fetchFunction
    if (report?.userPostId) {
      postType = POST_TYPES.PROFILE_POST
      postId = report?.userPostId
      fetchFunction = getUserPostById
    }
    else if (report?.userPostPhotoId) {
      postType = POST_TYPES.PHOTO_POST
      postId = report?.userPostPhotoId
      fetchFunction = getChildPostById
    }
    else if (report?.userPostVideoId) {
      postType = POST_TYPES.VIDEO_POST
      postId = report?.userPostVideoId
      fetchFunction = getChildPostById
    }
    else if (report?.groupPostId) {
      postType = POST_TYPES.GROUP_POST
      postId = report?.groupPostId
      fetchFunction = getGroupPostByGroupPostId
    }
    else if (report?.groupPostVideoId) {
      postType = POST_TYPES.GROUP_VIDEO_POST
      postId = report?.groupPostVideoId
      fetchFunction = getChildGroupPost
    }
    else if (report?.groupPostPhotoId) {
      postType = POST_TYPES.GROUP_PHOTO_POST
      postId = report?.groupPostPhotoId
      fetchFunction = getChildGroupPost
    }
    else if (report?.sharePostId) {
      postType = POST_TYPES.SHARE_POST
      postId = report?.sharePostId
      fetchFunction = getUserPostById
    }
    else if (report?.groupSharePostId) {
      postType = POST_TYPES.GROUP_SHARE_POST
      postId = report?.groupSharePostId
      fetchFunction = getGroupPostByGroupPostId
    }
    fetchFunction(postId).then(data => {
      dispatch(updateCurrentActivePost({ ...data, postType: postType }))
      dispatch(showModalActivePost())
    }
    )
  }

  return (
    <div className="relative overflow-x-auto shadow-md sm:rounded-lg h-full p-2 flex flex-col justify-between">
      {isOpenActivePost && <ActivePost isReportPost={true} />}
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
              Reported By
            </th>
            <th scope="col" className="">
              Reasons
            </th>
            <th className="">
            </th>
          </tr>
        </thead>

        <tbody className=''>
          {
            listPostReport?.map(report => (
              <tr key={report?.reportPostId} className="bg-white border-b hover:bg-gray-50 h-[100px]">
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
                    onClick={() => handleReviewReportedPost(report)}
                  >
                    <img src={blogIcon} className='size-10' />
                    <span className='font-semibold text-xs capitalize '>Click to view</span>
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

export default PostReports
