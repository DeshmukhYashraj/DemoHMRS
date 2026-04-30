// src/pages/roles/RolesPermissions.jsx
// ─────────────────────────────────────────────────────────────────────────────
// Roles & Permissions — HR role only (as per Figma)
// Includes: permission matrix, user assignment, Role Transfer modal,
//           Designation Transfer modal
// ─────────────────────────────────────────────────────────────────────────────

import { useState, useRef, useEffect, useMemo } from 'react'
import {
  Shield, Users, Search, Clock, ChevronDown, X, Check,
  UserCheck, Lock, Calendar, AlertTriangle, Edit2, Save, Info
} from 'lucide-react'

const PRIMARY      = '#C35E33'
const PRIMARY_DARK = '#A34A24'
const PRIMARY_LIGHT = '#FDE8DD'

// ── Mock: Single role (HR only, as per Figma) ─────────────────────────────
const HR_ROLE = {
  id: 'hr',
  name: 'Human Resources',
  icon: '🧑‍💼',
  userCount: 5,
  color: PRIMARY,
}

// ── Modules (matching Figma rows) ─────────────────────────────────────────
const MODULES = [
  { id: 'dashboard',    label: 'Dashboard' },
  { id: 'employees',   label: 'Employees' },
  { id: 'attendance',  label: 'Attendance' },
  { id: 'leave',       label: 'Leave Management'},
  { id: 'timesheet',   label: 'Timesheet'},
  { id: 'roles',       label: 'Roles & Permission'},
  { id: 'payroll',     label: 'Payroll' },
  { id: 'projects',    label: 'Projects'},
  { id: 'report',      label: 'Report' },
]

// Initial HR permissions (matching Figma)
const INITIAL_PERMS = {
  dashboard:   { all: true,  view: false, create: false, edit: false, delete: false },
  employees:   { all: true,  view: true,  create: true,  edit: true,  delete: true  },
  attendance:  { all: true,  view: false, create: false, edit: false, delete: false },
  leave:       { all: true,  view: false, create: true,  edit: false, delete: true  },
  timesheet:   { all: true,  view: false, create: false, edit: true,  delete: false },
  roles:       { all: true,  view: true,  create: false, edit: false, delete: false },
  payroll:     { all: true,  view: false, create: true,  edit: false, delete: true  },
  projects:    { all: true,  view: false, create: false, edit: false, delete: false },
  report:      { all: true,  view: true,  create: true,  edit: true,  delete: true  },
}

// ── Mock users for assignment ─────────────────────────────────────────────
const ALL_USERS = [
  { id: 1,  name: 'Sarah Jenkins',   designation: 'Developer',       avatar: 'SJ', assigned: true  },
  { id: 2,  name: 'Rajan Mehta',     designation: 'HR Executive',    avatar: 'RM', assigned: true  },
  { id: 3,  name: 'Priya Sharma',    designation: 'Team Lead',       avatar: 'PS', assigned: true  },
  { id: 4,  name: 'Anika Rhiel',     designation: 'Product Manager', avatar: 'AR', assigned: true  },
  { id: 5,  name: 'Leo Workman',     designation: 'QA Engineer',     avatar: 'LW', assigned: true  },
  { id: 6,  name: 'Craig Bergson',   designation: 'DevOps',          avatar: 'CB', assigned: false },
  { id: 7,  name: 'Gretchen Curtis', designation: 'Accountant',      avatar: 'GC', assigned: false },
  { id: 8,  name: 'Emerson Geidt',   designation: 'Sales Exec',      avatar: 'EG', assigned: false },
  { id: 9,  name: 'Talan Torff',     designation: 'Marketer',        avatar: 'TT', assigned: false },
  { id: 10, name: 'Carla Korsgaard', designation: 'Data Analyst',    avatar: 'CK', assigned: false },
]

const DESIGNATIONS = [
  'Junior Developer', 'Senior Developer', 'Team Lead', 'HR Executive',
  'HR Manager', 'Senior Architect', 'QA Engineer', 'DevOps Engineer',
  'Product Manager', 'Data Analyst', 'Accountant', 'HR Management',
]

// ── Helpers ───────────────────────────────────────────────────────────────
function Avatar({ initials, size = 8, color = PRIMARY }) {
  return (
    <div
      className={`w-${size} h-${size} rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0`}
      style={{ backgroundColor: color }}
    >
      {initials}
    </div>
  )
}

