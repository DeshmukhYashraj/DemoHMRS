// src/pages/leave/tabs/LeaveOverviewTab.jsx
import { useState, useMemo, useEffect } from 'react'
import { Search, Filter, Eye, ChevronLeft, ChevronRight, Check, X, Clock, Users, CalendarCheck, CalendarX, AlertCircle } from 'lucide-react'
import FilterModal from '@/components/shared/FilterModal'
import LeaveRequestDetailModal from '../modals/LeaveRequestDetailModal'

const PRIMARY      = '#C35E33'
const PRIMARY_DARK = '#A34A24'
const PAGE_SIZE    = 8

const LEAVE_DATA = [
  {
    id: 1,
    employeeCode: 'AJ001',
    name: 'Jaylon',
    designation: 'Sr. Developer',
    department: 'IT Department',
    leaveType: 'Sick Leave',
    startDate: '06-Apr-2026',
    endDate: '09-Apr-2026',
    days: 4,

    appliedDays: 4,
    activeDays: 2,
    cancelledDates: ['08-Apr-2026', '09-Apr-2026'],
    actualLeaveDates: ['06-Apr-2026', '07-Apr-2026'],

    appliedOn: '05-Apr-2026',
    status: 'APPROVED',
    reason: 'High fever and doctor advised rest.'
  },

  {
    id: 2,
    employeeCode: 'AJ002',
    name: 'Jaxson',
    designation: 'Designer',
    department: 'IT Department',
    leaveType: 'Casual Leave',
    startDate: '05-Apr-2026',
    endDate: '06-Apr-2026',
    days: 2,

    appliedDays: 2,
    activeDays: 0,
    cancelledDates: ['05-Apr-2026', '06-Apr-2026'],
    actualLeaveDates: [],

    appliedOn: '03-Apr-2026',
    status: 'REJECTED',
    reason: 'Personal work.'
  },

  {
    id: 3,
    employeeCode: 'AJ003',
    name: 'Adison',
    designation: 'Sr. Java Dev',
    department: 'IT Department',
    leaveType: 'Sick Leave',
    startDate: '05-Apr-2026',
    endDate: '05-Apr-2026',
    days: 1,

    appliedDays: 1,
    activeDays: 1,
    cancelledDates: [],
    actualLeaveDates: ['05-Apr-2026'],

    appliedOn: '04-Apr-2026',
    status: 'PENDING',
    reason: 'Medical appointment.'
  },

  {
    id: 4,
    employeeCode: 'AJ004',
    name: 'Alfredo',
    designation: 'HR Manager',
    department: 'HR Department',
    leaveType: 'Earned Leave',
    startDate: '05-Apr-2026',
    endDate: '06-Apr-2026',
    days: 2,

    appliedDays: 2,
    activeDays: 2,
    cancelledDates: [],
    actualLeaveDates: ['05-Apr-2026', '06-Apr-2026'],

    appliedOn: '03-Apr-2026',
    status: 'APPROVED',
    reason: 'Annual vacation.'
  },

  {
    id: 5,
    employeeCode: 'AJ005',
    name: 'Sarah',
    designation: 'QA Engineer',
    department: 'IT Department',
    leaveType: 'Annual Leave',
    startDate: '10-Apr-2026',
    endDate: '15-Apr-2026',
    days: 6,

    appliedDays: 6,
    activeDays: 6,
    cancelledDates: [],
    actualLeaveDates: ['10-Apr-2026','11-Apr-2026','12-Apr-2026','13-Apr-2026','14-Apr-2026','15-Apr-2026'],

    appliedOn: '01-Apr-2026',
    status: 'PENDING',
    reason: 'Family vacation.'
  },

  {
    id: 6,
    employeeCode: 'AJ006',
    name: 'Marcus',
    designation: 'DevOps',
    department: 'Engineering',
    leaveType: 'Casual Leave',
    startDate: '08-Apr-2026',
    endDate: '08-Apr-2026',
    days: 1,

    appliedDays: 1,
    activeDays: 1,
    cancelledDates: [],
    actualLeaveDates: ['08-Apr-2026'],

    appliedOn: '06-Apr-2026',
    status: 'APPROVED',
    reason: 'Personal errand.'
  },

  {
    id: 7,
    employeeCode: 'AJ007',
    name: 'Priya',
    designation: 'Product Mgr',
    department: 'Marketing',
    leaveType: 'Sick Leave',
    startDate: '09-Apr-2026',
    endDate: '11-Apr-2026',
    days: 3,

    appliedDays: 3,
    activeDays: 2,
    cancelledDates: ['11-Apr-2026'],
    actualLeaveDates: ['09-Apr-2026', '10-Apr-2026'],

    appliedOn: '08-Apr-2026',
    status: 'PENDING',
    reason: 'Viral infection.'
  },

  {
    id: 8,
    employeeCode: 'AJ008',
    name: 'Chen',
    designation: 'Frontend Dev',
    department: 'IT Department',
    leaveType: 'Annual Leave',
    startDate: '20-Apr-2026',
    endDate: '25-Apr-2026',
    days: 6,

    appliedDays: 6,
    activeDays: 5,
    cancelledDates: ['23-Apr-2026'],
    actualLeaveDates: ['20-Apr-2026','21-Apr-2026','22-Apr-2026','24-Apr-2026','25-Apr-2026'],

    appliedOn: '15-Apr-2026',
    status: 'APPROVED',
    reason: 'Travel abroad.'
  },

  {
    id: 9,
    employeeCode: 'AJ009',
    name: 'Nina',
    designation: 'Data Analyst',
    department: 'Finance',
    leaveType: 'Casual Leave',
    startDate: '15-Apr-2026',
    endDate: '16-Apr-2026',
    days: 2,

    appliedDays: 2,
    activeDays: 0,
    cancelledDates: ['15-Apr-2026', '16-Apr-2026'],
    actualLeaveDates: [],

    appliedOn: '13-Apr-2026',
    status: 'REJECTED',
    reason: 'Family event.'
  },

  {
    id: 10,
    employeeCode: 'AJ010',
    name: 'Omar',
    designation: 'Backend Dev',
    department: 'IT Department',
    leaveType: 'Earned Leave',
    startDate: '22-Apr-2026',
    endDate: '24-Apr-2026',
    days: 3,

    appliedDays: 3,
    activeDays: 3,
    cancelledDates: [],
    actualLeaveDates: ['22-Apr-2026','23-Apr-2026','24-Apr-2026'],

    appliedOn: '20-Apr-2026',
    status: 'PENDING',
    reason: 'Personal leave.'
  }
]
const FILTER_CONFIG = [
  { key: 'status',    label: 'Status',      type: 'multi',  options: ['PENDING','APPROVED','REJECTED'] },
  { key: 'leaveType', label: 'Leave Type',  type: 'select', options: ['Sick Leave','Casual Leave','Earned Leave','Annual Leave'] },
  { key: 'dept',      label: 'Department',  type: 'select', options: ['IT Department','HR Department','Engineering','Marketing','Finance'] },
  { key: 'dateFrom',  label: 'Date From',   type: 'date' },
  { key: 'dateTo',    label: 'Date To',     type: 'date' },
]

