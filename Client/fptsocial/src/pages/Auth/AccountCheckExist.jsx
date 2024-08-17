import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { checkUserExist } from '~/apis'
import PageLoadingSpinner from '~/components/Loading/PageLoadingSpinner'
import { addUser, getUserByUserId } from '~/redux/user/userSlice'

function AccountCheckExist() {
  const profileFeId = JSON.parse(sessionStorage.getItem('oidc.user:https://feid.ptudev.net:societe-front-end'))?.profile
  const dispatch = useDispatch()
  const navigate = useNavigate()
  useEffect(() => {
    checkUserExist().then((resData) => {
      if (resData?.data?.enumcode === 4) {
        if (!resData?.data?.isAdmin)
          navigate('/firstlogin')
        else if (resData?.data?.isAdmin)
          navigate('/updateadmin')
      }
      else if (resData?.data?.enumcode === 7) {
        if (resData?.data?.isAdmin) {
          dispatch(addUser(profileFeId))
          navigate('/dashboard')
        }
        else {
          toast.promise(
            dispatch(getUserByUserId()),
            {
              pending: 'Checking...',
              success: 'Success!',
            },
          )
            .then(res => {
              if (!res.error) {
                navigate('/')
                toast.success('Welcome to FPT Social!')
              }
            })
        }
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
