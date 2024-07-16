import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { checkUserExist } from '~/apis'
import PageLoadingSpinner from '~/components/Loading/PageLoadingSpinner'
import { getUserByUserId } from '~/redux/user/userSlice'

function AccountCheckExist() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  useEffect(() => {
    checkUserExist().then((resData) => {
      if (resData?.data?.enumcode === 4)
        navigate('/firstlogin')
      else if (resData?.data?.enumcode === 7) {
        toast.promise(
          dispatch(getUserByUserId()),
          { pending: 'Checking...' }
        )
          .then(res => {
            if (!res.error) {
              navigate('/')
              toast.success('Welcome to FPT Social!')
            }
          })
      }
    })
  }, [])
  return (
    <div className='w-screen h-screen flex items-center justify-center'>
      <PageLoadingSpinner />
    </div>
  )

}

export default AccountCheckExist
