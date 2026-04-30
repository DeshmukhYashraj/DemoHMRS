// src/pages/shift/EmployeeShiftHistory.jsx
import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ArrowLeft, Search, Calendar, Filter, Clock,
  ChevronLeft, ChevronRight, TrendingUp, CheckCircle,
  CalendarDays, BarChart2, X,
} from 'lucide-react'

const PRIMARY   = '#C35E33'
const PAGE_SIZE = 8

// Mock history data (all shifts employee has ever had)
const ALL_HISTORY = [
  { id:  1, week: 'Apr 28 – Apr 30', shift: 'Morning Shift',   type: 'Normal', startTime: '09:00', endTime: '18:00', status: 'Active',   daysWorked: 3, totalHours: '24h 00m', lateCount: 0, overtimeHrs: '0h 00m', dateFrom: '2026-04-28', dateTo: '2026-04-30' },
  { id:  2, week: 'Apr 21 – Apr 25', shift: 'Morning Shift',   type: 'Normal', startTime: '09:00', endTime: '18:00', status: 'Active',   daysWorked: 5, totalHours: '40h 00m', lateCount: 0, overtimeHrs: '0h 30m', dateFrom: '2026-04-21', dateTo: '2026-04-25' },
  { id:  3, week: 'Apr 14 – Apr 18', shift: 'Morning Shift',   type: 'Normal', startTime: '09:00', endTime: '18:00', status: 'Active',   daysWorked: 5, totalHours: '39h 45m', lateCount: 1, overtimeHrs: '0h 00m', dateFrom: '2026-04-14', dateTo: '2026-04-18' },
  { id:  4, week: 'Apr 07 – Apr 11', shift: 'Morning Shift',   type: 'Normal', startTime: '09:00', endTime: '18:00', status: 'Active',   daysWorked: 4, totalHours: '32h 10m', lateCount: 0, overtimeHrs: '0h 00m', dateFrom: '2026-04-07', dateTo: '2026-04-11' },
  { id:  5, week: 'Mar 31 – Apr 04', shift: 'Morning Shift',   type: 'Normal', startTime: '09:00', endTime: '18:00', status: 'Active',   daysWorked: 5, totalHours: '40h 00m', lateCount: 0, overtimeHrs: '1h 00m', dateFrom: '2026-03-31', dateTo: '2026-04-04' },
  { id:  6, week: 'Mar 24 – Mar 28', shift: 'Evening Shift',   type: 'Normal', startTime: '14:00', endTime: '22:00', status: 'Previous', daysWorked: 5, totalHours: '40h 00m', lateCount: 0, overtimeHrs: '0h 00m', dateFrom: '2026-03-24', dateTo: '2026-03-28' },
  { id:  7, week: 'Mar 17 – Mar 21', shift: 'Evening Shift',   type: 'Normal', startTime: '14:00', endTime: '22:00', status: 'Previous', daysWorked: 5, totalHours: '40h 00m', lateCount: 2, overtimeHrs: '0h 45m', dateFrom: '2026-03-17', dateTo: '2026-03-21' },
  { id:  8, week: 'Mar 10 – Mar 14', shift: 'Evening Shift',   type: 'Normal', startTime: '14:00', endTime: '22:00', status: 'Previous', daysWorked: 4, totalHours: '32h 00m', lateCount: 0, overtimeHrs: '0h 00m', dateFrom: '2026-03-10', dateTo: '2026-03-14' },
  { id:  9, week: 'Mar 03 – Mar 07', shift: 'Afternoon Shift', type: 'Custom', startTime: '12:00', endTime: '21:00', status: 'Previous', daysWorked: 5, totalHours: '40h 00m', lateCount: 0, overtimeHrs: '0h 00m', dateFrom: '2026-03-03', dateTo: '2026-03-07' },
  { id: 10, week: 'Feb 24 – Feb 28', shift: 'Afternoon Shift', type: 'Custom', startTime: '12:00', endTime: '21:00', status: 'Previous', daysWorked: 5, totalHours: '40h 00m', lateCount: 1, overtimeHrs: '0h 00m', dateFrom: '2026-02-24', dateTo: '2026-02-28' },
  { id: 11, week: 'Feb 17 – Feb 21', shift: 'Morning Shift',   type: 'Normal', startTime: '09:00', endTime: '18:00', status: 'Previous', daysWorked: 5, totalHours: '40h 00m', lateCount: 0, overtimeHrs: '0h 15m', dateFrom: '2026-02-17', dateTo: '2026-02-21' },
  { id: 12, week: 'Feb 10 – Feb 14', shift: 'Morning Shift',   type: 'Normal', startTime: '09:00', endTime: '18:00', status: 'Previous', daysWorked: 5, totalHours: '39h 30m', lateCount: 0, overtimeHrs: '0h 00m', dateFrom: '2026-02-10', dateTo: '2026-02-14' },
]