function Checkbox({ checked, onChange, disabled }) {
  return (
    <button
      type="button"
      onClick={() => !disabled && onChange(!checked)}
      disabled={disabled}
      className={`w-5 h-5 rounded flex items-center justify-center border-2 transition-all ${
        disabled ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer hover:scale-110'
      }`}
      style={{
        borderColor:     checked ? '#16A34A' : '#D1D5DB',
        backgroundColor: checked ? '#16A34A' : '#fff',
      }}
    >
      {checked && <Check size={11} color="#fff" strokeWidth={3} />}
    </button>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// ROLE TRANSFER MODAL
// ─────────────────────────────────────────────────────────────────────────────
function RoleTransferModal({ onClose }) {
  const overlayRef = useRef(null)
  const [selectedUser, setSelectedUser] = useState(ALL_USERS[0])
  const [showUserPicker, setShowUserPicker] = useState(false)
  const [startDate, setStartDate] = useState('2026-01-25')
  const [endDate, setEndDate]     = useState('2026-02-28')
  const [permanent, setPermanent] = useState(true)
  const [otp, setOtp]             = useState('')
  const [otpSent, setOtpSent]     = useState(false)
  const [verified, setVerified]   = useState(false)
  const [reason, setReason]       = useState('')

  useEffect(() => {
    const fn = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', fn)
    return () => window.removeEventListener('keydown', fn)
  }, [onClose])

  const duration = useMemo(() => {
    if (!startDate || !endDate) return '—'
    const days = Math.round((new Date(endDate) - new Date(startDate)) / 86400000)
    if (days <= 0) return '—'
    if (days < 7)  return `${days} Day${days !== 1 ? 's' : ''}`
    const weeks = Math.round(days / 7)
    return `${weeks} Week${weeks !== 1 ? 's' : ''}`
  }, [startDate, endDate])

  const fmt = (d) => d ? new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—'

  return (
    <div
      ref={overlayRef}
      onClick={(e) => { if (e.target === overlayRef.current) onClose() }}
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ backgroundColor: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(3px)' }}
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full flex flex-col overflow-hidden"
        style={{ maxWidth: 520, maxHeight: '92vh', margin: '0 16px' }}>

        {/* Header */}
        <div className="px-6 py-5 flex items-center justify-between" style={{ backgroundColor: PRIMARY }}>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center">
              <Shield size={18} color="#fff" />
            </div>
            <h2 className="text-white text-lg font-bold">Role Transfer</h2>
          </div>
          <button onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-white/80 hover:text-white hover:bg-white/20 transition-colors">
            <X size={16} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">

          {/* Source + Recipient */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs font-semibold text-gray-700 mb-2">Source Role</p>
              <div className="flex items-center gap-3 p-3.5 rounded-xl border-2 bg-orange-50"
                style={{ borderColor: PRIMARY + '40' }}>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg"
                  style={{ backgroundColor: PRIMARY }}>
                  <Shield size={18} color="#fff" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-gray-900 truncate">Human Resources</p>
                  <p className="text-[11px] text-gray-500">Permission</p>
                </div>
                <Lock size={14} color="#9CA3AF" className="ml-auto flex-shrink-0" />
              </div>
            </div>

            <div className="relative">
              <p className="text-xs font-semibold text-gray-700 mb-2">Recipient User</p>
              <button
                onClick={() => setShowUserPicker(!showUserPicker)}
                className="w-full flex items-center gap-3 p-3.5 rounded-xl border-2 hover:bg-gray-50 transition-colors text-left"
                style={{ borderColor: showUserPicker ? PRIMARY : '#E5E7EB' }}>
                <Avatar initials={selectedUser.avatar} size={10} />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-gray-900 truncate">{selectedUser.name}</p>
                  <p className="text-[11px] text-gray-500 truncate">{selectedUser.designation}</p>
                </div>
                <ChevronDown size={14} color="#9CA3AF" className={`flex-shrink-0 transition-transform ${showUserPicker ? 'rotate-180' : ''}`} />
              </button>

              {showUserPicker && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-xl border border-gray-200 shadow-xl z-20 max-h-48 overflow-y-auto">
                  {ALL_USERS.map((u) => (
                    <button key={u.id}
                      onClick={() => { setSelectedUser(u); setShowUserPicker(false) }}
                      className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-orange-50 transition-colors text-left">
                      <Avatar initials={u.avatar} size={7} />
                      <div className="min-w-0">
                        <p className="text-xs font-semibold text-gray-900 truncate">{u.name}</p>
                        <p className="text-[10px] text-gray-500 truncate">{u.designation}</p>
                      </div>
                      {selectedUser.id === u.id && <Check size={13} color={PRIMARY} className="ml-auto" />}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Delegation Period */}
          <div>
            <p className="text-xs font-semibold text-gray-700 mb-3">Delegation Period</p>
            <div className="grid grid-cols-3 gap-3">
              <div className="rounded-xl border-2 p-3.5" style={{ borderColor: PRIMARY + '50' }}>
                <p className="text-[10px] font-semibold mb-1.5" style={{ color: PRIMARY }}>Start Date</p>
                <div className="flex items-center gap-2">
                  <Calendar size={13} color={PRIMARY} />
                  <input type="date" value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="text-sm font-semibold text-gray-800 border-none outline-none bg-transparent w-full" />
                </div>
              </div>
              <div className="rounded-xl border-2 p-3.5" style={{ borderColor: PRIMARY + '50' }}>
                <p className="text-[10px] font-semibold mb-1.5" style={{ color: PRIMARY }}>End Date</p>
                <div className="flex items-center gap-2">
                  <Calendar size={13} color={PRIMARY} />
                  <input type="date" value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="text-sm font-semibold text-gray-800 border-none outline-none bg-transparent w-full" />
                </div>
              </div>
              <div className="rounded-xl p-3.5 flex flex-col justify-center" style={{ backgroundColor: '#111827' }}>
                <p className="text-[10px] text-gray-400 font-medium">Total Duration</p>
                <p className="text-base font-bold text-white mt-0.5">{duration}</p>
              </div>
            </div>
          </div>

          {/* Permanent toggle */}
          <label className="flex items-center gap-3 cursor-pointer select-none">
            <div
              onClick={() => setPermanent(!permanent)}
              className="w-5 h-5 rounded flex items-center justify-center border-2 transition-all"
              style={{ borderColor: permanent ? PRIMARY : '#D1D5DB', backgroundColor: permanent ? PRIMARY : '#fff' }}>
              {permanent && <Check size={11} color="#fff" strokeWidth={3} />}
            </div>
            <span className="text-sm font-semibold text-gray-800">Permanent Designation Transfer</span>
          </label>

          {/* OTP */}
          <div className="space-y-3">
            <button
              onClick={() => setOtpSent(true)}
              className="px-4 py-2 rounded-lg text-sm font-semibold text-white transition-colors"
              style={{ backgroundColor: '#16A34A' }}>
              {otpSent ? 'Resend OTP' : 'Generate OTP'}
            </button>
            <div className="flex gap-3">
              <input
                type="text"
                maxLength={6}
                placeholder="• • • • • •"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                className="flex-1 h-11 px-4 text-sm border-2 rounded-xl outline-none tracking-[0.4em] font-mono placeholder:tracking-normal"
                style={{ borderColor: otp.length === 6 ? '#16A34A' : '#E5E7EB' }}
              />
              <button
                onClick={() => setVerified(otp.length === 6)}
                className="px-5 py-2 rounded-xl text-sm font-semibold text-white transition-colors"
                style={{ backgroundColor: PRIMARY }}>
                {verified ? '✓ Verified' : 'Verify'}
              </button>
            </div>
            <p className="text-[11px] text-gray-400 flex items-center gap-1.5">
              <Shield size={11} />
              Confirm Transfer will be enabled once your identity is verified via OTP.
            </p>
          </div>

          {/* Reason */}
          <div>
            <p className="text-xs font-semibold text-gray-700 mb-2">Reason Of Declaration</p>
            <textarea
              rows={3}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Please Provide Institutional Justification For This Elevated Access…"
              className="w-full px-4 py-3 text-sm text-gray-700 border-2 rounded-xl outline-none resize-none placeholder:text-gray-400 focus:border-orange-300 transition-colors"
              style={{ borderColor: '#E5E7EB' }}
            />
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button onClick={onClose}
              className="px-5 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors">
              Cancel
            </button>
            <button className="px-5 py-2.5 rounded-xl border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
              Save Draft
            </button>
          </div>
          <button
            disabled={!verified}
            className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            style={{ backgroundColor: PRIMARY }}>
            Confirm Declaration
          </button>
        </div>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// DESIGNATION TRANSFER MODAL
// ─────────────────────────────────────────────────────────────────────────────
function DesignationTransferModal({ onClose }) {
  const overlayRef = useRef(null)
  const [fromDesig, setFromDesig] = useState('Senior Architect')
  const [toDesig,   setToDesig]   = useState('HR Management')
  const [startDate, setStartDate] = useState('2026-01-25')
  const [endDate,   setEndDate]   = useState('2026-02-28')
  const [permanent, setPermanent] = useState(true)
  const [otp, setOtp]             = useState('')
  const [otpSent, setOtpSent]     = useState(false)
  const [verified, setVerified]   = useState(false)
  const [reason, setReason]       = useState('')

  useEffect(() => {
    const fn = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', fn)
    return () => window.removeEventListener('keydown', fn)
  }, [onClose])

  const duration = useMemo(() => {
    if (!startDate || !endDate) return '—'
    const days = Math.round((new Date(endDate) - new Date(startDate)) / 86400000)
    if (days <= 0) return '—'
    if (days < 7)  return `${days} Day${days !== 1 ? 's' : ''}`
    const weeks = Math.round(days / 7)
    return `${weeks} Week${weeks !== 1 ? 's' : ''}`
  }, [startDate, endDate])

  return (
    <div
      ref={overlayRef}
      onClick={(e) => { if (e.target === overlayRef.current) onClose() }}
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ backgroundColor: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(3px)' }}
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full flex flex-col overflow-hidden"
        style={{ maxWidth: 520, maxHeight: '92vh', margin: '0 16px' }}>

        {/* Header */}
        <div className="px-6 py-5 flex items-center justify-between" style={{ backgroundColor: PRIMARY }}>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center">
              <UserCheck size={18} color="#fff" />
            </div>
            <h2 className="text-white text-lg font-bold">Designation Transfer</h2>
          </div>
          <button onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-white/80 hover:text-white hover:bg-white/20 transition-colors">
            <X size={16} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">

          {/* From / To */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs font-semibold text-gray-700 mb-2">From Designation</p>
              <div className="relative">
                <select
                  value={fromDesig}
                  onChange={(e) => setFromDesig(e.target.value)}
                  className="w-full px-4 py-3 text-sm font-semibold text-gray-900 border-2 rounded-xl outline-none appearance-none bg-white cursor-pointer"
                  style={{ borderColor: PRIMARY + '50' }}>
                  {DESIGNATIONS.map((d) => <option key={d}>{d}</option>)}
                </select>
                <ChevronDown size={14} color="#9CA3AF" className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-700 mb-2">To Designation</p>
              <input
                type="text"
                value={toDesig}
                onChange={(e) => setToDesig(e.target.value)}
                className="w-full px-4 py-3 text-sm font-semibold text-gray-900 border-2 rounded-xl outline-none"
                style={{ borderColor: PRIMARY + '50' }}
              />
            </div>
          </div>

          {/* Delegation Period */}
          <div>
            <p className="text-xs font-semibold text-gray-700 mb-3">Delegation Period</p>
            <div className="grid grid-cols-3 gap-3">
              <div className="rounded-xl border-2 p-3.5" style={{ borderColor: PRIMARY + '50' }}>
                <p className="text-[10px] font-semibold mb-1.5" style={{ color: PRIMARY }}>Start Date</p>
                <div className="flex items-center gap-2">
                  <Calendar size={13} color={PRIMARY} />
                  <input type="date" value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="text-sm font-semibold text-gray-800 border-none outline-none bg-transparent w-full" />
                </div>
              </div>
              <div className="rounded-xl border-2 p-3.5" style={{ borderColor: PRIMARY + '50' }}>
                <p className="text-[10px] font-semibold mb-1.5" style={{ color: PRIMARY }}>End Date</p>
                <div className="flex items-center gap-2">
                  <Calendar size={13} color={PRIMARY} />
                  <input type="date" value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="text-sm font-semibold text-gray-800 border-none outline-none bg-transparent w-full" />
                </div>
              </div>
              <div className="rounded-xl p-3.5 flex flex-col justify-center" style={{ backgroundColor: '#111827' }}>
                <p className="text-[10px] text-gray-400 font-medium">Total Duration</p>
                <p className="text-base font-bold text-white mt-0.5">{duration}</p>
              </div>
            </div>
          </div>

          {/* Permanent toggle */}
          <label className="flex items-center gap-3 cursor-pointer select-none">
            <div
              onClick={() => setPermanent(!permanent)}
              className="w-5 h-5 rounded flex items-center justify-center border-2 transition-all cursor-pointer"
              style={{ borderColor: permanent ? PRIMARY : '#D1D5DB', backgroundColor: permanent ? PRIMARY : '#fff' }}>
              {permanent && <Check size={11} color="#fff" strokeWidth={3} />}
            </div>
            <span className="text-sm font-semibold text-gray-800">Permanent Designation Transfer</span>
          </label>

          {/* OTP */}
          <div className="space-y-3">
            <button
              onClick={() => setOtpSent(true)}
              className="px-4 py-2 rounded-lg text-sm font-semibold text-white transition-colors"
              style={{ backgroundColor: '#16A34A' }}>
              {otpSent ? 'Resend OTP' : 'Generate OTP'}
            </button>
            <div className="flex gap-3">
              <input
                type="text"
                maxLength={6}
                placeholder="• • • • • •"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                className="flex-1 h-11 px-4 text-sm border-2 rounded-xl outline-none tracking-[0.4em] font-mono placeholder:tracking-normal"
                style={{ borderColor: otp.length === 6 ? '#16A34A' : '#E5E7EB' }}
              />
              <button
                onClick={() => setVerified(otp.length === 6)}
                className="px-5 py-2 rounded-xl text-sm font-semibold text-white transition-colors"
                style={{ backgroundColor: PRIMARY }}>
                {verified ? '✓ Verified' : 'Verify'}
              </button>
            </div>
            <p className="text-[11px] text-gray-400 flex items-center gap-1.5">
              <Shield size={11} />
              Confirm Transfer will be enabled once your identity is verified via OTP.
            </p>
          </div>

          {/* Reason */}
          <div>
            <p className="text-xs font-semibold text-gray-700 mb-2">Reason Of Declaration</p>
            <textarea
              rows={3}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Please Provide Institutional Justification For This Elevated Access…"
              className="w-full px-4 py-3 text-sm text-gray-700 border-2 rounded-xl outline-none resize-none placeholder:text-gray-400 transition-colors"
              style={{ borderColor: '#E5E7EB' }}
            />
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button onClick={onClose}
              className="px-5 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors">
              Cancel
            </button>
            <button className="px-5 py-2.5 rounded-xl border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
              Save Draft
            </button>
          </div>
          <button
            disabled={!verified}
            className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            style={{ backgroundColor: PRIMARY }}>
            Confirm Declaration
          </button>
        </div>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// ASSIGN USERS MODAL
// ─────────────────────────────────────────────────────────────────────────────
function AssignUsersModal({ users, onClose, onSave }) {
  const [localUsers, setLocalUsers] = useState(users.map((u) => ({ ...u })))
  const [search, setSearch] = useState('')

  const filtered = useMemo(() =>
    localUsers.filter((u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.designation.toLowerCase().includes(search.toLowerCase())
    ), [localUsers, search])

  const toggle = (id) => {
    setLocalUsers((prev) => prev.map((u) => u.id === id ? { ...u, assigned: !u.assigned } : u))
  }

  const assignedCount = localUsers.filter((u) => u.assigned).length

  useEffect(() => {
    const fn = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', fn)
    return () => window.removeEventListener('keydown', fn)
  }, [onClose])

  return (
    <div
      onClick={(e) => { if (e.currentTarget === e.target) onClose() }}
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ backgroundColor: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(3px)' }}
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full flex flex-col overflow-hidden"
        style={{ maxWidth: 460, maxHeight: '85vh', margin: '0 16px' }}>

        <div className="px-5 py-4 flex items-center justify-between" style={{ backgroundColor: '#111827' }}>
          <div>
            <p className="text-white font-semibold text-sm">Assign Users to Role</p>
            <p className="text-gray-400 text-[11px] mt-0.5">Human Resources · {assignedCount} assigned</p>
          </div>
          <button onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-white hover:bg-gray-700 transition-colors">
            <X size={16} />
          </button>
        </div>

        <div className="px-4 pt-4 pb-2">
          <label className="flex items-center gap-2 bg-gray-50 rounded-xl px-3 h-9 border border-gray-200">
            <Search size={13} color="#9CA3AF" />
            <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
              placeholder="Search users…"
              className="border-none outline-none text-[13px] text-gray-900 bg-transparent flex-1" />
          </label>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-2">
          {filtered.map((u) => (
            <div key={u.id}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer"
              onClick={() => toggle(u.id)}>
              <Avatar initials={u.avatar} size={9} color={u.assigned ? PRIMARY : '#9CA3AF'} />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-gray-900 truncate">{u.name}</p>
                <p className="text-[11px] text-gray-500 truncate">{u.designation}</p>
              </div>
              <div
                className="w-5 h-5 rounded flex items-center justify-center border-2 transition-all flex-shrink-0"
                style={{ borderColor: u.assigned ? '#16A34A' : '#D1D5DB', backgroundColor: u.assigned ? '#16A34A' : '#fff' }}>
                {u.assigned && <Check size={11} color="#fff" strokeWidth={3} />}
              </div>
            </div>
          ))}
        </div>

        <div className="px-5 py-4 border-t border-gray-100 flex gap-3">
          <button onClick={onClose}
            className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors">
            Cancel
          </button>
          <button
            onClick={() => { onSave(localUsers); onClose() }}
            className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white transition-colors"
            style={{ backgroundColor: PRIMARY }}>
            Save Assignment
          </button>
        </div>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN PAGE
// ─────────────────────────────────────────────────────────────────────────────
export default function RolesPermissions() {
  const [perms,        setPerms]        = useState(INITIAL_PERMS)
  const [users,        setUsers]        = useState(ALL_USERS)
  const [dirty,        setDirty]        = useState(false)
  const [showRole,     setShowRole]     = useState(false)
  const [showDesig,    setShowDesig]    = useState(false)
  const [showAssign,   setShowAssign]   = useState(false)
  const [saved,        setSaved]        = useState(false)

  const assignedUsers = users.filter((u) => u.assigned)

  const togglePerm = (moduleId, col) => {
    setPerms((prev) => {
      const current = prev[moduleId]
      if (col === 'all') {
        const newAll = !current.all
        return {
          ...prev,
          [moduleId]: { all: newAll, view: newAll, create: newAll, edit: newAll, delete: newAll },
        }
      }
      const updated = { ...current, [col]: !current[col] }
      // recalc "all"
      updated.all = updated.view && updated.create && updated.edit && updated.delete
      return { ...prev, [moduleId]: updated }
    })
    setDirty(true)
    setSaved(false)
  }

  const handleSave = () => {
    setDirty(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  const COLS = [
    { key: 'all',    label: 'All'    },
    { key: 'view',   label: 'View'   },
    { key: 'create', label: 'Create' },
    { key: 'edit',   label: 'Edit'   },
    { key: 'delete', label: 'Delete' },
  ]

  return (
    <>
      {/* ── Page Header ─────────────────────────────────────── */}
      <div className="flex items-center justify-between mb-5 gap-3 flex-wrap">
        <div>
          <h1 className="text-xl font-bold text-gray-900 m-0">Roles &amp; Permissions</h1>
          <p className="text-xs text-gray-400 mt-0.5">Manage access control for Human Resources</p>
        </div>
      </div>

      <div className="flex gap-5 items-start">

        {/* ── Left panel: Role card + Assigned Users ──────────── */}
        <div className="flex flex-col gap-4" style={{ width: 240, flexShrink: 0 }}>

          {/* Role Card */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
              <p className="text-sm font-bold text-gray-800">Roles</p>
              <Info size={14} color="#9CA3AF" />
            </div>
            <div className="p-3">
              {/* Only HR role shown (as per Figma: only HR tab) */}
              <div
                className="flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer"
                style={{ borderColor: PRIMARY, backgroundColor: PRIMARY_LIGHT }}>
                <div className="w-9 h-9 rounded-xl flex items-center justify-center text-base"
                  style={{ backgroundColor: PRIMARY }}>
                  <Shield size={16} color="#fff" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-gray-900 truncate">Human Resources</p>
                  <p className="text-[11px] text-gray-500">05 Users assigned</p>
                </div>
                <button className="w-6 h-6 rounded-lg flex items-center justify-center hover:bg-white/60 transition-colors">
                  <Edit2 size={12} color={PRIMARY} />
                </button>
              </div>
            </div>
          </div>

          {/* Assigned Users Card */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
              <p className="text-sm font-bold text-gray-800">Assigned Users</p>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full text-white" style={{ backgroundColor: PRIMARY }}>
                {assignedUsers.length}
              </span>
            </div>
            <div className="p-3 space-y-1 max-h-64 overflow-y-auto">
              {assignedUsers.map((u) => (
                <div key={u.id} className="flex items-center gap-2.5 px-2 py-2 rounded-lg hover:bg-gray-50 transition-colors">
                  <Avatar initials={u.avatar} size={7} />
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-gray-900 truncate">{u.name}</p>
                    <p className="text-[10px] text-gray-400 truncate">{u.designation}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="px-3 pb-3">
              <button
                onClick={() => setShowAssign(true)}
                className="w-full py-2 rounded-xl text-xs font-semibold border-2 border-dashed transition-colors hover:bg-orange-50"
                style={{ borderColor: PRIMARY, color: PRIMARY }}>
                + Manage Users
              </button>
            </div>
          </div>
        </div>

        {/* ── Right panel: Permissions table ──────────────────── */}
        <div className="flex-1 min-w-0 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">

          {/* Table header bar */}
          <div className="flex items-center justify-between px-5 py-4 rounded-t-2xl flex-wrap gap-3"
            style={{ backgroundColor: PRIMARY }}>
            <div>
              <p className="text-white font-bold text-sm">Permissions : Human Resources</p>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <button
                onClick={() => setShowRole(true)}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-white/40 text-xs font-semibold text-white hover:bg-white/10 transition-colors whitespace-nowrap">
                <Shield size={12} />
                Role Transfer
              </button>
              <button
                onClick={() => setShowDesig(true)}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap"
                style={{ backgroundColor: '#111827', color: '#fff' }}>
                <UserCheck size={12} />
                Designation Transfer
              </button>
              <button
                onClick={handleSave}
                disabled={!dirty}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg border text-xs font-semibold transition-all whitespace-nowrap disabled:opacity-50"
                style={{ borderColor: '#fff', color: '#fff', backgroundColor: saved ? '#16A34A' : 'transparent' }}>
                {saved ? <><Check size={12} /> Saved!</> : <><Save size={12} /> Save Changes</>}
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full border-collapse" style={{ minWidth: 640 }}>
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="px-5 py-3.5 text-left text-xs font-semibold text-gray-900">
                    Module Name
                  </th>
                  {COLS.map(({ key, label }) => (
                    <th key={key} className="px-5 py-3.5 text-center text-xs font-semibold"
                      style={{ color: key === 'all' ? PRIMARY : '#111827' }}>
                      {label}
                    </th>
                  ))}
                  <th className="px-5 py-3.5 text-center text-xs font-semibold text-gray-700">
                    Schedule
                  </th>
                </tr>
              </thead>
              <tbody>
                {MODULES.map((mod, idx) => {
                  const p = perms[mod.id]
                  return (
                    <tr key={mod.id}
                      className="hover:bg-orange-50/40 transition-colors"
                      style={{ backgroundColor: idx % 2 === 0 ? '#fff' : '#FAFAFA' }}>
                      <td className="px-5 py-4 border-b border-gray-50">
                        <div className="flex items-center gap-2.5">
                          <span className="text-sm font-medium text-gray-800">{mod.label}</span>
                        </div>
                      </td>
                      {COLS.map(({ key }) => (
                        <td key={key} className="px-5 py-4 border-b border-gray-50 text-center">
                          <div className="flex justify-center">
                            <Checkbox
                              checked={p[key]}
                              onChange={() => togglePerm(mod.id, key)}
                            />
                          </div>
                        </td>
                      ))}
                      <td className="px-5 py-4 border-b border-gray-50 text-center">
                        <button className="w-7 h-7 mx-auto flex items-center justify-center rounded-full border border-orange-200 hover:border-orange-400 hover:bg-orange-50 transition-colors">
                          <Clock size={13} color={PRIMARY} />
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          {/* Info bar */}
          <div className="px-5 py-3 border-t border-gray-100 flex items-center gap-2">
            <AlertTriangle size={12} color="#854D0E" />
            <p className="text-[11px] text-yellow-800">
              Changes to permissions take effect immediately upon saving. Review carefully before saving.
            </p>
          </div>
        </div>
      </div>

      {/* ── Modals ──────────────────────────────────────────── */}
      {showRole  && <RoleTransferModal       onClose={() => setShowRole(false)}  />}
      {showDesig && <DesignationTransferModal onClose={() => setShowDesig(false)} />}
      {showAssign && (
        <AssignUsersModal
          users={users}
          onClose={() => setShowAssign(false)}
          onSave={(updated) => setUsers(updated)}
        />
      )}
    </>
  )
}