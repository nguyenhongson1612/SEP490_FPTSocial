// import React from 'react'
import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { useDispatch, useSelector } from 'react-redux'
import { selectCurrentUser } from '~/redux/user/userSlice'
import { IconX } from '@tabler/icons-react'
import { POST_TYPES, REPORT_TYPES } from '~/utils/constants'
import { triggerReload } from '~/redux/ui/uiSlice'
import { Modal } from '@mui/material'
import { clearReport, selectIsOpenReport, selectReportData, selectReportType } from '~/redux/report/reportSlice'
import { createReportComment, createReportPost, createReportProfile, getReportType } from '~/apis/report'


function Report() {
  const currentUser = useSelector(selectCurrentUser)
  const reportData = useSelector(selectReportData)
  console.log('🚀 ~ Report ~ reportData:', reportData)
  const reportType = useSelector(selectReportType)

  const [listReportType, setListReportType] = useState(null)

  const dispatch = useDispatch()
  const isOpenModalReport = useSelector(selectIsOpenReport)

  const isPost = reportType == REPORT_TYPES.POST
  const isProfile = reportType == REPORT_TYPES.PROFILE
  const isComment = reportType == REPORT_TYPES.COMMENT

  const isProfilePost = reportData?.type == POST_TYPES.PROFILE_POST
  const isPhoto = reportData?.type == POST_TYPES.PHOTO_POST
  const isVideo = reportData?.type == POST_TYPES.VIDEO_POST
  const isShare = reportData?.type == POST_TYPES.SHARE_POST
  const isGroup = reportData?.type == POST_TYPES.GROUP_POST
  const isGroupPhoto = reportData?.type == POST_TYPES.GROUP_PHOTO_POST
  const isGroupVideo = reportData?.type == POST_TYPES.GROUP_VIDEO_POST
  const isGroupShare = reportData?.type == POST_TYPES.GROUP_SHARE_POST

  useEffect(() => {
    getReportType().then(data => setListReportType(data))
  }, [])

  useEffect(() => {
  }, [])

  const handleReport = (typeId) => {
    let submitData = {}
    if (isPost) {
      submitData = {
        'reportById': currentUser?.userId,
        'groupPostId': isGroup ? (reportData?.postId || reportData?.groupPostId) : null,
        'userPostId': isProfilePost ? (reportData?.postId || reportData?.userPostId) : null,
        'userPostPhotoId': isPhoto ? (reportData?.userPostMediaId || reportData?.userPostPhotoId) : null,
        'reportTypeId': typeId,
        'userPostVideoId': isVideo ? (reportData?.userPostMediaId || reportData?.userPostVideoId) : null,
        'groupPostVideoId': isGroupVideo ? (reportData?.groupPostMediaId || reportData?.groupPostVideoId) : null,
        'groupPostPhotoId': isGroupPhoto ? (reportData?.groupPostMediaId || reportData?.groupPostPhotoId) : null
      }
    } else if (isProfile) {
      submitData = {
        'reportTypeId': typeId,
        'groupId': reportData?.groupId ?? null,
        'userId': reportData?.userId ?? null,
        'reportById': currentUser?.userId
      }
    } else if (isComment) {
      submitData = {
        reportTypeId: typeId,
        commentId: reportData?.commentId ?? null,
        commentPhotoPostId: reportData?.commentPhotoPostId ?? null,
        commentVideoPostId: reportData?.commentVideoPostId ?? null,
        commentGroupPostId: reportData?.commentGroupPostId ?? null,
        commentPhotoGroupPostId: reportData?.commentPhotoGroupPostId ?? null,
        commentGroupVideoPostId: reportData?.commentGroupVideoPostId ?? null,
        commentSharePostId: reportData?.commentSharePostId ?? null,
        commentGroupSharePostId: reportData?.commentGroupSharePostId ?? null,
        content: reportData?.content,
        reportById: currentUser?.userId
      }
    }
    toast.promise(
      isProfile ? createReportProfile(submitData)
        : isPost ? createReportPost(submitData)
          : isComment && createReportComment(submitData)
      ,
      { pending: 'Posting...' }
    ).then(() => {
      // dispatch(triggerReload())
      dispatch(clearReport())
      toast.success('Reported!')
    })
  }
  return (
    <div id="new-post"
      className="w-full sm:w-[500px] flex flex-col gap-2 border border-gray-300 p-4 rounded-lg shadow-lg bg-white"
    >

      <Modal
        open={isOpenModalReport}
        onClose={() => dispatch(clearReport())}
      >
        <div className='absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2'>
          <div className='w-full xs:w-[420px] md:w-[500px] bg-white shadow-4edges rounded-lg '>
            <div className='h-[60px] py-2 px-3 font-bold flex justify-between items-center border-b text-xl'>
              <span></span>
              <span className='font-bold font-sans text-xl capitalize'>
                Report
              </span>
              <div className='cursor-pointer' onClick={() => dispatch(clearReport())}>
                <IconX className='text-white bg-orangeFpt rounded-full' />
              </div>
            </div>
            <div className='flex flex-col gap-1 py-2 px-2'>
              {
                listReportType?.map(report => (
                  <div
                    key={report?.reportTypeId}
                    className=' py-3 cursor-pointer rounded-lg bg-fbWhite hover:text-white hover:bg-orangeFpt hover:scale-[1.03]'
                    onClick={() => handleReport(report?.reportTypeId)}
                  >
                    <div className='px-2 first-letter:uppercase'>{report?.reportTypeName}</div>
                  </div>
                ))
              }
            </div>
          </div >
        </div >
      </Modal>
    </div>
  )
}

export default Report