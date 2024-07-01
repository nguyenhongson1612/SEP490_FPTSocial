import PostComment from './PostContent/PostComment/PostComment'
import PostContents from './PostContent/PostContents'
import PostReactStatus from './PostContent/PostReactStatus'
import PostTitle from './PostContent/PostTitle'

function Post({ postData }) {
  return <div id="post"
    // ref={refModal}
    className="w-full h-fit flex flex-col items-center gap-2 border bg-white border-gray-300 p-4 shadow-md rounded-md">
    <PostTitle postData={postData} />
    <PostContents postData={postData} />
    <PostReactStatus postData={postData} />
    {/* <PostComment postData={postData} /> */}
  </div>

}
export default Post