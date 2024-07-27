import Comment from './Comment/Comment'

function ListComments({ comment, postType }) {
  return (
    <div className='my-4 flex flex-col gap-3'>
      {comment?.map((e, i) => (
        // <Comment key={e?.commentId || e?.commentPhotoPostId || e?.commentVideoPostId} comment={e} />
        <Comment key={i} comment={e} postType={postType} />
      ))}
    </div>
  )
}

export default ListComments

