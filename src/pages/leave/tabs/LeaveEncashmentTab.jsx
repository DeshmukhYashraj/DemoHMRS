// src/pages/leave/tabs/LeaveEncashmentTab.jsx
import { useState, useMemo } from 'react'
import { Plus, ChevronDown, Eye, ChevronLeft, ChevronRight, Search } from 'lucide-react'

const PRIMARY      = '#C35E33'
const PRIMARY_DARK = '#A34A24'
const PAGE_SIZE    = 8

const ENCASHMENT_DATA = [
  { id: 1,  employeeCode: 'AJ001', name: 'Jaylon',  dateRange: '01-Apr-2026', totalDays: 4, reason: 'Carry forward encashment Q1.', appliedOn: '22-05-2026', status: 'APPROVED' },
  { id: 2,  employeeCode: 'AJ002', name: 'Jaxson',  dateRange: '01-Mar-2026', totalDays: 2, reason: 'Year end leave encashment.',    appliedOn: '22-04-2026', status: 'PENDING'  },
  { id: 3,  employeeCode: 'AJ003', name: 'Adison',  dateRange: '15-Feb-2026', totalDays: 6, reason: 'Festival leave encashment.',    appliedOn: '01-03-2026', status: 'REJECTED' },
]

const ENCASHMENT_RULE_DATA = [
  { id: 1, policy: 'General Leave Policy', isEnabled: true, maxEncashment: 15, timing: 'YEAR_END' },
  { id: 2, policy: 'Intern Policy',        isEnabled: false, maxEncashment: 0,  timing: 'NONE' },
]

const STATUS_MAP = {
  APPROVED: { label: 'Approved', bg: '#DCFCE7', color: '#15803D' },
  REJECTED: { label: 'Rejected', bg: '#FEE2E2', color: '#DC2626' },
  PENDING:  { label: 'Pending',  bg: '#F3F4F6', color: '#374151' },
}

const SUB_TABS = [
  { key: 'requests', label: 'Encashment Requests' },
  { key: 'rules',    label: 'Encashment Rules' },
]

