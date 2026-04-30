// src/pages/shift/EmployeeShiftView.jsx
import { useNavigate } from 'react-router-dom'
import {
  Sun, Clock, Coffee, CalendarDays, AlertCircle,
  ArrowRight, Info, Zap, History,
} from 'lucide-react'

const PRIMARY = '#C35E33'

// ── Mock data ─────────────────────────────────────────────────────────────────
const MY_SHIFT = {
  name:           'Morning Shift',
  type:           'Normal',
  shiftId:        '#SHIFT-0042',
  status:         'Active',
  startTime:      '09:00',
  endTime:        '18:00',
  checkInWindow:  { from: '08:30', to: '09:30' },
  checkOutWindow: { from: '17:30', to: '18:30' },
  gracePeriod:    10,
  lateMarkAfter:  15,
  lateMarkLimit:  3,
  minWorkHours:   8,
  overtimeAfter:  30,
  autoCheckout:   true,
  effectiveFrom:  'Jan 01, 2025',
  breaks: [
    { name: 'Lunch Break', duration: 60, paid: true  },
    { name: 'Tea Break',   duration: 15, paid: false },
  ],
  weekSchedule: [
    { day: 'MON', startTime: '09:00', endTime: '18:00', isOff: false },
    { day: 'TUE', startTime: '09:00', endTime: '18:00', isOff: false },
    { day: 'WED', startTime: '09:00', endTime: '18:00', isOff: false },
    { day: 'THU', startTime: '09:00', endTime: '18:00', isOff: false },
    { day: 'FRI', startTime: '09:00', endTime: '18:00', isOff: false },
    { day: 'SAT', startTime: null,    endTime: null,    isOff: true  },
    { day: 'SUN', startTime: null,    endTime: null,    isOff: true  },
  ],
}

const UPCOMING_CHANGE = {
  newShift:      'Afternoon Shift',
  effectiveDate: 'May 12, 2026',
  assignedBy:    'Admin - Mark',
}

// ── Helpers ───────────────────────────────────────────────────────────────────
const fmt12 = (t) => {
  if (!t) return '—'
  const [h, m] = t.split(':').map(Number)
  const ampm   = h >= 12 ? 'PM' : 'AM'
  const hh     = h > 12 ? h - 12 : h === 0 ? 12 : h
  return `${hh}:${m.toString().padStart(2, '0')} ${ampm}`
}

const todayDayIndex = new Date().getDay()
const dayIndexMap   = { 0: 6, 1: 0, 2: 1, 3: 2, 4: 3, 5: 4, 6: 5 }
const todayShiftIdx = dayIndexMap[todayDayIndex]

// ── Stat tile ─────────────────────────────────────────────────────────────────
function StatTile({ icon, label, value, sub, accent }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex items-start gap-3">
      <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
        style={{ backgroundColor: accent + '18' }}>
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-xl font-bold leading-none" style={{ color: accent }}>{value}</p>
        <p className="text-xs font-semibold text-gray-700 mt-1">{label}</p>
        {sub && <p className="text-[10px] text-gray-400 mt-0.5">{sub}</p>}
      </div>
    </div>
  )
}

function InfoRow({ label, value }) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-gray-50 last:border-0">
      <span className="text-sm text-gray-500">{label}</span>
      <span className="text-sm font-semibold" style={{ color: PRIMARY }}>{value}</span>
    </div>
  )
}

