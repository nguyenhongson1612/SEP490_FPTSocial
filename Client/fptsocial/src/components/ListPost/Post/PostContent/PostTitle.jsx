import moment from 'moment';
import { Link } from 'react-router-dom'
import { compareDateTime } from '~/utils/formatters';


function PostTitle({ postData }) {

  return (
    <div id="post-title"
      className="w-full flex gap-4">
      <Link to={`/profile?id=${postData?.userId}`} className="w-fit cursor-pointer relative text-gray-500 hover:text-gray-950 flex items-center justify-start gap-3">
        <img
          src={postData?.avatar?.avataPhotosUrl || './src/assets/img/user_holder.jpg'}
          loading='lazy'
          // className="rounded-md aspect-square object-cover w-10"
          className="rounded-[50%] aspect-square object-cover w-10"
        />
        {/* <img
          src={`${postData?.image}`}
          loading='lazy'
          className="absolute -bottom-1 -right-1 rounded-[50%] aspect-squa  re object-cover w-7"
        /> */}
      </Link>

      <div className="flex flex-col gap-1">
        <div className="font-semibold font-sans">{postData?.fullName}</div>
        <div className="flex justify-start gap-2 text-gray-500  text-sm">
          {/* <span>{postData?.userId}</span>. */}
          <span>{compareDateTime(postData?.createdAt)}</span>
        </div>
      </div>
    </div>
  )
}

export default PostTitle