import { Navigate, Route, Routes } from 'react-router-dom'
import './App.css'
import { ProtectedRoute, RoleRoute } from './routes/ProtectedRoute.jsx'
import { HomePage } from './pages/HomePage.jsx'
import { LoginPage } from './pages/auth/LoginPage.jsx'
import { RegisterPage } from './pages/auth/RegisterPage.jsx'
import { DashboardPage } from './pages/DashboardPage.jsx'
import { AdminPage } from './pages/admin/AdminPage.jsx'
import { NotFoundPage } from './pages/NotFoundPage.jsx'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route element={<RoleRoute roles={['ADMIN']} />}>
          <Route path="/admin" element={<AdminPage />} />
        </Route>
      </Route>
      <Route path="/home" element={<Navigate to="/" replace />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}
