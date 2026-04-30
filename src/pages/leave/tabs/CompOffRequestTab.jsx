// src/pages/leave/tabs/CompOffRequestTab.jsx
import { useState, useMemo } from 'react'
import { Plus, ChevronDown, Eye, ChevronLeft, ChevronRight, Search, Filter } from 'lucide-react'
import FilterModal from '@/components/shared/FilterModal'

const PRIMARY      = '#C35E33'
const PRIMARY_DARK = '#A34A24'
const PAGE_SIZE    = 8

const COMP_OFF_DATA = [
  { id: 1,  employeeCode: 'AJ001', name: 'Jaylon',  workedDate: '05-Apr-2026', earnedDays: '1 Day', totalHours: 9,  reason: 'Worked on weekend for project deadline.', status: 'APPROVED' },
  { id: 2,  employeeCode: 'AJ002', name: 'Jaxson',  workedDate: '06-Apr-2026', earnedDays: '1 Day', totalHours: 8,  reason: 'Worked on Sunday for client demo.', status: 'PENDING'  },
  { id: 3,  employeeCode: 'AJ003', name: 'Adison',  workedDate: '12-Apr-2026', earnedDays: '0.5 Day', totalHours: 5, reason: 'Emergency support on holiday.', status: 'PENDING'  },
  { id: 4,  employeeCode: 'AJ004', name: 'Alfredo', workedDate: '13-Apr-2026', earnedDays: '1 Day', totalHours: 8,  reason: 'Year-end reconciliation.', status: 'REJECTED' },
]

const FILTER_CONFIG = [
  { key: 'status', label: 'Status', type: 'multi', options: ['PENDING','APPROVED','REJECTED'] },
  { key: 'dateFrom', label: 'Date From', type: 'date' },
  { key: 'dateTo',   label: 'Date To',   type: 'date' },
]

const STATUS_MAP = {
  APPROVED: { label: 'Approved', bg: '#DCFCE7', color: '#15803D' },
  REJECTED: { label: 'Rejected', bg: '#FEE2E2', color: '#DC2626' },
  PENDING:  { label: 'Pending',  bg: '#F3F4F6', color: '#374151' },
}