const fmt12 = (t) => {
  if (!t) return '—'
  const [h, m] = t.split(':').map(Number)
  const ampm   = h >= 12 ? 'PM' : 'AM'
  const hh     = h > 12 ? h - 12 : h === 0 ? 12 : h
  return `${hh}:${m.toString().padStart(2,'0')} ${ampm}`
}

// ── Pagination ────────────────────────────────────────────────────────────────
function Pagination({ current, total, pageSize, onChange }) {
  const totalPages = Math.ceil(total / pageSize)
  if (totalPages <= 1) return null
  return (
    <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100 flex-wrap gap-2">
      <p className="text-xs text-gray-500">
        Showing <span className="font-semibold text-gray-800">{(current-1)*pageSize+1}–{Math.min(current*pageSize,total)}</span> of <span className="font-semibold text-gray-800">{total}</span>
      </p>
      <div className="flex items-center gap-1">
        <button onClick={() => onChange(current-1)} disabled={current===1}
          className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 text-gray-500 disabled:opacity-30 disabled:cursor-not-allowed hover:border-gray-400 transition-colors">
          <ChevronLeft size={14} />
        </button>
        {Array.from({length:totalPages},(_,i)=>i+1).map(p=>(
          <button key={p} onClick={()=>onChange(p)}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-xs font-medium border transition-all"
            style={{
              borderColor:     current===p ? PRIMARY : '#E5E7EB',
              backgroundColor: current===p ? PRIMARY : 'transparent',
              color:           current===p ? '#fff'   : '#6B7280',
            }}>
            {p}
          </button>
        ))}
        <button onClick={() => onChange(current+1)} disabled={current===Math.ceil(total/pageSize)}
          className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 text-gray-500 disabled:opacity-30 disabled:cursor-not-allowed hover:border-gray-400 transition-colors">
          <ChevronRight size={14} />
        </button>
      </div>
    </div>
  )
}

