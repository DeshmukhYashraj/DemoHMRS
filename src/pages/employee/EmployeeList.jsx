// src/pages/employee/EmployeeList.jsx
import { useState, useMemo, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Filter, Search, UserPlus, ChevronLeft, ChevronRight } from 'lucide-react'
import FilterModal from '@/components/shared/FilterModal'

const PRIMARY  = '#C35E33'
const PAGE_SIZE = 8

const EMPLOYEES = [
  { id: '01', name: 'Mark G Parker',   dept: 'IT-Based', desig: 'Senior Developer',  email: 'demo@gmail.com', phone: '8952354526', date: '01-02-2023', status: 'Active',   type: 'Employee'    },
  { id: '02', name: 'Mark G Parker',   dept: 'IT-Based', desig: 'Junior Developer',  email: 'demo@gmail.com', phone: '8952354526', date: '01-02-2023', status: 'Inactive', type: 'Internship'  },
  { id: '03', name: 'Jaylon Vaccaro',  dept: 'IT-Based', desig: 'Senior Designer',   email: 'demo@gmail.com', phone: '8952354526', date: '01-02-2023', status: 'Hold',     type: 'Training'    },
  { id: '04', name: 'Mark G Parker',   dept: 'IT-Based', desig: 'Senior Designer',   email: 'demo@gmail.com', phone: '8952354526', date: '01-02-2023', status: 'Active',   type: 'Employee'    },
  { id: '05', name: 'Leo Workman',     dept: 'IT-Based', desig: 'Digital Marketing', email: 'demo@gmail.com', phone: '8952354526', date: '01-02-2023', status: 'Active',   type: 'Employee'    },
  { id: '06', name: 'Corey Botosh',    dept: 'IT-Based', desig: 'Senior Developer',  email: 'demo@gmail.com', phone: '8952354526', date: '01-02-2023', status: 'Active',   type: 'Training'    },
  { id: '07', name: 'James George',    dept: 'IT-Based', desig: 'Senior Developer',  email: 'demo@gmail.com', phone: '8952354526', date: '01-02-2023', status: 'Active',   type: 'Employee'    },
  { id: '08', name: 'Anika Rhiel',     dept: 'IT-Based', desig: 'UI/UX Designer',    email: 'demo@gmail.com', phone: '8952354526', date: '05-03-2023', status: 'Active',   type: 'Internship'  },
  { id: '09', name: 'Gretchen Curtis', dept: 'IT-Based', desig: 'Product Manager',   email: 'demo@gmail.com', phone: '8952354526', date: '10-04-2023', status: 'Inactive', type: 'Employee'    },
  { id: '10', name: 'Ryan Westervelt', dept: 'IT-Based', desig: 'DevOps Engineer',   email: 'demo@gmail.com', phone: '8952354526', date: '15-05-2023', status: 'Hold',     type: 'Training'    },
  { id: '11', name: 'Allison Bator',   dept: 'IT-Based', desig: 'QA Engineer',       email: 'demo@gmail.com', phone: '8952354526', date: '20-06-2023', status: 'Active',   type: 'Internship'  },
  { id: '12', name: 'Carla Korsgaard', dept: 'IT-Based', desig: 'Data Analyst',      email: 'demo@gmail.com', phone: '8952354526', date: '25-07-2023', status: 'Active',   type: 'Employee'    },
]

const FILTER_TABS = ['All', 'Internship', 'Training', 'Employee']

const FILTER_CONFIG = [
  { key: 'status', label: 'Status',      type: 'multi',  options: ['Active', 'Inactive', 'Hold'] },
  { key: 'type',   label: 'Type',        type: 'multi',  options: ['Employee', 'Internship', 'Training'] },
  { key: 'dept',   label: 'Department',  type: 'select', options: ['IT-Based', 'HR', 'Finance', 'Marketing'] },
  { key: 'from',   label: 'Joined From', type: 'date' },
  { key: 'to',     label: 'Joined To',   type: 'date' },
]

