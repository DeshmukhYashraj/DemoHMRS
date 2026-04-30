// src/pages/attendance/EmployeeAttendance.jsx
import { useState, useEffect, useCallback, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  LogIn, LogOut, Coffee, Play, Clock, CalendarDays,
  TrendingUp, AlertTriangle, History, CheckCircle2,
  Timer, Wifi, ChevronRight, Activity, Zap, Sun,
} from 'lucide-react'
import { useToast } from '@/components/shared/toast/ToastProvider'
import { ROUTES } from '@/constants/routes'

const PRIMARY      = '#C35E33'
const PRIMARY_DARK = '#A34A24'
const PRIMARY_LIGHT = '#FDE8DD'

const SHIFT = {
  name:      'Morning Shift',
  start:     '09:00',
  end:       '18:00',
  grace:     10,
  lateAfter: 15,
}

const WEEK_SUMMARY = [
  { day: 'Mon', date: '28', status: 'present',  hours: '8h 02m', late: false },
  { day: 'Tue', date: '29', status: 'present',  hours: '7h 55m', late: true  },
  { day: 'Wed', date: '30', status: 'today',    hours: null,      late: false },
  { day: 'Thu', date: '01', status: 'upcoming', hours: null,      late: false },
  { day: 'Fri', date: '02', status: 'upcoming', hours: null,      late: false },
]

const RECENT = [
  { date: 'Apr 29', checkIn: '09:12', checkOut: '18:05', hours: '7h 55m', status: 'PRESENT',  late: true  },
  { date: 'Apr 28', checkIn: '09:02', checkOut: '18:10', hours: '8h 02m', status: 'PRESENT',  late: false },
  { date: 'Apr 25', checkIn: '09:30', checkOut: '18:30', hours: '8h 00m', status: 'PRESENT',  late: false },
  { date: 'Apr 24', checkIn: null,    checkOut: null,    hours: '—',       status: 'ABSENT',   late: false },
  { date: 'Apr 23', checkIn: '11:15', checkOut: '18:30', hours: '6h 15m', status: 'HALF_DAY', late: true  },
]

const toMin = (t) => { const [h, m] = t.split(':').map(Number); return h * 60 + m }

const fmt12 = (t) => {
  if (!t) return '—'
  const [h, m] = t.split(':').map(Number)
  const ampm = h >= 12 ? 'PM' : 'AM'
  const hh = h > 12 ? h - 12 : h === 0 ? 12 : h
  return `${hh}:${m.toString().padStart(2, '0')} ${ampm}`
}

const fmtTimer = (secs) => {
  const h = Math.floor(secs / 3600)
  const m = Math.floor((secs % 3600) / 60)
  const s = secs % 60
  return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
}

const nowHHMM   = () => { const n = new Date(); return `${n.getHours().toString().padStart(2,'0')}:${n.getMinutes().toString().padStart(2,'0')}` }
const nowHHMMSS = () => { const n = new Date(); return `${n.getHours().toString().padStart(2,'0')}:${n.getMinutes().toString().padStart(2,'0')}:${n.getSeconds().toString().padStart(2,'0')}` }

const STATUS_BADGE = {
  PRESENT:  { bg: '#DCFCE7', color: '#15803D', label: 'Present'  },
  ABSENT:   { bg: '#FEE2E2', color: '#B91C1C', label: 'Absent'   },
  HALF_DAY: { bg: '#FEF9C3', color: '#854D0E', label: 'Half Day' },
  ON_LEAVE: { bg: '#DBEAFE', color: '#1D4ED8', label: 'On Leave' },
}

