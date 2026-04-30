// src/pages/leave/tabs/LeaveBalanceTab.jsx
import { useState, useMemo } from 'react'
import { Search, Plus, ChevronLeft, ChevronRight, Filter } from 'lucide-react'
import FilterModal from '@/components/shared/FilterModal'

const PRIMARY      = '#C35E33'
const PRIMARY_DARK = '#A34A24'
const PAGE_SIZE    = 8

const BALANCE_DATA = [
  { id: 1,  name: 'Jaylon Press',    code: 'JK-01', designation: 'Senior Dev',   department: 'Engineering', leaveType: 'CL',  totalLeaves: 12, usedLeaves: 6,  remainingLeaves: 6,  year: 2026 },
  { id: 2,  name: 'Emerson Geidt',   code: 'JK-02', designation: 'Sales Exec',   department: 'Sales',       leaveType: 'SL',  totalLeaves: 10, usedLeaves: 2,  remainingLeaves: 8,  year: 2026 },
  { id: 3,  name: 'Alfredo Gouse',   code: 'JK-03', designation: 'UI Designer',  department: 'IT-Based',    leaveType: 'EL',  totalLeaves: 15, usedLeaves: 5,  remainingLeaves: 10, year: 2026 },
  { id: 4,  name: 'Talan Torff',     code: 'JK-04', designation: 'Marketer',     department: 'Marketing',   leaveType: 'CL',  totalLeaves: 12, usedLeaves: 4,  remainingLeaves: 8,  year: 2026 },
  { id: 5,  name: 'Craig Bergson',   code: 'JK-05', designation: 'DevOps',       department: 'Engineering', leaveType: 'AL',  totalLeaves: 18, usedLeaves: 8,  remainingLeaves: 10, year: 2026 },
  { id: 6,  name: 'Maria Stanton',   code: 'JK-06', designation: 'HR Manager',   department: 'HR',          leaveType: 'SL',  totalLeaves: 10, usedLeaves: 10, remainingLeaves: 0,  year: 2026 },
  { id: 7,  name: 'Leo Workman',     code: 'JK-07', designation: 'QA Engineer',  department: 'Engineering', leaveType: 'CL',  totalLeaves: 12, usedLeaves: 7,  remainingLeaves: 5,  year: 2026 },
  { id: 8,  name: 'Anika Rhiel',     code: 'JK-08', designation: 'Product Mgr',  department: 'Design',      leaveType: 'EL',  totalLeaves: 15, usedLeaves: 3,  remainingLeaves: 12, year: 2026 },
  { id: 9,  name: 'Gretchen Curtis', code: 'JK-09', designation: 'Accountant',   department: 'Finance',     leaveType: 'AL',  totalLeaves: 18, usedLeaves: 12, remainingLeaves: 6,  year: 2026 },
  { id: 10, name: 'Ryan Westervelt', code: 'JK-10', designation: 'Backend Dev',  department: 'IT-Based',    leaveType: 'CL',  totalLeaves: 12, usedLeaves: 0,  remainingLeaves: 12, year: 2026 },
]

const LEAVE_TYPE_LABELS = { CL: 'Casual Leave', SL: 'Sick Leave', EL: 'Earned Leave', AL: 'Annual Leave' }

const FILTER_CONFIG = [
  { key: 'leaveType', label: 'Leave Type',  type: 'multi',  options: ['CL','SL','EL','AL'] },
  { key: 'dept',      label: 'Department',  type: 'select', options: ['Engineering','Sales','IT-Based','Marketing','HR','Finance','Design'] },
  { key: 'year',      label: 'Year',        type: 'select', options: ['2026','2025','2024'] },
]

function BalanceBar({ used, total }) {
  const pct = total > 0 ? Math.min((used / total) * 100, 100) : 0
  const color = pct >= 90 ? '#DC2626' : pct >= 60 ? PRIMARY : '#16A34A'
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1.5 rounded-full bg-gray-100 overflow-hidden">
        <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, backgroundColor: color }} />
      </div>
      <span className="text-[10px] text-gray-400 whitespace-nowrap">{Math.round(pct)}%</span>
    </div>
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
          className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 text-gray-500 disabled:opacity-30 disabled:cursor-not-allowed">
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
          className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 text-gray-500 disabled:opacity-30 disabled:cursor-not-allowed">
          <ChevronRight size={14} />
        </button>
      </div>
    </div>
  )
}

