// src/pages/attendance/EmployeeAttendanceHistory.jsx
import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ArrowLeft, Search, Filter, ChevronLeft, ChevronRight,
  Clock, Coffee, TrendingUp, AlertTriangle, CalendarDays,
  CheckCircle2, XCircle, LayoutList, CalendarRange,
  Download, Activity,
} from 'lucide-react'

const PRIMARY       = '#C35E33'
const PRIMARY_DARK  = '#A34A24'
const PRIMARY_LIGHT = '#FDE8DD'
const PAGE_SIZE     = 8

// ─── Mock data ────────────────────────────────────────────────────────────────
const HISTORY = [
  { id: 1,  date: '2026-04-30', day: 'Wed', checkIn: '09:02', checkOut: '18:08', workMinutes: 486, breakMinutes: 30, lateMinutes: 0,  overtimeMinutes: 8,  status: 'PRESENT'  },
  { id: 2,  date: '2026-04-29', day: 'Tue', checkIn: '09:12', checkOut: '18:05', workMinutes: 473, breakMinutes: 45, lateMinutes: 12, overtimeMinutes: 5,  status: 'PRESENT'  },
  { id: 3,  date: '2026-04-28', day: 'Mon', checkIn: '09:02', checkOut: '18:10', workMinutes: 488, breakMinutes: 30, lateMinutes: 0,  overtimeMinutes: 10, status: 'PRESENT'  },
  { id: 4,  date: '2026-04-25', day: 'Fri', checkIn: '09:30', checkOut: '18:30', workMinutes: 480, breakMinutes: 60, lateMinutes: 0,  overtimeMinutes: 0,  status: 'PRESENT'  },
  { id: 5,  date: '2026-04-24', day: 'Thu', checkIn: null,    checkOut: null,    workMinutes: 0,   breakMinutes: 0,  lateMinutes: 0,  overtimeMinutes: 0,  status: 'ABSENT'   },
  { id: 6,  date: '2026-04-23', day: 'Wed', checkIn: '11:15', checkOut: '18:30', workMinutes: 375, breakMinutes: 30, lateMinutes: 135,overtimeMinutes: 0,  status: 'HALF_DAY' },
  { id: 7,  date: '2026-04-22', day: 'Tue', checkIn: '09:05', checkOut: '18:20', workMinutes: 495, breakMinutes: 45, lateMinutes: 0,  overtimeMinutes: 20, status: 'PRESENT'  },
  { id: 8,  date: '2026-04-21', day: 'Mon', checkIn: null,    checkOut: null,    workMinutes: 0,   breakMinutes: 0,  lateMinutes: 0,  overtimeMinutes: 0,  status: 'ON_LEAVE' },
  { id: 9,  date: '2026-04-18', day: 'Fri', checkIn: '09:28', checkOut: '18:32', workMinutes: 484, breakMinutes: 30, lateMinutes: 0,  overtimeMinutes: 32, status: 'PRESENT'  },
  { id: 10, date: '2026-04-17', day: 'Thu', checkIn: '09:35', checkOut: '18:30', workMinutes: 475, breakMinutes: 60, lateMinutes: 5,  overtimeMinutes: 0,  status: 'PRESENT'  },
  { id: 11, date: '2026-04-16', day: 'Wed', checkIn: '09:00', checkOut: '19:00', workMinutes: 540, breakMinutes: 60, lateMinutes: 0,  overtimeMinutes: 60, status: 'PRESENT'  },
  { id: 12, date: '2026-04-15', day: 'Tue', checkIn: null,    checkOut: null,    workMinutes: 0,   breakMinutes: 0,  lateMinutes: 0,  overtimeMinutes: 0,  status: 'ABSENT'   },
  { id: 13, date: '2026-04-14', day: 'Mon', checkIn: '09:10', checkOut: '18:15', workMinutes: 485, breakMinutes: 45, lateMinutes: 10, overtimeMinutes: 15, status: 'PRESENT'  },
  { id: 14, date: '2026-04-11', day: 'Fri', checkIn: '09:02', checkOut: '18:05', workMinutes: 483, breakMinutes: 30, lateMinutes: 0,  overtimeMinutes: 5,  status: 'PRESENT'  },
  { id: 15, date: '2026-04-10', day: 'Thu', checkIn: '10:00', checkOut: '14:30', workMinutes: 270, breakMinutes: 0,  lateMinutes: 60, overtimeMinutes: 0,  status: 'HALF_DAY' },
  { id: 16, date: '2026-04-09', day: 'Wed', checkIn: null,    checkOut: null,    workMinutes: 0,   breakMinutes: 0,  lateMinutes: 0,  overtimeMinutes: 0,  status: 'ON_LEAVE' },
]