// ─── Status badge ─────────────────────────────────────────────────────────────
function StatusBadge({ status }) {
  const map = {
    Active:   { bg: '#DCFCE7', color: '#15803D' },
    Inactive: { bg: '#FEE2E2', color: '#B91C1C' },
    Hold:     { bg: '#1F2937', color: '#FFFFFF' },
  }
  const s = map[status] ?? map.Hold
  return (
    <span className="inline-flex px-3 py-0.5 rounded-full text-[11px] font-semibold whitespace-nowrap"
      style={{ backgroundColor: s.bg, color: s.color }}>
      {status}
    </span>
  )
}

// ─── Action dropdown ──────────────────────────────────────────────────────────
function ActionDropdown({ currentStatus, onStatusChange }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    const h = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', h)
    return () => document.removeEventListener('mousedown', h)
  }, [])

  const options = [
    { label: 'Active',   dot: '#15803D' },
    { label: 'Inactive', dot: '#B91C1C' },
    { label: 'Hold',     dot: '#1F2937' },
  ]

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-1 border rounded-md px-2.5 py-1 text-xs font-medium transition-all"
        style={{
          borderColor: open ? PRIMARY : '#E5E7EB',
          color: open ? PRIMARY : '#6B7280',
        }}
      >
        •••
        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor"
          strokeWidth="2.5" strokeLinecap="round"
          style={{ transform: open ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform .15s' }}>
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>

      {open && (
        <div className="absolute right-0 z-20 mt-1 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden" style={{ minWidth: 148 }}>
          <p className="px-3 pt-2.5 pb-1 text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Set Status</p>
          {options.map(({ label, dot }) => (
            <button key={label}
              onClick={() => { onStatusChange(label); setOpen(false) }}
              className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium hover:bg-gray-50 transition-colors text-left">
              <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: dot }} />
              <span className="text-gray-700">{label}</span>
              {currentStatus === label && (
                <svg className="ml-auto" width="12" height="12" viewBox="0 0 24 24" fill="none"
                  stroke={PRIMARY} strokeWidth="2.5" strokeLinecap="round">
                  <path d="M20 6 9 17l-5-5" />
                </svg>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

// ─── Sort icon ────────────────────────────────────────────────────────────────
function SortIcon() {
  return (
    <svg width="10" height="10" viewBox="0 0 24 24" fill="none"
      stroke={PRIMARY} strokeWidth="2.5" strokeLinecap="round" className="ml-1 inline-block flex-shrink-0">
      <path d="m6 9 6-6 6 6"/><path d="m6 15 6 6 6-6"/>
    </svg>
  )
}

// ─── Pagination ───────────────────────────────────────────────────────────────
function Pagination({ current, total, pageSize, onChange }) {
  const totalPages = Math.ceil(total / pageSize)
  if (totalPages <= 1) return null
  return (
    <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100 flex-wrap gap-3">
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
            style={{
              borderColor:     current === p ? PRIMARY : '#E5E7EB',
              backgroundColor: current === p ? PRIMARY : 'transparent',
              color:           current === p ? '#fff'  : '#6B7280',
            }}>
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

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function EmployeeList() {
  const navigate = useNavigate()

  const [activeTab,     setActiveTab]     = useState('All')
  const [search,        setSearch]        = useState('')
  const [showFilter,    setShowFilter]    = useState(false)
  const [activeFilters, setActiveFilters] = useState({})
  const [page,          setPage]          = useState(1)
  const [employees,     setEmployees]     = useState(EMPLOYEES)

  const counts = {
    total:    employees.length,
    active:   employees.filter((e) => e.status === 'Active').length,
    inactive: employees.filter((e) => e.status === 'Inactive').length,
    hold:     employees.filter((e) => e.status === 'Hold').length,
  }

  const filtered = useMemo(() => {
    const q = search.toLowerCase()
    return employees.filter((e) => {
      const tabMatch    = activeTab === 'All' || e.type === activeTab
      const searchMatch = !q || e.name.toLowerCase().includes(q) || e.desig.toLowerCase().includes(q) || e.email.toLowerCase().includes(q)
      const statusMatch = !activeFilters.status?.length || activeFilters.status.includes(e.status)
      const typeMatch   = !activeFilters.type?.length   || activeFilters.type.includes(e.type)
      const deptMatch   = !activeFilters.dept           || e.dept === activeFilters.dept
      return tabMatch && searchMatch && statusMatch && typeMatch && deptMatch
    })
  }, [activeTab, search, activeFilters, employees])

  useEffect(() => setPage(1), [activeTab, search, activeFilters])

  const paginated = useMemo(
    () => filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE),
    [filtered, page]
  )

  const filterCount = Object.values(activeFilters).filter((v) =>
    Array.isArray(v) ? v.length > 0 : !!v
  ).length

  const handleStatusChange = (id, status) =>
    setEmployees((prev) => prev.map((e) => e.id === id ? { ...e, status } : e))

  return (
    <>
      {/* ── Header ──────────────────────────────────────────── */}
      <div className="flex items-center justify-between mb-5 gap-3 flex-wrap">
        <div>
          <h1 className="text-xl font-bold text-gray-900 m-0">Employee Management</h1>
          <p className="text-xs text-gray-400 mt-0.5">Manage and track all employees</p>
        </div>
        <button
          onClick={() => navigate('/employee/add')}
          className="flex items-center gap-2 text-white rounded-lg px-4 py-2.5 text-[13px] font-semibold cursor-pointer whitespace-nowrap border-none transition-colors"
          style={{ backgroundColor: '#111827' }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#374151')}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#111827')}
        >
          <UserPlus size={15} strokeWidth={2} />
          Add Employee
        </button>
      </div>

      {/* ── Stats ───────────────────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
        {[
          { label: 'Total Employees', value: counts.total,    bg: '#F3F4F6', color: '#111827', icon: (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#111827" strokeWidth="1.8" strokeLinecap="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
          )},
          { label: 'Active',          value: counts.active,   bg: '#DCFCE7', color: '#15803D', icon: (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#15803D" strokeWidth="1.8" strokeLinecap="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
          )},
          { label: 'Inactive',        value: counts.inactive, bg: '#FEE2E2', color: '#B91C1C', icon: (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#B91C1C" strokeWidth="1.8" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
          )},
          { label: 'On Hold',         value: counts.hold,     bg: '#FEF9C3', color: '#854D0E', icon: (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#854D0E" strokeWidth="1.8" strokeLinecap="round"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>
          )},
        ].map(({ label, value, bg, color, icon }) => (
          <div key={label} className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: bg }}>
              {icon}
            </div>
            <div className="min-w-0">
              <p className="text-[22px] font-bold leading-none" style={{ color }}>{value}</p>
              <p className="text-[11px] text-gray-500 mt-0.5 font-medium truncate">{label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ── Toolbar ─────────────────────────────────────────── */}
      <div className="flex items-center gap-2 mb-4 flex-wrap">
        {/* Tabs */}
        <div className="flex items-center gap-1.5 flex-wrap">
          {FILTER_TABS.map((tab) => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs border cursor-pointer transition-all whitespace-nowrap"
              style={{
                borderColor:     activeTab === tab ? '#111827' : '#E5E7EB',
                color:           activeTab === tab ? '#111827' : '#6B7280',
                backgroundColor: activeTab === tab ? '#F9FAFB' : '#fff',
                fontWeight:      activeTab === tab ? 600 : 500,
              }}
            >
              
              {tab}
              {tab !== 'All' && (
                <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: PRIMARY }} />
              )}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 ml-auto">
          {/* Search */}
          <label className="flex items-center gap-2 bg-white rounded-lg px-3 h-9 border border-gray-200 cursor-text">
            <Search size={13} color="#9CA3AF" strokeWidth={2} className="flex-shrink-0" />
            <input
              type="text" value={search} onChange={(e) => setSearch(e.target.value)}
              placeholder="Search…"
              className="border-none outline-none text-[13px] text-gray-900 bg-transparent w-32 sm:w-40"
            />
          </label>

          {/* Filter */}
          <button
            onClick={() => setShowFilter(true)}
            className="relative flex items-center gap-1.5 bg-white border rounded-lg px-3 h-9 text-[13px] font-medium cursor-pointer hover:bg-gray-50 transition-colors"
            style={{ borderColor: filterCount > 0 ? PRIMARY : '#E5E7EB', color: filterCount > 0 ? PRIMARY : '#374151' }}
          >
            <Filter size={13} strokeWidth={2} />
            <span className="hidden sm:inline">Filter</span>
            {filterCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full text-[9px] font-bold text-white flex items-center justify-center"
                style={{ backgroundColor: PRIMARY }}>
                {filterCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* ── Table ───────────────────────────────────────────── */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse" style={{ minWidth: 700 }}>
            <thead>
              <tr>
                {[
                  { label: 'ID',            sort: true  },
                  { label: 'Employee Name', sort: true  },
                  { label: 'Department',    sort: false },
                  { label: 'Designation',   sort: false },
                  { label: 'Email',         sort: false },
                  { label: 'Phone',         sort: false },
                  { label: 'Joining Date',  sort: true  },
                  { label: 'Status',        sort: false },
                  { label: 'Action',        sort: false },
                ].map(({ label, sort }) => (
                  <th key={label}
                    className="px-3.5 py-3 text-left text-xs font-semibold bg-gray-50 border-b border-gray-100 whitespace-nowrap"
                    style={{ color: PRIMARY }}>
                    <span className="inline-flex items-center">{label}{sort && <SortIcon />}</span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paginated.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-4 py-14 text-center text-sm text-gray-400">
                    No employees match your filters.
                  </td>
                </tr>
              ) : paginated.map((emp) => (
                <tr key={emp.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-3.5 py-3 text-[11px] font-bold text-gray-400 border-b border-gray-50 whitespace-nowrap">#{emp.id}</td>
                  <td className="px-3.5 py-3 border-b border-gray-50 whitespace-nowrap">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold text-white flex-shrink-0"
                        style={{ backgroundColor: PRIMARY }}>
                        {emp.name.split(' ').map((n) => n[0]).slice(0, 2).join('')}
                      </div>
                      <div>
                        <p className="text-[13px] font-semibold text-gray-900 leading-none">{emp.name}</p>
                        <p className="text-[10px] text-gray-400 mt-0.5">{emp.type}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-3.5 py-3 text-[13px] text-gray-600 border-b border-gray-50 whitespace-nowrap">{emp.dept}</td>
                  <td className="px-3.5 py-3 text-[13px] text-gray-600 border-b border-gray-50 whitespace-nowrap">{emp.desig}</td>
                  <td className="px-3.5 py-3 text-[13px] text-gray-500 border-b border-gray-50 whitespace-nowrap">{emp.email}</td>
                  <td className="px-3.5 py-3 text-[13px] text-gray-500 border-b border-gray-50 whitespace-nowrap">{emp.phone}</td>
                  <td className="px-3.5 py-3 text-[13px] text-gray-500 border-b border-gray-50 whitespace-nowrap">{emp.date}</td>
                  <td className="px-3.5 py-3 border-b border-gray-50 whitespace-nowrap">
                    <StatusBadge status={emp.status} />
                  </td>
                  <td className="px-3.5 py-3 border-b border-gray-50">
                    <ActionDropdown
                      currentStatus={emp.status}
                      onStatusChange={(s) => handleStatusChange(emp.id, s)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Pagination current={page} total={filtered.length} pageSize={PAGE_SIZE} onChange={setPage} />
      </div>

      {/* ── Filter Modal ────────────────────────────────────── */}
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