export default function CompOffRequestTab() {
  const [showForm,    setShowForm]    = useState(false)
  const [showFilter,  setShowFilter]  = useState(false)
  const [activeFilters, setActiveFilters] = useState({})
  const [search, setSearch]          = useState('')
  const [page, setPage]              = useState(1)

  // Admin comp-off form
  const [form, setForm] = useState({
    employeeId: '', employeeName: '', workedDate: '', earnedDays: '1 Day', reason: ''
  })

  const filtered = useMemo(() => {
    const q = search.toLowerCase()
    return COMP_OFF_DATA.filter((r) => {
      const searchMatch = !q || r.name.toLowerCase().includes(q) || r.employeeCode.toLowerCase().includes(q)
      const statusMatch = !activeFilters.status?.length || activeFilters.status.includes(r.status)
      return searchMatch && statusMatch
    })
  }, [search, activeFilters])

  const paginated = useMemo(
    () => filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE),
    [filtered, page]
  )

  const filterCount = Object.values(activeFilters).filter((v) => Array.isArray(v) ? v.length > 0 : !!v).length
  const totalPages  = Math.ceil(filtered.length / PAGE_SIZE)

  return (
    <>
      {/* Toolbar */}
      <div className="flex items-center gap-2 mb-4 flex-wrap">
        <label className="flex items-center gap-2 bg-white rounded-lg px-3 h-9 border border-gray-200 cursor-text">
          <Search size={13} color="#9CA3AF" />
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder="Search employee…"
            className="border-none outline-none text-[13px] text-gray-900 bg-transparent w-40" />
        </label>
        <button onClick={() => setShowFilter(true)}
          className="relative flex items-center gap-1.5 bg-white border rounded-lg px-3 h-9 text-[13px] font-medium cursor-pointer hover:bg-gray-50"
          style={{ borderColor: filterCount > 0 ? PRIMARY : '#E5E7EB', color: filterCount > 0 ? PRIMARY : '#374151' }}>
          <Filter size={13} strokeWidth={2} />
          Filter
          {filterCount > 0 && (
            <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full text-[9px] font-bold text-white flex items-center justify-center"
              style={{ backgroundColor: PRIMARY }}>{filterCount}</span>
          )}
        </button>
        <button
          onClick={() => setShowForm(true)}
          className="ml-auto flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-white"
          style={{ backgroundColor: PRIMARY }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = PRIMARY_DARK)}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = PRIMARY)}>
          <Plus size={14} /> New Comp Off
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden mb-4">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse" style={{ minWidth: 700 }}>
            <thead>
              <tr style={{ backgroundColor: PRIMARY }}>
                {['Employee ID','Employee Name','Worked Date','Earned Days','Total Hours','Reason','Status','View'].map((h) => (
                  <th key={h} className="px-3.5 py-3.5 text-left text-xs font-semibold whitespace-nowrap text-white">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paginated.length === 0 ? (
                <tr><td colSpan={8} className="px-4 py-12 text-center text-sm text-gray-400">No records found.</td></tr>
              ) : paginated.map((r, idx) => {
                const s = STATUS_MAP[r.status] || { label: r.status, bg: '#F3F4F6', color: '#374151' }
                return (
                  <tr key={r.id} className="hover:bg-orange-50 transition-colors"
                    style={{ backgroundColor: idx % 2 === 0 ? '#fff' : '#FAFAFA' }}>
                    <td className="px-3.5 py-4 text-[11px] font-bold border-b border-gray-50" style={{ color: PRIMARY }}>{r.employeeCode}</td>
                    <td className="px-3.5 py-4 border-b border-gray-50">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold text-white" style={{ backgroundColor: PRIMARY }}>{r.name[0]}</div>
                        <span className="text-[13px] font-semibold text-gray-900">{r.name}</span>
                      </div>
                    </td>
                    <td className="px-3.5 py-4 text-[12px] text-gray-600 border-b border-gray-50 whitespace-nowrap">{r.workedDate}</td>
                    <td className="px-3.5 py-4 text-[12px] font-semibold border-b border-gray-50" style={{ color: PRIMARY }}>{r.earnedDays}</td>
                    <td className="px-3.5 py-4 text-[12px] text-gray-700 border-b border-gray-50">{r.totalHours}h</td>
                    <td className="px-3.5 py-4 text-[12px] text-gray-500 border-b border-gray-50 max-w-[160px] truncate">{r.reason}</td>
                    <td className="px-3.5 py-4 border-b border-gray-50">
                      <span className="inline-flex px-2.5 py-0.5 rounded-full text-[10px] font-semibold whitespace-nowrap"
                        style={{ backgroundColor: s.bg, color: s.color }}>{s.label}</span>
                    </td>
                    <td className="px-3.5 py-4 border-b border-gray-50">
                      <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 text-gray-400 hover:border-[#C35E33] hover:text-[#C35E33] hover:bg-orange-50 transition-all">
                        <Eye size={14} strokeWidth={1.8} />
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100 flex-wrap gap-2">
            <p className="text-xs text-gray-500">Showing {(page-1)*PAGE_SIZE+1}–{Math.min(page*PAGE_SIZE, filtered.length)} of {filtered.length}</p>
            <div className="flex items-center gap-1">
              <button onClick={() => setPage(p => Math.max(1, p-1))} disabled={page===1}
                className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 text-gray-500 disabled:opacity-30">
                <ChevronLeft size={14} />
              </button>
              {Array.from({length: totalPages}, (_, i) => i+1).map(p => (
                <button key={p} onClick={() => setPage(p)}
                  className="w-8 h-8 flex items-center justify-center rounded-lg text-xs font-medium border"
                  style={{ borderColor: page===p ? PRIMARY : '#E5E7EB', backgroundColor: page===p ? PRIMARY : 'transparent', color: page===p ? '#fff' : '#6B7280' }}>
                  {p}
                </button>
              ))}
              <button onClick={() => setPage(p => Math.min(totalPages, p+1))} disabled={page===totalPages}
                className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 text-gray-500 disabled:opacity-30">
                <ChevronRight size={14} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Add form */}
      {showForm && (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
            <h3 className="text-sm font-bold text-gray-900">Comp Off Request</h3>
            <button onClick={() => setShowForm(false)} className="text-xs text-gray-400 hover:text-gray-600">✕</button>
          </div>
          <div className="p-6 space-y-4">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { label: 'Employee ID',   key: 'employeeId',   placeholder: 'Name' },
                { label: 'Employee Name', key: 'employeeName', placeholder: 'Name' },
                { label: 'Worked Date',   key: 'workedDate',   placeholder: 'Name', type: 'date' },
              ].map(({ label, key, placeholder, type = 'text' }) => (
                <div key={key}>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">{label}</label>
                  <input type={type} value={form[key]} onChange={(e) => setForm(p => ({ ...p, [key]: e.target.value }))}
                    placeholder={placeholder}
                    className="w-full h-10 px-3 text-sm border border-gray-200 rounded-xl outline-none bg-gray-50 placeholder:text-gray-300"
                    onFocus={(e) => (e.target.style.borderColor = PRIMARY)}
                    onBlur={(e) => (e.target.style.borderColor = '#E5E7EB')} />
                </div>
              ))}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">Earned Days</label>
                <div className="relative">
                  <select value={form.earnedDays} onChange={(e) => setForm(p => ({ ...p, earnedDays: e.target.value }))}
                    className="w-full h-10 px-3 pr-8 text-sm border border-gray-200 rounded-xl outline-none bg-gray-50 appearance-none">
                    <option>1 Day</option><option>0.5 Day</option>
                  </select>
                  <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                </div>
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">Reason</label>
              <textarea value={form.reason} onChange={(e) => setForm(p => ({ ...p, reason: e.target.value }))}
                placeholder="Type" rows={4}
                className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl outline-none bg-gray-50 resize-none placeholder:text-gray-300"
                onFocus={(e) => (e.target.style.borderColor = PRIMARY)}
                onBlur={(e) => (e.target.style.borderColor = '#E5E7EB')} />
            </div>
          </div>
          <div className="px-6 py-4 border-t border-gray-100 flex justify-end gap-2">
            <button onClick={() => setShowForm(false)}
              className="px-4 py-2 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50">Cancel</button>
            <button className="px-5 py-2 rounded-xl text-sm font-semibold text-white"
              style={{ backgroundColor: '#111827' }}>Add</button>
          </div>
        </div>
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