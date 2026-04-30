// src/pages/leave/tabs/LeaveTypeTab.jsx
import { useState, useMemo } from 'react'
import { Plus, Edit2, Trash2, ChevronDown, Search } from 'lucide-react'

const PRIMARY = '#C35E33'

function RadioGroup({ label, options, value, onChange }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-gray-700 mb-2">{label}</label>
      <div className="flex items-center gap-4">
        {options.map((opt) => (
          <label key={opt.value} className="flex items-center gap-1.5 cursor-pointer">
            <div
              onClick={() => onChange(opt.value)}
              className="w-4 h-4 rounded-full border-2 flex items-center justify-center cursor-pointer transition-all"
              style={{ borderColor: value === opt.value ? PRIMARY : '#D1D5DB', backgroundColor: value === opt.value ? PRIMARY : 'transparent' }}>
              {value === opt.value && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
            </div>
            <span className="text-sm text-gray-600">{opt.label}</span>
          </label>
        ))}
      </div>
    </div>
  )
}

const LEAVE_TYPES = [
  { id: 1, name: 'Casual Leave',   code: 'CL', isPaid: true,  allowHalfDay: true,  isActive: true,  allowDuringProbation: false, isCompOff: false },
  { id: 2, name: 'Sick Leave',     code: 'SL', isPaid: true,  allowHalfDay: true,  isActive: true,  allowDuringProbation: true,  isCompOff: false },
  { id: 3, name: 'Earned Leave',   code: 'EL', isPaid: true,  allowHalfDay: false, isActive: true,  allowDuringProbation: false, isCompOff: false },
  { id: 4, name: 'Annual Leave',   code: 'AL', isPaid: true,  allowHalfDay: false, isActive: true,  allowDuringProbation: false, isCompOff: false },
  { id: 5, name: 'Comp Off',       code: 'CO', isPaid: false, allowHalfDay: true,  isActive: true,  allowDuringProbation: false, isCompOff: true  },
]

