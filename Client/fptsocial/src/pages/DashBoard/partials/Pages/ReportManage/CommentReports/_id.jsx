import { Button, IconButton, Modal } from '@mui/material'
import { IconArrowBackUp } from '@tabler/icons-react'
import { useCallback, useEffect, useState } from 'react'
import { handleReport } from '~/apis/report'
import { getListReportComment, getListReportGroup, getListReportUser } from '~/apis/adminApis/reportsApis'
import { useConfirm } from 'material-ui-confirm'
import { useDispatch } from 'react-redux'
import { triggerReload } from '~/redux/ui/uiSlice'
import ListUserReported from '../ListUserReported'
import { POST_TYPES } from '~/utils/constants'

function DetailCommentReport({ open, setOpen, reportedComment }) {
  const handleClose = () => setOpen(false)
  const dispatch = useDispatch()

  const [reportedObject, setReportedObject] = useState({})

  let paramComment = {}
  let commentId = ''
  // let fetchFunction
  // let removeFunction

  if (reportedComment?.commentId) {
    commentId = reportedComment?.commentId
    // fetchFunction = getUserPostById
    // removeFunction = deleteUserPost
    paramComment = { commentId: commentId }
  }
  else if (reportedComment?.commentPhotoPostId) {
    // postType = POST_TYPES.PHOTO_POST
    commentId = reportedComment?.commentPhotoPostId
    // fetchFunction = getChildPostById
    paramComment = { commentPhotoPostId: commentId }
  }
  else if (reportedComment?.commentVideoPostId) {
    // postType = POST_TYPES.VIDEO_POST
    commentId = reportedComment?.commentVideoPostId
    // fetchFunction = getChildPostById
    paramComment = { commentVideoPostId: commentId }
  }
  else if (reportedComment?.commentGroupPostId) {
    // postType = POST_TYPES.GROUP_POST
    commentId = reportedComment?.commentGroupPostId
    // fetchFunction = getGroupPostByGroupPostId
    // removeFunction = deleteGroupPost
    paramComment = { commentGroupPostId: commentId }
  }
  else if (reportedComment?.commentGroupVideoPostId) {
    // postType = POST_TYPES.GROUP_VIDEO_POST
    commentId = reportedComment?.commentGroupVideoPostId
    // fetchFunction = getChildGroupPost
    paramComment = { commentGroupVideoPostId: commentId }
  }
  else if (reportedComment?.commentPhotoGroupPostId) {
    // postType = POST_TYPES.GROUP_PHOTO_POST
    commentId = reportedComment?.commentPhotoGroupPostId
    // fetchFunction = getChildGroupPost
    paramComment = { commentPhotoGroupPostId: commentId }
  }
  else if (reportedComment?.commentSharePostId) {
    // postType = POST_TYPES.SHARE_POST
    commentId = reportedComment?.commentSharePostId
    // fetchFunction = getUserPostById
    // removeFunction = deleteSharePost
    paramComment = { commentSharePostId: commentId }
  }
  else if (reportedComment?.commentGroupSharePostId) {
    // postType = POST_TYPES.GROUP_SHARE_POST
    commentId = reportedComment?.commentGroupSharePostId
    // fetchFunction = getGroupPostByGroupPostId
    // removeFunction = deleteGroupSharePost
    paramComment = { commentGroupSharePostId: commentId }
  }
  console.log(paramComment, 'abc');


  useEffect(() => {
    (async () => {
      // await fetchFunction(commentId).then(data => {
      //   setReportedObject({ ...data, postType: postType })
      // })
    })()
  }, [])

  const getUserReportedFn = useCallback(({ page }) => getListReportComment({ page, ...paramComment }), [])

  const confirm = useConfirm()
  const handleReportPost = () => {
    confirm({
      title: "Xử lý báo cáo",
      allowClose: true,
      description: "Bạn muốn xử lý báo cáo này như thế nào?",
      confirmationText: "Vi phạm",
      cancellationText: "An toàn",
      confirmationButtonProps: {
        variant: "contained",
        color: "error"
      },
      cancellationButtonProps: {
        variant: "contained",
        color: "primary"
      },
    })
      .then(() => {
        // handleReport({ 'reportType': 'User', 'isAccepted': true, ...par }).then(() => removeFunction(postId))
      })
      .catch(() => {
        handleReport({ 'reportType': 'Comment', 'isAccepted': false, ...paramComment })
      })
      .finally(() => {
        setOpen(false)
        dispatch(triggerReload())
      })
  }

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <div className='w-screen h-screen bg-white '>
        <div className='h-full'>
          <div className='flex py-1 px-5 gap-10'>
            <IconButton color="warning" onClick={handleClose} >
              <IconArrowBackUp />
            </IconButton>
            <div className='flex items-center gap-2'>
              <Button variant='contained' color='primary' sx={{ height: '30px' }} onClick={handleReportPost} size='small'>Handle Report</Button>
            </div>
          </div>
          <div className='border h-full grid grid-cols-12'>
            <div className='col-span-7 border-r  overflow-y-auto scrollbar-none-track '>
              <div className='pointer-events-none mb-20 mt-4 flex justify-center'>
                {/* <Post postData={reportedObject} /> */}
              </div>
            </div>
            <ListUserReported getUserReportedFn={getUserReportedFn} />
          </div>
        </div>
      </div>
    </Modal>
  )
}

export default DetailCommentReport
