import { zodResolver } from '@hookform/resolvers/zod'
import { Eye, EyeOff, LockKeyhole, Mail } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import { z } from 'zod'
import { getApiError } from '../../api/client.js'
import { useAuth } from '../../context/AuthContext.jsx'
import { AuthShell } from './AuthShell.jsx'

const loginSchema = z.object({
  email: z.string().trim().email('Enter a valid email address'),
  password: z.string().min(1, 'Enter your password'),
})

export function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [serverError, setServerError] = useState('')
  const { user, isLoading, login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({ resolver: zodResolver(loginSchema), defaultValues: { email: '', password: '' } })

  if (!isLoading && user) return <Navigate to={user.role === 'ADMIN' ? '/admin' : '/dashboard'} replace />

  const onSubmit = async (values) => {
    setServerError('')
    try {
      const signedInUser = await login(values)
      const fallback = signedInUser.role === 'ADMIN' ? '/admin' : '/dashboard'
      navigate(location.state?.from?.pathname || fallback, { replace: true })
    } catch (error) { setServerError(getApiError(error)) }
  }

  return (
    <AuthShell title="Welcome back" subtitle="Sign in to continue planning your next journey.">
      <form className="auth-form" onSubmit={handleSubmit(onSubmit)} noValidate>
        {serverError && <div className="form-alert" role="alert">{serverError}</div>}
        <label className="form-field"><span>Email address</span><div className="input-wrap"><Mail size={18} /><input type="email" autoComplete="email" placeholder="you@example.com" {...register('email')} /></div>{errors.email && <small className="field-error">{errors.email.message}</small>}</label>
        <label className="form-field"><span>Password</span><div className="input-wrap"><LockKeyhole size={18} /><input type={showPassword ? 'text' : 'password'} autoComplete="current-password" placeholder="Your password" {...register('password')} /><button type="button" onClick={() => setShowPassword((value) => !value)} aria-label={showPassword ? 'Hide password' : 'Show password'}>{showPassword ? <EyeOff size={18} /> : <Eye size={18} />}</button></div>{errors.password && <small className="field-error">{errors.password.message}</small>}</label>
        <div className="form-row"><label className="checkbox"><input type="checkbox" /> Remember me</label><button className="text-button" type="button">Forgot password?</button></div>
        <button className="button button--primary button--full" disabled={isSubmitting} type="submit">{isSubmitting ? 'Signing in…' : 'Sign in'}</button>
      </form>
      <p className="auth-card__footer">New to Voyara? <Link to="/register">Create an account</Link></p>
    </AuthShell>
  )
}
