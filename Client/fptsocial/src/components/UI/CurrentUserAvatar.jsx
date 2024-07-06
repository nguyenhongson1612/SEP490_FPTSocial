import { useSelector } from 'react-redux'
import { selectCurrentUser } from '~/redux/user/userSlice'

function CurrentUserAvatar({ avatarSrc, size, isLink }) {
  const currentUser = useSelector(selectCurrentUser)
  return (
    <img
      src={currentUser?.avataPhotos?.find(e => e.isUsed == true)?.avataPhotosUrl || './src/assets/img/avatar_holder.png'}
      alt="group-img"
      className="rounded-[50%] aspect-square object-cover size-10 border border-gray-300"
    />
  )
}

export default CurrentUserAvatar
