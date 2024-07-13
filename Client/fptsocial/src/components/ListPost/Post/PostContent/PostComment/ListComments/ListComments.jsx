import Comment from './Comment/Comment'

function ListComments({ comment }) {
  return (
    <div className='my-4 flex flex-col gap-3'>
      {comment?.map(e => (
        <Comment key={e?.commentId || e?.commentPhotoPostId || e?.commentVideoPostId} comment={e} />
      ))}
    </div>
  )
}

export default ListComments

