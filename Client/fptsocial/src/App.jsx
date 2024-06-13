import { Navigate, Outlet, Route, Routes } from 'react-router-dom'
import Login from './pages/Auth/Login'
import HomePage from './pages/HomePage/HomePage'
import Profile from './pages/Profile/Profile'
import NotFound from './pages/404/NotFound'
import Group from './pages/Group/Group'
import { AuthProvider } from 'oidc-react'
import oidcConfig from './utils/authOidc'
import FirstTimeLogin from './pages/FirstTimeLogin/FirstTimeLogin'
import { useSelector } from 'react-redux'
import { selectCurrentUser } from './redux/user/userSlice'
import PageLoadingSpinner from './components/Loading/PageLoadingSpinner'
import AccountCheckExist from './pages/Auth/AccountCheckExist'

const jwtToken = JSON.parse(window.sessionStorage.getItem('oidc.user:https://feid.ptudev.net:societe-front-end'))?.access_token

const ProtectedRouteByJWT = ({ jwtToken }) => {
  if (!jwtToken) return <Navigate to='/login' replace={true} />
  return <Outlet />
}

const ProtectedRouteByUser = ({ user }) => {
  if (!user) return <Navigate to='/checkexist' replace={true} />
  return <Outlet />
}

const UnauthorizeRoute = ({ jwtToken }) => {
  if (jwtToken) return <Navigate to='/' replace={true} />
  return <Outlet />
}

const UnCheckUser = ({ user }) => {
  if (user) return <Navigate to='/' replace={true} />
  return <Outlet />
}

const Home = () => {
  if (!jwtToken) return <PageLoadingSpinner />
  else return <Navigate to='/' />
}

function App() {
  const currentUser = useSelector(selectCurrentUser)

  return (
    <AuthProvider {...oidcConfig}>
      <Routes >
        {/* Check after FEID login page*/}
        <Route path='/home' element={<Home />} />

        {/* Protected Route */}
        <Route element={<ProtectedRouteByJWT jwtToken={jwtToken} />}>
          <Route path='/checkexist' element={<AccountCheckExist />} />

          <Route element={<UnCheckUser user={currentUser} />}>
            <Route path='/firstlogin' element={<FirstTimeLogin />} />
          </Route>

          {/* Route need existed user */}
          <Route element={<ProtectedRouteByUser user={currentUser} jwtToken={jwtToken} />}>
            <Route path='/' element={<Navigate to='/homepage' />} />

            {/* Home page */}
            <Route path='/homepage' element={<HomePage />} />

            {/* Profile page */}
            <Route path='/profile' element={<Profile />} />

            {/* Group page */}
            <Route path='/groups' element={<Group />}>
              <Route path='feed' element={<Group />} />
              <Route path='discover' element={<Group />} />
              <Route path='joins' element={<Group />} />
              <Route path='create' element={<Profile />} />
            </Route>
          </Route>

          {/* Auth */}

        </Route>

        {/* Unprotected Route */}
        <Route element={<UnauthorizeRoute jwtToken={jwtToken} />}>
          {/* Authentication */}
          <Route path='/login' element={<Login />} />
        </Route>


        {/* 404 not found */}
        <Route path='*' element={<NotFound />} />
      </Routes>
    </AuthProvider>
  )
}

export default App
