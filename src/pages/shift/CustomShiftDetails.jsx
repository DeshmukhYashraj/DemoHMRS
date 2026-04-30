// src/pages/shift/CustomShiftDetails.jsx
import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, Clock, RotateCcw } from 'lucide-react'

const PRIMARY      = '#C35E33'
const PRIMARY_DARK = '#A34A24'

const ALL_DAYS = [
  { key: 'MON', label: 'Mon' },
  { key: 'TUE', label: 'Tue' },
  { key: 'WED', label: 'Wed' },
  { key: 'THU', label: 'Thu' },
  { key: 'FRI', label: 'Fri' },
  { key: 'SAT', label: 'Sat' },
  { key: 'SUN', label: 'Sun' },
]

const defaultSchedule = {
  MON: { startTime: '09:00', endTime: '18:00', checkInEarliest: '09:00', checkInLatest:  '06:30', checkOutEarliest: '09:00', checkOutLatest: '06:30', weekOff: false },
  TUE: { startTime: '09:00', endTime: '18:00', checkInEarliest: '09:00', checkInLatest:  '06:30', checkOutEarliest: '09:00', checkOutLatest: '06:30', weekOff: false },
  WED: { startTime: '09:00', endTime: '18:00', checkInEarliest: '09:00', checkInLatest:  '06:30', checkOutEarliest: '09:00', checkOutLatest: '06:30', weekOff: false },
  THU: { startTime: '09:00', endTime: '18:00', checkInEarliest: '09:00', checkInLatest:  '06:30', checkOutEarliest: '09:00', checkOutLatest: '06:30', weekOff: false },
  FRI: { startTime: '09:00', endTime: '18:00', checkInEarliest: '09:00', checkInLatest:  '06:30', checkOutEarliest: '09:00', checkOutLatest: '06:30', weekOff: false },
  SAT: { startTime: '09:00', endTime: '18:00', checkInEarliest: '09:00', checkInLatest:  '06:30', checkOutEarliest: '09:00', checkOutLatest: '06:30', weekOff: true  },
  SUN: { startTime: '09:00', endTime: '18:00', checkInEarliest: '09:00', checkInLatest:  '06:30', checkOutEarliest: '09:00', checkOutLatest: '06:30', weekOff: true  },
}

function TimeInput({ value, onChange, placeholder }) {
  return (
    <div className="relative">
      <input
        type="time"
        value={value}
        onChange={e => onChange?.(e.target.value)}
        placeholder={placeholder}
        className="w-full h-10 px-3 pr-9 text-sm text-gray-800 bg-white border border-gray-200 rounded-xl outline-none transition-colors"
        onFocus={e => (e.target.style.borderColor = PRIMARY)}
        onBlur={e  => (e.target.style.borderColor = '#E5E7EB')}
      />
      <Clock size={13} color="#9CA3AF" className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
    </div>
  )
}

function FieldLabel({ children }) {
  return <p className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide mb-1.5">{children}</p>
}

