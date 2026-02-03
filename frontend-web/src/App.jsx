import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import './styles/responsive.css'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import RecruiterDashboard from './pages/RecruiterDashboard'
import AdminDashboard from './pages/AdminDashboard'
import AdminUsers from './pages/AdminUsers'
import AdminJobs from './pages/AdminJobs'
import Jobs from './pages/Jobs'
import JobDetail from './pages/JobDetail'
import Profile from './pages/Profile'
import CareerCoach from './pages/CareerCoach'
import CVUpload from './pages/CVUpload'
import RecruiterApplications from './pages/RecruiterApplications'
import PostJob from './pages/PostJob'
import Analytics from './pages/Analytics'
import CVScreening from './pages/CVScreening'
import MyApplications from './pages/MyApplications'
import './App.css'

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(
    !!localStorage.getItem('accessToken')
  )

  const handleLogin = (token) => {
    localStorage.setItem('accessToken', token)
    setIsAuthenticated(true)
  }

  const handleLogout = () => {
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
    localStorage.removeItem('userEmail')
    localStorage.removeItem('userRole')
    setIsAuthenticated(false)
  }

  // Get user role
  const userRole = localStorage.getItem('userRole') || 'CANDIDATE'
  const defaultDashboard = userRole === 'RECRUITER' ? '/recruiter/dashboard' : userRole === 'ADMIN' ? '/admin/dashboard' : '/dashboard'

  return (
    <Router>
      <Routes>
        <Route 
          path="/login" 
          element={
            isAuthenticated ? 
            <Navigate to={defaultDashboard} /> : 
            <Login onLogin={handleLogin} />
          } 
        />
        <Route 
          path="/register" 
          element={
            isAuthenticated ? 
            <Navigate to={defaultDashboard} /> : 
            <Register onRegister={handleLogin} />
          } 
        />
        <Route 
          path="/dashboard" 
          element={
            isAuthenticated ? 
            <Dashboard onLogout={handleLogout} /> : 
            <Navigate to="/login" />
          } 
        />
        <Route 
          path="/recruiter/dashboard" 
          element={
            isAuthenticated ? 
            <RecruiterDashboard onLogout={handleLogout} /> : 
            <Navigate to="/login" />
          } 
        />
        <Route 
          path="/admin/dashboard" 
          element={
            isAuthenticated ? 
            <AdminDashboard onLogout={handleLogout} /> : 
            <Navigate to="/login" />
          } 
        />
        <Route 
          path="/admin/users" 
          element={
            isAuthenticated ? 
            <AdminUsers onLogout={handleLogout} /> : 
            <Navigate to="/login" />
          } 
        />
        <Route 
          path="/admin/jobs" 
          element={
            isAuthenticated ? 
            <AdminJobs onLogout={handleLogout} /> : 
            <Navigate to="/login" />
          } 
        />
        <Route 
          path="/jobs" 
          element={
            isAuthenticated ? 
            <Jobs onLogout={handleLogout} /> : 
            <Navigate to="/login" />
          } 
        />
        <Route 
          path="/jobs/:id" 
          element={
            isAuthenticated ? 
            <JobDetail onLogout={handleLogout} /> : 
            <Navigate to="/login" />
          } 
        />
        <Route 
          path="/profile" 
          element={
            isAuthenticated ? 
            <Profile onLogout={handleLogout} /> : 
            <Navigate to="/login" />
          } 
        />
        <Route 
          path="/coach" 
          element={
            isAuthenticated ? 
            <CareerCoach onLogout={handleLogout} /> : 
            <Navigate to="/login" />
          } 
        />
        <Route 
          path="/cv-upload" 
          element={
            isAuthenticated ? 
            <CVUpload onLogout={handleLogout} /> : 
            <Navigate to="/login" />
          } 
        />
        <Route 
          path="/recruiter/applications" 
          element={
            isAuthenticated ? 
            <RecruiterApplications onLogout={handleLogout} /> : 
            <Navigate to="/login" />
          } 
        />
        <Route 
          path="/recruiter/post-job" 
          element={
            isAuthenticated ? 
            <PostJob onLogout={handleLogout} /> : 
            <Navigate to="/login" />
          } 
        />
        <Route 
          path="/recruiter/analytics" 
          element={
            isAuthenticated ? 
            <Analytics onLogout={handleLogout} /> : 
            <Navigate to="/login" />
          } 
        />
        <Route 
          path="/recruiter/cv-screening" 
          element={
            isAuthenticated ? 
            <CVScreening onLogout={handleLogout} /> : 
            <Navigate to="/login" />
          } 
        />
        <Route 
          path="/applications" 
          element={
            isAuthenticated ? 
            <MyApplications onLogout={handleLogout} /> : 
            <Navigate to="/login" />
          } 
        />
        <Route path="/" element={<Navigate to={isAuthenticated ? defaultDashboard : "/login"} />} />
      </Routes>
    </Router>
  )
}

export default App