// ── Today progress ────────────────────────────────────────────────────────────
function TodayTimeline() {
  const now        = new Date()
  const nowMinutes = now.getHours() * 60 + now.getMinutes()
  const shiftStart = 9 * 60
  const shiftEnd   = 18 * 60
  const shiftTotal = shiftEnd - shiftStart
  const elapsed    = Math.max(0, Math.min(nowMinutes - shiftStart, shiftTotal))
  const pct        = (elapsed / shiftTotal) * 100
  const isInShift  = nowMinutes >= shiftStart && nowMinutes <= shiftEnd
  const shiftDone  = nowMinutes > shiftEnd
  const remaining  = shiftEnd - nowMinutes
  const remHrs     = Math.floor(remaining / 60)
  const remMins    = remaining % 60

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-sm font-bold text-gray-900">Today's Shift Progress</p>
          <p className="text-[11px] text-gray-400 mt-0.5">
            {isInShift ? 'Currently in shift' : shiftDone ? 'Shift completed' : 'Shift not started yet'}
          </p>
        </div>
        <div className="px-3 py-1.5 rounded-full text-xs font-bold"
          style={{
            backgroundColor: isInShift ? '#DCFCE7' : shiftDone ? '#F3F4F6' : '#FEF9C3',
            color:           isInShift ? '#15803D' : shiftDone ? '#6B7280' : '#854D0E',
          }}>
          {isInShift ? 'In Shift' : shiftDone ? 'Completed' : 'Not Started'}
        </div>
      </div>

      <div className="relative h-4 rounded-full overflow-hidden bg-gray-100 mb-1">
        <div className="absolute left-0 top-0 h-full rounded-full transition-all duration-500"
          style={{
            width: `${shiftDone ? 100 : pct}%`,
            backgroundColor: shiftDone ? '#22C55E' : isInShift ? PRIMARY : '#D1D5DB',
          }} />
      </div>
      <div className="flex justify-between text-[10px] text-gray-400 mb-5">
        <span>{fmt12('09:00')}</span>
        <span className="font-medium" style={{ color: PRIMARY }}>
          {isInShift
            ? `${remHrs}h ${remMins}m remaining`
            : shiftDone
            ? `Shift ended at ${fmt12('18:00')}`
            : `Starts at ${fmt12('09:00')}`}
        </span>
        <span>{fmt12('18:00')}</span>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-xl p-3.5 border border-gray-100 bg-green-50">
          <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">Check-in Window</p>
          <p className="text-sm font-bold text-green-700">{fmt12('08:30')} – {fmt12('09:30')}</p>
          <p className="text-[10px] text-gray-400 mt-0.5">Grace: 10 min after</p>
        </div>
        <div className="rounded-xl p-3.5 border border-gray-100 bg-red-50">
          <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">Check-out Window</p>
          <p className="text-sm font-bold text-red-600">{fmt12('17:30')} – {fmt12('18:30')}</p>
          <p className="text-[10px] text-gray-400 mt-0.5">Auto-checkout: {fmt12('18:30')}</p>
        </div>
      </div>
    </div>
  )
}

