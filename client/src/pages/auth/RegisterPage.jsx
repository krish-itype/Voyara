import { zodResolver } from '@hookform/resolvers/zod'
import { Building2, Eye, EyeOff, LockKeyhole, Mail, Phone, UserRound } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link, Navigate, useNavigate, useSearchParams } from 'react-router-dom'
import { z } from 'zod'
import { getApiError } from '../../api/client.js'
import { useAuth } from '../../context/AuthContext.jsx'
import { AuthShell } from './AuthShell.jsx'

const registerSchema = z.object({
  role: z.enum(['TRAVELER', 'VENDOR']), firstName: z.string().trim().min(2, 'Enter your first name'), lastName: z.string().trim().min(2, 'Enter your last name'),
  email: z.string().trim().email('Enter a valid email address'), phone: z.string().trim().optional(), agencyName: z.string().trim().optional(),
  password: z.string().min(8, 'Use at least 8 characters'), confirmPassword: z.string(),
}).superRefine((values, context) => {
  if (values.password !== values.confirmPassword) context.addIssue({ code: 'custom', path: ['confirmPassword'], message: 'Passwords do not match' })
  if (values.role === 'VENDOR' && !values.agencyName) context.addIssue({ code: 'custom', path: ['agencyName'], message: 'Enter your business name' })
})

export function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [serverError, setServerError] = useState('')
  const [searchParams] = useSearchParams()
  const { user, isLoading, register: createAccount } = useAuth()
  const navigate = useNavigate()
  const initialRole = searchParams.get('role') === 'vendor' ? 'VENDOR' : 'TRAVELER'
  const { register, handleSubmit, setValue, watch, formState: { errors, isSubmitting } } = useForm({ resolver: zodResolver(registerSchema), defaultValues: { role: initialRole, firstName: '', lastName: '', email: '', phone: '', agencyName: '', password: '', confirmPassword: '' } })
  const role = watch('role')
  useEffect(() => setValue('role', initialRole), [initialRole, setValue])
  if (!isLoading && user) return <Navigate to={user.role === 'ADMIN' ? '/admin' : '/dashboard'} replace />

  const onSubmit = async ({ confirmPassword: _confirmPassword, agencyName, phone, ...values }) => {
    setServerError('')
    try {
      await createAccount({ ...values, phone: phone || undefined, ...(values.role === 'VENDOR' ? { agencyName } : {}) })
      navigate('/dashboard', { replace: true })
    } catch (error) { setServerError(getApiError(error)) }
  }

  return (
    <AuthShell title="Create your account" subtitle="Join as a traveler or start sharing your experiences.">
      <div className="role-switch" role="group" aria-label="Account type"><button className={role === 'TRAVELER' ? 'active' : ''} type="button" onClick={() => setValue('role', 'TRAVELER', { shouldValidate: true })}>Traveler</button><button className={role === 'VENDOR' ? 'active' : ''} type="button" onClick={() => setValue('role', 'VENDOR', { shouldValidate: true })}>Vendor</button></div>
      <form className="auth-form auth-form--compact" onSubmit={handleSubmit(onSubmit)} noValidate>
        <input type="hidden" {...register('role')} />
        {serverError && <div className="form-alert" role="alert">{serverError}</div>}
        <div className="field-grid">
          <label className="form-field"><span>First name</span><div className="input-wrap"><UserRound size={18} /><input autoComplete="given-name" placeholder="First name" {...register('firstName')} /></div>{errors.firstName && <small className="field-error">{errors.firstName.message}</small>}</label>
          <label className="form-field"><span>Last name</span><div className="input-wrap"><UserRound size={18} /><input autoComplete="family-name" placeholder="Last name" {...register('lastName')} /></div>{errors.lastName && <small className="field-error">{errors.lastName.message}</small>}</label>
        </div>
        {role === 'VENDOR' && <label className="form-field"><span>Vendor business name</span><div className="input-wrap"><Building2 size={18} /><input autoComplete="organization" placeholder="Your travel business" {...register('agencyName')} /></div>{errors.agencyName && <small className="field-error">{errors.agencyName.message}</small>}</label>}
        <label className="form-field"><span>Email address</span><div className="input-wrap"><Mail size={18} /><input type="email" autoComplete="email" placeholder="you@example.com" {...register('email')} /></div>{errors.email && <small className="field-error">{errors.email.message}</small>}</label>
        <label className="form-field"><span>Phone <em>optional</em></span><div className="input-wrap"><Phone size={18} /><input type="tel" autoComplete="tel" placeholder="Your phone number" {...register('phone')} /></div></label>
        <div className="field-grid">
          <label className="form-field"><span>Password</span><div className="input-wrap"><LockKeyhole size={18} /><input type={showPassword ? 'text' : 'password'} autoComplete="new-password" placeholder="8+ characters" {...register('password')} /><button type="button" onClick={() => setShowPassword((value) => !value)} aria-label="Toggle password visibility">{showPassword ? <EyeOff size={18} /> : <Eye size={18} />}</button></div>{errors.password && <small className="field-error">{errors.password.message}</small>}</label>
          <label className="form-field"><span>Confirm password</span><div className="input-wrap"><LockKeyhole size={18} /><input type={showPassword ? 'text' : 'password'} autoComplete="new-password" placeholder="Repeat password" {...register('confirmPassword')} /></div>{errors.confirmPassword && <small className="field-error">{errors.confirmPassword.message}</small>}</label>
        </div>
        <label className="checkbox checkbox--terms"><input type="checkbox" required /> I agree to Voyara’s Terms and Privacy Policy.</label>
        <button className="button button--primary button--full" disabled={isSubmitting} type="submit">{isSubmitting ? 'Creating account…' : role === 'VENDOR' ? 'Create vendor account' : 'Create traveler account'}</button>
      </form>
      <p className="auth-card__footer">Already have an account? <Link to="/login">Sign in</Link></p>
    </AuthShell>
  )
}
