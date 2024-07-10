import { useDispatch, useSelector } from 'react-redux'
import ActivePost from '../Modal/ActivePost/ActivePost'
import Post from './Post/Post'
import { selectCurrentUser } from '~/redux/user/userSlice'
import { useLocation, useSearchParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { getStatus } from '~/apis'
import { getAllReactType } from '~/apis/reactApis'
import UpdatePost from '../Modal/ActivePost/UpdatePost'
import { selectIsShowModalUpdatePost } from '~/redux/activePost/activePostSlice'
import { addListReactType, addListUserStatus } from '~/redux/sideData/sideDataSlice'

function ListPost({ listPost }) {
  // const currentUser = useSelector(selectCurrentUser)
  // const location = useLocation()
  // const [searchParams] = useSearchParams()
  const dispatch = useDispatch()

  // const isProfile = location.pathname === '/profile'
  // const paramUserId = isProfile && searchParams.get('id')
  // const isYourProfile = currentUser?.userId === paramUserId
  const isShowUpdatePost = useSelector(selectIsShowModalUpdatePost)
  useEffect(() => {
    getStatus().then(data => dispatch(addListUserStatus(data)))
    getAllReactType().then(data => dispatch(addListReactType(data)))
  }, [])


  return (
    <div id="post-list"
      className="flex flex-col items-center gap-3 min-h-[1000px]"
    >
      <ActivePost />
      {isShowUpdatePost && <UpdatePost />}
      {
        listPost?.map((post, key) => {
          return <Post
            key={key}
            postData={post} />
        })
      }
    </div>
  )
}

export default ListPost