// Action Card
function ActionCard({ title, icon: Icon, iconColor, timerSecs, timerBg, buttonLabel, buttonBg, buttonDisabled, onAction, active, pulse, accentColor }) {
  return (
    <div
      className="relative bg-white rounded-2xl flex flex-col gap-3 p-4 overflow-hidden transition-all duration-300"
      style={{
        border: `2px solid ${active ? iconColor + '40' : '#F1F5F9'}`,
        boxShadow: active ? `0 8px 32px ${iconColor}20` : '0 1px 3px rgba(0,0,0,0.06)',
      }}
    >
      {/* Decorative corner glow */}
      {active && (
        <div className="absolute -top-4 -right-4 w-16 h-16 rounded-full opacity-10"
          style={{ backgroundColor: iconColor, filter: 'blur(12px)' }} />
      )}

      {/* Header */}
      <div className="flex items-center justify-between relative z-10">
        <span className="text-[13px] font-bold text-gray-800 tracking-tight">{title}</span>
        <div className="w-9 h-9 rounded-xl flex items-center justify-center transition-all"
          style={{ backgroundColor: active ? iconColor + '18' : '#F8FAFC' }}>
          <Icon size={16} color={active ? iconColor : '#94A3B8'} strokeWidth={2} />
        </div>
      </div>

      {/* Timer */}
      <div className="relative flex items-center justify-center rounded-xl py-3 px-3 overflow-hidden"
        style={{ backgroundColor: active ? timerBg : '#0F172A' }}>
        {pulse && (
          <div className="absolute inset-0 opacity-20 animate-pulse rounded-xl" style={{ backgroundColor: timerBg }} />
        )}
        <span className="font-mono text-xl font-bold tracking-widest text-white relative z-10">
          {fmtTimer(timerSecs)}
        </span>
        {active && (
          <div className="absolute right-3 w-2 h-2 rounded-full bg-white animate-pulse opacity-60" />
        )}
      </div>

      {/* Button */}
      <button
        onClick={onAction}
        disabled={buttonDisabled}
        className="w-full py-2.5 rounded-xl text-[13px] font-bold transition-all duration-200 disabled:opacity-35 disabled:cursor-not-allowed"
        style={{
          backgroundColor: buttonDisabled ? '#F1F5F9' : buttonBg,
          color: buttonDisabled ? '#94A3B8' : '#fff',
          boxShadow: buttonDisabled ? 'none' : `0 4px 12px ${buttonBg}40`,
        }}
        onMouseEnter={e => { if (!buttonDisabled) { e.currentTarget.style.filter = 'brightness(0.9)'; e.currentTarget.style.transform = 'translateY(-1px)' } }}
        onMouseLeave={e => { e.currentTarget.style.filter = 'none'; e.currentTarget.style.transform = 'none' }}
      >
        {buttonLabel}
      </button>
    </div>
  )
}

