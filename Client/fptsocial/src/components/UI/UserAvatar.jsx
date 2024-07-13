import { useSelector } from 'react-redux'
import { selectCurrentUser } from '~/redux/user/userSlice'

function UserAvatar({ avatarSrc, size = '2.5', isOther = false }) {
  const currentUser = useSelector(selectCurrentUser)
  let avatarUrl
  if (!isOther) {
    avatarUrl = currentUser?.avataPhotos?.find(e => e.isUsed == true)?.avataPhotosUrl
  }
  else avatarUrl = avatarSrc

  return (
    <img
      src={avatarUrl || '../src/assets/img/avatar_holder.png'}
      alt="avatar"
      className="rounded-[50%] aspect-square object-cover border border-gray-300"
      style={{
        width: `${size}rem`,
        height: `${size}rem`
      }}
    />
  )
}

export default UserAvatar
