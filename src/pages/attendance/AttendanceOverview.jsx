// src/pages/attendance/AttendanceOverview.jsx
import { useState, useMemo, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, Filter, Eye, ChevronLeft, ChevronRight, Clock, Users, AlertTriangle, TrendingUp, CheckCircle, XCircle } from 'lucide-react'
import FilterModal from '@/components/shared/FilterModal'
import AttendanceDetailModal from './AttendanceDetailModal'

const PRIMARY      = '#C35E33'
const PRIMARY_DARK = '#A34A24'
const PAGE_SIZE    = 8

// ─── Mock data (maps to AttendanceResponseDTO from backend) ──────────────────
const ATTENDANCE_DATA = [
  { id: 1,  employeeCode: 'JK-01', name: 'Jaylon Press',    department: 'Engineering', designation: 'Senior Dev',   shift: '09:30 AM - 06:30 PM', checkIn: '09:28', checkOut: '18:32', workMinutes: 484, lateMinutes: 0,  overtimeMinutes: 22, breakMinutes: 30, status: 'PRESENT',  date: '09-05-2026' },
  { id: 2,  employeeCode: 'JK-02', name: 'Emerson Geidt',   department: 'Sales',       designation: 'Sales Exec',   shift: '09:30 AM - 06:30 PM', checkIn: '09:45', checkOut: '18:30', workMinutes: 465, lateMinutes: 15, overtimeMinutes: 0,  breakMinutes: 45, status: 'PRESENT',  date: '11-04-2022' },
  { id: 3,  employeeCode: 'JK-03', name: 'Alfredo Gouse',   department: 'IT-Based',    designation: 'UI Designer',  shift: '09:30 AM - 06:30 PM', checkIn: '09:30', checkOut: '18:30', workMinutes: 480, lateMinutes: 0,  overtimeMinutes: 0,  breakMinutes: 60, status: 'PRESENT',  date: '09-05-2026' },
  { id: 4,  employeeCode: 'JK-04', name: 'Talan Torff',     department: 'Marketing',   designation: 'Marketer',     shift: '09:30 AM - 06:30 PM', checkIn: '09:35', checkOut: '18:25', workMinutes: 470, lateMinutes: 5,  overtimeMinutes: 0,  breakMinutes: 40, status: 'PRESENT',  date: '09-05-2026' },
  { id: 5,  employeeCode: 'JK-05', name: 'Craig Bergson',   department: 'Engineering', designation: 'DevOps',       shift: '09:30 AM - 06:30 PM', checkIn: '09:28', checkOut: '19:03', workMinutes: 525, lateMinutes: 0,  overtimeMinutes: 45, breakMinutes: 30, status: 'PRESENT',  date: '09-05-2026' },
  { id: 6,  employeeCode: 'JK-06', name: 'Maria Stanton',   department: 'HR',          designation: 'HR Manager',   shift: '09:30 AM - 06:30 PM', checkIn: null,    checkOut: null,    workMinutes: 0,   lateMinutes: 0,  overtimeMinutes: 0,  breakMinutes: 0,  status: 'ABSENT',   date: '09-05-2026' },
  { id: 7,  employeeCode: 'JK-07', name: 'Leo Workman',     department: 'Engineering', designation: 'QA Engineer',  shift: '09:30 AM - 06:30 PM', checkIn: '11:10', checkOut: '18:30', workMinutes: 380, lateMinutes: 100,overtimeMinutes: 0,  breakMinutes: 30, status: 'HALF_DAY', date: '09-05-2026' },
  { id: 8,  employeeCode: 'JK-08', name: 'Anika Rhiel',     department: 'Design',      designation: 'Product Mgr',  shift: '09:30 AM - 06:30 PM', checkIn: '09:30', checkOut: '18:31', workMinutes: 481, lateMinutes: 0,  overtimeMinutes: 1,  breakMinutes: 60, status: 'PRESENT',  date: '09-05-2026' },
  { id: 9,  employeeCode: 'JK-09', name: 'Gretchen Curtis', department: 'Finance',     designation: 'Accountant',   shift: '09:30 AM - 06:30 PM', checkIn: '09:50', checkOut: '17:30', workMinutes: 340, lateMinutes: 20, overtimeMinutes: 0,  breakMinutes: 60, status: 'HALF_DAY', date: '09-05-2026' },
  { id: 10, employeeCode: 'JK-10', name: 'Ryan Westervelt', department: 'IT-Based',    designation: 'Backend Dev',  shift: '09:30 AM - 06:30 PM', checkIn: null,    checkOut: null,    workMinutes: 0,   lateMinutes: 0,  overtimeMinutes: 0,  breakMinutes: 0,  status: 'ON_LEAVE', date: '09-05-2026' },
  { id: 11, employeeCode: 'JK-11', name: 'Allison Bator',   department: 'IT-Based',    designation: 'Frontend Dev', shift: '09:30 AM - 06:30 PM', checkIn: '09:29', checkOut: '18:35', workMinutes: 486, lateMinutes: 0,  overtimeMinutes: 6,  breakMinutes: 30, status: 'PRESENT',  date: '09-05-2026' },
  { id: 12, employeeCode: 'JK-12', name: 'Carla Korsgaard', department: 'Data',        designation: 'Data Analyst', shift: '09:30 AM - 06:30 PM', checkIn: '09:30', checkOut: '18:30', workMinutes: 480, lateMinutes: 0,  overtimeMinutes: 0,  breakMinutes: 60, status: 'PRESENT',  date: '09-05-2026' },
]