const STATUS_CONFIG = {
  PRESENT:  { label: 'Present',   bg: '#DCFCE7', color: '#15803D', dot: '#22C55E' },
  ABSENT:   { label: 'Absent',    bg: '#FEE2E2', color: '#B91C1C', dot: '#EF4444' },
  HALF_DAY: { label: 'Half Day',  bg: '#FEF9C3', color: '#854D0E', dot: '#F59E0B' },
  ON_LEAVE: { label: 'On Leave',  bg: '#DBEAFE', color: '#1D4ED8', dot: '#3B82F6' },
}

// ─── Helpers ─────────────────────────────────────────────────────────────────
const fmt12 = (t) => {
  if (!t) return '—'
  const [h, m] = t.split(':').map(Number)
  const ampm = h >= 12 ? 'PM' : 'AM'
  const hh = h > 12 ? h - 12 : h === 0 ? 12 : h
  return `${hh}:${m.toString().padStart(2, '0')} ${ampm}`
}

const fmtDate = (d) => {
  const dt = new Date(d)
  return dt.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
}

const fmtMins = (m) => {
  if (!m) return '—'
  const h = Math.floor(m / 60)
  const min = m % 60
  if (h === 0) return `${min}m`
  if (min === 0) return `${h}h`
  return `${h}h ${min}m`
}

// ─── Mini timeline bar in table ───────────────────────────────────────────────
function MiniTimeline({ checkIn, checkOut, lateMinutes, breakMinutes, overtimeMinutes }) {
  if (!checkIn || !checkOut) {
    return <div className="w-32 h-3 rounded-full bg-gray-100" />
  }
  const toMin = (t) => { const [h, m] = t.split(':').map(Number); return h * 60 + m }
  const total = 9 * 60 // 9h shift
  const pct = (v) => Math.max(0, Math.min(100, (v / total) * 100))
  const workM = toMin(checkOut) - toMin(checkIn) - breakMinutes

  return (
    <div className="w-32">
      <div className="flex h-2.5 rounded-full overflow-hidden bg-gray-100">
        {lateMinutes > 0 && <div style={{ width: `${pct(lateMinutes)}%`, backgroundColor: PRIMARY, minWidth: 3 }} />}
        <div style={{ width: `${pct(workM)}%`, backgroundColor: '#22C55E' }} />
        {breakMinutes > 0 && <div style={{ width: `${pct(breakMinutes)}%`, backgroundColor: '#FCA5A5', minWidth: 2 }} />}
        {overtimeMinutes > 0 && <div style={{ width: `${pct(overtimeMinutes)}%`, backgroundColor: '#7C3AED', minWidth: 2 }} />}
      </div>
      <div className="flex justify-between mt-0.5">
        <span className="text-[8px] text-gray-400">{fmt12(checkIn)}</span>
        <span className="text-[8px] text-gray-400">{fmt12(checkOut)}</span>
      </div>
    </div>
  )
}

// ─── Status badge ─────────────────────────────────────────────────────────────
function Badge({ status }) {
  const c = STATUS_CONFIG[status] ?? { label: status, bg: '#F3F4F6', color: '#374151' }
  return (
    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold whitespace-nowrap"
      style={{ backgroundColor: c.bg, color: c.color }}>
      {c.label}
    </span>
  )
}

