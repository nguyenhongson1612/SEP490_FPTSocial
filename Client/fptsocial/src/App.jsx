import { Navigate, Route, Routes } from 'react-router-dom'
import Login from './pages/Login/Login'
import HomePage from './pages/HomePage/HomePage'
import Profile from './pages/Profile/Profile'
import NotFound from './pages/404/NotFound'
import Group from './pages/Group/Group'
import { AuthProvider } from 'oidc-react'
import oidcConfig from './utils/authOidc'
function App() {
  return (
    <AuthProvider {...oidcConfig}>
      <Routes >
        <Route path="/" element={
          <Navigate to='/home' />
        } />
        <Route path="/home" element={<HomePage />} />

        <Route path='/profile' element={<Profile />} />

        {/* Group page */}
        <Route path='/groups' element={<Group />}>
          <Route path='feed' element={<Group />} />
          <Route path='discover' element={<Group />} />
          <Route path='joins' element={<Group />} />
          <Route path='create' element={<Profile />} />
        </Route>

        {/* Authentication */}
        <Route path='/login' element={<Login />} />

        {/* 404 not found */}
        <Route path='*' element={<NotFound />} />
      </Routes>
    </AuthProvider>
  )
}

export default App
