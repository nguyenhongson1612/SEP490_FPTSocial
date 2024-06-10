import PostDescription from './PostContent/PostDescription'
import PostReactStatus from './PostContent/PostReactStatus'
import PostTitle from './PostContent/PostTitle'

function Post({ isOpen, setIsOpen, postData }) {
  return <div id="post"
    // ref={refModal}
    className={`w-full h-fit flex flex-col items-center gap-2 border bg-white border-gray-300 p-4 ${!isOpen ? 'rounded-lg' : ''} shadow-md`}>
    <PostTitle postData={postData} />
    <PostDescription postData={postData} />
    <PostReactStatus isOpen={isOpen} setIsOpen={setIsOpen} postData={postData} />

  </div>

}
export default Post