// ── Main page ─────────────────────────────────────────────────────────────────
export default function EmployeeShiftHistory() {
  const navigate = useNavigate()

  const [search,    setSearch]    = useState('')
  const [dateFrom,  setDateFrom]  = useState('')
  const [dateTo,    setDateTo]    = useState('')
  const [shiftFilter, setShiftFilter] = useState('')
  const [page,      setPage]      = useState(1)

  // Unique shift names for filter dropdown
  const shiftNames = [...new Set(ALL_HISTORY.map(r => r.shift))]

  const filtered = useMemo(() => {
    return ALL_HISTORY.filter(row => {
      const q         = search.toLowerCase()
      const srchMatch = !q || row.shift.toLowerCase().includes(q) || row.week.toLowerCase().includes(q)
      const sfMatch   = !shiftFilter || row.shift === shiftFilter
      const fromMatch = !dateFrom || row.dateFrom >= dateFrom
      const toMatch   = !dateTo   || row.dateTo   <= dateTo
      return srchMatch && sfMatch && fromMatch && toMatch
    })
  }, [search, shiftFilter, dateFrom, dateTo])

  const paginated = useMemo(
    () => filtered.slice((page-1)*PAGE_SIZE, page*PAGE_SIZE),
    [filtered, page]
  )

  const clearFilters = () => {
    setSearch(''); setDateFrom(''); setDateTo(''); setShiftFilter(''); setPage(1)
  }

  const hasFilters = search || dateFrom || dateTo || shiftFilter

  // ── Summary stats ──────────────────────────────────────────────────────────
  const totalHoursAll = ALL_HISTORY.reduce((sum, r) => {
    const [h, m] = r.totalHours.replace('h ','h').replace('m','').split('h').map(Number)
    return sum + h * 60 + m
  }, 0)
  const totalH = Math.floor(totalHoursAll / 60)
  const totalM = totalHoursAll % 60

  const uniqueShifts  = new Set(ALL_HISTORY.map(r=>r.shift)).size
  const totalLate     = ALL_HISTORY.reduce((s,r)=>s+r.lateCount,0)

  return (
    <>
      {/* ── Header ─────────────────────────────────────────── */}
      <div className="flex items-center gap-3 mb-5">
        <button
          onClick={() => navigate('/my-shift')}
          className="w-9 h-9 flex items-center justify-center rounded-xl border border-gray-200 text-gray-500 hover:bg-gray-50 transition-colors"
        >
          <ArrowLeft size={16} />
        </button>
        <div>
          <h1 className="text-xl font-bold text-gray-900">Shift History</h1>
          <p className="text-xs text-gray-400 mt-0.5">All your previous shift assignments and records</p>
        </div>
      </div>

      {/* ── Summary stats ──────────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
        {[
          { icon: <BarChart2 size={17} color={PRIMARY} />,          label: 'Total Records',   value: ALL_HISTORY.length,          bg: '#FDE8DD', color: PRIMARY    },
          { icon: <Clock size={17} color="#1D4ED8" />,              label: 'Total Hours',     value: `${totalH}h ${totalM}m`,     bg: '#DBEAFE', color: '#1D4ED8'  },
          { icon: <CalendarDays size={17} color="#15803D" />,       label: 'Shift Types',     value: `${uniqueShifts} shifts`,    bg: '#DCFCE7', color: '#15803D'  },
          { icon: <TrendingUp size={17} color="#854D0E" />,         label: 'Late Arrivals',   value: `${totalLate} times`,        bg: '#FEF9C3', color: '#854D0E'  },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: s.bg }}>
              {s.icon}
            </div>
            <div>
              <p className="text-lg font-bold leading-none" style={{ color: s.color }}>{s.value}</p>
              <p className="text-[10px] text-gray-500 mt-0.5 font-medium">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ── Filters row ────────────────────────────────────── */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 mb-4">
        <div className="flex items-center gap-2 flex-wrap">
          {/* Search */}
          <label className="flex items-center gap-2 bg-gray-50 rounded-xl px-3 h-10 border border-gray-200 cursor-text min-w-48 flex-1">
            <Search size={13} color="#9CA3AF" />
            <input
              type="text"
              value={search}
              onChange={e => { setSearch(e.target.value); setPage(1) }}
              placeholder="Search by shift or week…"
              className="border-none outline-none text-sm text-gray-900 bg-transparent w-full"
            />
          </label>

          {/* Shift name filter */}
          <select
            value={shiftFilter}
            onChange={e => { setShiftFilter(e.target.value); setPage(1) }}
            className="h-10 px-3 text-sm text-gray-700 bg-gray-50 border border-gray-200 rounded-xl outline-none cursor-pointer"
            onFocus={e => (e.target.style.borderColor = PRIMARY)}
            onBlur={e  => (e.target.style.borderColor = '#E5E7EB')}
          >
            <option value="">All Shifts</option>
            {shiftNames.map(n => <option key={n} value={n}>{n}</option>)}
          </select>

          {/* Date from */}
          <div className="relative">
            <input
              type="date"
              value={dateFrom}
              onChange={e => { setDateFrom(e.target.value); setPage(1) }}
              className="h-10 pl-9 pr-3 text-sm text-gray-700 bg-gray-50 border border-gray-200 rounded-xl outline-none cursor-pointer"
              onFocus={e => (e.target.style.borderColor = PRIMARY)}
              onBlur={e  => (e.target.style.borderColor = '#E5E7EB')}
            />
            <Calendar size={13} color="#9CA3AF" className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* Date to */}
          <div className="relative">
            <input
              type="date"
              value={dateTo}
              min={dateFrom}
              onChange={e => { setDateTo(e.target.value); setPage(1) }}
              className="h-10 pl-9 pr-3 text-sm text-gray-700 bg-gray-50 border border-gray-200 rounded-xl outline-none cursor-pointer"
              onFocus={e => (e.target.style.borderColor = PRIMARY)}
              onBlur={e  => (e.target.style.borderColor = '#E5E7EB')}
            />
            <Calendar size={13} color="#9CA3AF" className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* Clear */}
          {hasFilters && (
            <button
              onClick={clearFilters}
              className="flex items-center gap-1.5 h-10 px-3 rounded-xl border border-red-200 text-xs font-medium text-red-500 hover:bg-red-50 transition-colors"
            >
              <X size={12} />
              Clear
            </button>
          )}

          {/* Result count */}
          {hasFilters && (
            <span className="text-xs text-gray-400 ml-auto">
              {filtered.length} result{filtered.length !== 1 ? 's' : ''}
            </span>
          )}
        </div>
      </div>

      {/* ── Table ──────────────────────────────────────────── */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse" style={{ minWidth: 700 }}>
            <thead>
              <tr style={{ backgroundColor: PRIMARY }}>
                {['Week Period','Shift Name','Type','Timings','Status','Days Worked','Total Hours','Late','OT Hours'].map(h => (
                  <th key={h} className="px-4 py-3.5 text-left text-[11px] font-semibold text-white whitespace-nowrap first:pl-5">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paginated.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-4 py-14 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <CalendarDays size={28} color="#D1D5DB" />
                      <p className="text-sm text-gray-400">No records found for your filters</p>
                      {hasFilters && (
                        <button onClick={clearFilters} className="text-xs font-semibold mt-1" style={{ color: PRIMARY }}>
                          Clear filters
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ) : paginated.map((row, idx) => (
                <tr key={row.id}
                  className="hover:bg-orange-50 transition-colors border-b border-gray-50 last:border-0"
                  style={{ backgroundColor: idx % 2 === 0 ? '#fff' : '#FAFAFA' }}>

                  {/* Week */}
                  <td className="px-4 pl-5 py-4 text-xs font-medium text-gray-700 whitespace-nowrap">{row.week}</td>

                  {/* Shift name */}
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full flex-shrink-0"
                        style={{ backgroundColor: row.status === 'Active' ? '#22C55E' : '#9CA3AF' }} />
                      <span className="text-sm font-semibold" style={{ color: PRIMARY }}>{row.shift}</span>
                    </div>
                  </td>

                  {/* Type */}
                  <td className="px-4 py-4">
                    <span className="px-2.5 py-0.5 rounded-lg text-[10px] font-bold text-white"
                      style={{ backgroundColor: row.type === 'Normal' ? PRIMARY : '#111827' }}>
                      {row.type}
                    </span>
                  </td>

                  {/* Timings */}
                  <td className="px-4 py-4 text-xs text-gray-600 whitespace-nowrap">
                    {fmt12(row.startTime)} – {fmt12(row.endTime)}
                  </td>

                  {/* Status */}
                  <td className="px-4 py-4">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold"
                      style={{
                        backgroundColor: row.status === 'Active' ? '#DCFCE7' : '#F3F4F6',
                        color:           row.status === 'Active' ? '#15803D' : '#6B7280',
                      }}>
                      {row.status}
                    </span>
                  </td>

                  {/* Days */}
                  <td className="px-4 py-4 text-xs font-medium text-gray-700">{row.daysWorked} days</td>

                  {/* Total hours */}
                  <td className="px-4 py-4 text-xs font-bold text-gray-800">{row.totalHours}</td>

                  {/* Late */}
                  <td className="px-4 py-4">
                    <span className={`text-xs font-semibold ${row.lateCount > 0 ? '' : 'text-gray-400'}`}
                      style={row.lateCount > 0 ? { color: PRIMARY } : {}}>
                      {row.lateCount > 0 ? `${row.lateCount}×` : '—'}
                    </span>
                  </td>

                  {/* Overtime */}
                  <td className="px-4 py-4">
                    <span className={`text-xs font-semibold ${row.overtimeHrs !== '0h 00m' ? 'text-blue-600' : 'text-gray-400'}`}>
                      {row.overtimeHrs !== '0h 00m' ? row.overtimeHrs : '—'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Pagination current={page} total={filtered.length} pageSize={PAGE_SIZE} onChange={setPage} />
      </div>
    </>
  )
}