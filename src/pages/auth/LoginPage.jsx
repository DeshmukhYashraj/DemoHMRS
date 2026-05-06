// src/pages/auth/LoginPage.jsx
import { useState } from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import AuthLayout   from '@/components/auth/AuthLayout'
import AuthInput    from '@/components/auth/AuthInput'
import AuthButton   from '@/components/auth/AuthButton'
import illustration from '@/assets/images/login-illustration.png'
import { useAuthStore } from '@/store/authStore'
import { useToast }     from '@/components/shared/toast/ToastProvider'
import authService      from '@/services/authService'
import { ROUTES }       from '@/constants/routes'

// ── Validation helpers ────────────────────────────────────────
const isValidEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim())

// Normalise email so case differences never cause "Invalid credentials"
// e.g. "DEMO@Gmail.Com" → "demo@gmail.com"
const normaliseEmail = (v) => v.trim().toLowerCase()

export default function LoginPage() {
  const navigate   = useNavigate()
  const location   = useLocation()
  const loginStore = useAuthStore((s) => s.login)
  const { toast }  = useToast()

  const from = location.state?.from?.pathname || ROUTES.DASHBOARD

  const [form,    setForm]    = useState({ email: '', password: '' })
  const [errors,  setErrors]  = useState({})
  const [loading, setLoading] = useState(false)

  const set = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }))
    setErrors((prev) => ({ ...prev, [field]: '' }))
  }

  const validate = () => {
    const next = {}
    if (!form.email)
      next.email    = 'Email is required.'
    else if (!isValidEmail(form.email))
      next.email    = 'Please enter a valid email address.'
    if (!form.password)
      next.password = 'Password is required.'
    else if (form.password.length < 6)
      next.password = 'Password must be at least 6 characters.'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const handleSubmit = async (e) => {
    e?.preventDefault()
    if (!validate()) return

    setLoading(true)
    try {
      // ✅ Always normalise email before sending — prevents BadCredentials
      //    caused by case differences ("Admin@GMAIL.com" vs "admin@gmail.com")
      const res = await authService.login(
        normaliseEmail(form.email),
        form.password
      )

      // res = { success, message, data: LoginResponseDTO }
      loginStore(res.data)

      toast.success('Welcome back! Redirecting to your dashboard.', 'Login Successful')
      navigate(from, { replace: true })
    } catch (err) {
      const msg = err?.message || 'Invalid credentials. Please try again.'
      toast.error(msg, 'Login Failed')
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

        <div className="mt-6">
          <AuthButton loading={loading} disabled={!isFormFilled}>
            Log In
          </AuthButton>
        </div>
      </form>

      {/* Forgot password */}
      <p className="mt-5 text-center text-[13px] font-semibold text-gray-800">
        <Link
          to={ROUTES.FORGOT_PASSWORD}
          className="hover:underline transition-colors"
          style={{ color: '#1A1A1A' }}
          onMouseEnter={(e) => (e.currentTarget.style.color = '#C35E33')}
          onMouseLeave={(e) => (e.currentTarget.style.color = '#1A1A1A')}
        >
          Forgot Password?
        </Link>
      </p>
    </AuthLayout>
  )
}