// src/pages/attendance/PendingApprovals.jsx
import { useState, useMemo, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, Filter, ChevronLeft, ChevronRight, ArrowLeft, Check, X, Eye, Clock } from 'lucide-react'
import FilterModal from '@/components/shared/FilterModal'

const PRIMARY      = '#C35E33'
const PRIMARY_DARK = '#A34A24'
const PAGE_SIZE    = 8

const REQUESTS = [
  {
    id: 1,
    employeeCode: 'JK-01',
    name: 'Maria Garcia',
    department: 'Engineering',
    avatar: null,
    avatarColor: '#E91E63',
    requestDate: 'Oct 14, 2023',
    timeRange: '09:15 AM – 05:00 PM',
    originalCheckIn:  '—',
    originalCheckOut: '—',
    requestedCheckIn: '09:15 AM',
    requestedCheckOut:'05:00 PM',
    notes: 'Internet connection was down in the morning so I couldn\'t log in.',
    status: 'Pending',
    remarks: '',
  },
  {
    id: 2,
    employeeCode: 'JK-02',
    name: 'James Wilson',
    department: 'Sales',
    avatar: null,
    avatarColor: '#9C27B0',
    requestDate: 'Oct 14, 2023',
    timeRange: '08:00 AM – 04:30 PM',
    originalCheckIn:  '08:05 AM',
    originalCheckOut: '—',
    requestedCheckIn: '08:00 AM',
    requestedCheckOut:'04:30 PM',
    notes: 'Forgot to clock out yesterday evening.',
    status: 'Approved',
    remarks: 'Approved by HR',
  },
  {
    id: 3,
    employeeCode: 'JK-03',
    name: 'Sarah Connor',
    department: 'Marketing',
    avatar: null,
    avatarColor: '#2196F3',
    requestDate: 'Oct 13, 2023',
    timeRange: '10:00 AM – 06:00 PM',
    originalCheckIn:  '10:10 AM',
    originalCheckOut: '06:05 PM',
    requestedCheckIn: '10:00 AM',
    requestedCheckOut:'06:00 PM',
    notes: 'Attended an offsite event in the morning, check-in device was unavailable.',
    status: 'No response',
    remarks: '',
  },
  {
    id: 4,
    employeeCode: 'JK-07',
    name: 'Leo Workman',
    department: 'Engineering',
    avatar: null,
    avatarColor: '#4CAF50',
    requestDate: 'Oct 12, 2023',
    timeRange: '09:30 AM – 06:30 PM',
    originalCheckIn:  '11:10 AM',
    originalCheckOut: '06:30 PM',
    requestedCheckIn: '09:30 AM',
    requestedCheckOut:'06:30 PM',
    notes: 'Was in a client meeting from 9:30 AM and couldn\'t log in remotely.',
    status: 'Pending',
    remarks: '',
  },
  {
    id: 5,
    employeeCode: 'JK-09',
    name: 'Gretchen Curtis',
    department: 'Finance',
    avatar: null,
    avatarColor: '#FF9800',
    requestDate: 'Oct 11, 2023',
    timeRange: '09:30 AM – 05:30 PM',
    originalCheckIn:  '09:50 AM',
    originalCheckOut: '05:35 PM',
    requestedCheckIn: '09:30 AM',
    requestedCheckOut:'05:30 PM',
    notes: 'System update caused login delay at office terminal.',
    status: 'Rejected',
    remarks: 'Insufficient justification',
  },
]

const STATUS_STYLE = {
  Pending:      { bg: '#6B7280', color: '#fff'    },
  Approved:     { bg: PRIMARY,   color: '#fff'    },
  'No response':{ bg: '#EF4444', color: '#fff'    },
  Rejected:     { bg: '#1F2937', color: '#fff'    },
}

const FILTER_CONFIG = [
  { key: 'status', label: 'Status',     type: 'multi',  options: ['Pending','Approved','Rejected','No response'] },
  { key: 'dept',   label: 'Department', type: 'select', options: ['Engineering','Sales','Marketing','HR','Finance'] },
  { key: 'from',   label: 'From Date',  type: 'date' },
  { key: 'to',     label: 'To Date',    type: 'date' },
]

