import { Navigate, Outlet, Route, Routes } from 'react-router-dom'
import Login from './pages/Auth/Login'
import HomePage from './pages/HomePage/HomePage'
import Profile from './pages/Profile/Profile'
import NotFound from './pages/404/NotFound'
import { AuthProvider } from 'oidc-react'
import oidcConfig from './utils/authOidc'
import FirstTimeLogin from './pages/FirstTimeLogin/FirstTimeLogin'
import { useSelector } from 'react-redux'
import { selectCurrentUser } from './redux/user/userSlice'
import PageLoadingSpinner from './components/Loading/PageLoadingSpinner'
import AccountCheckExist from './pages/Auth/AccountCheckExist'
import NotAvailable from './pages/404/NotAvailable'
import Setting from './pages/Settings/Setting'
import Friends from './pages/Friends/Friends'
import Groups from './pages/Groups'
import Group from './pages/Groups/_id'
import Media from './pages/Media'
import Post from './pages/Post/_id'
import ChatsPage from './pages/ChatsPage'
import Dashboard from './pages/DashBoard/DashBoard'

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
  if (!jwtToken) return <div className='w-screen h-screen flex items-center justify-center'><PageLoadingSpinner /></div>
  else return <Navigate to='/' />
}

// const Logout = () => {
//   if (!jwtToken) return <PageLoadingSpinner />
//   else return <Navigate to='/' />
// }


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
          <Route path='/chats-page' element={<ChatsPage />} />
          <Route element={<UnCheckUser user={currentUser} />}>
            <Route path='/firstlogin' element={<FirstTimeLogin />} />
          </Route>

          {/* Route need existed user */}
          <Route element={<ProtectedRouteByUser user={currentUser} jwtToken={jwtToken} />}>
            <Route path='/' element={<Navigate to='/homepage' />} />

            <Route path='/settings' element={<Setting />} />

            {/* Home page */}
            <Route path='/homepage' element={<HomePage />} />

            {/* Photo, Video post */}
            <Route path='/photo/:photoId' element={<Media />} />
            <Route path='/media/:postId' element={<Media />} />
            <Route path='/video/:videoId' element={<Media />} />
            <Route path='/post/:postId' element={<Post />} />
            {/* Profile page */}
            <Route path='/profile' element={<Profile />} />

            {/* Friend page */}
            <Route path='/friends' element={<Friends />}>
              {/* <Route path='' element={<Friends />} /> */}
              <Route path='requests' element={<Friends />} />
              <Route path='suggestions' element={<Friends />} />
              <Route path='list' element={<Friends />} />
            </Route>

            {/* Group page */}
            <Route path='/groups' element={<Groups />}>
              <Route path='feed' element={<Groups />} />
              <Route path='discover' element={<Groups />} />
              <Route path='joins' element={<Groups />} />
              <Route path='create' element={<Groups />} />
            </Route>
            <Route path='/groups/:groupId' element={<Group />} >
              <Route path='member-requests' element={<Group />} />
              <Route path='member-manage' element={<Group />} />
              <Route path='settings' element={<Group />} />
              <Route path='pending-posts' element={<Group />} />
              <Route path='post/:postId' element={<Group />} />
            </Route>

            <Route exact path="/dashboard" element={<Dashboard />} />
          </Route>

          {/* Auth */}

        </Route>

        {/* Unprotected Route */}
        <Route element={<UnauthorizeRoute jwtToken={jwtToken} />}>
          {/* Authentication */}
          <Route path='/login' element={<Login />} />
        </Route>

        {/* 404 not found */}
        <Route path='/notavailable' element={<NotAvailable />} />
        <Route path='*' element={<NotFound />} />
      </Routes>
    </AuthProvider>
  )
}

export default App