export default function LeaveBalanceTab() {
  const [search,        setSearch]        = useState('')
  const [showFilter,    setShowFilter]    = useState(false)
  const [activeFilters, setActiveFilters] = useState({})
  const [page,          setPage]          = useState(1)
  const [showAddForm,   setShowAddForm]   = useState(false)

  // Add form state
  const [addForm, setAddForm] = useState({
    name: '', code: '', designation: '', department: 'Developer',
    leaveType: 'Cl', totalLeaves: '', usedLeaves: '', remainingLeaves: '', year: '2026'
  })

  const filtered = useMemo(() => {
    const q = search.toLowerCase()
    return BALANCE_DATA.filter((r) => {
      const searchMatch = !q || r.name.toLowerCase().includes(q) || r.code.toLowerCase().includes(q)
      const typeMatch   = !activeFilters.leaveType?.length || activeFilters.leaveType.includes(r.leaveType)
      const deptMatch   = !activeFilters.dept || r.department === activeFilters.dept
      return searchMatch && typeMatch && deptMatch
    })
  }, [search, activeFilters])

  const paginated = useMemo(
    () => filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE),
    [filtered, page]
  )

  const filterCount = Object.values(activeFilters).filter((v) => Array.isArray(v) ? v.length > 0 : !!v).length

  return (
    <>
      {/* Search bar */}
      <div className="flex items-center gap-2 mb-4 flex-wrap">
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 flex-1">
          <label className="flex items-center gap-2 bg-white rounded-lg px-3 h-9 border border-gray-200 cursor-text col-span-2 sm:col-span-1">
            <Search size={13} color="#9CA3AF" />
            <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
              placeholder="Employee name…"
              className="border-none outline-none text-[13px] text-gray-900 bg-transparent w-full" />
          </label>
          <input placeholder="Employee ID" className="h-9 px-3 text-sm border border-gray-200 rounded-lg outline-none focus:border-[#C35E33] bg-white" />
          <input placeholder="Designation" className="h-9 px-3 text-sm border border-gray-200 rounded-lg outline-none focus:border-[#C35E33] bg-white" />
          <select className="h-9 px-3 text-sm border border-gray-200 rounded-lg outline-none focus:border-[#C35E33] bg-white text-gray-500">
            <option>Department</option>
            <option>Engineering</option>
            <option>IT-Based</option>
            <option>HR</option>
          </select>
          <select className="h-9 px-3 text-sm border border-gray-200 rounded-lg outline-none focus:border-[#C35E33] bg-white text-gray-500">
            <option>2026</option>
            <option>2025</option>
          </select>
        </div>
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
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden mb-4">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse" style={{ minWidth: 800 }}>
            <thead>
              <tr style={{ backgroundColor: PRIMARY }}>
                {['Employee Name','Employee ID','Designation','Department','Leave Type','Total','Used','Remaining','Year','Usage'].map((h) => (
                  <th key={h} className="px-3.5 py-3.5 text-left text-xs font-semibold whitespace-nowrap text-white">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paginated.map((r, idx) => (
                <tr key={r.id} className="hover:bg-orange-50 transition-colors"
                  style={{ backgroundColor: idx % 2 === 0 ? '#fff' : '#FAFAFA' }}>
                  <td className="px-3.5 py-3.5 border-b border-gray-50 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold text-white flex-shrink-0"
                        style={{ backgroundColor: PRIMARY }}>{r.name[0]}</div>
                      <span className="text-[13px] font-semibold text-gray-900">{r.name}</span>
                    </div>
                  </td>
                  <td className="px-3.5 py-3.5 text-[11px] font-bold border-b border-gray-50" style={{ color: PRIMARY }}>{r.code}</td>
                  <td className="px-3.5 py-3.5 text-[12px] text-gray-600 border-b border-gray-50 whitespace-nowrap">{r.designation}</td>
                  <td className="px-3.5 py-3.5 text-[12px] text-gray-600 border-b border-gray-50 whitespace-nowrap">{r.department}</td>
                  <td className="px-3.5 py-3.5 border-b border-gray-50">
                    <span className="text-[11px] font-semibold px-2 py-0.5 rounded"
                      style={{ backgroundColor: '#F5EBE5', color: PRIMARY }}>{r.leaveType}</span>
                  </td>
                  <td className="px-3.5 py-3.5 text-[12px] font-bold text-gray-800 border-b border-gray-50">{r.totalLeaves}</td>
                  <td className="px-3.5 py-3.5 text-[12px] font-bold border-b border-gray-50" style={{ color: PRIMARY }}>{r.usedLeaves}</td>
                  <td className="px-3.5 py-3.5 text-[12px] font-bold text-green-600 border-b border-gray-50">{r.remainingLeaves}</td>
                  <td className="px-3.5 py-3.5 text-[12px] text-gray-500 border-b border-gray-50">{r.year}</td>
                  <td className="px-3.5 py-3.5 border-b border-gray-50" style={{ minWidth: 100 }}>
                    <BalanceBar used={r.usedLeaves} total={r.totalLeaves} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Pagination current={page} total={filtered.length} pageSize={PAGE_SIZE} onChange={setPage} />
      </div>

      {/* Add Form */}
      {showAddForm && (
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-4 shadow-sm">
          <h3 className="text-sm font-semibold text-gray-900 mb-4">Add Leave Balance</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
            {[
              { label: 'Employee Name', key: 'name',      placeholder: 'Demo' },
              { label: 'Employee ID',   key: 'code',      placeholder: 'Demo' },
              { label: 'Designation',   key: 'designation', placeholder: 'Demo' },
            ].map(({ label, key, placeholder }) => (
              <div key={key}>
                <label className="block text-xs font-medium text-gray-700 mb-1.5">{label}</label>
                <input value={addForm[key]} onChange={(e) => setAddForm(p => ({ ...p, [key]: e.target.value }))}
                  placeholder={placeholder}
                  className="w-full h-9 px-3 text-sm border border-gray-200 rounded-lg outline-none focus:border-[#C35E33] bg-gray-50 placeholder:text-gray-300" />
              </div>
            ))}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1.5">Department</label>
              <select value={addForm.department} onChange={(e) => setAddForm(p => ({ ...p, department: e.target.value }))}
                className="w-full h-9 px-3 text-sm border border-gray-200 rounded-lg outline-none focus:border-[#C35E33] bg-gray-50 appearance-none">
                <option>Developer</option><option>HR</option><option>Finance</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1.5">Leave Type</label>
              <input value={addForm.leaveType} onChange={(e) => setAddForm(p => ({ ...p, leaveType: e.target.value }))}
                placeholder="Cl" className="w-full h-9 px-3 text-sm border border-gray-200 rounded-lg outline-none focus:border-[#C35E33] bg-gray-50" />
            </div>
            {[
              { label: 'Total Leaves',     key: 'totalLeaves',     placeholder: '12' },
              { label: 'Used Leaves',      key: 'usedLeaves',      placeholder: '06' },
              { label: 'Remaining Leaves', key: 'remainingLeaves', placeholder: '06' },
              { label: 'Year',             key: 'year',            placeholder: '2026' },
            ].map(({ label, key, placeholder }) => (
              <div key={key}>
                <label className="block text-xs font-medium text-gray-700 mb-1.5">{label}</label>
                <input value={addForm[key]} onChange={(e) => setAddForm(p => ({ ...p, [key]: e.target.value }))}
                  placeholder={placeholder}
                  className="w-full h-9 px-3 text-sm border border-gray-200 rounded-lg outline-none focus:border-[#C35E33] bg-gray-50" />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add button */}
      <div className="flex justify-end">
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-colors"
          style={{ backgroundColor: '#111827' }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#1F2937')}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#111827')}>
          <Plus size={15} />
          Add
        </button>
      </div>

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