export default function LeaveTypeTab() {
  const [form, setForm] = useState({
    name: '', code: '', description: '',
    isPaid: 'Yes', allowHalfDay: 'Yes',
    status: 'Active', isOptional: 'No', allowDuringProbation: 'Yes',
  })
  const [search, setSearch] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [editId, setEditId] = useState(null)

  const set = (key) => (e) => setForm(p => ({ ...p, [key]: e.target ? e.target.value : e }))
  const setR = (key) => (v) => setForm(p => ({ ...p, [key]: v }))

  const filtered = useMemo(() => {
    const q = search.toLowerCase()
    return LEAVE_TYPES.filter(t => t.name.toLowerCase().includes(q) || t.code.toLowerCase().includes(q))
  }, [search])

  return (
    <>
      {/* Existing types table */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden mb-5">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <h3 className="text-sm font-bold text-gray-900">Leave Types</h3>
          <div className="flex items-center gap-2">
            <label className="flex items-center gap-2 bg-gray-50 rounded-lg px-3 h-8 border border-gray-200">
              <Search size={12} color="#9CA3AF" />
              <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
                placeholder="Search…" className="border-none outline-none text-[12px] bg-transparent w-28" />
            </label>
            <button onClick={() => { setShowForm(true); setEditId(null) }}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold text-white"
              style={{ backgroundColor: PRIMARY }}>
              <Plus size={12} /> Add Leave Type
            </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse" style={{ minWidth: 700 }}>
            <thead>
              <tr style={{ backgroundColor: PRIMARY }}>
                {['Leave Name','Code','Paid','Half Day','Probation','Comp Off','Status','Actions'].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-white whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((t, idx) => (
                <tr key={t.id} className="hover:bg-orange-50 transition-colors"
                  style={{ backgroundColor: idx % 2 === 0 ? '#fff' : '#FAFAFA' }}>
                  <td className="px-4 py-3.5 text-[13px] font-semibold text-gray-900 border-b border-gray-50">{t.name}</td>
                  <td className="px-4 py-3.5 border-b border-gray-50">
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded" style={{ backgroundColor: '#F5EBE5', color: PRIMARY }}>{t.code}</span>
                  </td>
                  <td className="px-4 py-3.5 border-b border-gray-50">
                    <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${t.isPaid ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                      {t.isPaid ? 'Yes' : 'No'}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 border-b border-gray-50">
                    <span className={`text-[11px] font-semibold ${t.allowHalfDay ? 'text-green-600' : 'text-gray-400'}`}>{t.allowHalfDay ? 'Yes' : 'No'}</span>
                  </td>
                  <td className="px-4 py-3.5 border-b border-gray-50">
                    <span className={`text-[11px] font-semibold ${t.allowDuringProbation ? 'text-green-600' : 'text-gray-400'}`}>{t.allowDuringProbation ? 'Yes' : 'No'}</span>
                  </td>
                  <td className="px-4 py-3.5 border-b border-gray-50">
                    <span className={`text-[11px] font-semibold ${t.isCompOff ? 'text-blue-600' : 'text-gray-400'}`}>{t.isCompOff ? 'Yes' : 'No'}</span>
                  </td>
                  <td className="px-4 py-3.5 border-b border-gray-50">
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${t.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>
                      {t.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 border-b border-gray-50">
                    <div className="flex items-center gap-1.5">
                      <button onClick={() => setShowForm(true)} className="w-7 h-7 flex items-center justify-center rounded-lg border border-gray-200 text-gray-400 hover:border-[#C35E33] hover:text-[#C35E33] transition-all">
                        <Edit2 size={12} />
                      </button>
                      <button className="w-7 h-7 flex items-center justify-center rounded-lg border border-gray-200 text-gray-400 hover:border-red-400 hover:text-red-500 transition-all">
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Form */}
      {showForm && (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
            <h3 className="text-sm font-bold text-gray-900">Leave Field</h3>
            <button onClick={() => setShowForm(false)} className="text-xs text-gray-400 hover:text-gray-600">✕ Close</button>
          </div>
          <div className="p-6 space-y-5">
            {/* Row 1 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="sm:col-span-1">
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">Leave Name <span style={{ color: PRIMARY }}>*</span></label>
                <input value={form.name} onChange={set('name')} placeholder="Name"
                  className="w-full h-10 px-3 text-sm border border-gray-200 rounded-xl outline-none bg-gray-50 placeholder:text-gray-300"
                  onFocus={(e) => (e.target.style.borderColor = PRIMARY)}
                  onBlur={(e) => (e.target.style.borderColor = '#E5E7EB')} />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">Leave Code <span style={{ color: PRIMARY }}>*</span></label>
                <input value={form.code} onChange={set('code')} placeholder="****"
                  className="w-full h-10 px-3 text-sm border border-gray-200 rounded-xl outline-none bg-gray-50 placeholder:text-gray-300"
                  onFocus={(e) => (e.target.style.borderColor = PRIMARY)}
                  onBlur={(e) => (e.target.style.borderColor = '#E5E7EB')} />
              </div>
              <RadioGroup label="Paid Leave" options={[{label:'Yes',value:'Yes'},{label:'No',value:'No'}]}
                value={form.isPaid} onChange={setR('isPaid')} />
              <RadioGroup label="Allow Half Day" options={[{label:'Yes',value:'Yes'},{label:'No',value:'No'}]}
                value={form.allowHalfDay} onChange={setR('allowHalfDay')} />
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">Description</label>
              <textarea value={form.description} onChange={set('description')} placeholder="Type..." rows={3}
                className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl outline-none bg-gray-50 resize-none placeholder:text-gray-300"
                onFocus={(e) => (e.target.style.borderColor = PRIMARY)}
                onBlur={(e) => (e.target.style.borderColor = '#E5E7EB')} />
            </div>

            {/* Row 3 */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">Status</label>
                <div className="relative">
                  <select value={form.status} onChange={set('status')}
                    className="w-full h-10 px-3 pr-8 text-sm border border-gray-200 rounded-xl outline-none bg-gray-50 appearance-none"
                    onFocus={(e) => (e.target.style.borderColor = PRIMARY)}
                    onBlur={(e) => (e.target.style.borderColor = '#E5E7EB')}>
                    <option>Active</option><option>Inactive</option>
                  </select>
                  <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                </div>
              </div>
              <RadioGroup label="Is Optional Leave" options={[{label:'Yes',value:'Yes'},{label:'No',value:'No'}]}
                value={form.isOptional} onChange={setR('isOptional')} />
              <RadioGroup label="Allow During Probation" options={[{label:'Yes',value:'Yes'},{label:'No',value:'No'}]}
                value={form.allowDuringProbation} onChange={setR('allowDuringProbation')} />
            </div>
          </div>
          <div className="px-6 py-4 border-t border-gray-100 flex justify-end gap-2">
            <button onClick={() => setShowForm(false)}
              className="px-4 py-2 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50">
              Cancel
            </button>
            <button className="px-5 py-2 rounded-xl text-sm font-semibold text-white"
              style={{ backgroundColor: '#111827' }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#1F2937')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#111827')}>
              Save Leave Type
            </button>
          </div>
        </div>
      )}
    </>
  )
}