// Timeline
function TodayTimeline({ clockInTime, clockOutTime, breakPeriods, shiftStart, shiftEnd }) {
  const start = toMin(shiftStart)
  const end   = toMin(shiftEnd)
  const total = end - start
  const pct   = (v) => `${Math.max(0, Math.min(100, ((v - start) / total) * 100)).toFixed(2)}%`
  const pctW  = (v) => `${Math.max(0, Math.min(100, (v / total) * 100)).toFixed(2)}%`
  const nowMin = toMin(nowHHMM())
  const nowPct = pct(nowMin)

  if (!clockInTime) {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 p-5" style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm font-bold text-gray-900">Today's Timeline</p>
          <span className="text-[11px] text-gray-400 bg-gray-50 px-2.5 py-1 rounded-lg border border-gray-100">Not started</span>
        </div>
        <div className="relative h-9 rounded-xl bg-gray-100 overflow-hidden mb-2.5">
          <div className="absolute left-0 top-0 h-full rounded-l-xl opacity-40" style={{ width: pctW(SHIFT.grace), backgroundColor: '#FCD34D' }} />
          <div className="absolute top-0 bottom-0 w-0.5 bg-blue-400 opacity-60" style={{ left: nowPct }} />
          {/* Stripes overlay */}
          <div className="absolute inset-0 opacity-5"
            style={{ backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 4px, #000 4px, #000 5px)' }} />
        </div>
        <div className="flex justify-between text-[11px]">
          <span className="text-gray-400 font-medium">{fmt12(shiftStart)}</span>
          <span className="font-semibold text-blue-500 flex items-center gap-1"><div className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />Clock in to begin</span>
          <span className="text-gray-400 font-medium">{fmt12(shiftEnd)}</span>
        </div>
      </div>
    )
  }

  const inMin  = toMin(clockInTime.slice(0, 5))
  const outMin = clockOutTime ? toMin(clockOutTime.slice(0, 5)) : nowMin

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5" style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm font-bold text-gray-900">Today's Timeline</p>
        <div className="flex items-center gap-3 text-[10px]">
          {[['#22C55E', 'Work'], ['#FCA5A5', 'Break'], ['#FCD34D', 'Grace'], ['#60A5FA', 'Now']].map(([c, l]) => (
            <span key={l} className="flex items-center gap-1 text-gray-500">
              <span className="w-2 h-2 rounded-sm inline-block" style={{ backgroundColor: c }} />{l}
            </span>
          ))}
        </div>
      </div>

      <div className="relative h-9 rounded-xl bg-gray-100 overflow-visible mb-3">
        <div className="absolute top-0 h-full rounded-l-xl opacity-40" style={{ left: pct(start), width: pctW(SHIFT.grace), backgroundColor: '#FCD34D' }} />
        <div className="absolute top-0 h-full rounded-xl" style={{ left: pct(inMin), width: pctW(outMin - inMin), backgroundColor: '#22C55E', opacity: 0.85 }} />
        {breakPeriods.map((bp, i) => {
          const bStart = toMin(bp.start.slice(0, 5))
          const bEnd   = bp.end ? toMin(bp.end.slice(0, 5)) : nowMin
          return <div key={i} className="absolute top-0 h-full" style={{ left: pct(bStart), width: pctW(bEnd - bStart), backgroundColor: '#FCA5A5', zIndex: 2 }} />
        })}
        {!clockOutTime && <div className="absolute top-[-5px] bottom-[-5px] w-0.5 rounded-full bg-blue-400 shadow-sm" style={{ left: nowPct, zIndex: 10 }} />}
        <div className="absolute top-[-7px] w-3.5 h-3.5 rounded-full bg-green-500 border-2 border-white shadow" style={{ left: `calc(${pct(inMin)} - 7px)`, zIndex: 5 }} />
        {clockOutTime && <div className="absolute top-[-7px] w-3.5 h-3.5 rounded-full bg-red-500 border-2 border-white shadow" style={{ left: `calc(${pct(toMin(clockOutTime.slice(0, 5)))} - 7px)`, zIndex: 5 }} />}
      </div>

      <div className="flex justify-between text-[10px] text-gray-400">
        <span className="font-medium">{fmt12(shiftStart)}</span>
        <div className="flex gap-3">
          <span className="text-green-600 font-bold">In: {fmt12(clockInTime.slice(0, 5))}</span>
          {clockOutTime && <span className="text-red-500 font-bold">Out: {fmt12(clockOutTime.slice(0, 5))}</span>}
        </div>
        <span className="font-medium">{fmt12(shiftEnd)}</span>
      </div>
    </div>
  )
}

