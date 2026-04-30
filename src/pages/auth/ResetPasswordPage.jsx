// src/pages/auth/ResetPasswordPage.jsx
import { useState } from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import AuthLayout   from '@/components/auth/AuthLayout'
import AuthInput    from '@/components/auth/AuthInput'
import AuthButton   from '@/components/auth/AuthButton'
import illustration from '@/assets/images/reset-pass-illustration.png'

// ── Password strength indicator ───────────────────────────────
function StrengthBar({ password }) {
  const getStrength = (p) => {
    if (!p) return 0
    let score = 0
    if (p.length >= 8)            score++
    if (/[A-Z]/.test(p))          score++
    if (/[0-9]/.test(p))          score++
    if (/[^A-Za-z0-9]/.test(p))   score++
    return score
  }

  const strength = getStrength(password)
  const labels   = ['', 'Weak', 'Fair', 'Good', 'Strong']
  const colors   = ['', '#EF4444', '#F59E0B', '#3B82F6', '#16A34A']

  if (!password) return null

  return (
    <div className="mt-1.5 mb-3">
      <div className="flex gap-1 mb-1">
        {[1, 2, 3, 4].map((s) => (
          <div
            key={s}
            className="h-1 flex-1 rounded-full transition-all duration-300"
            style={{ backgroundColor: s <= strength ? colors[strength] : '#E5E7EB' }}
          />
        ))}
      </div>
      <p className="text-[11px] font-medium" style={{ color: colors[strength] }}>
        {labels[strength]} password
      </p>
    </div>
  )
}

export default function ResetPasswordPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const email    = location.state?.email || ''
  const otp      = location.state?.otp   || ''

  const [form,    setForm]    = useState({ newPassword: '', confirmPassword: '' })
  const [errors,  setErrors]  = useState({})
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const set = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }))
    setErrors((prev) => ({ ...prev, [field]: '' }))
  }

  const validate = () => {
    const next = {}
    if (!form.newPassword)
      next.newPassword = 'New password is required.'
    else if (form.newPassword.length < 8)
      next.newPassword = 'Password must be at least 8 characters.'
    if (!form.confirmPassword)
      next.confirmPassword = 'Please confirm your password.'
    else if (form.newPassword !== form.confirmPassword)
      next.confirmPassword = 'Passwords do not match.'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const handleSubmit = async (e) => {
    e?.preventDefault()
    if (!validate()) return
    setLoading(true)
    try {
      // Replace with your real reset-password service call:
      // await authService.resetPassword({ email, otp, newPassword: form.newPassword })
      await new Promise((r) => setTimeout(r, 1200)) // demo delay
      setSuccess(true)
      setTimeout(() => navigate('/login'), 2500)
    } catch (err) {
      setErrors({ newPassword: err?.message || 'Failed to reset. Please try again.' })
    } finally {
      setLoading(false)
    }
  }

  const isFormFilled = form.newPassword && form.confirmPassword

  return (
    <AuthLayout illustration={illustration} illustrationAlt="People with laptop and key illustration">
      {success ? (
        /* ── Success state ── */
        <div className="flex flex-col items-center gap-4 py-8 text-center">
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center"
            style={{ backgroundColor: '#F0FDF4', border: '2px solid #16A34A' }}
          >
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#16A34A" strokeWidth="2.2" strokeLinecap="round">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
              <polyline points="22 4 12 14.01 9 11.01"/>
            </svg>
          </div>
          <div>
            <p className="text-[20px] font-bold text-gray-900">Password Reset!</p>
            <p className="text-[13px] text-gray-500 mt-1">Redirecting you to login…</p>
          </div>
        </div>
      ) : (
        <>
          {/* Heading */}
          <div className="mb-8">
            <h1 className="text-[28px] sm:text-[32px] font-extrabold text-gray-900 leading-tight tracking-tight mb-2">
              Please Reset your Password
            </h1>
            <p className="text-[14px] text-gray-500 font-medium">
              Set A New Password And Keep Your Account Safe
            </p>
          </div>

          <form onSubmit={handleSubmit} noValidate>
            <AuthInput
              label="New Password"
              type="password"
              placeholder="••••••••••"
              value={form.newPassword}
              onChange={set('newPassword')}
              error={errors.newPassword}
              autoFocus
            />
            <StrengthBar password={form.newPassword} />

            <AuthInput
              label="Confirm Password"
              type="password"
              placeholder="••••••••••"
              value={form.confirmPassword}
              onChange={set('confirmPassword')}
              error={errors.confirmPassword}
            />

            <div className="mt-6">
              <AuthButton loading={loading} disabled={!isFormFilled}>
                Reset Password
              </AuthButton>
            </div>
          </form>

          <p className="mt-5 text-center text-[13px] text-gray-500">
            <Link to="/login" className="font-semibold" style={{ color: '#C35E33' }}>
              ← Back to Login
            </Link>
          </p>
        </>
      )}
    </AuthLayout>
  )
}