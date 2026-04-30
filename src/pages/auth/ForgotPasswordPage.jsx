// src/pages/auth/ForgotPasswordPage.jsx
import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import AuthLayout   from '@/components/auth/AuthLayout'
import AuthInput    from '@/components/auth/AuthInput'
import AuthButton   from '@/components/auth/AuthButton'
import illustration from '@/assets/images/forgot-pass-illustration.png'

const isValidEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim())

export default function ForgotPasswordPage() {
  const navigate = useNavigate()

  const [email,   setEmail]   = useState('')
  const [error,   setError]   = useState('')
  const [loading, setLoading] = useState(false)
  const [sent,    setSent]    = useState(false)

  const handleSubmit = async (e) => {
    e?.preventDefault()
    if (!email)                  { setError('Email is required.');           return }
    if (!isValidEmail(email))    { setError('Enter a valid email address.'); return }
    setError('')
    setLoading(true)
    try {
      // Replace with your real forgot-password service call:
      // await authService.forgotPassword(email)
      await new Promise((r) => setTimeout(r, 1200)) // demo delay
      setSent(true)
      // Navigate to OTP page, passing email as state
      setTimeout(() => navigate('/verify-otp', { state: { email } }), 1500)
    } catch (err) {
      setError(err?.message || 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthLayout illustration={illustration} illustrationAlt="Security shield illustration">
      {/* Heading */}
      <div className="mb-8">
        <h1 className="text-[32px] sm:text-[36px] font-extrabold text-gray-900 leading-tight tracking-tight mb-2">
          Forgot Password
        </h1>
        <p className="text-[14px] text-gray-500 font-medium">
          Reset Your Password In Just A Few Steps
        </p>
      </div>

      {sent ? (
        /* ── Success state ── */
        <div className="flex flex-col items-center gap-4 py-6 text-center animate-fade-in">
          <div
            className="w-14 h-14 rounded-full flex items-center justify-center"
            style={{ backgroundColor: '#FDF5F1', border: '2px solid #C35E33' }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#C35E33" strokeWidth="2.2" strokeLinecap="round">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
              <polyline points="22,6 12,13 2,6"/>
            </svg>
          </div>
          <p className="text-[15px] font-semibold text-gray-800">Email Sent!</p>
          <p className="text-[13px] text-gray-500">
            Check your inbox for the OTP. Redirecting…
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} noValidate>
          <AuthInput
            label="Email"
            type="email"
            placeholder="Demo@Gmail.Com"
            value={email}
            onChange={(e) => { setEmail(e.target.value); setError('') }}
            error={error}
            autoFocus
          />

          <div className="mt-6">
            <AuthButton loading={loading} disabled={!email}>
              Sent Email
            </AuthButton>
          </div>
        </form>
      )}

      {/* Back to login */}
      <p className="mt-6 text-center text-[13px] text-gray-500">
        Remember your password?{' '}
        <Link
          to="/login"
          className="font-semibold transition-colors"
          style={{ color: '#C35E33' }}
        >
          Sign In
        </Link>
      </p>
    </AuthLayout>
  )
}