export default function CustomShiftDetails() {
  const navigate = useNavigate()
  const { id }   = useParams()

  const [selectedDay, setSelectedDay] = useState('MON')
  const [schedule,    setSchedule]    = useState(defaultSchedule)

  const updateDay = (day, key, val) => {
    setSchedule(prev => ({ ...prev, [day]: { ...prev[day], [key]: val } }))
  }

  const applyForAll = () => {
    const template = schedule[selectedDay]
    const updated  = {}
    ALL_DAYS.forEach(({ key }) => {
      updated[key] = { ...template }
    })
    setSchedule(updated)
  }

  const resetDay = () => {
    updateDay(selectedDay, 'startTime',       defaultSchedule[selectedDay].startTime)
    updateDay(selectedDay, 'endTime',         defaultSchedule[selectedDay].endTime)
    updateDay(selectedDay, 'checkInEarliest', defaultSchedule[selectedDay].checkInEarliest)
    updateDay(selectedDay, 'checkInLatest',   defaultSchedule[selectedDay].checkInLatest)
    updateDay(selectedDay, 'checkOutEarliest',defaultSchedule[selectedDay].checkOutEarliest)
    updateDay(selectedDay, 'checkOutLatest',  defaultSchedule[selectedDay].checkOutLatest)
    updateDay(selectedDay, 'weekOff',         defaultSchedule[selectedDay].weekOff)
  }

  const workingDays   = ALL_DAYS.filter(d => !schedule[d.key].weekOff)
  const weekOffDays   = ALL_DAYS.filter(d =>  schedule[d.key].weekOff)
  const selectedData  = schedule[selectedDay]

  const fmt = (t) => {
    if (!t) return '—'
    const [h, m] = t.split(':').map(Number)
    const ampm   = h >= 12 ? 'PM' : 'AM'
    const hh     = h > 12 ? h - 12 : h === 0 ? 12 : h
    return `${hh}:${m.toString().padStart(2,'0')}`
  }

  return (
    <>
      {/* ── Header ─────────────────────────────────────────── */}
      <div className="flex items-center gap-3 mb-5">
        <button
          onClick={() => navigate('/shift')}
          className="w-9 h-9 flex items-center justify-center rounded-xl border border-gray-200 text-gray-500 hover:bg-gray-50 transition-colors"
        >
          <ArrowLeft size={16} />
        </button>
        <div>
          <h1 className="text-xl font-bold text-gray-900 m-0">Custom Shift Details</h1>
          <p className="text-xs text-gray-400 mt-0.5">Configure timing for each day individually</p>
        </div>
      </div>

      {/* ── Two-column layout ──────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-4 items-start">

        {/* ── LEFT: Day-wise schedule ─── */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5">
          <div className="flex items-center justify-between mb-1">
            <div>
              <h2 className="text-sm font-bold text-gray-900">Day-wise schedule</h2>
              <p className="text-xs text-gray-400 mt-0.5">Click any day card to edit its timing. Toggle week off from the editor panel.</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-lg text-[11px] font-bold text-white" style={{ backgroundColor: '#111827' }}>Custom</span>
              <button
                onClick={applyForAll}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold text-white transition-colors"
                style={{ backgroundColor: PRIMARY }}
                onMouseEnter={e => e.currentTarget.style.backgroundColor = PRIMARY_DARK}
                onMouseLeave={e => e.currentTarget.style.backgroundColor = PRIMARY}
              >
                Apply for All
              </button>
            </div>
          </div>

          {/* Day selector cards */}
          <div className="grid grid-cols-7 gap-2 mt-4">
            {ALL_DAYS.map(({ key, label }) => {
              const d         = schedule[key]
              const isActive  = selectedDay === key
              const isWeekOff = d.weekOff

              return (
                <button
                  key={key}
                  onClick={() => setSelectedDay(key)}
                  className="flex flex-col items-center py-3 px-1 rounded-xl border-2 transition-all cursor-pointer"
                  style={{
                    borderColor:     isActive ? PRIMARY : (isWeekOff ? '#374151' : '#E5E7EB'),
                    backgroundColor: isWeekOff ? '#111827' : (isActive ? '#FDE8DD' : '#F9FAFB'),
                  }}
                >
                  <span className={`text-[11px] font-bold ${isWeekOff ? 'text-white' : isActive ? 'text-[#C35E33]' : 'text-gray-600'}`}>
                    {key}
                  </span>
                  {isWeekOff ? (
                    <span className="text-[9px] text-gray-400 mt-1">Week off</span>
                  ) : (
                    <>
                      <span className={`text-[9px] mt-1 ${isActive ? 'text-[#C35E33]' : 'text-gray-400'}`}>{fmt(d.startTime)}</span>
                      <span className={`text-[9px] ${isActive ? 'text-[#C35E33]' : 'text-gray-400'}`}>{fmt(d.endTime)}</span>
                    </>
                  )}
                </button>
              )
            })}
          </div>

          {/* Schedule summary */}
          <div className="mt-5 pt-5 border-t border-gray-100">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">Schedule Summary</p>
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">Working days</span>
                <span className="text-sm font-bold text-gray-900">{workingDays.length} days</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">Week offs</span>
                <div className="flex items-center gap-1">
                  {weekOffDays.map(d => (
                    <span key={d.key} className="px-2 py-0.5 rounded text-[10px] font-bold text-white" style={{ backgroundColor: '#374151' }}>{d.key}</span>
                  ))}
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">Working day chips</span>
                <div className="flex items-center gap-1">
                  {workingDays.map(d => (
                    <span key={d.key} className="px-2 py-0.5 rounded text-[10px] font-bold" style={{ color: PRIMARY, backgroundColor: '#FDE8DD' }}>{d.key}</span>
                  ))}
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">Typical hours</span>
                <span className="text-sm font-bold text-gray-900">
                  {fmt(schedule[workingDays[0]?.key]?.startTime)} — {fmt(schedule[workingDays[0]?.key]?.endTime)}
                </span>
              </div>
            </div>

            <button
              onClick={() => navigate('/shift')}
              className="mt-4 w-full py-2.5 rounded-xl text-sm font-semibold text-white transition-colors"
              style={{ backgroundColor: PRIMARY }}
              onMouseEnter={e => e.currentTarget.style.backgroundColor = PRIMARY_DARK}
              onMouseLeave={e => e.currentTarget.style.backgroundColor = PRIMARY}
            >
              Save &amp; continue
            </button>
          </div>
        </div>

        {/* ── RIGHT: Day editor ─── */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 space-y-4">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-bold text-gray-900">{ALL_DAYS.find(d=>d.key===selectedDay)?.label}</p>
              <p className="text-[11px] text-gray-400">{selectedData.weekOff ? 'Week off' : 'Working day'}</p>
            </div>
            {/* Working day toggle */}
            <button
              type="button"
              onClick={() => updateDay(selectedDay, 'weekOff', !selectedData.weekOff)}
              className="relative flex-shrink-0 rounded-full transition-colors duration-200"
              style={{ width: 40, height: 22, backgroundColor: !selectedData.weekOff ? '#3B82F6' : '#D1D5DB' }}
            >
              <span
                className="absolute top-0.5 left-0.5 bg-white rounded-full shadow-sm transition-transform duration-200"
                style={{ width: 18, height: 18, transform: !selectedData.weekOff ? 'translateX(18px)' : 'translateX(0)' }}
              />
            </button>
          </div>

          {!selectedData.weekOff && (
            <>
              {/* Start / End */}
              <div>
                <FieldLabel>Start time</FieldLabel>
                <TimeInput value={selectedData.startTime} onChange={v => updateDay(selectedDay, 'startTime', v)} />
              </div>
              <div>
                <FieldLabel>End time</FieldLabel>
                <TimeInput value={selectedData.endTime} onChange={v => updateDay(selectedDay, 'endTime', v)} />
              </div>

              {/* Check-in window */}
              <div>
                <FieldLabel>Check-in Window</FieldLabel>
                <p className="text-[10px] text-gray-400 mb-2">Earliest &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Latest</p>
                <div className="grid grid-cols-2 gap-2">
                  <TimeInput value={selectedData.checkInEarliest} onChange={v => updateDay(selectedDay, 'checkInEarliest', v)} />
                  <TimeInput value={selectedData.checkInLatest}   onChange={v => updateDay(selectedDay, 'checkInLatest',   v)} />
                </div>
              </div>

              {/* Check-out window */}
              <div>
                <FieldLabel>Check-out Window</FieldLabel>
                <p className="text-[10px] text-gray-400 mb-2">Earliest &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Latest</p>
                <div className="grid grid-cols-2 gap-2">
                  <TimeInput value={selectedData.checkOutEarliest} onChange={v => updateDay(selectedDay, 'checkOutEarliest', v)} />
                  <TimeInput value={selectedData.checkOutLatest}   onChange={v => updateDay(selectedDay, 'checkOutLatest',   v)} />
                </div>
              </div>
            </>
          )}

          {/* Mark as week off toggle */}
          <div className="pt-2 border-t border-gray-100">
            <button
              onClick={() => updateDay(selectedDay, 'weekOff', !selectedData.weekOff)}
              className="w-full flex items-center justify-between px-4 py-3 rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors"
            >
              <div>
                <p className="text-sm font-semibold text-gray-700 text-left">Mark as week off</p>
                <p className="text-[10px] text-gray-400 text-left">No attendance for this day</p>
              </div>
              <input type="checkbox" checked={selectedData.weekOff} onChange={() => {}} className="w-4 h-4 rounded" style={{ accentColor: PRIMARY }} />
            </button>
          </div>

          {/* Action buttons */}
          <div className="grid grid-cols-2 gap-2 pt-1">
            <button
              onClick={resetDay}
              className="flex items-center justify-center gap-2 py-2.5 rounded-xl border border-gray-300 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <RotateCcw size={13} />
              Reset
            </button>
            <button
              onClick={() => {}}
              className="py-2.5 rounded-xl text-sm font-semibold text-white transition-colors"
              style={{ backgroundColor: PRIMARY }}
              onMouseEnter={e => e.currentTarget.style.backgroundColor = PRIMARY_DARK}
              onMouseLeave={e => e.currentTarget.style.backgroundColor = PRIMARY}
            >
              Apply
            </button>
          </div>
        </div>
      </div>

      {/* ── Footer ──────────────────────────────────────────── */}
      <div className="flex items-center justify-end gap-3 mt-6 pb-6">
        <button
          onClick={() => {}}
          className="px-5 py-2.5 rounded-xl border border-gray-300 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
        >
          Deactivate
        </button>
        <button
          onClick={() => {}}
          className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-colors"
          style={{ backgroundColor: '#111827' }}
          onMouseEnter={e => e.currentTarget.style.backgroundColor = '#374151'}
          onMouseLeave={e => e.currentTarget.style.backgroundColor = '#111827'}
        >
          Delete shift
        </button>
        <button
          onClick={() => navigate('/shift')}
          className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-colors"
          style={{ backgroundColor: PRIMARY }}
          onMouseEnter={e => e.currentTarget.style.backgroundColor = PRIMARY_DARK}
          onMouseLeave={e => e.currentTarget.style.backgroundColor = PRIMARY}
        >
          Save Shift
        </button>
      </div>
    </>
  )
}