// ─── Week Calendar ────────────────────────────────────────────────────────────
function WeekCalendar({ summary }) {
  const styles = {
    present:  { bg: '#F0FDF4', border: '#BBF7D0', color: '#15803D', dot: '#22C55E'  },
    today:    { bg: PRIMARY_LIGHT, border: PRIMARY + '60', color: PRIMARY, dot: PRIMARY },
    upcoming: { bg: '#F8FAFC', border: '#E2E8F0',  color: '#94A3B8', dot: '#CBD5E1' },
    absent:   { bg: '#FFF5F5', border: '#FED7D7',  color: '#B91C1C', dot: '#EF4444' },
  }
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-4" style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
      <p className="text-xs font-bold text-gray-700 mb-3 tracking-wide">This Week</p>
      <div className="flex gap-2">
        {summary.map((d) => {
          const s = styles[d.status] || styles.upcoming
          return (
            <div key={d.day} className="flex-1 flex flex-col items-center rounded-xl py-3 transition-all"
              style={{ backgroundColor: s.bg, border: `1.5px solid ${s.border}` }}>
              <span className="text-[9px] font-bold uppercase tracking-widest" style={{ color: s.color }}>{d.day}</span>
              <span className="text-base font-bold mt-0.5" style={{ color: s.color }}>{d.date}</span>
              <div className="w-1.5 h-1.5 rounded-full mt-1.5" style={{ backgroundColor: s.dot }} />
              {d.hours && <span className="text-[8px] mt-1 font-semibold" style={{ color: s.color }}>{d.hours}</span>}
              {d.late && <span className="text-[7px] mt-0.5 font-bold px-1 py-0.5 rounded" style={{ backgroundColor: PRIMARY + '20', color: PRIMARY }}>Late</span>}
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function EmployeeAttendance() {
  const navigate  = useNavigate()
  const { toast } = useToast()

  const [attState,       setAttState]       = useState('idle')
  const [clockInTime,    setClockInTime]    = useState(null)
  const [clockOutTime,   setClockOutTime]   = useState(null)
  const [breakPeriods,   setBreakPeriods]   = useState([])
  const [workSecs,       setWorkSecs]       = useState(0)
  const [breakSecs,      setBreakSecs]      = useState(0)
  const [totalBreakSecs, setTotalBreakSecs] = useState(0)
  const intervalRef = useRef(null)

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      if (attState === 'clocked_in') setWorkSecs(s => s + 1)
      if (attState === 'on_break')   setBreakSecs(s => s + 1)
    }, 1000)
    return () => clearInterval(intervalRef.current)
  }, [attState])

  const handleClockIn = useCallback(() => {
    const now = nowHHMMSS()
    const nowM = toMin(now.slice(0, 5))
    const isLate = nowM > toMin(SHIFT.start) + SHIFT.lateAfter
    setClockInTime(now); setAttState('clocked_in'); setWorkSecs(0)
    isLate ? toast.warning(`You clocked in ${nowM - toMin(SHIFT.start)} minutes after shift start.`, 'Late Check-In') : toast.success(`Clocked in at ${fmt12(now.slice(0, 5))}. Have a great day!`, 'Clock In')
  }, [toast])

  const handleBreakIn = useCallback(() => {
    const now = nowHHMMSS()
    setAttState('on_break'); setBreakSecs(0)
    setBreakPeriods(prev => [...prev, { start: now, end: null }])
    toast.info(`Break started at ${fmt12(now.slice(0, 5))}.`, 'Break Started')
  }, [toast])

  const handleBreakOut = useCallback(() => {
    const now = nowHHMMSS()
    setAttState('clocked_in'); setTotalBreakSecs(s => s + breakSecs)
    setBreakPeriods(prev => { const u = [...prev]; u[u.length - 1] = { ...u[u.length - 1], end: now }; return u })
    toast.info(`Break ended. Duration: ${fmtTimer(breakSecs)}.`, 'Break Over')
    setBreakSecs(0)
  }, [toast, breakSecs])

  const handleClockOut = useCallback(() => {
    const now = nowHHMMSS()
    const otMins = Math.max(0, toMin(now.slice(0, 5)) - toMin(SHIFT.end))
    setClockOutTime(now); setAttState('clocked_out'); clearInterval(intervalRef.current)
    const workH = Math.floor(workSecs / 3600), workM = Math.floor((workSecs % 3600) / 60)
    otMins > 0
      ? toast.custom({ type: 'success', title: 'Clocked Out — Overtime!', message: `Work: ${workH}h ${workM}m · OT: ${otMins} min`, duration: 6000 })
      : toast.success(`Work time: ${workH}h ${workM}m. See you tomorrow!`, 'Clocked Out')
  }, [toast, workSecs])

  const nowMin      = toMin(nowHHMM())
  const minutesLeft = attState === 'clocked_in' ? Math.max(0, toMin(SHIFT.end) - nowMin) : 0
  const totalBreakMin = Math.floor(totalBreakSecs / 60)
  const workHrsDisplay = `${Math.floor(workSecs / 3600)}h ${Math.floor((workSecs % 3600) / 60)}m`

  const statusMeta = {
    idle:        { text: 'Not Clocked In', color: '#64748B', bg: '#F1F5F9', dot: '#94A3B8' },
    clocked_in:  { text: 'Working',        color: '#15803D', bg: '#DCFCE7', dot: '#22C55E' },
    on_break:    { text: 'On Break',       color: PRIMARY,   bg: PRIMARY_LIGHT, dot: PRIMARY },
    clocked_out: { text: 'Day Complete',   color: '#1D4ED8', bg: '#DBEAFE', dot: '#3B82F6' },
  }[attState]

  const cards = [
    { title: 'Clock-In',  icon: LogIn,  iconColor: '#22C55E', timerSecs: workSecs,   timerBg: '#0F172A', buttonLabel: 'Clock In',   buttonBg: '#22C55E', buttonDisabled: attState !== 'idle',       onAction: handleClockIn,  active: attState === 'idle',       pulse: false },
    { title: 'Break-In',  icon: Coffee, iconColor: PRIMARY,   timerSecs: attState === 'on_break' ? breakSecs : totalBreakSecs, timerBg: PRIMARY, buttonLabel: 'Start Break', buttonBg: PRIMARY, buttonDisabled: attState !== 'clocked_in', onAction: handleBreakIn,  active: attState === 'clocked_in', pulse: false },
    { title: 'Break-Out', icon: Play,   iconColor: '#64748B', timerSecs: attState === 'on_break' ? breakSecs : 0, timerBg: attState === 'on_break' ? '#1E293B' : '#94A3B8', buttonLabel: 'End Break', buttonBg: '#1E293B', buttonDisabled: attState !== 'on_break', onAction: handleBreakOut, active: attState === 'on_break',   pulse: attState === 'on_break' },
    { title: 'Clock-Out', icon: LogOut, iconColor: '#0F172A', timerSecs: workSecs,   timerBg: attState === 'clocked_out' ? '#22C55E' : '#0F172A', buttonLabel: 'Clock Out', buttonBg: '#0F172A', buttonDisabled: attState !== 'clocked_in', onAction: handleClockOut, active: attState === 'clocked_in', pulse: false },
  ]

  const stats = [
    { icon: <Activity size={16} color={PRIMARY} />, bg: PRIMARY_LIGHT, label: 'Work Time',   value: attState === 'idle' ? '—' : workHrsDisplay,                                         color: PRIMARY    },
    { icon: <Coffee size={16} color="#7C3AED" />,   bg: '#F5F3FF',     label: 'Break Taken', value: totalBreakMin > 0 ? `${totalBreakMin} min` : '—',                                   color: '#7C3AED'  },
    { icon: <Timer size={16} color="#0EA5E9" />,    bg: '#E0F2FE',     label: 'Time Left',   value: attState === 'clocked_in' ? `${Math.floor(minutesLeft/60)}h ${minutesLeft%60}m` : '—', color: '#0284C7'  },
    { icon: <CheckCircle2 size={16} color="#15803D" />, bg: '#DCFCE7', label: 'Clock-Out',   value: clockOutTime ? fmt12(clockOutTime.slice(0, 5)) : '—',                               color: '#15803D'  },
  ]

  return (
    <>
      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <div className="flex items-start justify-between mb-5 flex-wrap gap-3">
        <div>
          <div className="flex items-center gap-2.5 mb-0.5">
            <h1 className="text-xl font-bold text-gray-900">My Attendance</h1>
            {/* Live status pill */}
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-semibold"
              style={{ backgroundColor: statusMeta.bg, color: statusMeta.color }}>
              <div className={`w-1.5 h-1.5 rounded-full ${attState === 'clocked_in' ? 'animate-pulse' : ''}`}
                style={{ backgroundColor: statusMeta.dot }} />
              {statusMeta.text}
            </div>
          </div>
          <p className="text-xs text-gray-400">
            {new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Shift badge */}
          <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl border border-gray-200 bg-white text-xs"
            style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
            <div className="w-6 h-6 rounded-lg flex items-center justify-center" style={{ backgroundColor: PRIMARY_LIGHT }}>
              <Clock size={12} color={PRIMARY} />
            </div>
            <span className="font-semibold text-gray-700">{SHIFT.name}</span>
            <span className="text-gray-400">{fmt12(SHIFT.start)} – {fmt12(SHIFT.end)}</span>
          </div>
          {/* History button */}
          <button
            onClick={() => navigate(ROUTES.ATTENDANCE_EMPLOYEE_HISTORY)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-[13px] font-semibold text-white transition-all"
            style={{ backgroundColor: '#0F172A', boxShadow: '0 2px 8px rgba(15,23,42,0.25)' }}
            onMouseEnter={e => e.currentTarget.style.backgroundColor = '#1E293B'}
            onMouseLeave={e => e.currentTarget.style.backgroundColor = '#0F172A'}
          >
            <History size={14} strokeWidth={2} />
            History
          </button>
        </div>
      </div>

      {/* ── 4 Action Cards ─────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
        {cards.map(c => <ActionCard key={c.title} {...c} />)}
      </div>

      {/* ── Stats Row ──────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
        {stats.map(s => (
          <div key={s.label} className="bg-white rounded-2xl border border-gray-100 p-4 flex items-center gap-3"
            style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
            <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: s.bg }}>
              {s.icon}
            </div>
            <div>
              <p className="text-lg font-bold leading-none" style={{ color: s.color }}>{s.value}</p>
              <p className="text-[11px] text-gray-500 mt-0.5 font-medium">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ── Two-column layout ──────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

        {/* LEFT ── */}
        <div className="lg:col-span-2 space-y-4">
          <TodayTimeline clockInTime={clockInTime} clockOutTime={clockOutTime} breakPeriods={breakPeriods} shiftStart={SHIFT.start} shiftEnd={SHIFT.end} />
          <WeekCalendar summary={WEEK_SUMMARY} />

          {/* Session log */}
          {(clockInTime || breakPeriods.length > 0) && (
            <div className="bg-white rounded-2xl border border-gray-100 p-5" style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
              <p className="text-sm font-bold text-gray-900 mb-3">Today's Session Log</p>
              <div className="space-y-2">
                {clockInTime && (
                  <div className="flex items-center gap-3 py-2.5 px-3.5 rounded-xl bg-green-50 border border-green-100">
                    <div className="w-2 h-2 rounded-full bg-green-500 flex-shrink-0" />
                    <span className="text-xs font-semibold text-green-700">Clock In</span>
                    <span className="text-xs text-gray-400 ml-auto">{fmt12(clockInTime.slice(0, 5))}</span>
                  </div>
                )}
                {breakPeriods.map((bp, i) => (
                  <div key={i}>
                    <div className="flex items-center gap-3 py-2.5 px-3.5 rounded-xl border" style={{ backgroundColor: PRIMARY_LIGHT, borderColor: PRIMARY + '30' }}>
                      <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: PRIMARY }} />
                      <span className="text-xs font-semibold" style={{ color: PRIMARY }}>Break {i + 1} Start</span>
                      <span className="text-xs text-gray-400 ml-auto">{fmt12(bp.start.slice(0, 5))}</span>
                    </div>
                    {bp.end && (
                      <div className="flex items-center gap-3 py-2.5 px-3.5 rounded-xl bg-gray-50 border border-gray-100 mt-2">
                        <div className="w-2 h-2 rounded-full bg-gray-400 flex-shrink-0" />
                        <span className="text-xs font-semibold text-gray-600">Break {i + 1} End</span>
                        <span className="text-xs text-gray-400 ml-auto">{fmt12(bp.end.slice(0, 5))}</span>
                      </div>
                    )}
                  </div>
                ))}
                {clockOutTime && (
                  <div className="flex items-center gap-3 py-2.5 px-3.5 rounded-xl bg-red-50 border border-red-100">
                    <div className="w-2 h-2 rounded-full bg-red-500 flex-shrink-0" />
                    <span className="text-xs font-semibold text-red-600">Clock Out</span>
                    <span className="text-xs text-gray-400 ml-auto">{fmt12(clockOutTime.slice(0, 5))}</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* RIGHT ── */}
        <div className="space-y-4">

          {/* Today's shift card */}
          <div className="rounded-2xl overflow-hidden border border-gray-100" style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
            <div className="px-5 py-4 relative overflow-hidden" style={{ backgroundColor: PRIMARY }}>
              {/* Decorative */}
              <div className="absolute -top-6 -right-6 w-24 h-24 rounded-full opacity-10 bg-white" />
              <div className="absolute bottom-0 right-8 w-16 h-16 rounded-full opacity-10 bg-white" />
              <p className="text-[10px] text-orange-200 font-bold uppercase tracking-widest mb-1 relative z-10">Today's Shift</p>
              <p className="text-base font-bold text-white relative z-10">{SHIFT.name}</p>
              <div className="mt-3 grid grid-cols-2 gap-2 relative z-10">
                <div className="rounded-xl p-3" style={{ backgroundColor: 'rgba(255,255,255,0.15)' }}>
                  <p className="text-[9px] text-orange-200 uppercase font-bold tracking-wide">Start</p>
                  <p className="text-xl font-bold text-white mt-0.5">{fmt12(SHIFT.start)}</p>
                </div>
                <div className="rounded-xl p-3" style={{ backgroundColor: 'rgba(255,255,255,0.15)' }}>
                  <p className="text-[9px] text-orange-200 uppercase font-bold tracking-wide">End</p>
                  <p className="text-xl font-bold text-white mt-0.5">{fmt12(SHIFT.end)}</p>
                </div>
              </div>
            </div>
            <div className="bg-white px-5 py-1">
              {[
                { label: 'Grace period',    value: `${SHIFT.grace} min` },
                { label: 'Late mark after', value: `${SHIFT.lateAfter} min` },
                { label: 'Check-in window', value: `${fmt12('08:30')} – ${fmt12('09:30')}` },
                { label: 'Auto checkout',   value: fmt12('18:30') },
              ].map(r => (
                <div key={r.label} className="flex items-center justify-between py-2.5 border-b border-gray-50 last:border-0">
                  <span className="text-xs text-gray-500">{r.label}</span>
                  <span className="text-xs font-semibold" style={{ color: PRIMARY }}>{r.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Recent attendance */}
          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden" style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
              <p className="text-sm font-bold text-gray-900">Recent Attendance</p>
              <button onClick={() => navigate(ROUTES.ATTENDANCE_EMPLOYEE_HISTORY)}
                className="flex items-center gap-1 text-[11px] font-semibold transition-colors" style={{ color: PRIMARY }}>
                View all <ChevronRight size={12} />
              </button>
            </div>
            <div className="divide-y divide-gray-50">
              {RECENT.map(r => {
                const s = STATUS_BADGE[r.status] ?? { bg: '#F3F4F6', color: '#374151', label: r.status }
                return (
                  <div key={r.date} className="flex items-center gap-3 px-5 py-3 hover:bg-gray-50 transition-colors">
                    <div>
                      <p className="text-xs font-semibold text-gray-800">{r.date}</p>
                      <p className="text-[10px] text-gray-400 mt-0.5">
                        {r.checkIn ? `${fmt12(r.checkIn)} – ${fmt12(r.checkOut)}` : '—'}
                      </p>
                    </div>
                    <div className="ml-auto flex items-center gap-2">
                      <span className="text-xs font-bold text-gray-700">{r.hours}</span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold"
                        style={{ backgroundColor: s.bg, color: s.color }}>{s.label}</span>
                      {r.late && (
                        <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full"
                          style={{ backgroundColor: PRIMARY_LIGHT, color: PRIMARY }}>Late</span>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

        </div>
      </div>
    </>
  )
}