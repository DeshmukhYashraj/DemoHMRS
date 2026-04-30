// src/pages/shift/ShiftForm.jsx
import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ChevronDown, Clock, Info } from 'lucide-react'

const PRIMARY      = '#C35E33'
const PRIMARY_DARK = '#A34A24'

// ── Reusable field components ─────────────────────────────────────────────────
function Label({ children, hint }) {
  return (
    <div className="flex items-center gap-1.5 mb-1.5">
      <span className="text-sm font-semibold text-gray-700">{children}</span>
      {hint && <Info size={12} color="#9CA3AF" />}
    </div>
  )
}

function TextInput({ placeholder, value, onChange, type = 'text' }) {
  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={e => onChange?.(e.target.value)}
      className="w-full h-11 px-4 text-sm text-gray-800 bg-white border border-gray-200 rounded-xl outline-none transition-colors placeholder:text-gray-400"
      style={{ focusBorderColor: PRIMARY }}
      onFocus={e => (e.target.style.borderColor = PRIMARY)}
      onBlur={e => (e.target.style.borderColor = '#E5E7EB')}
    />
  )
}

function TimeInput({ value, onChange, placeholder }) {
  return (
    <div className="relative">
      <input
        type="time"
        value={value}
        onChange={e => onChange?.(e.target.value)}
        placeholder={placeholder}
        className="w-full h-11 px-4 pr-10 text-sm text-gray-800 bg-white border border-gray-200 rounded-xl outline-none transition-colors appearance-none"
        onFocus={e => (e.target.style.borderColor = PRIMARY)}
        onBlur={e => (e.target.style.borderColor = '#E5E7EB')}
      />
      <Clock size={15} color="#9CA3AF" className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
    </div>
  )
}

function Toggle({ checked, onChange, label, sublabel }) {
  return (
    <div className="flex items-center gap-3">
      <button
        type="button"
        onClick={() => onChange?.(!checked)}
        className="relative flex-shrink-0 w-10 h-5.5 rounded-full transition-colors duration-200 focus:outline-none"
        style={{
          backgroundColor: checked ? '#22C55E' : '#D1D5DB',
          width: 40, height: 22,
        }}
      >
        <span
          className="absolute top-0.5 left-0.5 w-4.5 h-4.5 bg-white rounded-full shadow-sm transition-transform duration-200"
          style={{
            width: 18, height: 18,
            transform: checked ? 'translateX(18px)' : 'translateX(0)',
          }}
        />
      </button>
      <div>
        <span className="text-sm font-semibold text-gray-700">{label}</span>
        {sublabel && <p className="text-[10px] text-gray-400 mt-0.5">{sublabel}</p>}
      </div>
    </div>
  )
}

function SelectInput({ value, onChange, options, placeholder }) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={e => onChange?.(e.target.value)}
        className="w-full h-11 px-4 pr-10 text-sm text-gray-800 bg-white border border-gray-200 rounded-xl outline-none appearance-none cursor-pointer"
        onFocus={e => (e.target.style.borderColor = PRIMARY)}
        onBlur={e => (e.target.style.borderColor = '#E5E7EB')}
      >
        <option value="">{placeholder || 'Select…'}</option>
        {options.map(o => <option key={o} value={o}>{o}</option>)}
      </select>
      <ChevronDown size={15} color="#9CA3AF" className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
    </div>
  )
}

// ── Day row (Normal Shift week-offs table) ────────────────────────────────────
const DAYS = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday']

function DayRow({ day, startTime, endTime, weekOff, onStartTime, onEndTime, onWeekOff }) {
  return (
    <tr className="border-b border-gray-100 last:border-0">
      <td className="px-4 py-3 text-sm font-medium text-gray-700 w-28">{day}</td>
      <td className="px-4 py-3">
        <TimeInput value={startTime} onChange={onStartTime} />
      </td>
      <td className="px-4 py-3">
        <TimeInput value={endTime} onChange={onEndTime} />
      </td>
      <td className="px-4 py-3 text-center">
        <input
          type="checkbox"
          checked={weekOff}
          onChange={e => onWeekOff?.(e.target.checked)}
          className="w-4 h-4 rounded cursor-pointer"
          style={{ accentColor: PRIMARY }}
        />
      </td>
    </tr>
  )
}

// ── Main Form ─────────────────────────────────────────────────────────────────
const defaultDays = DAYS.map((d, i) => ({
  day: d,
  startTime: '09:30',
  endTime:   '18:30',
  weekOff:   i >= 5,
}))

