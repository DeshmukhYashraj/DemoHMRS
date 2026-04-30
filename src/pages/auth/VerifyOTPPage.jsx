// src/pages/auth/VerifyOTPPage.jsx
import { useState, useEffect, useRef, useCallback } from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import AuthLayout   from '@/components/auth/AuthLayout'
import AuthButton   from '@/components/auth/AuthButton'
import illustration from '@/assets/images/verify-otp-illustration.png'

const OTP_LENGTH  = 6
const TIMER_START = 5 * 60 // 5 minutes in seconds

// ── Single OTP digit box ──────────────────────────────────────
function OtpBox({ value, index, inputRef, onChange, onKeyDown, onPaste, hasError }) {
  const [focused, setFocused] = useState(false)

  const borderColor = hasError
    ? '#DC2626'
    : focused
    ? '#C35E33'
    : value
    ? '#C35E33'
    : '#E8C9B8'

  return (
    <input
      ref={inputRef}
      type="text"
      inputMode="numeric"
      maxLength={1}
      value={value}
      onChange={(e) => onChange(index, e.target.value)}
      onKeyDown={(e) => onKeyDown(index, e)}
      onPaste={onPaste}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      className="w-12 h-14 sm:w-14 sm:h-16 rounded-xl text-center text-[20px] font-bold text-gray-900
                 outline-none transition-all duration-200 caret-transparent"
      style={{
        border: `1.5px solid ${borderColor}`,
        backgroundColor: value ? '#FDF5F1' : '#FAFAFA',
        boxShadow: focused ? '0 0 0 3px rgba(195,94,51,0.12)' : 'none',
      }}
      aria-label={`OTP digit ${index + 1}`}
    />
  )
}

// ── Timer display ─────────────────────────────────────────────
function CountdownTimer({ seconds }) {
  const mm = String(Math.floor(seconds / 60)).padStart(2, '0')
  const ss = String(seconds % 60).padStart(2, '0')
  return (
    <p className="text-[15px] font-bold" style={{ color: '#C35E33' }}>
      {mm}:{ss}
    </p>
  )
}

export default function VerifyOTPPage() {
  const navigate  = useNavigate()
  const location  = useLocation()
  const email     = location.state?.email || ''

  const [otp,      setOtp]      = useState(Array(OTP_LENGTH).fill(''))
  const [timer,    setTimer]    = useState(TIMER_START)
  const [loading,  setLoading]  = useState(false)
  const [error,    setError]    = useState('')
  const [resending, setResending] = useState(false)

  const inputRefs = useRef([])

  // ── Countdown timer ──────────────────────────────────────────
  useEffect(() => {
    if (timer <= 0) return
    const id = setInterval(() => setTimer((t) => t - 1), 1000)
    return () => clearInterval(id)
  }, [timer])

  // ── OTP input logic ──────────────────────────────────────────
  const handleChange = useCallback((index, raw) => {
    const val = raw.replace(/\D/g, '').slice(-1)
    setError('')
    setOtp((prev) => {
      const next = [...prev]
      next[index] = val
      return next
    })
    if (val && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus()
    }
  }, [])

  const handleKeyDown = useCallback((index, e) => {
    if (e.key === 'Backspace') {
      if (!otp[index] && index > 0) {
        inputRefs.current[index - 1]?.focus()
      }
      setOtp((prev) => {
        const next = [...prev]
        next[index] = ''
        return next
      })
    } else if (e.key === 'ArrowLeft' && index > 0) {
      inputRefs.current[index - 1]?.focus()
    } else if (e.key === 'ArrowRight' && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus()
    }
  }, [otp])

  const handlePaste = useCallback((e) => {
    e.preventDefault()
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, OTP_LENGTH)
    if (!pasted) return
    const next = Array(OTP_LENGTH).fill('')
    pasted.split('').forEach((c, i) => { next[i] = c })
    setOtp(next)
    const focusIdx = Math.min(pasted.length, OTP_LENGTH - 1)
    inputRefs.current[focusIdx]?.focus()
    setError('')
  }, [])

  // ── Submit ───────────────────────────────────────────────────
  const handleVerify = async (e) => {
    e?.preventDefault()
    const code = otp.join('')
    if (code.length < OTP_LENGTH) {
      setError('Please enter the complete 6-digit OTP.')
      return
    }
    setLoading(true)
    try {
      // Replace with your real OTP verification call:
      // await authService.verifyOTP(email, code)
      await new Promise((r) => setTimeout(r, 1200)) // demo delay
      navigate('/reset-password', { state: { email, otp: code } })
    } catch (err) {
      setError(err?.message || 'Invalid OTP. Please check and try again.')
    } finally {
      setLoading(false)
    }
  }

  // ── Resend ───────────────────────────────────────────────────
  const handleResend = async () => {
    if (timer > 0) return
    setResending(true)
    try {
      // await authService.forgotPassword(email)
      await new Promise((r) => setTimeout(r, 800))
      setOtp(Array(OTP_LENGTH).fill(''))
      setTimer(TIMER_START)
      setError('')
      inputRefs.current[0]?.focus()
    } finally {
      setResending(false)
    }
  }

  const isComplete = otp.every(Boolean)

  return (
    <AuthLayout illustration={illustration} illustrationAlt="Computer screen with login form">
      {/* Heading */}
      <div className="mb-8">
        <h1 className="text-[32px] sm:text-[38px] font-extrabold text-gray-900 leading-tight tracking-tight mb-2">
          Verify OTP
        </h1>
        <p className="text-[14px] text-gray-500 font-medium">
          Secure your account by verifying the code
        </p>
        {email && (
          <p className="mt-1 text-[13px] font-medium" style={{ color: '#C35E33' }}>
            Sent to {email}
          </p>
        )}
      </div>

      <form onSubmit={handleVerify} noValidate>
        {/* OTP Boxes */}
        <div className="flex items-center gap-2.5 sm:gap-3 mb-2 justify-center">
          {otp.map((digit, i) => (
            <OtpBox
              key={i}
              index={i}
              value={digit}
              inputRef={(el) => (inputRefs.current[i] = el)}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              onPaste={handlePaste}
              hasError={!!error}
            />
          ))}
        </div>

        {error && (
          <p className="mt-2 mb-4 text-[12px] text-red-600 text-center font-medium">{error}</p>
        )}

        <div className="mt-6">
          <AuthButton loading={loading} disabled={!isComplete}>
            Verify-OTP
          </AuthButton>
        </div>
      </form>

      {/* Timer + Resend */}
      <div className="mt-6 flex flex-col items-center gap-2">
        <CountdownTimer seconds={timer} />
        <button
          type="button"
          onClick={handleResend}
          disabled={timer > 0 || resending}
          className="text-[13px] font-bold text-gray-900 transition-colors duration-150
                     disabled:opacity-40 disabled:cursor-not-allowed hover:underline"
          style={{ cursor: timer > 0 ? 'not-allowed' : 'pointer' }}
          onMouseEnter={(e) => { if (timer <= 0) e.currentTarget.style.color = '#C35E33' }}
          onMouseLeave={(e) => { e.currentTarget.style.color = '#1A1A1A' }}
        >
          {resending ? 'Sending…' : 'Resend OTP'}
        </button>
      </div>

      {/* Back link */}
      <p className="mt-4 text-center text-[13px] text-gray-500">
        <Link to="/forgot-password" className="font-semibold" style={{ color: '#C35E33' }}>
          ← Change email
        </Link>
      </p>
    </AuthLayout>
  )
}