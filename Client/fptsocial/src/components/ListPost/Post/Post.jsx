import { useSelector } from 'react-redux'
import PostComment from './PostContent/PostComment/PostComment'
import PostContents from './PostContent/PostContents'
import PostMedia from './PostContent/PostMedia'
import PostReactStatus from './PostContent/PostReactStatus'
import PostTitle from './PostContent/PostTitle'
import { selectCurrentUser } from '~/redux/user/userSlice'

function Post({ postData }) {
  const currentUser = useSelector(selectCurrentUser)
  const isYourPost = postData?.userId == currentUser?.userId

  return <div id="post"
    // ref={refModal}
    className="w-full sm:w-[500px] flex flex-col items-center border bg-white border-gray-300 shadow-md rounded-md">
    <PostTitle postData={postData} isYourPost={isYourPost} />
    <PostContents postData={postData} />
    <PostMedia postData={postData} />
    <PostReactStatus postData={postData} />
    {/* <PostComment postData={postData} /> */}
  </div>

}
export default Post