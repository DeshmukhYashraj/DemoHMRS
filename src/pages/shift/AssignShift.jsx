// src/pages/shift/AssignShift.jsx
import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, X, ChevronDown, ArrowLeft, UserCheck, Calendar, Clock } from 'lucide-react'

const PRIMARY      = '#C35E33'
const PRIMARY_DARK = '#A34A24'

// ── Mock data ─────────────────────────────────────────────────────────────────
const EMPLOYEES = [
  { id: 1,  code: 'JK-01', name: 'Jaylon Press',    department: 'Engineering', designation: 'Senior Dev',   currentShift: 'Morning Shift' },
  { id: 2,  code: 'JK-02', name: 'Emerson Geidt',   department: 'Sales',       designation: 'Sales Exec',   currentShift: 'Afternoon Shift' },
  { id: 3,  code: 'JK-03', name: 'Alfredo Gouse',   department: 'IT-Based',    designation: 'UI Designer',  currentShift: 'Morning Shift' },
  { id: 4,  code: 'JK-04', name: 'Talan Torff',     department: 'Marketing',   designation: 'Marketer',     currentShift: 'Evening Shift' },
  { id: 5,  code: 'JK-05', name: 'Craig Bergson',   department: 'Engineering', designation: 'DevOps',       currentShift: 'Night Shift' },
  { id: 6,  code: 'JK-06', name: 'Maria Stanton',   department: 'HR',          designation: 'HR Manager',   currentShift: 'Morning Shift' },
  { id: 7,  code: 'JK-07', name: 'Leo Workman',     department: 'Engineering', designation: 'QA Engineer',  currentShift: 'Morning Shift' },
  { id: 8,  code: 'JK-08', name: 'Anika Rhiel',     department: 'Design',      designation: 'Product Mgr',  currentShift: 'Afternoon Shift' },
  { id: 9,  code: 'JK-09', name: 'Gretchen Curtis', department: 'Finance',     designation: 'Accountant',   currentShift: 'Morning Shift' },
  { id: 10, code: 'JK-10', name: 'Ryan Westervelt', department: 'IT-Based',    designation: 'Backend Dev',  currentShift: 'Night Shift' },
]

const SHIFTS = [
  { id: 1, name: 'Morning Shift',   type: 'Normal', timing: '09:00 — 18:00' },
  { id: 2, name: 'Afternoon Shift', type: 'Custom', timing: 'Day-wise Config' },
  { id: 3, name: 'Evening Shift',   type: 'Custom', timing: 'Day-wise Config' },
  { id: 4, name: 'Night Shift',     type: 'Normal', timing: '21:00 — 06:00' },
  { id: 5, name: 'General Shift',   type: 'Normal', timing: '09:30 — 18:30' },
]

function Avatar({ name, size = 8 }) {
  const initials = name.split(' ').map(n=>n[0]).slice(0,2).join('')
  return (
    <div
      className={`w-${size} h-${size} rounded-full flex items-center justify-center text-[10px] font-bold text-white flex-shrink-0`}
      style={{ backgroundColor: PRIMARY, width: size*4, height: size*4, fontSize: 10 }}
    >
      {initials}
    </div>
  )
}

function EmployeeChip({ emp, onRemove }) {
  return (
    <div
      className="flex items-center gap-1.5 pl-1 pr-2 py-1 rounded-full text-xs font-medium border"
      style={{ borderColor: PRIMARY, backgroundColor: '#FDE8DD', color: PRIMARY }}
    >
      <Avatar name={emp.name} size={5} />
      <span>{emp.name}</span>
      <button onClick={() => onRemove(emp.id)} className="ml-0.5 hover:opacity-70">
        <X size={11} strokeWidth={2.5} />
      </button>
    </div>
  )
}