const STATUS_MAP = {
  APPROVED: { label: 'Approved', bg: '#DCFCE7', color: '#15803D' },
  REJECTED: { label: 'Rejected', bg: '#FEE2E2', color: '#DC2626' },
  PENDING:  { label: 'Pending',  bg: '#F3F4F6', color: '#374151' },
}

function StatusBadge({ status }) {
  const s = STATUS_MAP[status] ?? { label: status, bg: '#F3F4F6', color: '#374151' }
  return (
    <span className="inline-flex px-2.5 py-0.5 rounded-full text-[10px] font-semibold whitespace-nowrap"
      style={{ backgroundColor: s.bg, color: s.color }}>
      {s.label}
    </span>
  )
}

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

export default function LeaveOverviewTab() {
  const [search,        setSearch]        = useState('')
  const [activeTab,     setActiveTab]     = useState('All')
  const [showFilter,    setShowFilter]    = useState(false)
  const [activeFilters, setActiveFilters] = useState({})
  const [page,          setPage]          = useState(1)
  const [detailRecord,  setDetailRecord]  = useState(null)
  const [records,       setRecords]       = useState(LEAVE_DATA)

  const tabs = [
    { key: 'All',      label: 'All',      count: records.length },
    { key: 'PENDING',  label: 'Pending',  count: records.filter(r => r.status === 'PENDING').length },
    { key: 'APPROVED', label: 'Approved', count: records.filter(r => r.status === 'APPROVED').length },
    { key: 'REJECTED', label: 'Rejected', count: records.filter(r => r.status === 'REJECTED').length },
  ]

  const statsData = [
    { label: 'Total Requests', value: records.length,                                        color: '#111827', bg: '#F3F4F6', icon: <Users size={16} color="#111827" strokeWidth={1.8}/> },
    { label: 'Pending',        value: records.filter(r => r.status === 'PENDING').length,    color: '#374151', bg: '#F3F4F6', icon: <Clock size={16} color="#374151" strokeWidth={1.8}/> },
    { label: 'Approved',       value: records.filter(r => r.status === 'APPROVED').length,   color: '#15803D', bg: '#DCFCE7', icon: <CalendarCheck size={16} color="#15803D" strokeWidth={1.8}/> },
    { label: 'Rejected',       value: records.filter(r => r.status === 'REJECTED').length,   color: '#DC2626', bg: '#FEE2E2', icon: <CalendarX size={16} color="#DC2626" strokeWidth={1.8}/> },
  ]

  const filtered = useMemo(() => {
    const q = search.toLowerCase()
    return records.filter((r) => {
      const tabMatch    = activeTab === 'All' || r.status === activeTab
      const searchMatch = !q || r.name.toLowerCase().includes(q) || r.employeeCode.toLowerCase().includes(q) || r.leaveType.toLowerCase().includes(q)
      const statusMatch = !activeFilters.status?.length || activeFilters.status.includes(r.status)
      const typeMatch   = !activeFilters.leaveType || r.leaveType === activeFilters.leaveType
      const deptMatch   = !activeFilters.dept || r.department === activeFilters.dept
      return tabMatch && searchMatch && statusMatch && typeMatch && deptMatch
    })
  }, [activeTab, search, activeFilters, records])

  useEffect(() => setPage(1), [activeTab, search, activeFilters])

  const paginated = useMemo(
    () => filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE),
    [filtered, page]
  )

  const filterCount = Object.values(activeFilters).filter((v) => Array.isArray(v) ? v.length > 0 : !!v).length

  const handleApprove = (id) => {
    setRecords(prev => prev.map(r => r.id === id ? { ...r, status: 'APPROVED' } : r))
  }
  const handleReject = (id) => {
    setRecords(prev => prev.map(r => r.id === id ? { ...r, status: 'REJECTED' } : r))
  }

  return (
    <>
      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
        {statsData.map(({ label, value, color, bg, icon }) => (
          <div key={label} className="bg-white rounded-xl border border-gray-100 shadow-sm p-3.5 flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: bg }}>{icon}</div>
            <div>
              <p className="text-xl font-bold leading-none" style={{ color }}>{value}</p>
              <p className="text-[10px] text-gray-500 mt-0.5 font-medium">{label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Toolbar */}
      <div className="flex items-center gap-2 mb-4 flex-wrap">
        <div className="flex items-center gap-1.5 flex-wrap">
          {tabs.map(({ key, label, count }) => (
            <button key={key} onClick={() => setActiveTab(key)}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs border cursor-pointer transition-all whitespace-nowrap"
              style={{ borderColor: activeTab === key ? '#111827' : '#E5E7EB', color: activeTab === key ? '#111827' : '#6B7280', backgroundColor: activeTab === key ? '#F9FAFB' : '#fff', fontWeight: activeTab === key ? 600 : 500 }}>
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
            <Search size={13} color="#9CA3AF" strokeWidth={2} />
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

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse" style={{ minWidth: 900 }}>
            <thead>
              <tr style={{ backgroundColor: PRIMARY }}>
                {['Employee ID','Employee Name','Designation','Department','Leave Type','Days','Applied On','Status','Actions'].map((h) => (
                  <th key={h} className="px-3.5 py-3.5 text-left text-xs font-semibold whitespace-nowrap text-white">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paginated.length === 0 ? (
                <tr><td colSpan={9} className="px-4 py-14 text-center text-sm text-gray-400">No records found.</td></tr>
              ) : paginated.map((rec, idx) => (
                <tr key={rec.id}
                  className="hover:bg-orange-50 transition-colors"
                  style={{ backgroundColor: idx % 2 === 0 ? '#fff' : '#FAFAFA' }}>
                  <td className="px-3.5 py-4 text-[11px] font-bold border-b border-gray-50 whitespace-nowrap" style={{ color: PRIMARY }}>{rec.employeeCode}</td>
                  <td className="px-3.5 py-4 border-b border-gray-50 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold text-white flex-shrink-0"
                        style={{ backgroundColor: PRIMARY }}>
                        {rec.name[0]}
                      </div>
                      <span className="text-[13px] font-semibold text-gray-900">{rec.name}</span>
                    </div>
                  </td>
                  <td className="px-3.5 py-4 text-[12px] text-gray-600 border-b border-gray-50 whitespace-nowrap">{rec.designation}</td>
                  <td className="px-3.5 py-4 text-[12px] text-gray-600 border-b border-gray-50 whitespace-nowrap">{rec.department}</td>
                  <td className="px-3.5 py-4 border-b border-gray-50 whitespace-nowrap">
                    <span className="text-[12px] font-medium text-gray-800">{rec.leaveType}</span>
                  </td>
                  <td className="px-3.5 py-4 text-[12px] font-bold border-b border-gray-50 whitespace-nowrap" style={{ color: PRIMARY }}>{rec.days}</td>
                  <td className="px-3.5 py-4 text-[12px] text-gray-500 border-b border-gray-50 whitespace-nowrap">{rec.appliedOn}</td>
                  <td className="px-3.5 py-4 border-b border-gray-50 whitespace-nowrap"><StatusBadge status={rec.status} /></td>
                  <td className="px-3.5 py-4 border-b border-gray-50">
                    <div className="flex items-center gap-1.5">
                      {rec.status === 'PENDING' && (
                        <>
                          <button onClick={() => handleApprove(rec.id)}
                            className="w-7 h-7 flex items-center justify-center rounded-lg border border-green-200 text-green-600 hover:bg-green-50 transition-all" title="Approve">
                            <Check size={13} strokeWidth={2.5} />
                          </button>
                          <button onClick={() => handleReject(rec.id)}
                            className="w-7 h-7 flex items-center justify-center rounded-lg border border-red-200 text-red-500 hover:bg-red-50 transition-all" title="Reject">
                            <X size={13} strokeWidth={2.5} />
                          </button>
                        </>
                      )}
                      <button onClick={() => setDetailRecord(rec)}
                        className="w-7 h-7 flex items-center justify-center rounded-lg border border-gray-200 text-gray-400 hover:border-[#C35E33] hover:text-[#C35E33] hover:bg-orange-50 transition-all" title="View">
                        <Eye size={13} strokeWidth={1.8} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Pagination current={page} total={filtered.length} pageSize={PAGE_SIZE} onChange={setPage} />
      </div>

      {detailRecord && (
        <LeaveRequestDetailModal
          record={detailRecord}
          onClose={() => setDetailRecord(null)}
          onApprove={handleApprove}
          onReject={handleReject}
        />
      )}

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