export default function LeaveEncashmentTab() {
  const [sub,      setSub]      = useState('requests')
  const [showForm, setShowForm] = useState(false)
  const [page,     setPage]     = useState(1)
  const [search,   setSearch]   = useState('')

  const [form, setForm] = useState({
    employeeName: '', employeeId: '2542', dateRange: '', totalDays: '04', reason: '', appliedOn: '22-05-2026'
  })

  // Rule form
  const [ruleForm, setRuleForm] = useState({
    policyId: '', isEnabled: true, maxEncashment: '', timing: 'YEAR_END'
  })

  const filtered = useMemo(() => {
    const q = search.toLowerCase()
    return ENCASHMENT_DATA.filter(r => r.name.toLowerCase().includes(q) || r.employeeCode.toLowerCase().includes(q))
  }, [search])

  const paginated = useMemo(() => filtered.slice((page-1)*PAGE_SIZE, page*PAGE_SIZE), [filtered, page])

  return (
    <>
      {/* Sub tabs */}
      <div className="flex items-center gap-1 mb-5 border-b border-gray-200">
        {SUB_TABS.map(({ key, label }) => (
          <button key={key} onClick={() => setSub(key)}
            className="px-4 py-2.5 text-sm font-medium whitespace-nowrap transition-all border-b-2 -mb-px"
            style={{ borderBottomColor: sub === key ? PRIMARY : 'transparent', color: sub === key ? PRIMARY : '#6B7280' }}>
            {label}
          </button>
        ))}
      </div>

      {/* ── Requests list ── */}
      {sub === 'requests' && (
        <>
          <div className="flex items-center gap-2 mb-4 flex-wrap">
            <label className="flex items-center gap-2 bg-white rounded-lg px-3 h-9 border border-gray-200 cursor-text">
              <Search size={13} color="#9CA3AF" />
              <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
                placeholder="Search employee…"
                className="border-none outline-none text-[13px] text-gray-900 bg-transparent w-40" />
            </label>
            <button onClick={() => setShowForm(true)} className="ml-auto flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-white"
              style={{ backgroundColor: PRIMARY }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = PRIMARY_DARK)}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = PRIMARY)}>
              <Plus size={14} /> New Request
            </button>
          </div>

          <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden mb-4">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse" style={{ minWidth: 700 }}>
                <thead>
                  <tr style={{ backgroundColor: PRIMARY }}>
                    {['Employee ID','Employee Name','Date Range','Total Days','Applied On','Status','View'].map((h) => (
                      <th key={h} className="px-3.5 py-3.5 text-left text-xs font-semibold text-white whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {paginated.map((r, idx) => {
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
                        <td className="px-3.5 py-4 text-[12px] text-gray-600 border-b border-gray-50 whitespace-nowrap">{r.dateRange}</td>
                        <td className="px-3.5 py-4 text-[12px] font-bold border-b border-gray-50" style={{ color: PRIMARY }}>{r.totalDays}</td>
                        <td className="px-3.5 py-4 text-[12px] text-gray-500 border-b border-gray-50 whitespace-nowrap">{r.appliedOn}</td>
                        <td className="px-3.5 py-4 border-b border-gray-50">
                          <span className="inline-flex px-2.5 py-0.5 rounded-full text-[10px] font-semibold"
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
          </div>

          {/* Add form */}
          {showForm && (
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                <h3 className="text-sm font-bold text-gray-900">Leave Encashment Request</h3>
                <button onClick={() => setShowForm(false)} className="text-xs text-gray-400 hover:text-gray-600">✕</button>
              </div>
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {[
                    { label: 'Employee Name', key: 'employeeName', placeholder: 'Name' },
                    { label: 'Employee ID',   key: 'employeeId',   placeholder: '2542' },
                  ].map(({ label, key, placeholder }) => (
                    <div key={key}>
                      <label className="block text-xs font-semibold text-gray-700 mb-1.5">{label}</label>
                      <input value={form[key]} onChange={(e) => setForm(p => ({ ...p, [key]: e.target.value }))}
                        placeholder={placeholder}
                        className="w-full h-10 px-3 text-sm border border-gray-200 rounded-xl outline-none bg-gray-50 placeholder:text-gray-300"
                        onFocus={(e) => (e.target.style.borderColor = PRIMARY)}
                        onBlur={(e) => (e.target.style.borderColor = '#E5E7EB')} />
                    </div>
                  ))}
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5">Date Range</label>
                    <div className="relative">
                      <input type="date" value={form.dateRange} onChange={(e) => setForm(p => ({ ...p, dateRange: e.target.value }))}
                        className="w-full h-10 px-3 pr-9 text-sm border border-gray-200 rounded-xl outline-none bg-gray-50"
                        onFocus={(e) => (e.target.style.borderColor = PRIMARY)}
                        onBlur={(e) => (e.target.style.borderColor = '#E5E7EB')} />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5">Total Days</label>
                    <input type="number" value={form.totalDays} onChange={(e) => setForm(p => ({ ...p, totalDays: e.target.value }))}
                      placeholder="04"
                      className="w-full h-10 px-3 text-sm border border-gray-200 rounded-xl outline-none bg-gray-50 placeholder:text-gray-300"
                      onFocus={(e) => (e.target.style.borderColor = PRIMARY)}
                      onBlur={(e) => (e.target.style.borderColor = '#E5E7EB')} />
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
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">Applied On</label>
                  <div className="relative inline-flex items-center h-10 px-3 gap-2 border border-gray-200 rounded-xl bg-gray-50 text-sm text-gray-600">
                    <span>{form.appliedOn}</span>
                    <span className="text-gray-400">📅</span>
                    <span className="text-gray-400">🕐</span>
                  </div>
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
        </>
      )}

      {/* ── Rules ── */}
      {sub === 'rules' && (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
            <h3 className="text-sm font-bold text-gray-900">Leave Encashment Rule</h3>
          </div>
          <div className="p-6 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">Leave Policy <span style={{ color: PRIMARY }}>*</span></label>
                <div className="relative">
                  <select value={ruleForm.policyId} onChange={(e) => setRuleForm(p => ({ ...p, policyId: e.target.value }))}
                    className="w-full h-10 px-3 pr-8 text-sm border border-gray-200 rounded-xl outline-none bg-gray-50 appearance-none">
                    <option value="">Select Policy</option>
                    <option>General Leave Policy</option>
                    <option>Intern Policy</option>
                  </select>
                  <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">Max Encashment Days <span style={{ color: PRIMARY }}>*</span></label>
                <input type="number" value={ruleForm.maxEncashment} onChange={(e) => setRuleForm(p => ({ ...p, maxEncashment: e.target.value }))}
                  placeholder="15"
                  className="w-full h-10 px-3 text-sm border border-gray-200 rounded-xl outline-none bg-gray-50 placeholder:text-gray-300"
                  onFocus={(e) => (e.target.style.borderColor = PRIMARY)}
                  onBlur={(e) => (e.target.style.borderColor = '#E5E7EB')} />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">Timing</label>
                <div className="relative">
                  <select value={ruleForm.timing} onChange={(e) => setRuleForm(p => ({ ...p, timing: e.target.value }))}
                    className="w-full h-10 px-3 pr-8 text-sm border border-gray-200 rounded-xl outline-none bg-gray-50 appearance-none">
                    <option value="YEAR_END">Year End</option>
                    <option value="MONTHLY">Monthly</option>
                    <option value="QUARTERLY">Quarterly</option>
                  </select>
                  <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3.5 rounded-xl border border-gray-100 bg-gray-50 w-fit">
              <span className="text-xs font-medium text-gray-600">Encashment Enabled</span>
              <button
                onClick={() => setRuleForm(p => ({ ...p, isEnabled: !p.isEnabled }))}
                className="relative w-9 h-5 rounded-full transition-colors"
                style={{ backgroundColor: ruleForm.isEnabled ? PRIMARY : '#D1D5DB' }}>
                <div className="absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all"
                  style={{ left: ruleForm.isEnabled ? '18px' : '2px' }} />
              </button>
            </div>
          </div>
          <div className="px-6 py-4 border-t border-gray-100 flex justify-end">
            <button className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white"
              style={{ backgroundColor: '#111827' }}>Save Rule</button>
          </div>
        </div>
      )}
    </>
  )
}