const FILTER_CONFIG = [
  { key: 'status',     label: 'Status',     type: 'multi',  options: ['PRESENT','ABSENT','HALF_DAY','ON_LEAVE'] },
  { key: 'dept',       label: 'Department', type: 'select', options: ['Engineering','Sales','IT-Based','Marketing','HR','Finance','Design','Data'] },
  { key: 'dateFrom',   label: 'Date From',  type: 'date' },
  { key: 'dateTo',     label: 'Date To',    type: 'date' },
]

const STATUS_MAP = {
  PRESENT:   { label: 'Present',   bg: '#DCFCE7', color: '#15803D' },
  ABSENT:    { label: 'Absent',    bg: '#FEE2E2', color: '#B91C1C' },
  HALF_DAY:  { label: 'Half Day',  bg: '#FEF9C3', color: '#854D0E' },
  ON_LEAVE:  { label: 'On Leave',  bg: '#DBEAFE', color: '#1D4ED8' },
}

// ─── Timeline progress bar (matching the Figma design) ───────────────────────
function TimelineBar({ checkIn, checkOut, breakMinutes, lateMinutes, overtimeMinutes }) {
  if (!checkIn || !checkOut) {
    return (
      <div className="flex flex-col items-center" style={{ width: 200 }}>
        <div className="w-full h-4 rounded-full bg-gray-100 flex items-center justify-center">
          <span className="text-[9px] text-gray-400">—</span>
        </div>
      </div>
    )
  }

  const toMin = (t) => {
    const [h, m] = t.split(':').map(Number)
    return h * 60 + m
  }

  const shiftStart = toMin('09:30')
  const shiftEnd   = toMin('18:30')
  const shiftTotal = shiftEnd - shiftStart // 540 min

  const inMin  = toMin(checkIn)
  const outMin = toMin(checkOut)
  const total  = outMin - inMin

  // percentages relative to bar width
  const pct = (v) => Math.max(0, Math.min(100, (v / shiftTotal) * 100))

  const lateStart  = 0
  const latePct    = pct(lateMinutes)
  const workPct    = pct(total - breakMinutes - lateMinutes - overtimeMinutes)
  const breakPct   = pct(breakMinutes)
  const otPct      = pct(overtimeMinutes)

  const fmt = (t) => {
    const [h, m] = t.split(':').map(Number)
    const ampm = h >= 12 ? 'PM' : 'AM'
    const hh = h > 12 ? h - 12 : h === 0 ? 12 : h
    return `${hh.toString().padStart(2,'0')}:${m.toString().padStart(2,'0')}${ampm}`
  }

  return (
    <div style={{ width: 200 }}>
      {/* Bar */}
      <div className="relative flex h-4 rounded-full overflow-hidden" style={{ backgroundColor: '#E5E7EB' }}>
        {lateMinutes > 0 && (
          <div style={{ width: `${latePct}%`, backgroundColor: PRIMARY, minWidth: lateMinutes > 0 ? 4 : 0 }} />
        )}
        <div style={{ flex: 1, backgroundColor: '#22C55E' }} />
        {breakMinutes > 0 && (
          <div style={{ width: `${breakPct}%`, backgroundColor: '#FCA5A5', minWidth: 4 }} />
        )}
        {overtimeMinutes > 0 && (
          <div style={{ width: `${otPct}%`, backgroundColor: '#111827', minWidth: 4 }} />
        )}
      </div>
      {/* Labels */}
      <div className="flex justify-between mt-0.5">
        <span className="text-[8px] text-gray-400">{fmt(checkIn)}</span>
        <span className="text-[8px] text-gray-400">{fmt(checkOut)}</span>
      </div>
      {/* Legend */}
      <div className="flex items-center gap-2 mt-0.5 flex-wrap">
        <span className="flex items-center gap-0.5"><span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block"/><span className="text-[7px] text-gray-400">Work</span></span>
        {lateMinutes > 0 && <span className="flex items-center gap-0.5"><span className="w-1.5 h-1.5 rounded-full inline-block" style={{ backgroundColor: PRIMARY }}/><span className="text-[7px] text-gray-400">Late</span></span>}
        {breakMinutes > 0 && <span className="flex items-center gap-0.5"><span className="w-1.5 h-1.5 rounded-full bg-red-300 inline-block"/><span className="text-[7px] text-gray-400">Break</span></span>}
        {overtimeMinutes > 0 && <span className="flex items-center gap-0.5"><span className="w-1.5 h-1.5 rounded-full bg-gray-800 inline-block"/><span className="text-[7px] text-gray-400">OT</span></span>}
      </div>
    </div>
  )
}