// ─── Calendar View ────────────────────────────────────────────────────────────
function CalendarView({ records }) {
  const [month, setMonth] = useState(new Date(2026, 3, 1)) // April 2026

  const year  = month.getFullYear()
  const mon   = month.getMonth()
  const firstDay = new Date(year, mon, 1).getDay()
  const daysInMonth = new Date(year, mon + 1, 0).getDate()

  const recordMap = {}
  records.forEach(r => { recordMap[r.date] = r })

  const prev = () => setMonth(new Date(year, mon - 1, 1))
  const next = () => setMonth(new Date(year, mon + 1, 1))

  const monthName = month.toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })

  const cells = []
  for (let i = 0; i < firstDay; i++) cells.push(null)
  for (let d = 1; d <= daysInMonth; d++) cells.push(d)

  return (
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden" style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
      {/* Month nav */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
        <button onClick={prev} className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors">
          <ChevronLeft size={14} color="#6B7280" />
        </button>
        <p className="text-sm font-bold text-gray-900">{monthName}</p>
        <button onClick={next} className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors">
          <ChevronRight size={14} color="#6B7280" />
        </button>
      </div>

      {/* Day headers */}
      <div className="grid grid-cols-7 px-4 pt-3 pb-1">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
          <div key={d} className="text-center text-[9px] font-bold text-gray-400 uppercase tracking-wide pb-2">{d}</div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-1 px-4 pb-4">
        {cells.map((day, i) => {
          if (!day) return <div key={`e-${i}`} />
          const dateStr = `${year}-${String(mon + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
          const rec = recordMap[dateStr]
          const isToday = dateStr === new Date().toISOString().slice(0, 10)
          const cfg = rec ? STATUS_CONFIG[rec.status] : null

          return (
            <div key={day}
              className="aspect-square flex flex-col items-center justify-center rounded-xl text-xs font-semibold transition-all cursor-default relative group"
              style={{
                backgroundColor: cfg ? cfg.bg : isToday ? '#F1F5F9' : 'transparent',
                color: cfg ? cfg.color : isToday ? '#0F172A' : '#6B7280',
                border: isToday && !cfg ? '1.5px solid #CBD5E1' : '1.5px solid transparent',
              }}
            >
              {day}
              {cfg && (
                <div className="w-1 h-1 rounded-full mt-0.5" style={{ backgroundColor: cfg.dot }} />
              )}
              {rec && (
                <div className="absolute -top-1 -right-1 opacity-0 group-hover:opacity-100 transition-opacity z-10
                  bg-gray-900 text-white text-[9px] rounded-lg px-2 py-1 whitespace-nowrap pointer-events-none"
                  style={{ fontSize: 9 }}>
                  {cfg.label}{rec.workMinutes > 0 ? ` · ${fmtMins(rec.workMinutes)}` : ''}
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 px-5 py-3 border-t border-gray-50 flex-wrap">
        {Object.entries(STATUS_CONFIG).map(([, c]) => (
          <span key={c.label} className="flex items-center gap-1.5 text-[10px] text-gray-500">
            <span className="w-2 h-2 rounded-sm" style={{ backgroundColor: c.dot }} />
            {c.label}
          </span>
        ))}
      </div>
    </div>
  )
}

// ─── Pagination ───────────────────────────────────────────────────────────────
function Pagination({ current, total, pageSize, onChange }) {
  const totalPages = Math.ceil(total / pageSize)
  if (totalPages <= 1) return null
  return (
    <div className="flex items-center justify-between px-5 py-3 border-t border-gray-100 flex-wrap gap-2">
      <p className="text-xs text-gray-500">
        Showing <span className="font-semibold text-gray-800">{(current - 1) * pageSize + 1}–{Math.min(current * pageSize, total)}</span> of <span className="font-semibold text-gray-800">{total}</span>
      </p>
      <div className="flex items-center gap-1">
        <button onClick={() => onChange(current - 1)} disabled={current === 1}
          className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:border-gray-400 disabled:opacity-30 disabled:cursor-not-allowed transition-colors">
          <ChevronLeft size={14} />
        </button>
        {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
          <button key={p} onClick={() => onChange(p)}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-xs font-medium border transition-all"
            style={{ borderColor: current === p ? PRIMARY : '#E5E7EB', backgroundColor: current === p ? PRIMARY : 'transparent', color: current === p ? '#fff' : '#6B7280' }}>
            {p}
          </button>
        ))}
        <button onClick={() => onChange(current + 1)} disabled={current === totalPages}
          className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:border-gray-400 disabled:opacity-30 disabled:cursor-not-allowed transition-colors">
          <ChevronRight size={14} />
        </button>
      </div>
    </div>
  )
}

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function EmployeeAttendanceHistory() {
  const navigate = useNavigate()

  const [viewMode,      setViewMode]      = useState('list')   // 'list' | 'calendar'
  const [search,        setSearch]        = useState('')
  const [filterStatus,  setFilterStatus]  = useState('All')
  const [page,          setPage]          = useState(1)
  const [dateFrom,      setDateFrom]      = useState('')
  const [dateTo,        setDateTo]        = useState('')

  // Filter
  const filtered = useMemo(() => {
    return HISTORY.filter(r => {
      const statusMatch = filterStatus === 'All' || r.status === filterStatus
      const dateMatchFrom = !dateFrom || r.date >= dateFrom
      const dateMatchTo   = !dateTo   || r.date <= dateTo
      return statusMatch && dateMatchFrom && dateMatchTo
    })
  }, [filterStatus, dateFrom, dateTo])

  const paginated = useMemo(() => filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE), [filtered, page])

  // Summary stats
  const presentDays  = HISTORY.filter(r => r.status === 'PRESENT').length
  const absentDays   = HISTORY.filter(r => r.status === 'ABSENT').length
  const halfDays     = HISTORY.filter(r => r.status === 'HALF_DAY').length
  const leaveDays    = HISTORY.filter(r => r.status === 'ON_LEAVE').length
  const lateDays     = HISTORY.filter(r => r.lateMinutes > 0).length
  const totalOT      = HISTORY.reduce((a, r) => a + r.overtimeMinutes, 0)
  const totalWork    = HISTORY.reduce((a, r) => a + r.workMinutes, 0)
  const avgWork      = presentDays > 0 ? Math.round(totalWork / presentDays) : 0

  const tabs = [
    { key: 'All',      label: 'All',       count: HISTORY.length },
    { key: 'PRESENT',  label: 'Present',   count: presentDays },
    { key: 'ABSENT',   label: 'Absent',    count: absentDays },
    { key: 'HALF_DAY', label: 'Half Day',  count: halfDays },
    { key: 'ON_LEAVE', label: 'On Leave',  count: leaveDays },
  ]

  return (
    <>
      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <div className="flex items-start justify-between mb-5 flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/my-attendance')}
            className="w-9 h-9 flex items-center justify-center rounded-xl border border-gray-200 text-gray-500 hover:bg-gray-50 hover:border-gray-300 transition-colors"
          >
            <ArrowLeft size={16} />
          </button>
          <div>
            <h1 className="text-xl font-bold text-gray-900">Attendance History</h1>
            <p className="text-xs text-gray-400 mt-0.5">Your complete attendance record</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* View toggle */}
          <div className="flex items-center bg-gray-100 rounded-xl p-1">
            {[
              { mode: 'list',     icon: LayoutList },
              { mode: 'calendar', icon: CalendarRange },
            ].map(({ mode, icon: Icon }) => (
              <button key={mode} onClick={() => setViewMode(mode)}
                className="flex items-center justify-center w-8 h-7 rounded-lg transition-all"
                style={{
                  backgroundColor: viewMode === mode ? '#fff' : 'transparent',
                  color: viewMode === mode ? PRIMARY : '#6B7280',
                  boxShadow: viewMode === mode ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                }}>
                <Icon size={14} />
              </button>
            ))}
          </div>
          {/* Export */}
          <button
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-[13px] font-semibold border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 transition-colors"
            style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
            <Download size={14} />
            Export
          </button>
        </div>
      </div>

      {/* ── Summary Stats ──────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-4 gap-3 mb-5">
        {[
          { icon: <CheckCircle2 size={17} color="#15803D" strokeWidth={1.8} />, bg: '#DCFCE7', label: 'Present Days',  value: presentDays,        color: '#15803D', sub: `${HISTORY.length} total` },
          { icon: <XCircle size={17} color="#B91C1C" strokeWidth={1.8} />,     bg: '#FEE2E2', label: 'Absent Days',   value: absentDays,         color: '#B91C1C', sub: `${halfDays} half-day` },
          { icon: <Activity size={17} color={PRIMARY} strokeWidth={1.8} />,    bg: PRIMARY_LIGHT, label: 'Avg Work Time', value: fmtMins(avgWork), color: PRIMARY,   sub: 'per day' },
          { icon: <TrendingUp size={17} color="#7C3AED" strokeWidth={1.8} />,  bg: '#F5F3FF', label: 'Total OT',      value: fmtMins(totalOT),   color: '#7C3AED', sub: `${lateDays} late arrivals` },
        ].map(({ icon, bg, label, value, color, sub }) => (
          <div key={label} className="bg-white rounded-2xl border border-gray-100 p-4 flex items-center gap-3"
            style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
            <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: bg }}>{icon}</div>
            <div>
              <p className="text-lg font-bold leading-none" style={{ color }}>{value}</p>
              <p className="text-[11px] text-gray-500 mt-0.5 font-medium">{label}</p>
              <p className="text-[9px] text-gray-400 mt-0.5">{sub}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ── Two-column layout for calendar + mini stats ────────────────────── */}
      {viewMode === 'calendar' ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2">
            <CalendarView records={HISTORY} />
          </div>
          {/* Monthly breakdown */}
          <div className="space-y-3">
            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden" style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
              <div className="px-5 py-4 border-b border-gray-100">
                <p className="text-sm font-bold text-gray-900">April 2026 Summary</p>
              </div>
              <div className="px-5 py-2 space-y-0">
                {[
                  { label: 'Working Days',  value: HISTORY.length,  color: '#374151' },
                  { label: 'Present',       value: presentDays,     color: '#15803D' },
                  { label: 'Absent',        value: absentDays,      color: '#B91C1C' },
                  { label: 'Half Days',     value: halfDays,        color: '#854D0E' },
                  { label: 'On Leave',      value: leaveDays,       color: '#1D4ED8' },
                  { label: 'Late Arrivals', value: lateDays,        color: PRIMARY   },
                  { label: 'Total OT',      value: fmtMins(totalOT),color: '#7C3AED' },
                ].map(({ label, value, color }) => (
                  <div key={label} className="flex items-center justify-between py-2.5 border-b border-gray-50 last:border-0">
                    <span className="text-xs text-gray-500">{label}</span>
                    <span className="text-xs font-bold" style={{ color }}>{value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Attendance rate */}
            <div className="bg-white rounded-2xl border border-gray-100 p-5" style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
              <p className="text-xs font-bold text-gray-700 mb-3">Attendance Rate</p>
              <div className="flex items-end gap-2 mb-2">
                <span className="text-3xl font-bold" style={{ color: PRIMARY }}>
                  {Math.round((presentDays / HISTORY.length) * 100)}%
                </span>
                <span className="text-xs text-gray-400 mb-1">{presentDays}/{HISTORY.length} days</span>
              </div>
              <div className="h-2 rounded-full bg-gray-100 overflow-hidden">
                <div className="h-full rounded-full transition-all" style={{ width: `${(presentDays / HISTORY.length) * 100}%`, backgroundColor: PRIMARY }} />
              </div>
            </div>
          </div>
        </div>
      ) : (
        <>
          {/* ── Toolbar ──────────────────────────────────────────────────────── */}
          <div className="flex items-center gap-2 mb-4 flex-wrap">
            {/* Status tabs */}
            <div className="flex items-center gap-1.5 flex-wrap">
              {tabs.map(({ key, label, count }) => (
                <button key={key} onClick={() => { setFilterStatus(key); setPage(1) }}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs border cursor-pointer transition-all whitespace-nowrap"
                  style={{
                    borderColor:     filterStatus === key ? PRIMARY : '#E5E7EB',
                    color:           filterStatus === key ? '#fff' : '#6B7280',
                    backgroundColor: filterStatus === key ? PRIMARY : '#fff',
                    fontWeight:      filterStatus === key ? 600 : 500,
                  }}>
                  {label}
                  <span className="px-1.5 py-0.5 rounded-full text-[9px] font-bold"
                    style={{
                      backgroundColor: filterStatus === key ? 'rgba(255,255,255,0.2)' : '#F3F4F6',
                      color: filterStatus === key ? '#fff' : '#6B7280',
                    }}>
                    {count}
                  </span>
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2 ml-auto flex-wrap">
              {/* Date range */}
              <input type="date" value={dateFrom} onChange={e => { setDateFrom(e.target.value); setPage(1) }}
                className="h-9 px-3 text-xs text-gray-600 bg-white border border-gray-200 rounded-xl outline-none focus:border-orange-400 cursor-pointer" />
              <span className="text-xs text-gray-400">to</span>
              <input type="date" value={dateTo} onChange={e => { setDateTo(e.target.value); setPage(1) }}
                className="h-9 px-3 text-xs text-gray-600 bg-white border border-gray-200 rounded-xl outline-none focus:border-orange-400 cursor-pointer" />
            </div>
          </div>

          {/* ── Table ────────────────────────────────────────────────────────── */}
          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden" style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse" style={{ minWidth: 780 }}>
                <thead>
                  <tr style={{ backgroundColor: PRIMARY }}>
                    {['Date', 'Day', 'Check In', 'Check Out', 'Timeline', 'Work Time', 'Break', 'Late (min)', 'OT (min)', 'Status'].map(h => (
                      <th key={h} className="px-4 py-3.5 text-left text-[11px] font-semibold text-white whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {paginated.length === 0 ? (
                    <tr>
                      <td colSpan={10} className="px-4 py-14 text-center text-sm text-gray-400">No records found.</td>
                    </tr>
                  ) : paginated.map((r, idx) => (
                    <tr key={r.id}
                      className="hover:bg-orange-50 transition-colors border-b border-gray-50"
                      style={{ backgroundColor: idx % 2 === 0 ? '#fff' : '#FAFAFA' }}>
                      {/* Date */}
                      <td className="px-4 py-3.5 whitespace-nowrap">
                        <span className="text-[12px] font-semibold text-gray-800">{fmtDate(r.date)}</span>
                      </td>
                      {/* Day */}
                      <td className="px-4 py-3.5">
                        <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-gray-100 text-gray-600">{r.day}</span>
                      </td>
                      {/* Check In */}
                      <td className="px-4 py-3.5 whitespace-nowrap">
                        <span className={`text-[12px] font-semibold ${r.checkIn ? 'text-green-600' : 'text-gray-300'}`}>
                          {r.checkIn ? fmt12(r.checkIn) : '—'}
                        </span>
                        {r.lateMinutes > 0 && (
                          <div className="text-[9px] font-bold mt-0.5" style={{ color: PRIMARY }}>+{r.lateMinutes}m late</div>
                        )}
                      </td>
                      {/* Check Out */}
                      <td className="px-4 py-3.5 whitespace-nowrap">
                        <span className={`text-[12px] font-semibold ${r.checkOut ? 'text-red-500' : 'text-gray-300'}`}>
                          {r.checkOut ? fmt12(r.checkOut) : '—'}
                        </span>
                        {r.overtimeMinutes > 0 && (
                          <div className="text-[9px] font-bold text-purple-600 mt-0.5">+{r.overtimeMinutes}m OT</div>
                        )}
                      </td>
                      {/* Timeline */}
                      <td className="px-4 py-3.5">
                        <MiniTimeline
                          checkIn={r.checkIn} checkOut={r.checkOut}
                          lateMinutes={r.lateMinutes} breakMinutes={r.breakMinutes}
                          overtimeMinutes={r.overtimeMinutes}
                        />
                      </td>
                      {/* Work Time */}
                      <td className="px-4 py-3.5 whitespace-nowrap">
                        <span className="text-[12px] font-bold text-gray-800">
                          {r.workMinutes > 0 ? fmtMins(r.workMinutes) : '—'}
                        </span>
                      </td>
                      {/* Break */}
                      <td className="px-4 py-3.5 whitespace-nowrap">
                        <span className="text-[12px] text-gray-500">
                          {r.breakMinutes > 0 ? fmtMins(r.breakMinutes) : '—'}
                        </span>
                      </td>
                      {/* Late */}
                      <td className="px-4 py-3.5 whitespace-nowrap">
                        <span className={`text-[12px] font-medium ${r.lateMinutes > 0 ? '' : 'text-gray-400'}`}
                          style={{ color: r.lateMinutes > 0 ? PRIMARY : undefined }}>
                          {r.lateMinutes > 0 ? `+${r.lateMinutes}` : '0'}
                        </span>
                      </td>
                      {/* OT */}
                      <td className="px-4 py-3.5 whitespace-nowrap">
                        <span className={`text-[12px] font-medium ${r.overtimeMinutes > 0 ? 'text-purple-600' : 'text-gray-400'}`}>
                          {r.overtimeMinutes > 0 ? `+${r.overtimeMinutes}` : '0'}
                        </span>
                      </td>
                      {/* Status */}
                      <td className="px-4 py-3.5 whitespace-nowrap">
                        <Badge status={r.status} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <Pagination current={page} total={filtered.length} pageSize={PAGE_SIZE} onChange={setPage} />
          </div>
        </>
      )}
    </>
  )
}