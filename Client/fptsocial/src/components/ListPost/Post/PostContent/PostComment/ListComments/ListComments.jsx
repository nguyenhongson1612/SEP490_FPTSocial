import { useTranslation } from 'react-i18next'
import Comment from './Comment/Comment'
import chatImg from '~/assets/img/chat.png'

function ListComments({ comment, postType }) {
  const { t } = useTranslation()
  return (
    <div className='my-4 flex flex-col gap-3'>
      {
        comment?.length == 0 && <div className='flex flex-col items-center gap-2 text-gray-500'>
          {t('standard.comment.noComment')}
          <img src={chatImg} className='size-10' />
        </div>
      }
      {comment?.map((e, i) => {
        const commentID = e?.commentId || e?.commentSharePostId || e?.commentVideoPostId || e?.commentPhotoPostId
          || e?.commentGroupPostId || e?.commentGroupSharePostId || e?.commentPhotoGroupPostId || e?.commentGroupVideoPostId || i
        return <Comment key={commentID} comment={e} postType={postType} />

      }
      )}
    </div>
  )
}

export default ListComments

