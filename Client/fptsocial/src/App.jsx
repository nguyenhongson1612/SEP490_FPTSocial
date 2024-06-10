import { Navigate, Route, Routes } from 'react-router-dom'
import Login from './pages/Login/Login'
import HomePage from './pages/HomePage/HomePage'
import Profile from './pages/Profile/Profile'
import NotFound from './pages/404/NotFound'
import Group from './pages/Group/Group'
function App() {
  return (
    <Routes >
      <Route path="/" element={<HomePage />} />

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
  )
}

export default App
