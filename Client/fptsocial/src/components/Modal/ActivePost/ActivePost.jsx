import { useDispatch, useSelector } from 'react-redux';
import { clearAndHireCurrentActivePost, selectIsShowModalActivePost } from '~/redux/activePost/activePostSlice';

function ActivePost() {
  const isShowActivePost = useSelector(selectIsShowModalActivePost)
  const dispatch = useDispatch()

  return (
    <>
      {/* <Modal opened={isShowActivePost} onClose={dispatch(clearAndHireCurrentActivePost)} title="Authentication" centered>
      </Modal> */}
    </>
  );
}

export default ActivePost