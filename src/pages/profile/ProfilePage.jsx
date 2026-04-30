// src/pages/profile/ProfilePage.jsx
// ─── User Profile — view / edit info, change password ────────────────────────
import { useState, useRef } from 'react'
import {
  User, Mail, Phone, Building2, Briefcase, MapPin,
  Lock, Eye, EyeOff, Camera, Check, X, AlertCircle,
} from 'lucide-react'
import { useAuthStore } from '@/store/authStore'

const BRAND      = '#C35E33'
const BRAND_DARK = '#A34A24'

// ─── helpers ─────────────────────────────────────────────────────────────────
function Field({ icon: Icon, label, value, editing, name, onChange, type = 'text', readOnly = false }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">{label}</label>
      <div
        className="flex items-center gap-3 px-4 h-11 rounded-xl border bg-white transition-colors"
        style={{ borderColor: editing && !readOnly ? BRAND : '#E5E7EB' }}
      >
        <Icon size={16} color={editing && !readOnly ? BRAND : '#9CA3AF'} strokeWidth={2} className="flex-shrink-0" />
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          readOnly={readOnly || !editing}
          className="flex-1 bg-transparent outline-none text-sm text-gray-800 font-medium placeholder:text-gray-400"
          style={{ cursor: readOnly || !editing ? 'default' : 'text' }}
        />
      </div>
    </div>
  )
}

function PasswordField({ label, name, value, onChange, show, onToggleShow }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">{label}</label>
      <div
        className="flex items-center gap-3 px-4 h-11 rounded-xl border bg-white transition-colors"
        style={{ borderColor: BRAND }}
      >
        <Lock size={16} color={BRAND} strokeWidth={2} className="flex-shrink-0" />
        <input
          type={show ? 'text' : 'password'}
          name={name}
          value={value}
          onChange={onChange}
          className="flex-1 bg-transparent outline-none text-sm text-gray-800"
          placeholder="••••••••"
        />
        <button type="button" onClick={onToggleShow} className="flex-shrink-0 text-gray-400 hover:text-gray-600">
          {show ? <EyeOff size={16} /> : <Eye size={16} />}
        </button>
      </div>
    </div>
  )
}

