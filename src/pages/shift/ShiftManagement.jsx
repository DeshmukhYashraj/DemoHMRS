// src/pages/shift/ShiftManagement.jsx
import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Search, Filter, MoreVertical, Plus, Clock, Users, Zap, CheckCircle,
  Eye, Edit2, Trash2, ToggleLeft, ChevronLeft, ChevronRight
} from 'lucide-react'
import FilterModal from '@/components/shared/FilterModal'

const PRIMARY      = '#C35E33'
const PRIMARY_DARK = '#A34A24'
const PAGE_SIZE    = 8

// ── Mock data ─────────────────────────────────────────────────────────────────
const SHIFTS = [
  { id: 1,  name: 'Morning Shift',   type: 'Normal', timing: '09:00 to 06:00', grace: '10min', late: '15min', overtime: 'Enable',  status: 'Active',   shiftId: '#SHIFT-0042', minHours: 8 },
  { id: 2,  name: 'Morning Shift',   type: 'Normal', timing: '09:00 to 06:00', grace: '10min', late: '15min', overtime: 'Enable',  status: 'Inactive', shiftId: '#SHIFT-0043', minHours: 8 },
  { id: 3,  name: 'Night Shift',     type: 'Normal', timing: '09:00 to 06:00', grace: '10min', late: '15min', overtime: 'Enable',  status: 'Hold',     shiftId: '#SHIFT-0044', minHours: 8 },
  { id: 4,  name: 'Morning Shift',   type: 'Custom', timing: 'Day-wise Config', grace: '05min', late: '10min', overtime: 'Disable', status: 'Active',   shiftId: '#SHIFT-0045', minHours: 8 },
  { id: 5,  name: 'Afternoon Shift', type: 'Custom', timing: 'Day-wise Config', grace: '05min', late: '10min', overtime: 'Active',  status: 'Active',   shiftId: '#SHIFT-0046', minHours: 8 },
  { id: 6,  name: 'Evening Shift',   type: 'Custom', timing: 'Day-wise Config', grace: '05min', late: '10min', overtime: 'Active',  status: 'Active',   shiftId: '#SHIFT-0047', minHours: 6 },
  { id: 7,  name: 'Morning Shift',   type: 'Normal', timing: '09:00 to 06:00', grace: '10min', late: '15min', overtime: 'Disable', status: 'Active',   shiftId: '#SHIFT-0048', minHours: 8 },
  { id: 8,  name: 'General Shift',   type: 'Normal', timing: '09:30 to 06:30', grace: '15min', late: '10min', overtime: 'Enable',  status: 'Active',   shiftId: '#SHIFT-0049', minHours: 8 },
  { id: 9,  name: 'Night Shift',     type: 'Custom', timing: 'Day-wise Config', grace: '10min', late: '15min', overtime: 'Enable',  status: 'Inactive', shiftId: '#SHIFT-0050', minHours: 8 },
  { id: 10, name: 'Flexible Shift',  type: 'Custom', timing: 'Day-wise Config', grace: '—',     late: '15min', overtime: 'Disable', status: 'Active',   shiftId: '#SHIFT-0051', minHours: 8 },
]

const FILTER_CONFIG = [
  { key: 'type',   label: 'Shift Type', type: 'multi',  options: ['Normal', 'Custom'] },
  { key: 'status', label: 'Status',     type: 'multi',  options: ['Active', 'Inactive', 'Hold'] },
]

const STATUS_STYLE = {
  Active:   { bg: '#DCFCE7', color: '#15803D' },
  Inactive: { bg: '#FEE2E2', color: '#B91C1C' },
  Hold:     { bg: '#111827', color: '#fff'     },
}

const OT_STYLE = {
  Enable:  { bg: PRIMARY,   color: '#fff' },
  Disable: { bg: '#9CA3AF', color: '#fff' },
  Active:  { bg: PRIMARY,   color: '#fff' },
}

function StatCard({ icon, value, label, color, bg }) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 flex items-start justify-between">
      <div>
        <p className="text-3xl font-bold" style={{ color }}>{value}</p>
        <p className="text-xs text-gray-500 mt-1 font-medium">{label}</p>
      </div>
      <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: bg }}>
        {icon}
      </div>
    </div>
  )
}