// ─── Status badge ─────────────────────────────────────────────────────────────
function StatusBadge({ status }) {
  const s = STATUS_MAP[status] ?? { label: status, bg: '#F3F4F6', color: '#374151' }
  return (
    <span className="inline-flex px-2.5 py-0.5 rounded-full text-[10px] font-semibold whitespace-nowrap"
      style={{ backgroundColor: s.bg, color: s.color }}>
      {s.label}
    </span>
  )
}

// ─── Sort icon ────────────────────────────────────────────────────────────────
function SortIcon() {
  return (
    <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke={PRIMARY}
      strokeWidth="2.5" strokeLinecap="round" className="ml-1 inline-block flex-shrink-0">
      <path d="m6 9 6-6 6 6"/><path d="m6 15 6 6 6-6"/>
    </svg>
  )
}

// ─── Pagination ───────────────────────────────────────────────────────────────
function Pagination({ current, total, pageSize, onChange }) {
  const totalPages = Math.ceil(total / pageSize)
  if (totalPages <= 1) return null
  return (
    <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100 flex-wrap gap-2">
      <p className="text-xs text-gray-500">
        Showing <span className="font-semibold text-gray-800">{(current - 1) * pageSize + 1}–{Math.min(current * pageSize, total)}</span> of <span className="font-semibold text-gray-800">{total}</span>
      </p>
      <div className="flex items-center gap-1">
        <button onClick={() => onChange(current - 1)} disabled={current === 1}
          className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:border-gray-400 disabled:opacity-30 disabled:cursor-not-allowed transition-colors">
          <ChevronLeft size={14} />
        </button>
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
          <button key={p} onClick={() => onChange(p)}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-xs font-medium border transition-all"
            style={{ borderColor: current === p ? PRIMARY : '#E5E7EB', backgroundColor: current === p ? PRIMARY : 'transparent', color: current === p ? '#fff' : '#6B7280' }}>
            {p}
          </button>
        ))}
        <button onClick={() => onChange(current + 1)} disabled={current === Math.ceil(total / pageSize)}
          className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:border-gray-400 disabled:opacity-30 disabled:cursor-not-allowed transition-colors">
          <ChevronRight size={14} />
        </button>
      </div>
    </div>
  )
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function AttendanceOverview() {
  const navigate = useNavigate()

  const [activeTab,     setActiveTab]     = useState('All')
  const [search,        setSearch]        = useState('')
  const [showFilter,    setShowFilter]    = useState(false)
  const [activeFilters, setActiveFilters] = useState({})
  const [page,          setPage]          = useState(1)
  const [detailRecord,  setDetailRecord]  = useState(null)

  const tabs = [
    { key: 'All',      label: 'All',       count: ATTENDANCE_DATA.length },
    { key: 'PRESENT',  label: 'Present',   count: ATTENDANCE_DATA.filter(e => e.status === 'PRESENT').length },
    { key: 'ABSENT',   label: 'Absent',    count: ATTENDANCE_DATA.filter(e => e.status === 'ABSENT').length },
    { key: 'HALF_DAY', label: 'Half Day',  count: ATTENDANCE_DATA.filter(e => e.status === 'HALF_DAY').length },
    { key: 'ON_LEAVE', label: 'On Leave',  count: ATTENDANCE_DATA.filter(e => e.status === 'ON_LEAVE').length },
  ]

  const filtered = useMemo(() => {
    const q = search.toLowerCase()
    return ATTENDANCE_DATA.filter((e) => {
      const tabMatch    = activeTab === 'All' || e.status === activeTab
      const searchMatch = !q || e.name.toLowerCase().includes(q) || e.employeeCode.toLowerCase().includes(q) || e.department.toLowerCase().includes(q)
      const statusMatch = !activeFilters.status?.length || activeFilters.status.includes(e.status)
      const deptMatch   = !activeFilters.dept || e.department === activeFilters.dept
      return tabMatch && searchMatch && statusMatch && deptMatch
    })
  }, [activeTab, search, activeFilters])

  useEffect(() => setPage(1), [activeTab, search, activeFilters])

  const paginated = useMemo(
    () => filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE),
    [filtered, page]
  )

  const filterCount = Object.values(activeFilters).filter((v) => Array.isArray(v) ? v.length > 0 : !!v).length

  const statsData = [
    { label: 'Total Today',  value: ATTENDANCE_DATA.length,                                          color: '#111827', bg: '#F3F4F6', icon: <Users size={17} color="#111827" strokeWidth={1.8}/> },
    { label: 'Present',      value: ATTENDANCE_DATA.filter(e => e.status === 'PRESENT').length,      color: '#15803D', bg: '#DCFCE7', icon: <CheckCircle size={17} color="#15803D" strokeWidth={1.8}/> },
    { label: 'Absent',       value: ATTENDANCE_DATA.filter(e => e.status === 'ABSENT').length,       color: '#B91C1C', bg: '#FEE2E2', icon: <XCircle size={17} color="#B91C1C" strokeWidth={1.8}/> },
    { label: 'Half Day',     value: ATTENDANCE_DATA.filter(e => e.status === 'HALF_DAY').length,     color: '#854D0E', bg: '#FEF9C3', icon: <AlertTriangle size={17} color="#854D0E" strokeWidth={1.8}/> },
    { label: 'On Leave',     value: ATTENDANCE_DATA.filter(e => e.status === 'ON_LEAVE').length,     color: '#1D4ED8', bg: '#DBEAFE', icon: <Clock size={17} color="#1D4ED8" strokeWidth={1.8}/> },
    { label: 'Late Arrivals',value: ATTENDANCE_DATA.filter(e => e.lateMinutes > 0).length,           color: PRIMARY,   bg: '#FDE8DD', icon: <TrendingUp size={17} color={PRIMARY} strokeWidth={1.8}/> },
  ]

  return (
    <>
      {/* ── Header ───────────────────────────────────────────── */}
      <div className="flex items-center justify-between mb-5 gap-3 flex-wrap">
        <div>
          <h1 className="text-xl font-bold text-gray-900 m-0">Attendance Overview</h1>
          <p className="text-xs text-gray-400 mt-0.5">Monitor daily employee attendance</p>
        </div>
        <div className="flex items-center gap-2">
          {/* Date picker */}
          <input type="date"
            defaultValue={new Date().toISOString().slice(0, 10)}
            className="h-9 px-3 text-sm text-gray-700 bg-white border border-gray-200 rounded-lg outline-none focus:border-[#C35E33] cursor-pointer" />
          {/* Pending Approvals button */}
          <button
            onClick={() => navigate('/attendance/pending-approvals')}
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold text-white border-none cursor-pointer transition-colors whitespace-nowrap"
            style={{ backgroundColor: PRIMARY }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = PRIMARY_DARK)}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = PRIMARY)}
          >
            <Clock size={14} strokeWidth={2} />
            Pending Approvals
            <span className="w-5 h-5 rounded-full bg-white text-[10px] font-bold flex items-center justify-center" style={{ color: PRIMARY }}>3</span>
          </button>
        </div>
      </div>

      {/* ── Stats Cards ──────────────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-5">
        {statsData.map(({ label, value, color, bg, icon }) => (
          <div key={label} className="bg-white rounded-xl border border-gray-100 shadow-sm p-3.5 flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: bg }}>{icon}</div>
            <div className="min-w-0">
              <p className="text-xl font-bold leading-none" style={{ color }}>{value}</p>
              <p className="text-[10px] text-gray-500 mt-0.5 font-medium leading-tight">{label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ── Toolbar ──────────────────────────────────────────── */}
      <div className="flex items-center gap-2 mb-4 flex-wrap">
        {/* Tabs */}
        <div className="flex items-center gap-1.5 flex-wrap">
          {tabs.map(({ key, label, count }) => (
            <button key={key} onClick={() => setActiveTab(key)}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs border cursor-pointer transition-all whitespace-nowrap"
              style={{
                borderColor:     activeTab === key ? '#111827' : '#E5E7EB',
                color:           activeTab === key ? '#111827' : '#6B7280',
                backgroundColor: activeTab === key ? '#F9FAFB' : '#fff',
                fontWeight:      activeTab === key ? 600 : 500,
              }}>
              {label}
              <span className="px-1.5 py-0.5 rounded-full text-[9px] font-bold"
                style={{ backgroundColor: activeTab === key ? '#111827' : '#F3F4F6', color: activeTab === key ? '#fff' : '#6B7280' }}>
                {count}
              </span>
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 ml-auto">
          <label className="flex items-center gap-2 bg-white rounded-lg px-3 h-9 border border-gray-200 cursor-text">
            <Search size={13} color="#9CA3AF" strokeWidth={2} className="flex-shrink-0" />
            <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
              placeholder="Search employee…"
              className="border-none outline-none text-[13px] text-gray-900 bg-transparent w-36 sm:w-44" />
          </label>
          <button onClick={() => setShowFilter(true)}
            className="relative flex items-center gap-1.5 bg-white border rounded-lg px-3 h-9 text-[13px] font-medium cursor-pointer hover:bg-gray-50 transition-colors"
            style={{ borderColor: filterCount > 0 ? PRIMARY : '#E5E7EB', color: filterCount > 0 ? PRIMARY : '#374151' }}>
            <Filter size={13} strokeWidth={2} />
            <span className="hidden sm:inline">Filter</span>
            {filterCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full text-[9px] font-bold text-white flex items-center justify-center"
                style={{ backgroundColor: PRIMARY }}>{filterCount}</span>
            )}
          </button>
        </div>
      </div>

      {/* ── Table ────────────────────────────────────────────── */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse" style={{ minWidth: 900 }}>
            <thead>
              <tr style={{ backgroundColor: PRIMARY }}>
                {[
                  { label: 'Employee ID',   sort: true  },
                  { label: 'Employee Name', sort: true  },
                  { label: 'Timeline',      sort: false },
                  { label: 'Department',    sort: false },
                  { label: 'Check In',      sort: true  },
                  { label: 'Check Out',     sort: true  },
                  { label: 'Work Hrs',      sort: true  },
                  { label: 'Late (min)',     sort: false },
                  { label: 'OT (min)',       sort: false },
                  { label: 'Date',          sort: true  },
                  { label: 'Status',        sort: false },
                  { label: 'View',          sort: false },
                ].map(({ label, sort }) => (
                  <th key={label}
                    className="px-3.5 py-3.5 text-left text-xs font-semibold whitespace-nowrap text-white">
                    <span className="inline-flex items-center">{label}
                      {sort && (
                        <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.7)"
                          strokeWidth="2.5" strokeLinecap="round" className="ml-1 inline-block flex-shrink-0">
                          <path d="m6 9 6-6 6 6"/><path d="m6 15 6 6 6-6"/>
                        </svg>
                      )}
                    </span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paginated.length === 0 ? (
                <tr>
                  <td colSpan={12} className="px-4 py-14 text-center text-sm text-gray-400">No records match your filters.</td>
                </tr>
              ) : paginated.map((emp, idx) => (
                <tr key={emp.id}
                  className="hover:bg-orange-50 transition-colors"
                  style={{ backgroundColor: idx % 2 === 0 ? '#fff' : '#FAFAFA' }}>
                  <td className="px-3.5 py-4 text-[11px] font-bold border-b border-gray-50 whitespace-nowrap" style={{ color: PRIMARY }}>
                    {emp.employeeCode}
                  </td>
                  <td className="px-3.5 py-4 border-b border-gray-50 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold text-white flex-shrink-0"
                        style={{ backgroundColor: PRIMARY }}>
                        {emp.name.split(' ').map(n => n[0]).slice(0, 2).join('')}
                      </div>
                      <div>
                        <p className="text-[13px] font-semibold text-gray-900 leading-none">{emp.name}</p>
                        <p className="text-[10px] text-gray-400 mt-0.5">{emp.designation}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-3.5 py-4 border-b border-gray-50">
                    <TimelineBar
                      checkIn={emp.checkIn}
                      checkOut={emp.checkOut}
                      breakMinutes={emp.breakMinutes}
                      lateMinutes={emp.lateMinutes}
                      overtimeMinutes={emp.overtimeMinutes}
                    />
                  </td>
                  <td className="px-3.5 py-4 text-[12px] text-gray-600 border-b border-gray-50 whitespace-nowrap">{emp.department}</td>
                  <td className="px-3.5 py-4 border-b border-gray-50 whitespace-nowrap">
                    <span className={`text-[12px] font-medium ${emp.checkIn ? 'text-green-600' : 'text-gray-300'}`}>
                      {emp.checkIn ? `${emp.checkIn} AM` : '—'}
                    </span>
                  </td>
                  <td className="px-3.5 py-4 border-b border-gray-50 whitespace-nowrap">
                    <span className={`text-[12px] font-medium ${emp.checkOut ? 'text-red-500' : 'text-gray-300'}`}>
                      {emp.checkOut ? `${emp.checkOut} PM` : '—'}
                    </span>
                  </td>
                  <td className="px-3.5 py-4 border-b border-gray-50 whitespace-nowrap">
                    <span className="text-[12px] font-bold text-gray-800">
                      {emp.workMinutes > 0 ? `${(emp.workMinutes / 60).toFixed(2)}h` : '—'}
                    </span>
                  </td>
                  <td className="px-3.5 py-4 border-b border-gray-50 whitespace-nowrap">
                    <span className={`text-[12px] font-medium ${emp.lateMinutes > 0 ? 'text-orange-500' : 'text-gray-400'}`}>
                      {emp.lateMinutes > 0 ? `+${emp.lateMinutes}` : '0'}
                    </span>
                  </td>
                  <td className="px-3.5 py-4 border-b border-gray-50 whitespace-nowrap">
                    <span className={`text-[12px] font-medium ${emp.overtimeMinutes > 0 ? 'text-blue-600' : 'text-gray-400'}`}>
                      {emp.overtimeMinutes > 0 ? `+${emp.overtimeMinutes}` : '0'}
                    </span>
                  </td>
                  <td className="px-3.5 py-4 text-[12px] text-gray-500 border-b border-gray-50 whitespace-nowrap">{emp.date}</td>
                  <td className="px-3.5 py-4 border-b border-gray-50 whitespace-nowrap">
                    <StatusBadge status={emp.status} />
                  </td>
                  <td className="px-3.5 py-4 border-b border-gray-50">
                    <button
                      onClick={() => setDetailRecord(emp)}
                      className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 text-gray-400 hover:border-[#C35E33] hover:text-[#C35E33] hover:bg-orange-50 transition-all"
                    >
                      <Eye size={14} strokeWidth={1.8} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Pagination current={page} total={filtered.length} pageSize={PAGE_SIZE} onChange={setPage} />
      </div>

      {/* ── Detail Modal ─────────────────────────────────────── */}
      {detailRecord && (
        <AttendanceDetailModal record={detailRecord} onClose={() => setDetailRecord(null)} />
      )}

      {/* ── Filter Modal ─────────────────────────────────────── */}
      <FilterModal
        isOpen={showFilter}
        onClose={() => setShowFilter(false)}
        onApply={(f) => setActiveFilters(f)}
        onReset={() => setActiveFilters({})}
        config={FILTER_CONFIG}
      />
    </>
  )
}