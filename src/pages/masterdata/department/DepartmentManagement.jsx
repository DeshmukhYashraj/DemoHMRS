// src/pages/masterdata/department/DepartmentManagement.jsx
import { useState, useMemo, useRef, useEffect } from 'react'
import {
  Search, Filter, Plus, MoreVertical, Pencil, Trash2,
  X, ChevronLeft, ChevronRight, CheckCircle, XCircle,
  Building2, ChevronDown, ChevronRight as ChevronRightIcon, Trash,
} from 'lucide-react'
import FilterModal from '@/components/shared/FilterModal'

const PRIMARY      = '#C35E33'
const PRIMARY_DARK = '#A34A24'
const PAGE_SIZE    = 8

// ─── Demo data ────────────────────────────────────────────────────────────────
let idCounter = 100
const mkId = () => ++idCounter

const INITIAL_DATA = [
  {
    id: 1, code: 'MK001', name: 'Marketing', description: 'Manages promotions & marketing', active: true,
    subDepartments: [
      { id: 11, code: 'MK001-A', name: 'Digital Marketing', active: true  },
      { id: 12, code: 'MK001-B', name: 'Content Creation',  active: true  },
      { id: 13, code: 'MK001-C', name: 'Public Relations',  active: false },
    ],
  },
  {
    id: 2, code: 'SL002', name: 'Sales', description: 'Drives revenue and customer acquisition', active: false,
    subDepartments: [
      { id: 21, code: 'SL002-A', name: 'Inside Sales',  active: true },
      { id: 22, code: 'SL002-B', name: 'Field Sales',   active: true },
    ],
  },
  {
    id: 3, code: 'HR003', name: 'Human Resources', description: 'Manages employee lifecycle and benefits', active: true,
    subDepartments: [],
  },
  {
    id: 4, code: 'EN004', name: 'Engineering', description: 'Product development and infrastructure', active: true,
    subDepartments: [
      { id: 41, code: 'EN004-A', name: 'Frontend',  active: true  },
      { id: 42, code: 'EN004-B', name: 'Backend',   active: true  },
      { id: 43, code: 'EN004-C', name: 'DevOps',    active: true  },
      { id: 44, code: 'EN004-D', name: 'QA',        active: false },
    ],
  },
  {
    id: 5, code: 'FI005', name: 'Finance', description: 'Handles accounts, auditing and payroll', active: true,
    subDepartments: [
      { id: 51, code: 'FI005-A', name: 'Accounts', active: true },
      { id: 52, code: 'FI005-B', name: 'Audit',    active: true },
    ],
  },
  {
    id: 6, code: 'DS006', name: 'Design', description: 'Product design and user experience', active: true,
    subDepartments: [
      { id: 61, code: 'DS006-A', name: 'UI/UX', active: true },
    ],
  },
]

const FILTER_CONFIG = [
  { key: 'status', label: 'Status', type: 'multi', options: ['Active', 'Inactive'] },
]

// ─── Helpers ─────────────────────────────────────────────────────────────────
const StatusBadge = ({ active }) => active ? (
  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold" style={{ backgroundColor: '#DCFCE7', color: '#15803D' }}>
    <CheckCircle size={11} /> Active
  </span>
) : (
  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold" style={{ backgroundColor: '#FEE2E2', color: '#B91C1C' }}>
    <XCircle size={11} /> Inactive
  </span>
)

