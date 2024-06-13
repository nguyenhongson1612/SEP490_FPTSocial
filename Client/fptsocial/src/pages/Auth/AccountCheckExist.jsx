import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { Navigate, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { checkUserExist } from '~/apis'
import PageLoadingSpinner from '~/components/Loading/PageLoadingSpinner'
import { getUserByNumber } from '~/redux/user/userSlice'

function AccountCheckExist() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  useEffect(() => {
    checkUserExist().then((resData) => {
      if (resData?.data?.enumcode === 2)
        navigate('/firstlogin')
      else if (resData?.data?.enumcode === 5) {
        toast.promise(
          dispatch(getUserByNumber(resData?.data?.userNumber)),
          { pending: 'Checking...' }
        ).then(res => {
          if (!res.error) navigate('/')
        })
      }
    })
  }, [])
  return <PageLoadingSpinner />
}

export default AccountCheckExist
