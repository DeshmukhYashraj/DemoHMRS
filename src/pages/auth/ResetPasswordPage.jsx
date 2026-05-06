// src/pages/auth/ResetPasswordPage.jsx
import { useState, useEffect } from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import AuthLayout   from '@/components/auth/AuthLayout'
import AuthInput    from '@/components/auth/AuthInput'
import AuthButton   from '@/components/auth/AuthButton'
import illustration from '@/assets/images/reset-pass-illustration.png'
import { useToast } from '@/components/shared/toast/ToastProvider'
import authService  from '@/services/authService'
import { ROUTES }   from '@/constants/routes'

// ── Password strength indicator ───────────────────────────────
function StrengthBar({ password }) {
  const getStrength = (p) => {
    if (!p) return 0
    let score = 0
    if (p.length >= 8)          score++
    if (/[A-Z]/.test(p))        score++
    if (/[0-9]/.test(p))        score++
    if (/[^A-Za-z0-9]/.test(p)) score++
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
  const navigate  = useNavigate()
  const location  = useLocation()
  const { toast } = useToast()

  const email = location.state?.email || ''
  const otp   = location.state?.otp   || ''

  // Guard: if accessed without verified OTP state, go back to forgot-password
  useEffect(() => {
    if (!email || !otp) {
      toast.warning('Please complete OTP verification first.', 'Access Denied')
      navigate(ROUTES.FORGOT_PASSWORD, { replace: true })
    }
  }, [email, otp]) // eslint-disable-line

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
      next.confirmPassword = 'Please confirm your new password.'
    else if (form.newPassword !== form.confirmPassword)
      next.confirmPassword = 'Passwords do not match. Please try again.'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const handleSubmit = async (e) => {
    e?.preventDefault()
    if (!validate()) return

    setLoading(true)
    try {
      const res = await authService.resetPassword(email, otp, form.newPassword)

      toast.success(
        res.message || 'Your password has been reset. Please log in.',
        'Password Reset'
      )
      setSuccess(true)

      setTimeout(() => navigate(ROUTES.LOGIN, { replace: true }), 2500)
    } catch (err) {
      const msg = err?.message || 'Failed to reset password. Please try again.'
      toast.error(msg, 'Reset Failed')
      // If OTP has expired or been tampered with, send them back
      if (err?.status === 400 || err?.status === 404) {
        setErrors({ newPassword: msg })
      }
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
            <p className="text-[13px] text-gray-500 mt-1">
              Redirecting you to login…
            </p>
          </div>
        </div>
      ) : (
        <>
          {/* Heading */}
          <div className="mb-8">
            <h1 className="text-[28px] sm:text-[32px] font-extrabold text-gray-900 leading-tight tracking-tight mb-2">
              Reset your Password
            </h1>
            <p className="text-[14px] text-gray-500 font-medium">
              Set a new password and keep your account safe
            </p>
            {email && (
              <p className="mt-1.5 text-[13px] font-semibold" style={{ color: '#C35E33' }}>
                Account: {email}
              </p>
            )}
          </div>

          <form onSubmit={handleSubmit} noValidate>
            <AuthInput
              label="New Password"
              type="password"
              placeholder="Min. 8 characters"
              value={form.newPassword}
              onChange={set('newPassword')}
              error={errors.newPassword}
              autoFocus
            />
            <StrengthBar password={form.newPassword} />

            <AuthInput
              label="Confirm Password"
              type="password"
              placeholder="Re-enter your new password"
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
            <Link to={ROUTES.LOGIN} className="font-semibold" style={{ color: '#C35E33' }}>
              ← Back to Login
            </Link>
          </p>
        </>
      )}
    </AuthLayout>
  )
}