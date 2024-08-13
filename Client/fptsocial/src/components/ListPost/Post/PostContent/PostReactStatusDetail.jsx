import { TabContext, TabList, TabPanel } from '@mui/lab'
import { Box, Tab } from '@mui/material'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { getAllReactByGroupPhotoPostId, getAllReactByGroupPostId, getAllReactByGroupSharePostId, getAllReactByGroupVideoPostId } from '~/apis/groupPostApis'
import { getAllReactByPhotoPostId, getAllReactByPostId, getAllReactBySharePostId, getAllReactByVideoPostId, getAllReactType, getReactPostDetail } from '~/apis/reactApis'
import UserAvatar from '~/components/UI/UserAvatar'
import { POST_TYPES } from '~/utils/constants'
import likeEmoji from '~/assets/img/emojis/like.png'
import angryEmoji from '~/assets/img/emojis/angry.png'
import { Link } from 'react-router-dom'

function PostReactStatusDetail({ postType, postData }) {
  const [listReact, setListReact] = useState([])
  const [listPostReact, setListPostReact] = useState([])
  const [listUserReactByReactType, setListUserReactByReactType] = useState([])
  const [value, setValue] = useState(10)
  const { t } = useTranslation()

  const handleChange = (event, newValue) => {
    setValue(newValue)
  }

  let postId = ''
  let postTypeName = ''
  let getAllPostReactFn = ''
  const isProfile = postType == POST_TYPES.PROFILE_POST
  const isShare = postType == POST_TYPES.SHARE_POST
  const isPhoto = postType == POST_TYPES.PHOTO_POST
  const isVideo = postType == POST_TYPES.VIDEO_POST
  const isGroup = postType == POST_TYPES.GROUP_POST
  const isGroupShare = postType == POST_TYPES.GROUP_SHARE_POST
  const isGroupPhoto = postType == POST_TYPES.GROUP_PHOTO_POST
  const isGroupVideo = postType == POST_TYPES.GROUP_VIDEO_POST

  if (isProfile) {
    postId = postData?.userPostId || postData?.postId
    postTypeName = 'UserPost'
    getAllPostReactFn = getAllReactByPostId
  } else if (isShare) {
    postId = postData?.sharePostId || postData?.postId
    postTypeName = 'UserSharePost'
    getAllPostReactFn = getAllReactBySharePostId
  } else if (isPhoto) {
    postId = postData?.userPostMediaId
    postTypeName = 'UserPhotoPost'
    getAllPostReactFn = getAllReactByPhotoPostId
  } else if (isVideo) {
    postId = postData?.userPostMediaId
    postTypeName = 'UserVideoPost'
    getAllPostReactFn = getAllReactByVideoPostId
  } else if (isGroup) {
    postId = postData?.groupPostId || postData?.postId
    postTypeName = 'GroupPost'
    getAllPostReactFn = getAllReactByGroupPostId
  } else if (isGroupShare) {
    postId = postData?.groupSharePostId || postData?.postId
    postTypeName = 'GroupSharePost'
    getAllPostReactFn = getAllReactByGroupSharePostId
  } else if (isGroupPhoto) {
    postId = postData?.groupPostMediaId
    postTypeName = 'GroupPhotoPost'
    getAllPostReactFn = getAllReactByGroupPhotoPostId
  } else if (isGroupVideo) {
    postId = postData?.groupPostMediaId
    postTypeName = 'GroupVideoPost'
    getAllPostReactFn = getAllReactByGroupVideoPostId
  }

  useEffect(() => {
    getAllPostReactFn(postId).then(data => setListPostReact(data))
    getAllReactType().then(data => setListReact(data))
  }, [])

  useEffect(() => {
    listPostReact?.listReact?.length > 0 && value != 10 &&
      getReactPostDetail({ postId: postId, postType: postTypeName, reactName: listPostReact?.listReact[value]?.reactTypeName })
        .then(data => setListUserReactByReactType(data?.listUserReact))
  }, [listReact, value])

  return (
    <div className='p-1 w-[90%] md:w-[300px] min-h-[200px]'>
      <TabContext value={value}>
        <Box sx={{
          borderBottom: 1,
          borderColor: 'divider',
          '.MuiTab-root': {
            height: '30px !important',
            minHeight: '30px',
            padding: '2px 8px',
            minWidth: 'auto',
            fontSize: '0.75rem',
          },
          '.MuiTabs-flexContainer': {
            height: '100%',
            justifyContent: 'center',
          },
          '.MuiTabScrollButton-root': {
            flex: '0 0 20px',
          }
        }}>
          <TabList onChange={handleChange} aria-label="lab API tabs example">
            <Tab
              value={10}
              label={'All'}
            />
            {listPostReact?.listReact?.map((e, index) => (
              <Tab
                key={e?.reactTypeId}
                value={index}
                icon={
                  <img
                    className='size-5'
                    src={e?.reactTypeName?.toLowerCase() == 'like' ? likeEmoji : angryEmoji}
                  />
                }
                iconPosition="start"
                label={String(e?.numberReact)}
              />
            ))}
          </TabList>
        </Box>
        <div className='p-2'>
          <div className='flex flex-col gap-1'>
            {
              value == 10 &&
              listPostReact?.listUserReact?.map(e => (
                <Link to={`/profile?id=${e?.userId}`} key={e?.userId} className='flex gap-2 items-center hover:bg-fbWhite p-2 rounded-md'>
                  <div className='relative'>
                    <UserAvatar avatarSrc={e?.avataUrl} />
                    <img
                      className='size-5 absolute right-0 bottom-0 border border-white rounded-full'
                      src={(e?.reactTypeName || e?.reactName)?.toLowerCase() == 'like' ? likeEmoji : angryEmoji}
                    />
                  </div>
                  <div className=''>
                    <p className='capitalize'>{e?.userName}</p>
                  </div>
                </Link>
              ))
            }
            {value != 10 &&
              listUserReactByReactType?.map(e => (
                <Link to={`/profile?id=${e?.userId}`} key={e?.userId} className='flex gap-2 items-center hover:bg-fbWhite p-2 rounded-md'>
                  <div className='relative'>
                    <UserAvatar avatarSrc={e?.avataUrl} />
                    <img
                      className='size-5 absolute right-0 bottom-0 border border-white rounded-full'
                      src={(e?.reactTypeName || e?.reactName)?.toLowerCase() == 'like' ? likeEmoji : angryEmoji}
                    />
                  </div>
                  <div className=''>
                    <p className='capitalize'>{e?.userName}</p>
                  </div>
                </Link>
              ))
            }
          </div>

        </div>
      </TabContext>
    </div>)
}

export default PostReactStatusDetail