// ── Weekly schedule ───────────────────────────────────────────────────────────
function WeeklySchedule({ schedule }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm font-bold text-gray-900">Weekly Schedule</p>
        <span className="text-[11px] text-gray-400 px-2.5 py-1 bg-gray-50 rounded-full border border-gray-100">
          {schedule.filter(d => !d.isOff).length} working days
        </span>
      </div>
      <div className="grid grid-cols-7 gap-1.5">
        {schedule.map((d, idx) => {
          const isToday = idx === todayShiftIdx
          return (
            <div key={d.day}
              className="flex flex-col items-center rounded-xl py-3 px-1 border-2 transition-all"
              style={{
                borderColor:     isToday ? PRIMARY : d.isOff ? '#E5E7EB' : '#F3F4F6',
                backgroundColor: d.isOff ? '#F9FAFB' : isToday ? '#FDE8DD' : '#fff',
              }}>
              <span className="text-[10px] font-bold uppercase tracking-wider"
                style={{ color: isToday ? PRIMARY : d.isOff ? '#9CA3AF' : '#6B7280' }}>
                {d.day}
              </span>
              {isToday && <span className="w-1.5 h-1.5 rounded-full mt-1" style={{ backgroundColor: PRIMARY }} />}
              {d.isOff ? (
                <span className="text-[9px] text-gray-400 mt-2 font-medium">Off</span>
              ) : (
                <>
                  <span className="text-[9px] font-semibold mt-1.5" style={{ color: isToday ? PRIMARY : '#374151' }}>
                    {fmt12(d.startTime).replace(' AM','').replace(' PM','')}
                  </span>
                  <span className="text-[8px] text-gray-400">to</span>
                  <span className="text-[9px] font-semibold" style={{ color: isToday ? PRIMARY : '#374151' }}>
                    {fmt12(d.endTime).replace(' AM','').replace(' PM','')}
                  </span>
                  <span className="text-[8px] text-gray-400 mt-0.5">{isToday ? 'Today' : '8 hrs'}</span>
                </>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ── Main ──────────────────────────────────────────────────────────────────────
export default function EmployeeShiftView() {
  const navigate      = useNavigate()
  const shift         = MY_SHIFT
  const weekOffDays   = shift.weekSchedule.filter(d => d.isOff)
  const totalBreakMin = shift.breaks.reduce((s, b) => s + b.duration, 0)

  return (
    <>
      {/* Header */}
      <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
        <div>
          <h1 className="text-xl font-bold text-gray-900">My Shift</h1>
          <p className="text-xs text-gray-400 mt-0.5">Your current shift schedule and timing details</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 bg-white shadow-sm">
            <div className="w-2 h-2 rounded-full bg-green-500" />
            <span className="text-sm font-semibold text-gray-800">{shift.name}</span>
            <span className="px-2 py-0.5 rounded-lg text-[10px] font-bold text-white" style={{ backgroundColor: PRIMARY }}>
              {shift.type}
            </span>
            <span className="text-[10px] font-medium text-gray-400 hidden sm:inline">{shift.shiftId}</span>
          </div>
          <button
            onClick={() => navigate('/my-shift/history')}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white transition-colors"
            style={{ backgroundColor: '#111827' }}
            onMouseEnter={e => e.currentTarget.style.backgroundColor = '#374151'}
            onMouseLeave={e => e.currentTarget.style.backgroundColor = '#111827'}
          >
            <History size={14} strokeWidth={2} />
            Shift History
          </button>
        </div>
      </div>

      {/* Upcoming change notice */}
      <div className="flex items-start gap-3 p-4 rounded-2xl border mb-5"
        style={{ borderColor: '#FDE68A', backgroundColor: '#FFFBEB' }}>
        <AlertCircle size={16} color="#854D0E" className="flex-shrink-0 mt-0.5" />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-yellow-800">Upcoming Shift Change</p>
          <p className="text-xs text-yellow-700 mt-0.5">
            You will be moved to <strong>{UPCOMING_CHANGE.newShift}</strong> effective{' '}
            <strong>{UPCOMING_CHANGE.effectiveDate}</strong>. Assigned by {UPCOMING_CHANGE.assignedBy}.
          </p>
        </div>
        <ArrowRight size={14} color="#854D0E" className="flex-shrink-0 mt-0.5" />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
        <StatTile icon={<Clock size={18} color={PRIMARY} />}         label="Shift Duration"  value={`${shift.minWorkHours}h`}                                           sub="Minimum required"         accent={PRIMARY}   />
        <StatTile icon={<CalendarDays size={18} color="#1D4ED8" />}  label="Working Days"    value={`${shift.weekSchedule.filter(d=>!d.isOff).length} days`}            sub={`Off: ${weekOffDays.map(d=>d.day).join(', ')}`} accent="#1D4ED8"   />
        <StatTile icon={<Coffee size={18} color="#7C3AED" />}        label="Total Break"     value={`${totalBreakMin} min`}                                              sub={`${shift.breaks.length} break types`}         accent="#7C3AED"   />
        <StatTile icon={<Zap size={18} color="#15803D" />}           label="Grace Period"    value={`${shift.gracePeriod} min`}                                         sub="Late mark after 15 min"   accent="#15803D"  />
      </div>

      {/* ── Two-col layout ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

        {/* Left: Timeline + Weekly */}
        <div className="lg:col-span-2 space-y-4">
          <TodayTimeline />
          <WeeklySchedule schedule={shift.weekSchedule} />
        </div>

        {/* Right: Shift detail card + Break Policies */}
        <div className="space-y-4">

          {/* Shift detail */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-5 py-4" style={{ backgroundColor: PRIMARY }}>
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-white flex items-center justify-center">
                  <Sun size={16} color={PRIMARY} />
                </div>
                <div>
                  <p className="text-sm font-bold text-white">{shift.name}</p>
                  <p className="text-[10px] text-orange-200">{shift.shiftId} · Since {shift.effectiveFrom}</p>
                </div>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-2">
                <div className="bg-white bg-opacity-15 rounded-xl p-3">
                  <p className="text-[9px] text-orange-200 uppercase font-bold tracking-wider">Start</p>
                  <p className="text-xl font-bold text-white mt-0.5">{fmt12(shift.startTime)}</p>
                </div>
                <div className="bg-white bg-opacity-15 rounded-xl p-3">
                  <p className="text-[9px] text-orange-200 uppercase font-bold tracking-wider">End</p>
                  <p className="text-xl font-bold text-white mt-0.5">{fmt12(shift.endTime)}</p>
                </div>
              </div>
            </div>
            <div className="px-5 pb-2">
              <InfoRow label="Check-in window"  value={`${fmt12(shift.checkInWindow.from)} – ${fmt12(shift.checkInWindow.to)}`} />
              <InfoRow label="Check-out window" value={`${fmt12(shift.checkOutWindow.from)} – ${fmt12(shift.checkOutWindow.to)}`} />
              <InfoRow label="Grace period"     value={`${shift.gracePeriod} min`} />
              <InfoRow label="Late mark after"  value={`${shift.lateMarkAfter} min`} />
              <InfoRow label="Late mark limit"  value={`${shift.lateMarkLimit} times`} />
              <InfoRow label="Min work hours"   value={`${shift.minWorkHours} hrs`} />
              <div className="flex items-center justify-between py-3 border-b border-gray-50">
                <span className="text-sm text-gray-500">Overtime</span>
                <span className="px-2.5 py-1 rounded-full text-[10px] font-bold text-white" style={{ backgroundColor: '#111827' }}>
                  After {shift.overtimeAfter} min
                </span>
              </div>
              <div className="flex items-center justify-between py-3">
                <span className="text-sm text-gray-500">Auto checkout</span>
                <span className="px-2.5 py-1 rounded-full text-[10px] font-bold text-white" style={{ backgroundColor: PRIMARY }}>
                  {shift.autoCheckout ? 'Enabled' : 'Disabled'}
                </span>
              </div>
            </div>
          </div>

          {/* Break Policies — in the same right column, directly below */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <div className="flex items-center gap-2 mb-4">
              <Coffee size={15} color={PRIMARY} />
              <p className="text-sm font-bold text-gray-900">Break Policies</p>
            </div>
            <div className="space-y-2.5">
              {shift.breaks.map(b => (
                <div key={b.name}
                  className="flex items-center justify-between px-4 py-3 rounded-xl"
                  style={{ backgroundColor: b.paid ? PRIMARY : '#111827' }}>
                  <div className="flex items-center gap-2.5">
                    <Coffee size={14} color="rgba(255,255,255,0.7)" />
                    <span className="text-sm font-semibold text-white">{b.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-orange-200">{b.duration} min</span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold"
                      style={{
                        backgroundColor: b.paid ? '#111827' : '#fff',
                        color:           b.paid ? '#fff'    : '#111827',
                      }}>
                      {b.paid ? 'Paid' : 'Unpaid'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-3 flex items-start gap-2 p-3 bg-gray-50 rounded-xl border border-gray-100">
              <Info size={12} color="#9CA3AF" className="flex-shrink-0 mt-0.5" />
              <p className="text-[10px] text-gray-400 leading-relaxed">
                Unpaid breaks are deducted from total work hours. Paid breaks count toward minimum required hours.
              </p>
            </div>
          </div>

        </div>
      </div>
    </>
  )
}