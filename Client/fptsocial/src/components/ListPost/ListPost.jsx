import NewPost from '~/components/NewPost/NewPost'
import PostOverLay from './PostOverlay/PostOverlay'

function ListPost({ listPost }) {

  return (
    <div id="post-list"
      className="flex flex-col items-center gap-3 w-[90%] "
    >
      {
        listPost?.map((post) => {
          return <PostOverLay
            key={post?.id}
            postData={post} />
        })
      }
    </div>
  )
}

export default ListPost