function Toast({ message, type }) {
  if (!message) return null
  const isSuccess = type === 'success'
  return (
    <div
      className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3 rounded-xl shadow-xl text-sm font-medium text-white transition-all`}
      style={{ backgroundColor: isSuccess ? '#16A34A' : '#DC2626' }}
    >
      {isSuccess ? <Check size={16} /> : <AlertCircle size={16} />}
      {message}
    </div>
  )
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function ProfilePage() {
  const { user, setUser } = useAuthStore()

  // ── Profile info state ────────────────────────────────────────
  const [editing, setEditing] = useState(false)
  const [form, setForm]       = useState({
    name:        user?.name        || 'Mac John',
    email:       user?.email       || 'macjohn@example.com',
    phone:       user?.phone       || '+91 98765 43210',
    designation: user?.designation || 'Software Engineer',
    department:  user?.department  || 'IT-Based',
    branch:      user?.branch      || 'Kolhapur HQ',
  })
  const [saved, setSaved]     = useState({ ...form })

  // ── Avatar state ──────────────────────────────────────────────
  const [avatar, setAvatar]   = useState(user?.avatar || null)
  const fileRef               = useRef(null)

  // ── Password state ────────────────────────────────────────────
  const [pwSection, setPwSection] = useState(false)
  const [pwForm, setPwForm]       = useState({ current: '', next: '', confirm: '' })
  const [showPw, setShowPw]       = useState({ current: false, next: false, confirm: false })
  const [pwError, setPwError]     = useState('')

  // ── Toast ─────────────────────────────────────────────────────
  const [toast, setToast] = useState({ message: '', type: '' })
  const showToast = (message, type = 'success') => {
    setToast({ message, type })
    setTimeout(() => setToast({ message: '', type: '' }), 3000)
  }

  const handleFormChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSave = () => {
    setSaved({ ...form })
    setUser?.({ ...user, ...form, avatar })
    setEditing(false)
    showToast('Profile updated successfully!')
  }

  const handleCancel = () => {
    setForm({ ...saved })
    setEditing(false)
  }

  const handleAvatarChange = (e) => {
    const file = e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => setAvatar(reader.result)
    reader.readAsDataURL(file)
  }

  const handlePasswordSave = () => {
    setPwError('')
    if (!pwForm.current) return setPwError('Current password is required.')
    if (pwForm.next.length < 8) return setPwError('New password must be at least 8 characters.')
    if (pwForm.next !== pwForm.confirm) return setPwError('Passwords do not match.')
    // Call API here
    setPwForm({ current: '', next: '', confirm: '' })
    setPwSection(false)
    showToast('Password changed successfully!')
  }

  const initials = (form.name || 'MJ').slice(0, 2).toUpperCase()

  return (
    <div className="max-w-3xl mx-auto pb-12">
      {/* ── Page title ───────────────────────────────────────── */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
        <p className="text-sm text-gray-500 mt-0.5">Manage your personal information and account security.</p>
      </div>

      {/* ── Avatar Card ──────────────────────────────────────── */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-5 flex items-center gap-6">
        {/* Avatar */}
        <div className="relative flex-shrink-0">
          <div
            className="w-24 h-24 rounded-full overflow-hidden flex items-center justify-center text-3xl font-bold text-white"
            style={{ backgroundColor: BRAND }}
          >
            {avatar
              ? <img src={avatar} alt="avatar" className="w-full h-full object-cover" />
              : <span>{initials}</span>
            }
          </div>
          <button
            onClick={() => fileRef.current.click()}
            title="Change photo"
            className="absolute bottom-0 right-0 w-8 h-8 rounded-full flex items-center justify-center text-white shadow-md transition-colors"
            style={{ backgroundColor: BRAND }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = BRAND_DARK)}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = BRAND)}
          >
            <Camera size={14} strokeWidth={2.5} />
          </button>
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
        </div>

        {/* Info summary */}
        <div className="flex-1 min-w-0">
          <h2 className="text-lg font-semibold text-gray-900 truncate">{form.name}</h2>
          <p className="text-sm text-gray-500">{form.designation} · {form.department}</p>
          <p className="text-sm text-gray-400 mt-0.5">{form.email}</p>
        </div>

        {/* Role badge */}
        <span
          className="hidden sm:inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold text-white flex-shrink-0"
          style={{ backgroundColor: BRAND }}
        >
          {user?.role || 'Admin'}
        </span>
      </div>

      {/* ── Personal Information Card ─────────────────────────── */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-5">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h3 className="text-base font-semibold text-gray-900">Personal Information</h3>
            <p className="text-xs text-gray-400 mt-0.5">Update your details below</p>
          </div>
          {!editing ? (
            <button
              onClick={() => setEditing(true)}
              className="px-4 py-2 text-sm font-semibold text-white rounded-xl transition-colors"
              style={{ backgroundColor: BRAND }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = BRAND_DARK)}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = BRAND)}
            >
              Edit Profile
            </button>
          ) : (
            <div className="flex gap-2">
              <button
                onClick={handleCancel}
                className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-gray-600 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
              >
                <X size={14} /> Cancel
              </button>
              <button
                onClick={handleSave}
                className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-white rounded-xl transition-colors"
                style={{ backgroundColor: BRAND }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = BRAND_DARK)}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = BRAND)}
              >
                <Check size={14} /> Save Changes
              </button>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field icon={User}       label="Full Name"    name="name"        value={form.name}        editing={editing} onChange={handleFormChange} />
          <Field icon={Mail}       label="Email"        name="email"       value={form.email}       editing={editing} onChange={handleFormChange} type="email" />
          <Field icon={Phone}      label="Phone"        name="phone"       value={form.phone}       editing={editing} onChange={handleFormChange} />
          <Field icon={Briefcase}  label="Designation"  name="designation" value={form.designation} editing={editing} onChange={handleFormChange} />
          <Field icon={Building2}  label="Department"   name="department"  value={form.department}  editing={editing} onChange={handleFormChange} />
          <Field icon={MapPin}     label="Branch"       name="branch"      value={form.branch}      editing={editing} onChange={handleFormChange} />
        </div>
      </div>

      {/* ── Change Password Card ──────────────────────────────── */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <div className="flex items-center justify-between mb-1">
          <div>
            <h3 className="text-base font-semibold text-gray-900">Change Password</h3>
            <p className="text-xs text-gray-400 mt-0.5">Keep your account secure with a strong password</p>
          </div>
          {!pwSection && (
            <button
              onClick={() => { setPwSection(true); setPwError('') }}
              className="px-4 py-2 text-sm font-semibold rounded-xl border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Update Password
            </button>
          )}
        </div>

        {pwSection && (
          <div className="mt-5 space-y-4">
            <PasswordField
              label="Current Password" name="current" value={pwForm.current}
              onChange={(e) => setPwForm((p) => ({ ...p, current: e.target.value }))}
              show={showPw.current}
              onToggleShow={() => setShowPw((p) => ({ ...p, current: !p.current }))}
            />
            <PasswordField
              label="New Password" name="next" value={pwForm.next}
              onChange={(e) => setPwForm((p) => ({ ...p, next: e.target.value }))}
              show={showPw.next}
              onToggleShow={() => setShowPw((p) => ({ ...p, next: !p.next }))}
            />
            <PasswordField
              label="Confirm New Password" name="confirm" value={pwForm.confirm}
              onChange={(e) => setPwForm((p) => ({ ...p, confirm: e.target.value }))}
              show={showPw.confirm}
              onToggleShow={() => setShowPw((p) => ({ ...p, confirm: !p.confirm }))}
            />

            {/* Password strength hint */}
            {pwForm.next.length > 0 && (
              <p className={`text-xs ${pwForm.next.length >= 8 ? 'text-green-600' : 'text-amber-500'}`}>
                {pwForm.next.length >= 8 ? '✓ Strong enough' : `${8 - pwForm.next.length} more characters needed`}
              </p>
            )}

            {pwError && (
              <p className="flex items-center gap-2 text-sm text-red-500">
                <AlertCircle size={14} /> {pwError}
              </p>
            )}

            <div className="flex gap-3 pt-1">
              <button
                onClick={() => { setPwSection(false); setPwError(''); setPwForm({ current: '', next: '', confirm: '' }) }}
                className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handlePasswordSave}
                className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white transition-colors"
                style={{ backgroundColor: BRAND }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = BRAND_DARK)}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = BRAND)}
              >
                Change Password
              </button>
            </div>
          </div>
        )}
      </div>

      <Toast message={toast.message} type={toast.type} />
    </div>
  )
}