function ActionMenu({ shift, onView, onEdit, onDelete, onToggle }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 text-gray-400 hover:border-gray-400 hover:text-gray-700 transition-all"
      >
        <MoreVertical size={14} />
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-9 z-20 bg-white border border-gray-100 rounded-xl shadow-xl w-44 py-1 overflow-hidden">
            {[
              { icon: <Eye size={13} />,        label: 'View Details', action: onView   },
              { icon: <Edit2 size={13} />,       label: 'Edit Shift',   action: onEdit   },
              { icon: <ToggleLeft size={13} />,  label: shift.status === 'Active' ? 'Deactivate' : 'Activate', action: onToggle },
              { icon: <Trash2 size={13} />,      label: 'Delete Shift', action: onDelete, danger: true },
            ].map(({ icon, label, action, danger }) => (
              <button
                key={label}
                onClick={() => { action?.(); setOpen(false) }}
                className="w-full flex items-center gap-2.5 px-4 py-2.5 text-xs font-medium transition-colors hover:bg-gray-50 text-left"
                style={{ color: danger ? '#B91C1C' : '#374151' }}
              >
                {icon}{label}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

function Pagination({ current, total, pageSize, onChange }) {
  const totalPages = Math.ceil(total / pageSize)
  if (totalPages <= 1) return null
  return (
    <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100 flex-wrap gap-2">
      <p className="text-xs text-gray-500">
        Showing <span className="font-semibold text-gray-800">{(current-1)*pageSize+1}–{Math.min(current*pageSize, total)}</span> of <span className="font-semibold text-gray-800">{total}</span>
      </p>
      <div className="flex items-center gap-1">
        <button onClick={() => onChange(current-1)} disabled={current===1}
          className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 text-gray-500 disabled:opacity-30 disabled:cursor-not-allowed hover:border-gray-400 transition-colors">
          <ChevronLeft size={14}/>
        </button>
        {Array.from({length:totalPages},(_,i)=>i+1).map(p=>(
          <button key={p} onClick={()=>onChange(p)}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-xs font-medium border transition-all"
            style={{borderColor:current===p?PRIMARY:'#E5E7EB',backgroundColor:current===p?PRIMARY:'transparent',color:current===p?'#fff':'#6B7280'}}>
            {p}
          </button>
        ))}
        <button onClick={() => onChange(current+1)} disabled={current===totalPages}
          className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 text-gray-500 disabled:opacity-30 disabled:cursor-not-allowed hover:border-gray-400 transition-colors">
          <ChevronRight size={14}/>
        </button>
      </div>
    </div>
  )
}

export default function ShiftManagement() {
  const navigate = useNavigate()
  const [activeTab,     setActiveTab]     = useState('All')
  const [search,        setSearch]        = useState('')
  const [showFilter,    setShowFilter]    = useState(false)
  const [activeFilters, setActiveFilters] = useState({})
  const [page,          setPage]          = useState(1)

  const tabs = [
    { key: 'All',      label: 'All'      },
    { key: 'Normal',   label: 'Normal'   },
    { key: 'Custom',   label: 'Custom'   },
    { key: 'Active',   label: 'Active'   },
    { key: 'Inactive', label: 'Inactive' },
  ]

  const filtered = useMemo(() => {
    const q = search.toLowerCase()
    return SHIFTS.filter(s => {
      const tabMatch   = activeTab === 'All' || s.type === activeTab || s.status === activeTab
      const srchMatch  = !q || s.name.toLowerCase().includes(q) || s.shiftId.toLowerCase().includes(q)
      const typeMatch  = !activeFilters.type?.length   || activeFilters.type.includes(s.type)
      const statMatch  = !activeFilters.status?.length || activeFilters.status.includes(s.status)
      return tabMatch && srchMatch && typeMatch && statMatch
    })
  }, [activeTab, search, activeFilters])

  const paginated = useMemo(
    () => filtered.slice((page-1)*PAGE_SIZE, page*PAGE_SIZE),
    [filtered, page]
  )

  const filterCount = Object.values(activeFilters).filter(v => Array.isArray(v) ? v.length > 0 : !!v).length

  const stats = [
    { icon: <Clock size={18} color={PRIMARY} />,         value: SHIFTS.length + 'hrs',                                          label: 'Total Shift',  color: '#111827', bg: '#FDE8DD' },
    { icon: <Clock size={18} color="#1D4ED8" />,         value: SHIFTS.filter(s=>s.type==='Normal').length*8+'hrs',             label: 'Normal Shift', color: '#1D4ED8', bg: '#DBEAFE' },
    { icon: <Users size={18} color="#7C3AED" />,         value: SHIFTS.filter(s=>s.type==='Custom').length*6+'hrs',             label: 'Custom Shift', color: '#7C3AED', bg: '#F5F3FF' },
    { icon: <CheckCircle size={18} color="#15803D" />,   value: SHIFTS.filter(s=>s.status==='Active').length,                   label: 'Active Shift', color: '#15803D', bg: '#DCFCE7' },
  ]

  return (
    <>
      {/* ── Header ─────────────────────────────────────────── */}
      <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
        <div>
          <h1 className="text-xl font-bold text-gray-900 m-0">Shift Management</h1>
          <p className="text-xs text-gray-400 mt-0.5">Configure and manage all employee shifts</p>
        </div>
        <button
          onClick={() => navigate('/shift/new')}
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold text-white border-none cursor-pointer transition-colors"
          style={{ backgroundColor: '#111827' }}
          onMouseEnter={e => e.currentTarget.style.backgroundColor = '#374151'}
          onMouseLeave={e => e.currentTarget.style.backgroundColor = '#111827'}
        >
          <Plus size={15} strokeWidth={2.5} />
          New Shift
        </button>
      </div>

      {/* ── Stats ──────────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-5">
        {stats.map(s => <StatCard key={s.label} {...s} />)}
      </div>

      {/* ── Toolbar ────────────────────────────────────────── */}
      <div className="flex items-center gap-2 mb-4 flex-wrap">
        <div className="flex items-center gap-1.5 flex-wrap">
          {tabs.map(({ key, label }) => (
            <button key={key} onClick={() => { setActiveTab(key); setPage(1) }}
              className="px-3.5 py-1.5 rounded-full text-xs border cursor-pointer transition-all whitespace-nowrap"
              style={{
                borderColor:     activeTab===key ? '#111827' : '#E5E7EB',
                color:           activeTab===key ? '#111827' : '#6B7280',
                backgroundColor: activeTab===key ? '#F9FAFB' : '#fff',
                fontWeight:      activeTab===key ? 600 : 500,
              }}>
              {label}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2 ml-auto">
          <label className="flex items-center gap-2 bg-white rounded-lg px-3 h-9 border border-gray-200 cursor-text">
            <Search size={13} color="#9CA3AF" strokeWidth={2} />
            <input type="text" value={search} onChange={e => { setSearch(e.target.value); setPage(1) }}
              placeholder="Search shifts…"
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

      {/* ── Table ──────────────────────────────────────────── */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse" style={{ minWidth: 760 }}>
            <thead>
              <tr style={{ backgroundColor: PRIMARY }}>
                {['Shift Name','Type','Timing','Grace / Late','Overtime','Status','Action'].map(h => (
                  <th key={h} className="px-4 py-3.5 text-left text-xs font-semibold text-white whitespace-nowrap first:pl-5">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paginated.length === 0 ? (
                <tr><td colSpan={7} className="px-4 py-14 text-center text-sm text-gray-400">No shifts match your filters.</td></tr>
              ) : paginated.map((shift, idx) => {
                const ss = STATUS_STYLE[shift.status] ?? { bg: '#F3F4F6', color: '#374151' }
                const os = OT_STYLE[shift.overtime]   ?? { bg: '#9CA3AF', color: '#fff' }
                return (
                  <tr key={shift.id}
                    className="hover:bg-orange-50 transition-colors"
                    style={{ backgroundColor: idx % 2 === 0 ? '#fff' : '#FAFAFA' }}>
                    <td className="px-4 pl-5 py-4 border-b border-gray-50">
                      <p className="text-[13px] font-semibold text-gray-900">{shift.name}</p>
                      <p className="text-[10px] mt-0.5 font-medium" style={{ color: PRIMARY }}>{shift.shiftId}</p>
                    </td>
                    <td className="px-4 py-4 border-b border-gray-50">
                      <span className="px-2.5 py-1 rounded-lg text-[11px] font-semibold"
                        style={{
                          backgroundColor: shift.type==='Normal' ? PRIMARY : '#111827',
                          color: '#fff'
                        }}>
                        {shift.type}
                      </span>
                    </td>
                    <td className="px-4 py-4 border-b border-gray-50 text-[12px] text-gray-600 whitespace-nowrap">{shift.timing}</td>
                    <td className="px-4 py-4 border-b border-gray-50 text-[12px] text-gray-700 whitespace-nowrap font-medium">
                      {shift.grace} / {shift.late}
                    </td>
                    <td className="px-4 py-4 border-b border-gray-50">
                      <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold"
                        style={{ backgroundColor: os.bg, color: os.color }}>
                        {shift.overtime}
                      </span>
                    </td>
                    <td className="px-4 py-4 border-b border-gray-50">
                      <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold"
                        style={{ backgroundColor: ss.bg, color: ss.color }}>
                        {shift.status}
                      </span>
                    </td>
                    <td className="px-4 py-4 border-b border-gray-50">
                      <ActionMenu
                        shift={shift}
                        onView={() => navigate(`/shift/${shift.id}/view`)}
                        onEdit={() => navigate(`/shift/${shift.id}/edit`)}
                        onDelete={() => {}}
                        onToggle={() => {}}
                      />
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
        <Pagination current={page} total={filtered.length} pageSize={PAGE_SIZE} onChange={setPage} />
      </div>

      <FilterModal
        isOpen={showFilter}
        onClose={() => setShowFilter(false)}
        onApply={f => { setActiveFilters(f); setPage(1) }}
        onReset={() => setActiveFilters({})}
        config={FILTER_CONFIG}
      />
    </>
  )
}