export default function AssignShift() {
  const navigate = useNavigate()

  const [empSearch,      setEmpSearch]      = useState('')
  const [selectedEmps,   setSelectedEmps]   = useState([])
  const [selectedShift,  setSelectedShift]  = useState('')
  const [effectiveDate,  setEffectiveDate]  = useState('')
  const [endDate,        setEndDate]        = useState('')
  const [note,           setNote]           = useState('')
  const [empDropOpen,    setEmpDropOpen]    = useState(false)
  const [shiftDropOpen,  setShiftDropOpen]  = useState(false)
  const [submitted,      setSubmitted]      = useState(false)

  const filteredEmps = useMemo(() => {
    const q = empSearch.toLowerCase()
    return EMPLOYEES.filter(e =>
      !selectedEmps.find(s => s.id === e.id) &&
      (e.name.toLowerCase().includes(q) || e.code.toLowerCase().includes(q) || e.department.toLowerCase().includes(q))
    )
  }, [empSearch, selectedEmps])

  const addEmployee  = emp => { setSelectedEmps(p => [...p, emp]); setEmpDropOpen(false); setEmpSearch('') }
  const removeEmployee = id => setSelectedEmps(p => p.filter(e => e.id !== id))

  const chosenShift = SHIFTS.find(s => s.id === Number(selectedShift))
  const canSubmit   = selectedEmps.length > 0 && selectedShift && effectiveDate

  const handleSubmit = () => {
    if (!canSubmit) return
    setSubmitted(true)
    setTimeout(() => { navigate('/shift') }, 1800)
  }

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center min-h-96 gap-4">
        <div className="w-16 h-16 rounded-full flex items-center justify-center" style={{ backgroundColor: '#DCFCE7' }}>
          <UserCheck size={28} color="#15803D" />
        </div>
        <p className="text-lg font-bold text-gray-900">Shift Assigned Successfully!</p>
        <p className="text-sm text-gray-500">{selectedEmps.length} employee(s) assigned to {chosenShift?.name}</p>
        <p className="text-xs text-gray-400">Redirecting to Shift Management…</p>
      </div>
    )
  }

  return (
    <>
      {/* ── Header ─────────────────────────────────────────── */}
      <div className="flex items-center gap-3 mb-5">
        <button
          onClick={() => navigate('/shift')}
          className="w-9 h-9 flex items-center justify-center rounded-xl border border-gray-200 text-gray-500 hover:bg-gray-50 transition-colors"
        >
          <ArrowLeft size={16} />
        </button>
        <div>
          <h1 className="text-xl font-bold text-gray-900 m-0">Assign Shift</h1>
          <p className="text-xs text-gray-400 mt-0.5">Map employees to a shift schedule</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-4 items-start">

        {/* ── LEFT: Form ─── */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 space-y-6">

          {/* ── Employee selector ── */}
          <div>
            <label className="text-sm font-semibold text-gray-700 block mb-2">
              Select Employees <span style={{ color: PRIMARY }}>*</span>
            </label>

            {/* Selected chips */}
            {selectedEmps.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mb-2 p-2.5 rounded-xl border border-dashed" style={{ borderColor: PRIMARY }}>
                {selectedEmps.map(emp => (
                  <EmployeeChip key={emp.id} emp={emp} onRemove={removeEmployee} />
                ))}
              </div>
            )}

            {/* Search input */}
            <div className="relative">
              <div className="flex items-center gap-2 bg-white rounded-xl border border-gray-200 px-3 h-11 transition-colors"
                style={{ borderColor: empDropOpen ? PRIMARY : '#E5E7EB' }}>
                <Search size={14} color="#9CA3AF" />
                <input
                  type="text"
                  value={empSearch}
                  onChange={e => { setEmpSearch(e.target.value); setEmpDropOpen(true) }}
                  onFocus={() => setEmpDropOpen(true)}
                  placeholder="Search employee by name, code, or department…"
                  className="flex-1 border-none outline-none text-sm text-gray-900 bg-transparent placeholder:text-gray-400"
                />
              </div>

              {empDropOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setEmpDropOpen(false)} />
                  <div className="absolute top-12 left-0 right-0 z-20 bg-white border border-gray-200 rounded-xl shadow-xl max-h-64 overflow-y-auto">
                    {filteredEmps.length === 0 ? (
                      <p className="px-4 py-6 text-sm text-gray-400 text-center">No employees found</p>
                    ) : filteredEmps.map(emp => (
                      <button
                        key={emp.id}
                        onClick={() => addEmployee(emp)}
                        className="w-full flex items-center gap-3 px-4 py-3 hover:bg-orange-50 transition-colors text-left border-b border-gray-50 last:border-0"
                      >
                        <Avatar name={emp.name} />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-gray-900">{emp.name}</p>
                          <p className="text-[10px] text-gray-400">{emp.code} · {emp.department} · {emp.designation}</p>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <p className="text-[10px] text-gray-400">Current</p>
                          <p className="text-[10px] font-medium" style={{ color: PRIMARY }}>{emp.currentShift}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
            <p className="text-[11px] text-gray-400 mt-1">Select one or multiple employees</p>
          </div>

          {/* ── Shift selector ── */}
          <div>
            <label className="text-sm font-semibold text-gray-700 block mb-2">
              Select Shift <span style={{ color: PRIMARY }}>*</span>
            </label>
            <div className="relative">
              <button
                onClick={() => setShiftDropOpen(!shiftDropOpen)}
                className="w-full flex items-center justify-between px-4 h-11 bg-white border border-gray-200 rounded-xl text-sm transition-colors"
                style={{ borderColor: shiftDropOpen ? PRIMARY : '#E5E7EB' }}
              >
                {chosenShift ? (
                  <span className="text-gray-800 font-medium">{chosenShift.name}</span>
                ) : (
                  <span className="text-gray-400">Select a shift…</span>
                )}
                <ChevronDown size={14} color="#9CA3AF" />
              </button>

              {shiftDropOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setShiftDropOpen(false)} />
                  <div className="absolute top-12 left-0 right-0 z-20 bg-white border border-gray-200 rounded-xl shadow-xl overflow-hidden">
                    {SHIFTS.map(s => (
                      <button
                        key={s.id}
                        onClick={() => { setSelectedShift(String(s.id)); setShiftDropOpen(false) }}
                        className="w-full flex items-center justify-between px-4 py-3 hover:bg-orange-50 transition-colors border-b border-gray-50 last:border-0"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#FDE8DD' }}>
                            <Clock size={14} color={PRIMARY} />
                          </div>
                          <div className="text-left">
                            <p className="text-sm font-semibold text-gray-900">{s.name}</p>
                            <p className="text-[10px] text-gray-400">{s.timing}</p>
                          </div>
                        </div>
                        <span className="px-2 py-0.5 rounded-lg text-[10px] font-bold text-white"
                          style={{ backgroundColor: s.type==='Normal' ? PRIMARY : '#111827' }}>
                          {s.type}
                        </span>
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>

          {/* ── Date range ── */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-semibold text-gray-700 block mb-2">
                Effective Date <span style={{ color: PRIMARY }}>*</span>
              </label>
              <div className="relative">
                <input
                  type="date"
                  value={effectiveDate}
                  onChange={e => setEffectiveDate(e.target.value)}
                  className="w-full h-11 px-4 pr-10 text-sm text-gray-800 bg-white border border-gray-200 rounded-xl outline-none transition-colors"
                  onFocus={e => (e.target.style.borderColor = PRIMARY)}
                  onBlur={e  => (e.target.style.borderColor = '#E5E7EB')}
                />
                <Calendar size={14} color="#9CA3AF" className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-700 block mb-2">
                End Date <span className="text-gray-400 text-[11px] font-normal">(optional)</span>
              </label>
              <div className="relative">
                <input
                  type="date"
                  value={endDate}
                  onChange={e => setEndDate(e.target.value)}
                  min={effectiveDate}
                  className="w-full h-11 px-4 pr-10 text-sm text-gray-800 bg-white border border-gray-200 rounded-xl outline-none transition-colors"
                  onFocus={e => (e.target.style.borderColor = PRIMARY)}
                  onBlur={e  => (e.target.style.borderColor = '#E5E7EB')}
                />
                <Calendar size={14} color="#9CA3AF" className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* ── Note ── */}
          <div>
            <label className="text-sm font-semibold text-gray-700 block mb-2">
              Note <span className="text-gray-400 text-[11px] font-normal">(optional)</span>
            </label>
            <textarea
              value={note}
              onChange={e => setNote(e.target.value)}
              placeholder="Add a note about this assignment…"
              rows={3}
              className="w-full px-4 py-3 text-sm text-gray-800 bg-white border border-gray-200 rounded-xl outline-none resize-none placeholder:text-gray-400"
              onFocus={e => (e.target.style.borderColor = PRIMARY)}
              onBlur={e  => (e.target.style.borderColor = '#E5E7EB')}
            />
          </div>
        </div>

        {/* ── RIGHT: Summary ─── */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 space-y-4 sticky top-4">
          <p className="text-sm font-bold text-gray-900">Assignment Summary</p>

          {/* Shift info */}
          <div className="rounded-xl p-4" style={{ backgroundColor: '#FDE8DD' }}>
            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2">Selected Shift</p>
            {chosenShift ? (
              <>
                <p className="text-base font-bold" style={{ color: PRIMARY }}>{chosenShift.name}</p>
                <p className="text-xs text-gray-500 mt-0.5">{chosenShift.type} · {chosenShift.timing}</p>
              </>
            ) : (
              <p className="text-sm text-gray-400">No shift selected</p>
            )}
          </div>

          {/* Employees */}
          <div>
            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2">
              Employees ({selectedEmps.length})
            </p>
            {selectedEmps.length === 0 ? (
              <p className="text-xs text-gray-400">No employees selected</p>
            ) : (
              <div className="space-y-2 max-h-44 overflow-y-auto">
                {selectedEmps.map(emp => (
                  <div key={emp.id} className="flex items-center gap-2.5">
                    <Avatar name={emp.name} />
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-gray-900 truncate">{emp.name}</p>
                      <p className="text-[10px] text-gray-400">{emp.code}</p>
                    </div>
                    <button onClick={() => removeEmployee(emp.id)} className="ml-auto text-gray-300 hover:text-red-400 transition-colors">
                      <X size={12} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Date */}
          {effectiveDate && (
            <div className="rounded-xl p-3 bg-gray-50 border border-gray-100">
              <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Effective From</p>
              <p className="text-sm font-semibold text-gray-800">{effectiveDate}</p>
              {endDate && <p className="text-xs text-gray-400">Until {endDate}</p>}
            </div>
          )}

          {/* Divider */}
          <div className="h-px bg-gray-100" />

          {/* Actions */}
          <div className="space-y-2">
            <button
              onClick={handleSubmit}
              disabled={!canSubmit}
              className="w-full py-2.5 rounded-xl text-sm font-semibold text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ backgroundColor: PRIMARY }}
              onMouseEnter={e => { if (canSubmit) e.currentTarget.style.backgroundColor = PRIMARY_DARK }}
              onMouseLeave={e => { if (canSubmit) e.currentTarget.style.backgroundColor = PRIMARY }}
            >
              Assign Shift
            </button>
            <button
              onClick={() => navigate('/shift')}
              className="w-full py-2.5 rounded-xl text-sm font-semibold text-gray-600 border border-gray-200 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </>
  )
}