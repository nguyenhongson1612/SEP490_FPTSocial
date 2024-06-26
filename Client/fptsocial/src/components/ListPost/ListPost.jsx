import NewPost from '~/components/NewPost/NewPost'
import PostOverLay from './PostOverlay/PostOverlay'

function ListPost({ listPost }) {

  return (
    <div id="post-list"
      className="flex flex-col items-center gap-3 w-full sm:w-[500px]"
    >
      {
        listPost?.map((post, key) => {
          return <PostOverLay
            key={key}
            postData={post} />
        })
      }
    </div>
  )
}

export default ListPost