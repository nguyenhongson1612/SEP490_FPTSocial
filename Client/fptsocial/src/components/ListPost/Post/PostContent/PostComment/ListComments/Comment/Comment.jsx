import { Menu, MenuItem, Popover } from '@mui/material'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import { commentPhotoPost, commentPost, commentSharePost, commentVideoPost, deleteCommentSharePost, deleteCommentUserPhotoPost, deleteCommentUserPost, deleteCommentUserVideoPost, updateCommentSharePost, updateUserCommentPhotoPost, updateUserCommentPost, updateUserCommentVideoPost } from '~/apis/postApis'
import { createReactCommentSharePost, createReactCommentUserPhotoPost, createReactCommentUserPost, createReactCommentUserVideoPost, getAllReactByCommentId, getAllReactByCommentPhotoId, getAllReactByCommentSharePostId, getAllReactByCommentVideoId } from '~/apis/reactApis'
import Tiptap from '~/components/TitTap/TitTap'
import UserAvatar from '~/components/UI/UserAvatar'
import { selectCurrentActivePost, triggerReloadComment, updateCurrentActivePost } from '~/redux/activePost/activePostSlice'
import { selectListReactType } from '~/redux/sideData/sideDataSlice'
import { selectCurrentUser } from '~/redux/user/userSlice'
import { cleanAndParseHTML, compareDateTime } from '~/utils/formatters'
import likeEmoji from '~/assets/img/emojis/like.png'
import angryEmoji from '~/assets/img/emojis/angry.png'
import { commentGroupPhotoPost, commentGroupPost, commentGroupSharePost, commentGroupVideoPost, createReactCommentGroupPhotoPost, createReactCommentGroupPost, createReactCommentGroupSharePost, createReactCommentGroupVideoPost, deleteCommentGroupPhotoPost, deleteCommentGroupPost, deleteCommentGroupSharePost, deleteCommentGroupVideoPost, getAllReactByCommentGroupSharePostId, getAllReactByGroupCommentId, getAllReactByGroupCommentPhotoId, getAllReactByGroupCommentVideoId, updateCommentGroupSharePost, updateGroupCommentPhotoPost, updateGroupCommentPost, updateGroupCommentVideoPost } from '~/apis/groupPostApis'
import { EDITOR_TYPE, POST_TYPES, REPORT_TYPES } from '~/utils/constants'
import { IconDotsVertical } from '@tabler/icons-react'
import { useConfirm } from 'material-ui-confirm'
import { selectCurrentActiveListPost, updateCurrentActiveListPost } from '~/redux/activeListPost/activeListPostSlice'
import { addReport, openModalReport } from '~/redux/report/reportSlice'

