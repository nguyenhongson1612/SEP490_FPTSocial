import { comment } from '~/apis/mock-data'
import ListComments from './ListComments/ListComments'
import Tiptap from '~/components/TitTap/TitTap'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useSelector } from 'react-redux'
import { selectCurrentUser } from '~/redux/user/userSlice'
import { IconCaretDownFilled } from '@tabler/icons-react'
import { Popover, Typography } from '@mui/material'

function PostComment({ comment, postType }) {
  const [isCreate, setIsCreate] = useState(false)
  const [isChosePostAudience, setIsChosePostAudience] = useState(false)
  const { handleSubmit } = useForm()
  const [content, setContent] = useState('')
  const user = useSelector(selectCurrentUser)
  const [listPhotos, setListPhotos] = useState([])
  const [listVideos, setListVideos] = useState([])
  const [listStatus, setListStatus] = useState([])
  const [choseStatus, setChoseStatus] = useState({})

  const [anchorEl, setAnchorEl] = useState(null)

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const open = Boolean(anchorEl)
  const id = open ? 'simple-popover' : undefined

  return (
    <div className='w-full border-t'>
      <div className='px-4 py-2'>
        <div id='comment-filter' onClick={handleClick} className='flex font-medium cursor-pointer w-fit'>Most relevent<IconCaretDownFilled /></div>
        <Popover
          id={id}
          open={open}
          anchorEl={anchorEl}
          onClose={handleClose}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}>
          <div className='flex flex-col p-2 gap-2'>
            <span>Most relevant</span>
            <span>Newest</span>
            <span>All comment</span>
          </div>
        </Popover>
        <ListComments comment={comment} postType={postType} />
      </div>
    </div>
  )
}

export default PostComment