export default function ShiftForm() {
  const navigate = useNavigate()
  const { id }   = useParams()
  const isEdit   = Boolean(id)

  const [mode, setMode] = useState('Normal') // 'Normal' | 'Custom'

  // Common fields
  const [shiftName,          setShiftName]          = useState('')
  const [graceMinutes,       setGraceMinutes]        = useState('10')
  const [lateMarkLimit,      setLateMarkLimit]       = useState('3')
  const [overtimeAllowed,    setOvertimeAllowed]     = useState(true)
  const [autoCheckout,       setAutoCheckout]        = useState(true)
  const [overtimeAfterMin,   setOvertimeAfterMin]    = useState('10')
  const [selectedBreak,      setSelectedBreak]       = useState('')

  // Normal shift
  const [startTime,          setStartTime]           = useState('09:00')
  const [endTime,            setEndTime]             = useState('18:00')
  const [checkInStart,       setCheckInStart]        = useState('08:30')
  const [checkInEnd,         setCheckInEnd]          = useState('09:30')
  const [checkOutStart,      setCheckOutStart]       = useState('17:30')
  const [checkOutEnd,        setCheckOutEnd]         = useState('18:30')
  const [saturdayOff,        setSaturdayOff]         = useState(true)
  const [sundayOff,          setSundayOff]           = useState(true)

  // Custom shift: per-day settings shown in day-wise table (reused for custom mode preview)
  const [days, setDays] = useState(defaultDays)

  const updateDay = (idx, key, val) => {
    setDays(prev => prev.map((d, i) => i === idx ? { ...d, [key]: val } : d))
  }

  const handleSubmit = () => {
    // In production: dispatch to API
    navigate('/shift')
  }

  const handleView = () => {
    // Show view card
    navigate('/shift/1/view')
  }

  return (
    <>
      {/* ── Header ─────────────────────────────────────────── */}
      <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
        <div>
          <h1 className="text-xl font-bold text-gray-900 m-0">
            {isEdit ? 'Edit Shift' : 'Shift Management Form'}
          </h1>
          <p className="text-xs text-gray-400 mt-0.5">
            {isEdit ? 'Update shift configuration' : 'Create a new shift configuration'}
          </p>
        </div>
        {/* Normal / Custom toggle */}
        <div className="flex items-center bg-gray-100 p-1 rounded-xl gap-1">
          {['Normal','Custom'].map(m => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className="px-5 py-2 rounded-lg text-sm font-semibold transition-all"
              style={{
                backgroundColor: mode === m ? (m === 'Normal' ? PRIMARY : '#111827') : 'transparent',
                color:           mode === m ? '#fff' : '#6B7280',
              }}
            >
              {m}
            </button>
          ))}
        </div>
      </div>

      {/* ── Form Card ──────────────────────────────────────── */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm space-y-6">

        {/* Shift Name */}
        <div className="max-w-md">
          <Label>Shift Name</Label>
          <TextInput placeholder="Morning Shift" value={shiftName} onChange={setShiftName} />
        </div>

        {/* Grace + Late */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl">
          <div>
            <Label hint>Grace Minutes</Label>
            <TextInput placeholder="10 min" value={graceMinutes} onChange={setGraceMinutes} />
          </div>
          <div>
            <Label>Late Mark Limit</Label>
            <TextInput placeholder="3" value={lateMarkLimit} onChange={setLateMarkLimit} />
          </div>
        </div>

        {/* Toggles */}
        <div className="flex items-center gap-10 flex-wrap">
          <Toggle
            checked={overtimeAllowed}
            onChange={setOvertimeAllowed}
            label="Overtime Allowed"
            sublabel="Allow Extra Hours Beyond Shift End"
          />
          <Toggle
            checked={autoCheckout}
            onChange={setAutoCheckout}
            label="Auto Checkout"
            sublabel="Auto Mark Checkout At Shift End"
          />
        </div>

        {/* Overtime After Minutes */}
        {overtimeAllowed && (
          <div className="max-w-sm">
            <Label>Overtime After Minutes</Label>
            <TextInput placeholder="10 min" value={overtimeAfterMin} onChange={setOvertimeAfterMin} />
          </div>
        )}

        {/* Breaks */}
        <div className="max-w-xs">
          <Label>Breaks</Label>
          <SelectInput
            value={selectedBreak}
            onChange={setSelectedBreak}
            options={['Lunch Break (60 min)', 'Tea Break (15 min)', 'Short Break (10 min)']}
            placeholder="Select Break"
          />
        </div>

        {/* ── Divider ── */}
        <div className="h-px bg-gray-100" />

        {/* ── NORMAL MODE ───────────────────────────────────── */}
        {mode === 'Normal' && (
          <div className="space-y-5">
            <h2 className="text-base font-bold text-gray-900">Normal Shift</h2>

            {/* Start / End */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl">
              <div>
                <Label>Start Time</Label>
                <TimeInput value={startTime} onChange={setStartTime} />
              </div>
              <div>
                <Label>End Time</Label>
                <TimeInput value={endTime} onChange={setEndTime} />
              </div>
            </div>

            {/* Check-in window */}
            <div>
              <Label hint>Check-in Window</Label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl">
                <div>
                  <p className="text-xs text-gray-500 mb-1.5">Start</p>
                  <TimeInput value={checkInStart} onChange={setCheckInStart} />
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1.5">End</p>
                  <TimeInput value={checkInEnd} onChange={setCheckInEnd} />
                </div>
              </div>
            </div>

            {/* Check-out window */}
            <div>
              <Label hint>Check-Out Window</Label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl">
                <div>
                  <p className="text-xs text-gray-500 mb-1.5">Start</p>
                  <TimeInput value={checkOutStart} onChange={setCheckOutStart} />
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1.5">End</p>
                  <TimeInput value={checkOutEnd} onChange={setCheckOutEnd} />
                </div>
              </div>
            </div>

            {/* Weekly Off */}
            <div>
              <h3 className="text-sm font-bold text-gray-800 mb-3">Weekly Off</h3>
              <div className="flex items-center gap-8 flex-wrap">
                <Toggle checked={saturdayOff} onChange={setSaturdayOff} label="Saturday Off" />
                <Toggle checked={sundayOff}   onChange={setSundayOff}   label="Sunday Off"   />
              </div>
            </div>
          </div>
        )}

        {/* ── CUSTOM MODE ───────────────────────────────────── */}
        {mode === 'Custom' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-gray-900">Day-wise Schedule</h2>
              <span className="text-xs text-gray-400">Configure each day individually</span>
            </div>

            <div className="rounded-xl border border-gray-200 overflow-hidden">
              {/* Table header */}
              <div className="grid grid-cols-4 gap-0 bg-gray-900 text-white">
                {['Day', 'Start Time', 'End Time', 'Week Off'].map(h => (
                  <div key={h} className="px-4 py-3.5 text-xs font-semibold text-center first:text-left">{h}</div>
                ))}
              </div>

              {/* Day rows */}
              <table className="w-full">
                <tbody>
                  {days.map((d, idx) => (
                    <DayRow
                      key={d.day}
                      day={d.day}
                      startTime={d.startTime}
                      endTime={d.endTime}
                      weekOff={d.weekOff}
                      onStartTime={v => updateDay(idx, 'startTime', v)}
                      onEndTime={v   => updateDay(idx, 'endTime',   v)}
                      onWeekOff={v   => updateDay(idx, 'weekOff',   v)}
                    />
                  ))}
                </tbody>
              </table>
            </div>

            <p className="text-xs text-gray-400">
              <Info size={11} className="inline mr-1" />
              Days marked as "Week Off" will not count as working days. You can also configure per-day check-in/out windows after saving.
            </p>
          </div>
        )}
      </div>

      {/* ── Footer Actions ─────────────────────────────────── */}
      <div className="flex items-center justify-end gap-3 mt-6 pb-6">
        <button
          onClick={() => navigate('/shift')}
          className="px-6 py-2.5 rounded-xl border border-gray-300 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={handleSubmit}
          className="px-6 py-2.5 rounded-xl text-sm font-semibold text-white transition-colors"
          style={{ backgroundColor: PRIMARY }}
          onMouseEnter={e => e.currentTarget.style.backgroundColor = PRIMARY_DARK}
          onMouseLeave={e => e.currentTarget.style.backgroundColor = PRIMARY}
        >
          {isEdit ? 'Update Shift' : 'Add Shift'}
        </button>
        {isEdit && (
          <button
            onClick={handleView}
            className="px-6 py-2.5 rounded-xl text-sm font-semibold text-white transition-colors"
            style={{ backgroundColor: '#111827' }}
            onMouseEnter={e => e.currentTarget.style.backgroundColor = '#374151'}
            onMouseLeave={e => e.currentTarget.style.backgroundColor = '#111827'}
          >
            View
          </button>
        )}
      </div>
    </>
  )
}