// ─── Action Menu ──────────────────────────────────────────────────────────────
function ActionMenu({ onEdit, onDelete }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)
  useEffect(() => {
    const h = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', h)
    return () => document.removeEventListener('mousedown', h)
  }, [])
  return (
    <div ref={ref} className="relative inline-block">
      <button onClick={() => setOpen((p) => !p)}
        className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:border-gray-400 hover:bg-gray-50 transition-all">
        <MoreVertical size={15} />
      </button>
      {open && (
        <div className="absolute right-0 top-9 z-30 w-36 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden">
          <button onClick={() => { onEdit(); setOpen(false) }}
            className="w-full flex items-center gap-2.5 px-3.5 py-2.5 text-xs font-medium text-gray-700 hover:bg-orange-50 hover:text-[#C35E33] transition-colors">
            <Pencil size={13} /> Edit
          </button>
          <div className="mx-3 h-px bg-gray-100" />
          <button onClick={() => { onDelete(); setOpen(false) }}
            className="w-full flex items-center gap-2.5 px-3.5 py-2.5 text-xs font-medium text-red-600 hover:bg-red-50 transition-colors">
            <Trash2 size={13} /> Delete
          </button>
        </div>
      )}
    </div>
  )
}

// ─── Sub-department form row (inside modal) ───────────────────────────────────
function SubDeptFormRow({ sub, onChange, onRemove, index }) {
  return (
    <div className="border border-gray-200 rounded-xl p-4 mb-3 relative bg-gray-50">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-semibold text-gray-600">Sub-Department {String(index + 1).padStart(2, '0')}</span>
        <button onClick={onRemove}
          className="w-7 h-7 flex items-center justify-center rounded-lg border border-red-200 text-red-400 hover:bg-red-50 hover:text-red-600 transition-colors">
          <Trash size={13} />
        </button>
      </div>
      <div className="grid grid-cols-2 gap-3 mb-3">
        <div>
          <label className="block text-[11px] font-semibold text-gray-600 mb-1">Sub-Department Name</label>
          <input
            type="text"
            value={sub.name}
            onChange={(e) => onChange('name', e.target.value)}
            placeholder="e.g. Recruitment"
            className="w-full h-9 px-3 text-sm text-gray-800 bg-white border border-gray-200 rounded-lg outline-none placeholder:text-gray-400 transition-colors"
            onFocus={(e) => { e.target.style.borderColor = PRIMARY }}
            onBlur={(e)  => { e.target.style.borderColor = '#E5E7EB' }}
          />
        </div>
        <div>
          <label className="block text-[11px] font-semibold text-gray-600 mb-1">Sub-Department Code</label>
          <input
            type="text"
            value={sub.code}
            onChange={(e) => onChange('code', e.target.value)}
            placeholder="e.g. 2589505"
            className="w-full h-9 px-3 text-sm text-gray-800 bg-white border border-gray-200 rounded-lg outline-none placeholder:text-gray-400 transition-colors"
            onFocus={(e) => { e.target.style.borderColor = PRIMARY }}
            onBlur={(e)  => { e.target.style.borderColor = '#E5E7EB' }}
          />
        </div>
      </div>
      <div className="mb-3">
        <label className="block text-[11px] font-semibold text-gray-600 mb-1">Description</label>
        <input
          type="text"
          value={sub.description}
          onChange={(e) => onChange('description', e.target.value)}
          placeholder="Short description about this sub-department…"
          className="w-full h-9 px-3 text-sm text-gray-800 bg-white border border-gray-200 rounded-lg outline-none placeholder:text-gray-400 transition-colors"
          onFocus={(e) => { e.target.style.borderColor = PRIMARY }}
          onBlur={(e)  => { e.target.style.borderColor = '#E5E7EB' }}
        />
      </div>
      <div>
        <label className="block text-[11px] font-semibold text-gray-600 mb-1.5">Status</label>
        <div className="flex items-center gap-5">
          {[{ label: 'Active', val: true }, { label: 'Inactive', val: false }].map(({ label, val }) => (
            <label key={label} className="flex items-center gap-1.5 cursor-pointer select-none text-xs text-gray-600"
              onClick={() => onChange('active', val)}>
              <span className="w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all"
                style={{ borderColor: sub.active === val ? PRIMARY : '#D1D5DB', backgroundColor: sub.active === val ? PRIMARY : 'transparent' }}>
                {sub.active === val && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
              </span>
              {label}
            </label>
          ))}
        </div>
      </div>
    </div>
  )
}

// ─── Add / Edit Department Modal ──────────────────────────────────────────────
function DepartmentModal({ mode, initial, onClose, onSave }) {
  const overlayRef = useRef(null)
  const isEdit = mode === 'edit'

  const [form, setForm] = useState({
    name:        initial?.name        ?? '',
    code:        initial?.code        ?? '',
    description: initial?.description ?? '',
    active:      initial?.active      ?? true,
  })
  const [subDepts, setSubDepts] = useState(
    initial?.subDepartments?.map((s) => ({ ...s, _key: s.id })) ?? []
  )
  const [errors,  setErrors]  = useState({})
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const h = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', h)
    return () => window.removeEventListener('keydown', h)
  }, [onClose])

  const setField = (k, v) => { setForm((p) => ({ ...p, [k]: v })); setErrors((p) => ({ ...p, [k]: '' })) }

  const validate = () => {
    const e = {}
    if (!form.name.trim()) e.name = 'Department name is required'
    if (!form.code.trim()) e.code = 'Department code is required'
    return e
  }

  const addSubDept = () => {
    setSubDepts((p) => [...p, { _key: mkId(), id: mkId(), name: '', code: '', description: '', active: true }])
  }

  const updateSubDept = (key, field, value) => {
    setSubDepts((p) => p.map((s) => s._key === key ? { ...s, [field]: value } : s))
  }

  const removeSubDept = (key) => {
    setSubDepts((p) => p.filter((s) => s._key !== key))
  }

  const handleSubmit = async () => {
    const e = validate()
    if (Object.keys(e).length) { setErrors(e); return }
    setLoading(true)
    try {
      await new Promise((r) => setTimeout(r, 300))
      onSave({ ...form, name: form.name.trim(), code: form.code.trim(), subDepartments: subDepts })
      onClose()
    } finally { setLoading(false) }
  }

  return (
    <div ref={overlayRef} onClick={(e) => { if (e.target === overlayRef.current) onClose() }}
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ backgroundColor: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(3px)' }}>

      <div className="bg-white rounded-2xl shadow-2xl w-full flex flex-col"
        style={{ maxWidth: 640, maxHeight: '90vh', margin: '0 16px' }}>

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 rounded-t-2xl flex-shrink-0"
          style={{ backgroundColor: '#111827' }}>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: PRIMARY }}>
              <Building2 size={16} color="#fff" />
            </div>
            <h2 className="text-white font-semibold text-sm">{isEdit ? 'Edit Department' : 'Add Department'}</h2>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-lg bg-gray-700 flex items-center justify-center text-gray-300 hover:bg-gray-600 transition-colors">
            <X size={15} />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto px-6 py-5">

          {/* Main Department fields */}
          <div className="border rounded-xl p-5 mb-5" style={{ borderColor: PRIMARY }}>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  Department Name <span style={{ color: PRIMARY }}>*</span>
                </label>
                <input type="text" value={form.name} onChange={(e) => setField('name', e.target.value)}
                  placeholder="Enter Department Name"
                  className="w-full h-10 px-3.5 text-sm text-gray-800 bg-gray-50 border rounded-xl outline-none placeholder:text-gray-400 transition-colors"
                  style={{ borderColor: errors.name ? '#EF4444' : '#E5E7EB' }}
                  onFocus={(e) => { e.target.style.borderColor = PRIMARY }}
                  onBlur={(e)  => { e.target.style.borderColor = errors.name ? '#EF4444' : '#E5E7EB' }}
                />
                {errors.name && <p className="text-[11px] text-red-500 mt-1">⚠ {errors.name}</p>}
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  Department Code <span style={{ color: PRIMARY }}>*</span>
                </label>
                <input type="text" value={form.code} onChange={(e) => setField('code', e.target.value)}
                  placeholder="e.g. 2585695"
                  className="w-full h-10 px-3.5 text-sm text-gray-800 bg-gray-50 border rounded-xl outline-none placeholder:text-gray-400 transition-colors"
                  style={{ borderColor: errors.code ? '#EF4444' : '#E5E7EB' }}
                  onFocus={(e) => { e.target.style.borderColor = PRIMARY }}
                  onBlur={(e)  => { e.target.style.borderColor = errors.code ? '#EF4444' : '#E5E7EB' }}
                />
                {errors.code && <p className="text-[11px] text-red-500 mt-1">⚠ {errors.code}</p>}
              </div>
            </div>
            <div className="mb-4">
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">Description</label>
              <textarea value={form.description} onChange={(e) => setField('description', e.target.value)}
                placeholder="Text…." rows={3}
                className="w-full px-3.5 py-2.5 text-sm text-gray-800 bg-gray-50 border border-gray-200 rounded-xl outline-none resize-none placeholder:text-gray-400 transition-colors"
                onFocus={(e) => { e.target.style.borderColor = PRIMARY }}
                onBlur={(e)  => { e.target.style.borderColor = '#E5E7EB' }}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-2">Status</label>
              <div className="flex items-center gap-6">
                {[{ label: 'Active', val: true }, { label: 'Inactive', val: false }].map(({ label, val }) => (
                  <label key={label} className="flex items-center gap-2 cursor-pointer select-none text-sm text-gray-600"
                    onClick={() => setField('active', val)}>
                    <span className="w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all"
                      style={{ borderColor: form.active === val ? PRIMARY : '#D1D5DB', backgroundColor: form.active === val ? PRIMARY : 'transparent' }}>
                      {form.active === val && <span className="w-2 h-2 rounded-full bg-white" />}
                    </span>
                    {label}
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Sub-Departments section */}
          <div>
            <p className="text-sm font-bold mb-3" style={{ color: PRIMARY }}>Sub-Departments</p>
            {subDepts.map((sub, idx) => (
              <SubDeptFormRow
                key={sub._key}
                sub={sub}
                index={idx}
                onChange={(field, value) => updateSubDept(sub._key, field, value)}
                onRemove={() => removeSubDept(sub._key)}
              />
            ))}
            <button
              onClick={addSubDept}
              className="w-full flex items-center justify-center gap-2 h-10 border-2 border-dashed rounded-xl text-sm font-medium transition-colors"
              style={{ borderColor: PRIMARY, color: PRIMARY }}
              onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#FDE8DD' }}
              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent' }}
            >
              <Plus size={15} /> Add Sub-Department
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-100 flex justify-end gap-3 flex-shrink-0">
          <button onClick={onClose} disabled={loading}
            className="px-5 py-2 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors">
            Cancel
          </button>
          <button onClick={handleSubmit} disabled={loading}
            className="px-5 py-2 rounded-xl text-sm font-semibold text-white transition-colors flex items-center gap-2"
            style={{ backgroundColor: '#111827' }}
            onMouseEnter={(e) => !loading && (e.currentTarget.style.backgroundColor = '#1F2937')}
            onMouseLeave={(e) => !loading && (e.currentTarget.style.backgroundColor = '#111827')}
          >
            {loading && <svg className="animate-spin w-3.5 h-3.5" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/></svg>}
            {isEdit ? 'Update Department' : 'Save Department'}
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Delete Confirm ───────────────────────────────────────────────────────────
function DeleteModal({ dept, onClose, onConfirm }) {
  const overlayRef = useRef(null)
  useEffect(() => {
    const h = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', h)
    return () => window.removeEventListener('keydown', h)
  }, [onClose])
  return (
    <div ref={overlayRef} onClick={(e) => { if (e.target === overlayRef.current) onClose() }}
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ backgroundColor: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(3px)' }}>
      <div className="bg-white rounded-2xl shadow-2xl w-full flex flex-col items-center p-8 text-center"
        style={{ maxWidth: 400, margin: '0 16px' }}>
        <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4" style={{ backgroundColor: '#FEE2E2' }}>
          <Trash2 size={24} color="#B91C1C" />
        </div>
        <h2 className="text-lg font-bold text-gray-900 mb-1">Delete Department</h2>
        <p className="text-sm text-gray-500 mb-6 leading-relaxed">
          Are you sure you want to delete <span className="font-semibold text-gray-800">"{dept.name}"</span>?
          This will also remove all its sub-departments.
        </p>
        <div className="flex gap-3 w-full">
          <button onClick={onClose} className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors">Cancel</button>
          <button onClick={() => { onConfirm(dept.id); onClose() }} className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white bg-red-600 hover:bg-red-700 transition-colors">Delete</button>
        </div>
      </div>
    </div>
  )
}

// ─── Pagination ───────────────────────────────────────────────────────────────
function Pagination({ current, total, pageSize, onChange }) {
  const totalPages = Math.ceil(total / pageSize)
  if (totalPages <= 1) return null
  return (
    <div className="flex items-center justify-between px-5 py-3 border-t border-gray-100 flex-wrap gap-2">
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
        <button onClick={() => onChange(current + 1)} disabled={current === totalPages}
          className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:border-gray-400 disabled:opacity-30 disabled:cursor-not-allowed transition-colors">
          <ChevronRight size={14} />
        </button>
      </div>
    </div>
  )
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function DepartmentManagement() {
  const [data,         setData]         = useState(INITIAL_DATA)
  const [search,       setSearch]       = useState('')
  const [showFilter,   setShowFilter]   = useState(false)
  const [activeFilters,setActiveFilters]= useState({})
  const [page,         setPage]         = useState(1)
  const [expandedIds,  setExpandedIds]  = useState(new Set([1]))  // MK001 open by default
  const [modalMode,    setModalMode]    = useState(null)
  const [editTarget,   setEditTarget]   = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(null)

  const filtered = useMemo(() => {
    const q = search.toLowerCase()
    return data.filter((d) => {
      const sm = !q || d.name.toLowerCase().includes(q) || d.code.toLowerCase().includes(q) || (d.description || '').toLowerCase().includes(q)
      const st = !activeFilters.status?.length || activeFilters.status.some((s) => (s === 'Active' ? d.active : !d.active))
      return sm && st
    })
  }, [data, search, activeFilters])

  useEffect(() => setPage(1), [search, activeFilters])

  const paginated = useMemo(() => filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE), [filtered, page])

  const toggleExpand = (id) => {
    setExpandedIds((prev) => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  const handleAdd    = (form) => setData((p) => [{ id: mkId(), ...form }, ...p])
  const handleEdit   = (form) => setData((p) => p.map((d) => d.id === editTarget.id ? { ...d, ...form } : d))
  const handleDelete = (id)   => setData((p) => p.filter((d) => d.id !== id))

  const filterCount = Object.values(activeFilters).filter((v) => Array.isArray(v) ? v.length > 0 : !!v).length

  return (
    <>
      {/* Header */}
      <div className="flex items-center justify-between mb-5 gap-3 flex-wrap">
        <div>
          <h1 className="text-xl font-bold text-gray-900 m-0">Department Management</h1>
          <p className="text-xs text-gray-400 mt-0.5">Manage departments and their sub-departments</p>
        </div>
        <button onClick={() => setModalMode('add')}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white transition-colors"
          style={{ backgroundColor: '#111827' }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#1F2937')}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#111827')}
        >
          <Plus size={15} strokeWidth={2.5} /> Add Department
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 mb-5">
        {[
          { label: 'Total',    value: data.length,                        color: '#111827', bg: '#F3F4F6' },
          { label: 'Active',   value: data.filter(d => d.active).length,  color: '#15803D', bg: '#DCFCE7' },
          { label: 'Inactive', value: data.filter(d => !d.active).length, color: '#B91C1C', bg: '#FEE2E2' },
        ].map(({ label, value, color, bg }) => (
          <div key={label} className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: bg }}>
              <Building2 size={18} color={color} />
            </div>
            <div>
              <p className="text-2xl font-bold leading-none" style={{ color }}>{value}</p>
              <p className="text-[11px] text-gray-500 mt-0.5 font-medium">{label} Departments</p>
            </div>
          </div>
        ))}
      </div>

      {/* Toolbar */}
      <div className="flex items-center gap-2 mb-4 flex-wrap">
        <label className="flex items-center gap-2 bg-white rounded-xl px-3 h-10 border border-gray-200 cursor-text flex-1" style={{ maxWidth: 420 }}
          onFocus={(e) => { e.currentTarget.style.borderColor = PRIMARY }}
          onBlur={(e)  => { e.currentTarget.style.borderColor = '#E5E7EB' }}>
          <Search size={13} color="#9CA3AF" strokeWidth={2} className="flex-shrink-0" />
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder="Search Department Name"
            className="border-none outline-none text-[13px] text-gray-900 bg-transparent w-full"
            onFocus={(e) => { e.target.parentElement.style.borderColor = PRIMARY }}
            onBlur={(e)  => { e.target.parentElement.style.borderColor = '#E5E7EB' }}
          />
        </label>
        <button onClick={() => setShowFilter(true)}
          className="relative flex items-center gap-1.5 bg-white border rounded-lg px-3 h-10 text-[13px] font-medium cursor-pointer hover:bg-gray-50 ml-auto transition-colors"
          style={{ borderColor: filterCount > 0 ? PRIMARY : '#E5E7EB', color: filterCount > 0 ? PRIMARY : '#374151' }}>
          <Filter size={13} strokeWidth={2} />
          <span>Filter</span>
          {filterCount > 0 && <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full text-[9px] font-bold text-white flex items-center justify-center" style={{ backgroundColor: PRIMARY }}>{filterCount}</span>}
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse" style={{ minWidth: 820 }}>
            <thead>
              <tr style={{ backgroundColor: PRIMARY }}>
                {['', 'Dept Code', 'Department Name', 'Subdepartments', 'Description', 'Status', 'Action'].map((h) => (
                  <th key={h} className={`px-4 py-3.5 text-left text-xs font-semibold text-white whitespace-nowrap ${h === 'Action' ? 'text-center' : ''} ${h === '' ? 'w-10' : ''}`}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paginated.length === 0 ? (
                <tr><td colSpan={7} className="px-4 py-14 text-center text-sm text-gray-400">No departments found.</td></tr>
              ) : paginated.map((dept, idx) => {
                const isExpanded = expandedIds.has(dept.id)
                const subCount   = dept.subDepartments?.length ?? 0
                return (
                  <>
                    {/* Main department row */}
                    <tr key={dept.id}
                      className="hover:bg-orange-50 transition-colors cursor-pointer"
                      style={{ backgroundColor: isExpanded ? '#FFF7F4' : idx % 2 === 0 ? '#fff' : '#FAFAFA' }}
                      onClick={() => subCount > 0 && toggleExpand(dept.id)}
                    >
                      {/* Expand arrow */}
                      <td className="px-4 py-4 border-b border-gray-100 w-10">
                        {subCount > 0 ? (
                          <span className="w-6 h-6 flex items-center justify-center rounded-md transition-transform"
                            style={{ transform: isExpanded ? 'rotate(90deg)' : 'rotate(0deg)', transition: 'transform 220ms ease' }}>
                            <ChevronRightIcon size={15} color={PRIMARY} strokeWidth={2.5} />
                          </span>
                        ) : (
                          <span className="w-6 h-6 flex items-center justify-center text-gray-200">
                            <ChevronRightIcon size={13} strokeWidth={2} />
                          </span>
                        )}
                      </td>

                      {/* Code */}
                      <td className="px-4 py-4 border-b border-gray-100 whitespace-nowrap">
                        <span className="text-[12px] font-bold" style={{ color: PRIMARY }}>{dept.code}</span>
                      </td>

                      {/* Name */}
                      <td className="px-4 py-4 border-b border-gray-100 whitespace-nowrap">
                        <span className="text-[13px] font-semibold text-gray-900">{dept.name}</span>
                      </td>

                      {/* Sub-dept count */}
                      <td className="px-4 py-4 border-b border-gray-100 whitespace-nowrap">
                        <span className="inline-flex px-2.5 py-1 rounded-lg text-xs font-semibold"
                          style={{ backgroundColor: subCount > 0 ? '#F3F4F6' : '#FFF', color: '#374151', border: '1px solid #E5E7EB' }}>
                          {subCount} sub-dept{subCount !== 1 ? 's' : ''}
                        </span>
                      </td>

                      {/* Description */}
                      <td className="px-4 py-4 border-b border-gray-100 max-w-xs">
                        <p className="text-[12px] text-gray-600 truncate max-w-[220px]">{dept.description || '—'}</p>
                      </td>

                      {/* Status */}
                      <td className="px-4 py-4 border-b border-gray-100 whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                        <StatusBadge active={dept.active} />
                      </td>

                      {/* Action */}
                      <td className="px-4 py-4 border-b border-gray-100 text-center" onClick={(e) => e.stopPropagation()}>
                        <ActionMenu
                          onEdit={() => { setEditTarget(dept); setModalMode('edit') }}
                          onDelete={() => setDeleteTarget(dept)}
                        />
                      </td>
                    </tr>

                    {/* Expanded sub-department rows */}
                    {isExpanded && subCount > 0 && (
                      <tr key={`sub-${dept.id}`}>
                        <td colSpan={7} className="border-b border-gray-100 p-0">
                          <div className="mx-4 my-3 rounded-xl border border-gray-200 overflow-hidden bg-gray-50">
                            <table className="w-full border-collapse">
                              <thead>
                                <tr className="bg-gray-100">
                                  <th className="px-4 py-2.5 text-left text-[11px] font-semibold text-gray-500 w-36">Sub-Dept Code</th>
                                  <th className="px-4 py-2.5 text-left text-[11px] font-semibold text-gray-500">Sub-Department Name</th>
                                  <th className="px-4 py-2.5 text-left text-[11px] font-semibold text-gray-500">Status</th>
                                  <th className="px-4 py-2.5 text-center text-[11px] font-semibold text-gray-500 w-20">Action</th>
                                </tr>
                              </thead>
                              <tbody>
                                {dept.subDepartments.map((sub, si) => (
                                  <tr key={sub.id} className="border-t border-gray-200 hover:bg-orange-50 transition-colors"
                                    style={{ backgroundColor: si % 2 === 0 ? '#fff' : '#F9FAFB' }}>
                                    <td className="px-4 py-3 text-[11px] font-semibold" style={{ color: PRIMARY }}>{sub.code}</td>
                                    <td className="px-4 py-3 text-[12px] text-gray-700 font-medium">{sub.name}</td>
                                    <td className="px-4 py-3"><StatusBadge active={sub.active} /></td>
                                    <td className="px-4 py-3 text-center">
                                      <ActionMenu
                                        onEdit={() => { setEditTarget(dept); setModalMode('edit') }}
                                        onDelete={() => {}}
                                      />
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </td>
                      </tr>
                    )}
                  </>
                )
              })}
            </tbody>
          </table>
        </div>
        <Pagination current={page} total={filtered.length} pageSize={PAGE_SIZE} onChange={setPage} />
      </div>

      {/* Modals */}
      {(modalMode === 'add' || modalMode === 'edit') && (
        <DepartmentModal
          mode={modalMode}
          initial={modalMode === 'edit' ? editTarget : null}
          onClose={() => { setModalMode(null); setEditTarget(null) }}
          onSave={modalMode === 'add' ? handleAdd : handleEdit}
        />
      )}
      {deleteTarget && (
        <DeleteModal dept={deleteTarget} onClose={() => setDeleteTarget(null)} onConfirm={handleDelete} />
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