// ─── Detail modal (view details of a single request) ─────────────────────────
function DetailModal({ request, onClose, onApprove, onReject }) {
  const ref = useRef(null)

  useEffect(() => {
    const h = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', h)
    return () => window.removeEventListener('keydown', h)
  }, [])

  const status = STATUS_STYLE[request.status] ?? { bg: '#6B7280', color: '#fff' }

  return (
    <div ref={ref} onClick={(e) => { if (e.target === ref.current) onClose() }}
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ backgroundColor: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(3px)' }}>

      <div className="bg-white rounded-2xl shadow-2xl w-full flex flex-col" style={{ maxWidth: 520, maxHeight: '90vh', margin: '0 16px' }}>

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 rounded-t-2xl" style={{ backgroundColor: '#111827' }}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white"
              style={{ backgroundColor: request.avatarColor }}>
              {request.name.split(' ').map(n => n[0]).slice(0, 2).join('')}
            </div>
            <div>
              <p className="text-white font-semibold text-sm leading-none">{request.name}</p>
              <p className="text-gray-400 text-[11px] mt-0.5">{request.employeeCode} · {request.department}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold" style={{ backgroundColor: status.bg, color: status.color }}>
              {request.status}
            </span>
            <button onClick={onClose} className="w-8 h-8 rounded-lg bg-gray-700 flex items-center justify-center text-gray-300 hover:bg-gray-600 transition-colors">
              <X size={15} />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
          {/* Date */}
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <Clock size={12} />
            <span>Request Date: <span className="font-semibold text-gray-700">{request.requestDate}</span></span>
          </div>

          {/* Time comparison */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3.5 rounded-xl bg-red-50 border border-red-100">
              <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-wide mb-2">Original Time</p>
              <p className="text-sm font-bold text-red-500">{request.originalCheckIn}</p>
              <p className="text-[10px] text-gray-400 mt-0.5">Check In</p>
              <p className="text-sm font-bold text-red-500 mt-2">{request.originalCheckOut}</p>
              <p className="text-[10px] text-gray-400 mt-0.5">Check Out</p>
            </div>
            <div className="p-3.5 rounded-xl bg-green-50 border border-green-100">
              <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-wide mb-2">Requested Time</p>
              <p className="text-sm font-bold text-green-600">{request.requestedCheckIn}</p>
              <p className="text-[10px] text-gray-400 mt-0.5">Check In</p>
              <p className="text-sm font-bold text-green-600 mt-2">{request.requestedCheckOut}</p>
              <p className="text-[10px] text-gray-400 mt-0.5">Check Out</p>
            </div>
          </div>

          {/* Reason */}
          <div className="p-3.5 rounded-xl bg-gray-50 border border-gray-100">
            <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Reason / Notes</p>
            <p className="text-sm text-gray-700 leading-relaxed">{request.notes}</p>
          </div>

          {/* Remarks (if any) */}
          {request.remarks && (
            <div className="p-3.5 rounded-xl border border-yellow-100 bg-yellow-50">
              <p className="text-[10px] font-semibold text-yellow-700 uppercase tracking-wide mb-1">Admin Remarks</p>
              <p className="text-sm text-yellow-800">{request.remarks}</p>
            </div>
          )}
        </div>

        {/* Footer actions */}
        <div className="px-5 py-4 border-t border-gray-100 flex items-center gap-2 justify-end">
          <button onClick={onClose}
            className="px-4 py-2 rounded-lg border border-gray-200 text-sm text-gray-500 hover:bg-gray-50 transition-colors">
            Close
          </button>
          {request.status === 'Pending' || request.status === 'No response' ? (
            <>
              <button onClick={() => { onReject(request.id); onClose() }}
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg border border-red-200 text-red-600 text-sm font-medium hover:bg-red-50 transition-colors">
                <X size={13} /> Reject
              </button>
              <button onClick={() => { onApprove(request.id); onClose() }}
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold text-white transition-colors"
                style={{ backgroundColor: '#15803D' }}>
                <Check size={13} /> Approve
              </button>
            </>
          ) : null}
        </div>
      </div>
    </div>
  )
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function PendingApprovals() {
  const navigate = useNavigate()

  const [search,        setSearch]        = useState('')
  const [showFilter,    setShowFilter]    = useState(false)
  const [activeFilters, setActiveFilters] = useState({})
  const [page,          setPage]          = useState(1)
  const [requests,      setRequests]      = useState(REQUESTS)
  const [detailItem,    setDetailItem]    = useState(null)

  const filtered = useMemo(() => {
    const q = search.toLowerCase()
    return requests.filter((r) => {
      const searchMatch = !q || r.name.toLowerCase().includes(q) || r.employeeCode.toLowerCase().includes(q) || r.department.toLowerCase().includes(q)
      const statusMatch = !activeFilters.status?.length || activeFilters.status.includes(r.status)
      const deptMatch   = !activeFilters.dept || r.department === activeFilters.dept
      return searchMatch && statusMatch && deptMatch
    })
  }, [search, activeFilters, requests])

  useEffect(() => setPage(1), [search, activeFilters])

  const paginated = useMemo(
    () => filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE),
    [filtered, page]
  )

  const filterCount = Object.values(activeFilters).filter((v) => Array.isArray(v) ? v.length > 0 : !!v).length

  const handleApprove = (id) => setRequests((prev) => prev.map((r) => r.id === id ? { ...r, status: 'Approved', remarks: 'Approved by admin' } : r))
  const handleReject  = (id) => setRequests((prev) => prev.map((r) => r.id === id ? { ...r, status: 'Rejected', remarks: 'Rejected by admin' } : r))

  const pendingCount = requests.filter(r => r.status === 'Pending' || r.status === 'No response').length

  return (
    <>
      {/* ── Header ──────────────────────────────────────────── */}
      <div className="flex items-center justify-between mb-5 gap-3 flex-wrap">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/attendance')}
            className="w-9 h-9 flex items-center justify-center rounded-xl border border-gray-200 text-gray-500 hover:bg-gray-50 hover:border-gray-400 transition-colors">
            <ArrowLeft size={16} />
          </button>
          <div>
            <h1 className="text-xl font-bold text-gray-900 m-0">Pending Approvals</h1>
            <p className="text-xs text-gray-400 mt-0.5">Attendance regularization requests</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {pendingCount > 0 && (
            <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-white" style={{ backgroundColor: PRIMARY }}>
              <Clock size={12} /> {pendingCount} Awaiting Action
            </span>
          )}
        </div>
      </div>

      {/* ── Stats row ───────────────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
        {[
          { label: 'Total Requests', value: requests.length,                                     color: '#111827', bg: '#F3F4F6' },
          { label: 'Pending',        value: requests.filter(r => r.status === 'Pending').length, color: '#374151', bg: '#F3F4F6' },
          { label: 'Approved',       value: requests.filter(r => r.status === 'Approved').length,color: '#15803D', bg: '#DCFCE7' },
          { label: 'Rejected',       value: requests.filter(r => r.status === 'Rejected').length,color: '#B91C1C', bg: '#FEE2E2' },
        ].map(({ label, value, color, bg }) => (
          <div key={label} className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
            <p className="text-2xl font-bold leading-none" style={{ color }}>{value}</p>
            <p className="text-[11px] text-gray-500 mt-1 font-medium">{label}</p>
          </div>
        ))}
      </div>

      {/* ── Toolbar ─────────────────────────────────────────── */}
      <div className="flex items-center gap-2 mb-4 flex-wrap">
        <h2 className="text-sm font-bold text-gray-800">Pending Approvals</h2>
        <div className="flex items-center gap-2 ml-auto">
          <label className="flex items-center gap-2 bg-white rounded-lg px-3 h-9 border border-gray-200 cursor-text">
            <Search size={13} color="#9CA3AF" strokeWidth={2} className="flex-shrink-0" />
            <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
              placeholder="Search requests…"
              className="border-none outline-none text-[13px] text-gray-900 bg-transparent w-36 sm:w-44" />
          </label>
          <button onClick={() => setShowFilter(true)}
            className="relative flex items-center gap-1.5 bg-white border rounded-lg px-3 h-9 text-[13px] font-medium cursor-pointer hover:bg-gray-50 transition-colors"
            style={{ borderColor: filterCount > 0 ? PRIMARY : '#E5E7EB', color: filterCount > 0 ? PRIMARY : '#374151' }}>
            <Filter size={13} strokeWidth={2} />
            <span className="hidden sm:inline">Filter</span>
            {filterCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full text-[9px] font-bold text-white flex items-center justify-center" style={{ backgroundColor: PRIMARY }}>{filterCount}</span>
            )}
          </button>
        </div>
      </div>

      {/* ── Table ───────────────────────────────────────────── */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse" style={{ minWidth: 820 }}>
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                {['Employee', 'Request Date', 'Time Range', 'Original Time', 'Notes', 'Status', 'Actions'].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paginated.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-14 text-center text-sm text-gray-400">No requests match your filters.</td>
                </tr>
              ) : paginated.map((req, idx) => {
                const s = STATUS_STYLE[req.status] ?? { bg: '#6B7280', color: '#fff' }
                return (
                  <tr key={req.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                    {/* Employee */}
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
                          style={{ backgroundColor: req.avatarColor }}>
                          {req.name.split(' ').map(n => n[0]).slice(0, 2).join('')}
                        </div>
                        <div>
                          <p className="text-[13px] font-semibold text-gray-900 leading-none">{req.name}</p>
                          <p className="text-[11px] text-gray-400 mt-0.5">{req.department}</p>
                        </div>
                      </div>
                    </td>

                    {/* Request Date */}
                    <td className="px-4 py-4 text-[13px] text-gray-600 whitespace-nowrap">{req.requestDate}</td>

                    {/* Time Range (Requested) */}
                    <td className="px-4 py-4 text-[13px] font-medium whitespace-nowrap" style={{ color: PRIMARY }}>
                      {req.timeRange}
                    </td>

                    {/* Original Time */}
                    <td className="px-4 py-4 whitespace-nowrap">
                      <p className="text-[11px] text-gray-500">In: <span className="font-medium text-gray-700">{req.originalCheckIn}</span></p>
                      <p className="text-[11px] text-gray-500 mt-0.5">Out: <span className="font-medium text-gray-700">{req.originalCheckOut}</span></p>
                    </td>

                    {/* Notes */}
                    <td className="px-4 py-4 max-w-xs">
                      <p className="text-[12px] text-gray-600 leading-relaxed line-clamp-2">{req.notes}</p>
                    </td>

                    {/* Status */}
                    <td className="px-4 py-4 whitespace-nowrap">
                      <span className="inline-flex px-3 py-1 rounded-full text-xs font-semibold"
                        style={{ backgroundColor: s.bg, color: s.color }}>
                        {req.status}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        {/* View Details */}
                        <button onClick={() => setDetailItem(req)}
                          className="px-3 py-1.5 rounded-lg border border-gray-200 text-xs font-medium text-gray-600 hover:bg-gray-50 hover:border-gray-400 transition-colors whitespace-nowrap">
                          View Details
                        </button>
                        {/* Approve */}
                        <button onClick={() => handleApprove(req.id)}
                          disabled={req.status === 'Approved' || req.status === 'Rejected'}
                          className="w-7 h-7 flex items-center justify-center rounded-lg border border-gray-200 text-green-500 hover:bg-green-50 hover:border-green-300 disabled:opacity-30 disabled:cursor-not-allowed transition-colors">
                          <Check size={13} strokeWidth={2.5} />
                        </button>
                        {/* Reject */}
                        <button onClick={() => handleReject(req.id)}
                          disabled={req.status === 'Approved' || req.status === 'Rejected'}
                          className="w-7 h-7 flex items-center justify-center rounded-lg border border-gray-200 text-red-500 hover:bg-red-50 hover:border-red-300 disabled:opacity-30 disabled:cursor-not-allowed transition-colors">
                          <X size={13} strokeWidth={2.5} />
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {Math.ceil(filtered.length / PAGE_SIZE) > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100 flex-wrap gap-2">
            <p className="text-xs text-gray-500">
              Showing <span className="font-semibold text-gray-800">{(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, filtered.length)}</span> of <span className="font-semibold text-gray-800">{filtered.length}</span>
            </p>
            <div className="flex items-center gap-1">
              <button onClick={() => setPage(p => p - 1)} disabled={page === 1}
                className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:border-gray-400 disabled:opacity-30 disabled:cursor-not-allowed transition-colors">
                <ChevronLeft size={14} />
              </button>
              {Array.from({ length: Math.ceil(filtered.length / PAGE_SIZE) }, (_, i) => i + 1).map((p) => (
                <button key={p} onClick={() => setPage(p)}
                  className="w-8 h-8 flex items-center justify-center rounded-lg text-xs font-medium border transition-all"
                  style={{ borderColor: page === p ? PRIMARY : '#E5E7EB', backgroundColor: page === p ? PRIMARY : 'transparent', color: page === p ? '#fff' : '#6B7280' }}>
                  {p}
                </button>
              ))}
              <button onClick={() => setPage(p => p + 1)} disabled={page === Math.ceil(filtered.length / PAGE_SIZE)}
                className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:border-gray-400 disabled:opacity-30 disabled:cursor-not-allowed transition-colors">
                <ChevronRight size={14} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ── Detail Modal ─────────────────────────────────────── */}
      {detailItem && (
        <DetailModal
          request={detailItem}
          onClose={() => setDetailItem(null)}
          onApprove={handleApprove}
          onReject={handleReject}
        />
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