import MenuItem from '@mui/material/MenuItem'
import Menu from '@mui/material/Menu'
import FormControl from '@mui/material/FormControl'
import FormControlLabel from '@mui/material/FormControlLabel'
import Modal from '@mui/material/Modal'
import Radio from '@mui/material/Radio'
import RadioGroup from '@mui/material/RadioGroup'
import { IconBookmark, IconMessageReport, IconPencil, IconTrash, IconX } from '@tabler/icons-react'
import { useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { Link } from 'react-router-dom'
import { IconDots } from '@tabler/icons-react'
import UserAvatar from '~/components/UI/UserAvatar'
import { compareDateTime } from '~/utils/formatters'
import { useDispatch, useSelector } from 'react-redux'
import { selectIsShowModalUpdatePost, showModalUpdatePost, updateCurrentActivePost } from '~/redux/activePost/activePostSlice'
import { selectListUserStatus } from '~/redux/sideData/sideDataSlice'


function PostTitle({ postData, isYourPost }) {
  const [isOpenModal, setIsOpenModal] = useState(false)
  const listStatus = useSelector(selectListUserStatus)
  const { register, setValue, control, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
    }
  })

  const isShowModalUpdatePost = useSelector(selectIsShowModalUpdatePost)
  const dispatch = useDispatch()
  const [anchorEl, setAnchorEl] = useState(null)
  const open = Boolean(anchorEl)
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleEdit = () => {
    dispatch(showModalUpdatePost())
    dispatch(updateCurrentActivePost(postData))
  }

  return (
    <div id="post-title"
      className="w-full flex justify-between items-center px-4 py-2">
      <div className='w-full flex gap-4'>
        <Link to={`/profile?id=${postData?.userId || postData?.photo?.userId}`} className="w-fit cursor-pointer relative text-gray-500 hover:text-gray-950 flex items-center justify-start gap-3">
          <UserAvatar avatarSrc={postData?.avatar?.avataPhotosUrl} isOther={true} />
        </Link>

        <div className="flex flex-col gap-1">
          <div className="font-semibold font-sans">{postData?.fullName}</div>
          <div className="flex justify-start gap-2 text-gray-500  text-sm">
            <Link to={`/post/${postData?.userPostId}`}>{compareDateTime(postData?.createdAt)}</Link>
            <span onClick={() => { isYourPost && setIsOpenModal(!isOpenModal) }}
              className={`text-gray-900 font-bold ${isYourPost && 'cursor-pointer'}`}>
              {postData?.userStatus?.userStatusName || postData?.status?.userStatusName}
            </span>

            <Modal
              open={isOpenModal}
              onClose={() => setIsOpenModal(!isOpenModal)}
              aria-labelledby="parent-modal-title"
              aria-describedby="parent-modal-description"
            >
              <div className='absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-md'>
                <div className='h-[60px]  flex justify-between items-center px-5 border-b '>
                  <span></span>
                  <span className='text-2xl font-bold'>Select audience</span>
                  <IconX className='bg-orangeFpt text-white rounded-full size-9 cursor-pointer hover:bg-orange-700'
                    onClick={() => setIsOpenModal(!isOpenModal)} />
                </div>
                <div className='px-4 pb-10 ' >
                  <div>
                    <div className='font-bold '>Who can see your post?</div>
                    <div className='text-sm'>
                      Your post will show up in Feed, on your profile and in search results.<br /><br />
                      Your default audience is set to Public, but you can change the audience of this specific post.
                    </div>
                  </div>
                  <div>
                    <FormControl fullWidth className="col-span-12" error={!!errors.groupType}>
                      <Controller
                        name="postStatus"
                        control={control}
                        defaultValue={postData?.userStatus?.userStatusId || postData?.status?.userStatusId}
                        // rules={{ required: FIELD_REQUIRED_MESSAGE }}
                        render={({ field }) => (
                          <RadioGroup
                            {...field}
                            value={field.value || ''}
                          >
                            {listStatus?.map(status => (
                              <FormControlLabel key={status.userStatusId} value={status.userStatusId} control={<Radio />} label={status.statusName} />
                            ))}
                          </RadioGroup>
                        )}
                      />
                      {/* <FieldErrorAlert errors={errors} fieldName="groupType" /> */}
                    </FormControl>
                  </div>
                </div >
              </div>
            </Modal>
          </div>
        </div>
      </div>

      <div
        className="rounded-full flex justify-center items-center hover:bg-fbWhite cursor-pointer size-10"
        onClick={handleClick}
      ><IconDots /></div>
      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={open}
        onClose={handleClose}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <MenuItem onClick={handleClose} sx={{ gap: '5px' }}>
          <IconBookmark /> Save post
        </MenuItem>
        {
          isYourPost && (
            <MenuItem onClick={handleEdit} sx={{ gap: '5px' }} >
              <IconPencil /> Edit post
            </MenuItem>
          )
        }
        {
          isYourPost && (
            <MenuItem onClick={handleClose} sx={{ gap: '5px' }}  >
              <IconTrash /> Remove post
            </MenuItem>
          )
        }
        {!isYourPost &&
          <MenuItem onClick={handleClose} sx={{ gap: '5px' }}>
            <IconMessageReport /> Report
          </MenuItem>
        }
      </Menu>
    </div>
  )
}

export default PostTitle