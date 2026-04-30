// src/pages/auth/LoginPage.jsx
import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import AuthLayout  from '@/components/auth/AuthLayout'
import AuthInput   from '@/components/auth/AuthInput'
import AuthButton  from '@/components/auth/AuthButton'
import illustration from '@/assets/images/login-illustration.png'
import { useAuthStore } from '@/store/authStore'
import { ROUTES } from '@/constants/routes'

// ── Validation helpers ────────────────────────────────────────
const isValidEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim())

export default function LoginPage() {
  const navigate   = useNavigate()
  const login      = useAuthStore((s) => s.login)

  const [form,    setForm]    = useState({ email: '', password: '' })
  const [errors,  setErrors]  = useState({})
  const [loading, setLoading] = useState(false)
  const [apiError, setApiError] = useState('')

  const set = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }))
    setErrors((prev) => ({ ...prev, [field]: '' }))
    setApiError('')
  }

  const validate = () => {
    const next = {}
    if (!form.email)                      next.email    = 'Email is required.'
    else if (!isValidEmail(form.email))   next.email    = 'Enter a valid email address.'
    if (!form.password)                   next.password = 'Password is required.'
    else if (form.password.length < 6)    next.password = 'Password must be at least 6 characters.'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const handleSubmit = async (e) => {
    e?.preventDefault()
    if (!validate()) return
    setLoading(true)
    try {
      // Replace with your real auth service call:
      // await authService.login(form.email, form.password)
      await new Promise((r) => setTimeout(r, 1200)) // demo delay
      // After success — update auth store and redirect
      // login({ email: form.email, role: 'admin' }, 'your_jwt_token')
      navigate(ROUTES.DASHBOARD)
    } catch (err) {
      setApiError(err?.message || 'Invalid credentials. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const isFormFilled = form.email && form.password

  return (
    <AuthLayout illustration={illustration} illustrationAlt="Person working on a laptop">
      {/* Heading */}
      <div className="mb-8">
        <h1 className="text-[32px] sm:text-[36px] font-extrabold text-gray-900 leading-tight tracking-tight mb-2">
          Welcome Back
        </h1>
        <p className="text-[14px] text-gray-500 font-medium">
          Sign In To Continue To Your Account
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} noValidate>
        <AuthInput
          label="Email"
          type="email"
          placeholder="Demo@Gmail.Com"
          value={form.email}
          onChange={set('email')}
          error={errors.email}
          autoFocus
        />
        <AuthInput
          label="Password"
          type="password"
          placeholder="••••••••••"
          value={form.password}
          onChange={set('password')}
          error={errors.password}
        />

        {/* API error */}
        {apiError && (
          <p className="mb-4 text-[13px] text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2.5 font-medium">
            {apiError}
          </p>
        )}

        <div className="mt-6">
          <AuthButton loading={loading} disabled={!isFormFilled}>
            Log-In
          </AuthButton>
        </div>
      </form>

      {/* Forgot password */}
      <p className="mt-5 text-center text-[13px] font-semibold text-gray-800">
        <Link
          to="/forgot-password"
          className="hover:underline transition-colors"
          style={{ color: '#1A1A1A' }}
          onMouseEnter={(e) => (e.currentTarget.style.color = '#C35E33')}
          onMouseLeave={(e) => (e.currentTarget.style.color = '#1A1A1A')}
        >
          Forgot Password ?
        </Link>
      </p>
    </AuthLayout>
  )
}