function Comment({ comment, postType }) {
  // console.log('🚀 ~ Comment ~ comment:', comment)
  const currentActivePost = useSelector(selectCurrentActivePost)
  const currentActiveListPost = useSelector(selectCurrentActiveListPost)
  const { handleSubmit } = useForm()
  const listReact = useSelector(selectListReactType)
  const [content, setContent] = useState('')
  const [listPhotos, setListPhotos] = useState([])
  const [listVideos, setListVideos] = useState([])
  const [listCommentReact, setListCommentReact] = useState()
  const [reload, setReload] = useState(false)
  const dispatch = useDispatch()
  const [isEditContent, setIsEditContent] = useState(false)

  const currentUser = useSelector(selectCurrentUser)
  const isYourComment = currentUser?.userId == comment?.userId
  const isProfile = postType === POST_TYPES.PROFILE_POST
  const isShare = postType === POST_TYPES.SHARE_POST
  const isVideoPost = postType === POST_TYPES.VIDEO_POST
  const isPhotoPost = postType === POST_TYPES.PHOTO_POST
  const isGroup = postType === POST_TYPES.GROUP_POST
  const isGroupShare = postType === POST_TYPES.GROUP_SHARE_POST
  const isGroupPhoto = postType === POST_TYPES.GROUP_PHOTO_POST
  const isGroupVideo = postType === POST_TYPES.GROUP_VIDEO_POST

  const [anchorEl, setAnchorEl] = useState(null)
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }
  const [anchorEl2, setAnchorEl2] = useState(null)
  const handleClick2 = (event) => {
    setAnchorEl2(event.currentTarget)
  }
  const handleClose2 = () => {
    setAnchorEl2(null)
  }
  const open = Boolean(anchorEl)
  const id = open ? 'simple-popover' : undefined
  const open2 = Boolean(anchorEl2)
  const id2 = open ? 'simple-popover2' : undefined

  const getReactOfComment = async () => {
    const response = await (
      isProfile ? getAllReactByCommentId(comment?.commentId)
        : isShare ? getAllReactByCommentSharePostId(comment?.commentSharePostId)
          : isVideoPost ? getAllReactByCommentVideoId(comment?.commentVideoPostId)
            : isPhotoPost ? getAllReactByCommentPhotoId(comment?.commentPhotoPostId)
              : isGroup ? getAllReactByGroupCommentId(comment?.commentGroupPostId)
                : isGroupShare ? getAllReactByCommentGroupSharePostId(comment?.commentGroupSharePostId)
                  : isGroupPhoto ? getAllReactByGroupCommentPhotoId(comment?.commentPhotoGroupPostId)
                    : isGroupVideo && getAllReactByGroupCommentVideoId(comment?.commentGroupVideoPostId)
    )
    setListCommentReact(response)
  }

  useEffect(() => {
    getReactOfComment()
  }, [reload])

  const handleRelyComment = () => {
    const submitData =
    {
      ...(isProfile ? { 'userPostId': comment?.userPostId }
        : isShare ? { 'sharePostId': comment?.sharePostId }
          : isVideoPost ? { 'userPostVideoId': comment?.userPostVideoId }
            : isPhotoPost ? { 'userPostPhotoId': comment?.userPostPhotoId }
              : isGroup ? { 'groupPostId': comment?.groupPostId }
                : isGroupShare ? { 'groupSharePostId': comment?.groupSharePostId }
                  : isGroupPhoto ? { 'groupPostPhotoId': comment?.groupPostPhotoId }
                    : isGroupVideo && { 'groupPostVideoId': comment?.groupPostVideoId }
      ),
      'userId': currentUser?.userId,
      'content': content,
      'parentCommentId':
        isProfile ? comment?.commentId
          : isShare ? comment?.commentSharePostId
            : isPhotoPost ? comment?.commentPhotoPostId
              : isVideoPost ? comment?.commentVideoPostId
                : isGroup ? comment?.commentGroupPostId
                  : isGroupShare ? comment?.commentGroupSharePostId
                    : isGroupPhoto ? comment?.commentPhotoGroupPostId
                      : isGroupVideo && comment?.commentGroupVideoPostId
    }
    toast.promise(
      isProfile ? commentPost(submitData)
        : isShare ? commentSharePost(submitData)
          : isVideoPost ? commentVideoPost(submitData)
            : isPhotoPost ? commentPhotoPost(submitData)
              : isGroup ? commentGroupPost(submitData)
                : isGroupShare ? commentGroupSharePost(submitData)
                  : isGroupPhoto ? commentGroupPhotoPost(submitData)
                    : isGroupVideo && commentGroupVideoPost(submitData)
      ,
      { pending: 'Posting...' }
    ).then(() => {
      toast.success('Commented')
    }).then(() => { dispatch(triggerReloadComment()); setAnchorEl(null) })
      .then(() => dispatch(updateCurrentActivePost({ ...currentActivePost, reactCount: { ...currentActivePost?.reactCount, commentNumber: currentActivePost?.reactCount?.commentNumber + 1 } })))
      .then(() => {
        const updatedPosts = currentActiveListPost.map(post =>
          post.postId === currentActivePost.postId
            ? {
              ...currentActivePost,
              reactCount: {
                ...currentActivePost.reactCount,
                commentNumber: currentActivePost.reactCount.commentNumber + 1
              }
            }
            : post
        );
        dispatch(updateCurrentActiveListPost(updatedPosts));
      })
  }

  const handleReactPost = (type) => {
    const reactData = (isProfile ?
      {
        'userPostId': comment?.userPostId,
        'userId': currentUser?.userId,
        'reactTypeId': type,
        'commentId': comment?.commentId,
      }
      : isShare ? {
        'sharePostId': comment?.sharePostId,
        'userId': currentUser?.userId,
        'reactTypeId': type,
        'commentSharePostId': comment?.commentSharePostId,
      }
        : isVideoPost ? {
          'userPostVideoId': comment?.userPostVideoId,
          'userId': currentUser?.userId,
          'reactTypeId': type,
          'commentVideoPostId': comment?.commentVideoPostId,
        }
          : isPhotoPost ? {
            'userPostPhotoId': comment?.userPostPhotoId,
            'userId': currentUser?.userId,
            'reactTypeId': type,
            'commentPhotoPostId': comment?.commentPhotoPostId,
          }
            : isGroup ? {
              'groupPostId': comment?.groupPostId,
              'userId': currentUser?.userId,
              'reactTypeId': type,
              'commentGroupPostId': comment?.commentGroupPostId,
            }
              : isGroupShare ? {
                'groupSharePostId': comment?.groupSharePostId,
                'userId': currentUser?.userId,
                'reactTypeId': type,
                'commentGroupSharePostId': comment?.commentGroupSharePostId,
              }
                : isGroupPhoto ? {
                  'groupPostPhotoId': comment?.groupPostPhotoId,
                  'userId': currentUser?.userId,
                  'reactTypeId': type,
                  'commentPhotoGroupPostId': comment?.commentPhotoGroupPostId,
                }
                  : isGroupVideo && {
                    'groupPostVideoId': comment?.groupPostVideoId,
                    'userId': currentUser?.userId,
                    'reactTypeId': type,
                    'commentGroupVideoPostId': comment?.commentGroupVideoPostId,
                  })
    toast.promise(
      isProfile ? createReactCommentUserPost(reactData)
        : isShare ? createReactCommentSharePost(reactData)
          : isVideoPost ? createReactCommentUserVideoPost(reactData)
            : isPhotoPost ? createReactCommentUserPhotoPost(reactData)
              : isGroup ? createReactCommentGroupPost(reactData)
                : isGroupShare ? createReactCommentGroupSharePost(reactData)
                  : isGroupPhoto ? createReactCommentGroupPhotoPost(reactData)
                    : isGroupVideo && createReactCommentGroupVideoPost(reactData)
      //   .then((data) => {
      //     if (data) {
      //       const signalRData = {
      //         MsgCode: 'User-004',
      //         Receiver: `${postData?.userId}`,
      //         Url: `http://localhost:3000/profile?id=${currentUser?.userId}`,
      //         AdditionsMsd: ''
      //       }
      //       connectionSignalR.invoke('SendNotify', JSON.stringify(signalRData))
      //     }
      //   })
      , { pending: '' }
    ).then(() => setReload(!reload)
    )
  }
  const confirm = useConfirm()
  const handleRemoveComment = () => {
    confirm({
      title: (
        <div className='flex flex-col gap-2'>
          <div className='font-bold text-[#d22e2e]'>Delete this comment?</div>
        </div>
      ),
      description: ('This a permanent action and cannot be undone.The comment and all associated replies will be removed from the system..'),
      confirmationButtonProps: { color: 'error', variant: 'contained' },
      confirmationText: 'Delete',
      cancellationText: 'Cancel'
    }).then(() => {
      toast.promise(
        (isProfile ? deleteCommentUserPost(comment?.commentId)
          : isShare ? deleteCommentSharePost(comment?.commentSharePostId)
            : isPhotoPost ? deleteCommentUserPhotoPost(comment?.commentPhotoPostId)
              : isVideoPost ? deleteCommentUserVideoPost(comment?.commentVideoPostId)
                : isGroup ? deleteCommentGroupPost(comment?.commentGroupPostId)
                  : isGroupShare ? deleteCommentGroupSharePost(comment?.commentGroupSharePostId)
                    : isGroupPhoto ? deleteCommentGroupPhotoPost(comment?.commentPhotoGroupPostId)
                      : isGroupVideo && deleteCommentGroupVideoPost(comment?.commentGroupVideoPostId)),
        { pending: 'Processing...' }
      ).then(() => dispatch(triggerReloadComment()))
        .then(() => dispatch(updateCurrentActivePost({ ...currentActivePost, reactCount: { ...currentActivePost?.reactCount, commentNumber: currentActivePost?.reactCount?.commentNumber - 1 } })))
        .then(() => {
          const updatedPosts = currentActiveListPost.map(post =>
            post.postId === currentActivePost.postId
              ? {
                ...currentActivePost,
                reactCount: {
                  ...currentActivePost.reactCount,
                  commentNumber: currentActivePost.reactCount.commentNumber - 1
                }
              }
              : post
          );
          dispatch(updateCurrentActiveListPost(updatedPosts));
        })
    })
  }

  const handleUpdateComment = () => {
    (async () => {
      const submitData = {
        'userId': currentUser?.userId,
        'content': content,
        ...(isProfile ? { 'commentId': comment?.commentId }
          : isShare ? { 'commentSharePostId': comment?.commentSharePostId }
            : isPhotoPost ? { 'commentPhotoPostId': comment?.commentPhotoPostId }
              : isVideoPost ? { 'commentVideoPostId': comment?.commentVideoPostId }
                : isGroup ? { 'commentGroupPostId': comment?.commentGroupPostId }
                  : isGroupShare ? { 'commentGroupSharePostId': comment?.commentGroupSharePostId }
                    : isGroupPhoto ? { 'commentPhotoGroupPostId': comment?.commentPhotoGroupPostId }
                      : isGroupVideo && { 'commentGroupVideoPostId': comment?.commentGroupVideoPostId }
        )
      }
      await (isProfile ? updateUserCommentPost(submitData)
        : isShare ? updateCommentSharePost(submitData)
          : isPhotoPost ? updateUserCommentPhotoPost(submitData)
            : isVideoPost ? updateUserCommentVideoPost(submitData)
              : isGroup ? updateGroupCommentPost(submitData)
                : isGroupShare ? updateCommentGroupSharePost(submitData)
                  : isGroupPhoto ? updateGroupCommentPhotoPost(submitData)
                    : isGroupVideo && updateGroupCommentVideoPost(submitData)
      )
      dispatch(triggerReloadComment())
      setIsEditContent(false)
      setContent('')
    })()
  }
  return (
    <div className={`${comment?.level !== 1 && 'pl-[15%] mt-3'} `}>
      <div className='flex gap-1'>
        <UserAvatar avatarSrc={comment?.url} isOther={true} />
        <div className='flex flex-col gap-1'>
          {
            !isEditContent &&
            <>
              <div className='bg-gray-100 flex flex-col py-2 px-3 rounded-2xl w-full'>
                <span className='font-bold'>{comment?.userName}</span>
                <div>{cleanAndParseHTML(comment?.content)}</div>
              </div>
              <div className='flex gap-2 items-center text-xs'>
                <span className='font-thin cursor-pointer'>{compareDateTime(comment?.createdDate)}</span>
                <div className={`relative ${listCommentReact?.isReact && 'text-blue-500'} font-semibold cursor-pointer [&>#react-comment]:hover:!opacity-100`}>
                  Like
                  <div id='react-comment' className='min-w-20 absolute flex gap-1 opacity-0 transition-opacity duration-300 delay-500 top-0 -translate-y-10
                  bg-white shadow-4edges rounded-3xl px-2 py-1'>
                    {listReact?.map(reaction => (
                      <div key={reaction?.reactTypeId} className="text-4xl" onClick={() => handleReactPost(reaction?.reactTypeId)}>
                        {reaction?.reactTypeName?.toLowerCase() == 'like' ?
                          <img className='size-8 hover:scale-[1.2] cursor-pointer' src={likeEmoji} />
                          : reaction?.reactTypeName?.toLowerCase() == 'dislike'
                          && <img className='size-8 hover:scale-[1.2] cursor-pointer' src={angryEmoji} />}
                      </div>
                    ))}
                  </div>
                </div>
                <span id='comment-filter' className='font-semibold cursor-pointer' onClick={handleClick}>Rely</span>
                <span className={`font-semibold cursor-pointer flex items-center gap-[1px] ${(listCommentReact?.sumOfReact ?? 0) == 0 && 'invisible'}`}>
                  <img className='size-4 cursor-pointer' src={likeEmoji} />
                  {listCommentReact?.sumOfReact}
                </span>
                <Popover
                  id={id}
                  open={open}
                  anchorEl={anchorEl}
                  onClose={handleClose}
                  anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                  }}
                >
                  <form onSubmit={handleSubmit(handleRelyComment)} className='my-4 w-full flex gap-2 px-4'>
                    <UserAvatar />
                    <div className='rounded-lg pt-2'>
                      <Tiptap
                        setContent={setContent}
                        content={content}
                        listPhotos={listPhotos}
                        setListPhotos={setListPhotos}
                        listVideos={listVideos}
                        setListVideos={setListVideos}
                        editorType={EDITOR_TYPE.COMMENT}
                      />
                    </div>
                  </form>
                </Popover>
              </div>
            </>
          }
          {
            isEditContent && <div className='mb-3'>
              <form onSubmit={handleSubmit(handleUpdateComment)} className='my-4 w-full flex gap-2 px-4'>
                <div className='rounded-lg pt-2'>
                  <Tiptap
                    setContent={setContent}
                    content={comment?.content}
                    listPhotos={listPhotos}
                    setListPhotos={setListPhotos}
                    listVideos={listVideos}
                    setListVideos={setListVideos}
                    editorType={EDITOR_TYPE.COMMENT}
                  />
                </div>
              </form>
              <span className='cursor-pointer text-xs px-3 font-semibold text-blue-500' onClick={() => setIsEditContent(!isEditContent)}>Cancel</span>
            </div>

          }
        </div>

        <div
          className="rounded-full flex justify-center items-center hover:bg-fbWhite cursor-pointer size-10"
          onClick={handleClick2}
        ><IconDotsVertical /></div>
        <Menu
          anchorEl={anchorEl2}
          id={id2}
          open={open2}
          onClose={handleClose2}
          transformOrigin={{ horizontal: 'right', vertical: 'top' }}
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        >
          {isYourComment && <MenuItem onClick={() => { handleClose2(), setIsEditContent(!isEditContent) }} sx={{ gap: '5px' }}>
            Edit
          </MenuItem>}
          {isYourComment && <MenuItem onClick={() => { handleRemoveComment(); handleClose2() }} sx={{ gap: '5px' }}>
            Delete
          </MenuItem>}
          <MenuItem
            onClick={() => {
              dispatch(addReport({ reportData: { ...comment, type: postType }, reportType: REPORT_TYPES.COMMENT }))
              dispatch(openModalReport())
              handleClose()
            }}
            sx={{ gap: '5px' }}>
            Report
          </MenuItem>
        </Menu>

      </div>
      {comment?.replies?.map((e, i) => (
        <Comment key={i} comment={e} postType={postType} />
      ))}
    </div >
  )
}

export default Comment
