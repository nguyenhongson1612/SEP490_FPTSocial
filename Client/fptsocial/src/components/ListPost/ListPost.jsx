import ActivePost from '../Modal/ActivePost/ActivePost'
import Post from './Post/Post'

function ListPost({ listPost }) {

  return (
    <div id="post-list"
      className="flex flex-col items-center gap-3 w-full sm:w-[500px]"
    >
      <ActivePost />
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