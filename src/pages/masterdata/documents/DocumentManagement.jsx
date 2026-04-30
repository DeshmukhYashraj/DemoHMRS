// src/pages/masterdata/documents/DocumentManagement.jsx
import { useState, useMemo, useRef, useEffect } from 'react'
import {
  Search, Plus, MoreVertical, Pencil, Trash2,
  X, ChevronLeft, ChevronRight, CheckCircle, XCircle,
  FileText, ChevronDown,
} from 'lucide-react'

const PRIMARY      = '#C35E33'
const PRIMARY_DARK = '#A34A24'
const PAGE_SIZE    = 8

// ─── Demo data ────────────────────────────────────────────────────────────────
const INITIAL_DATA = [
  { id: 1,  name: 'Aadhaar Card',      type: 'PDF',      applicableFor: 'Employee', mandatory: true,  active: true  },
  { id: 2,  name: 'Aadhaar Card',      type: 'JPG',      applicableFor: 'Intern',   mandatory: true,  active: false },
  { id: 3,  name: 'Aadhaar Card',      type: 'PNG',      applicableFor: 'Employee', mandatory: false, active: false },
  { id: 4,  name: 'Aadhaar Card',      type: 'JPG',      applicableFor: 'Employee', mandatory: true,  active: true  },
  { id: 5,  name: 'Aadhaar Card',      type: 'PNG',      applicableFor: 'Employee', mandatory: false, active: true  },
  { id: 6,  name: 'Pan Card',          type: 'PNG',      applicableFor: 'Employee', mandatory: true,  active: false },
  { id: 7,  name: 'Offer Letter',      type: 'PDF',      applicableFor: 'Employee', mandatory: true,  active: true  },
  { id: 8,  name: 'Experience Letter', type: 'PDF',      applicableFor: 'Employee', mandatory: false, active: true  },
  { id: 9,  name: 'Degree Certificate',type: 'PDF',      applicableFor: 'Trainee',  mandatory: true,  active: true  },
  { id: 10, name: 'Bank Passbook',     type: 'JPG',      applicableFor: 'Employee', mandatory: false, active: false },
  { id: 11, name: 'Resume',            type: 'PDF',      applicableFor: 'Intern',   mandatory: true,  active: true  },
  { id: 12, name: 'NOC Letter',        type: 'Multiple', applicableFor: 'Trainee',  mandatory: false, active: true  },
]

const DOC_TYPES    = ['PDF', 'JPG', 'PNG', 'Multiple']
const APPLICABLE   = ['Employee', 'Intern', 'Trainee']

// ─── Helpers ─────────────────────────────────────────────────────────────────
function StatusBadge({ active }) {
  return active ? (
    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold"
      style={{ backgroundColor: '#DCFCE7', color: '#15803D' }}>
      <CheckCircle size={11} /> Active
    </span>
  ) : (
    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold"
      style={{ backgroundColor: '#FEE2E2', color: '#B91C1C' }}>
      <XCircle size={11} /> Inactive
    </span>
  )
}

function TypeBadge({ type }) {
  const colors = {
    PDF:      { bg: '#EFF6FF', color: '#1D4ED8' },
    JPG:      { bg: '#FEF9C3', color: '#854D0E' },
    PNG:      { bg: '#F0FDF4', color: '#15803D' },
    Multiple: { bg: '#FDE8DD', color: PRIMARY   },
  }
  const s = colors[type] ?? { bg: '#F3F4F6', color: '#374151' }
  return (
    <span className="inline-flex px-2.5 py-0.5 rounded-md text-[11px] font-semibold"
      style={{ backgroundColor: s.bg, color: s.color }}>
      {type}
    </span>
  )
}

// ─── Custom Select Dropdown ───────────────────────────────────────────────────
function SelectDropdown({ value, onChange, options, placeholder }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    const h = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', h)
    return () => document.removeEventListener('mousedown', h)
  }, [])

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((p) => !p)}
        className="flex items-center gap-2 h-9 px-3.5 text-sm border rounded-xl bg-white transition-colors whitespace-nowrap"
        style={{ borderColor: value ? PRIMARY : '#E5E7EB', color: value ? PRIMARY : '#6B7280', minWidth: 130 }}
      >
        <span className="flex-1 text-left text-[13px]">{value || placeholder}</span>
        <ChevronDown size={13} style={{ transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 200ms', flexShrink: 0 }} />
      </button>
      {open && (
        <div className="absolute top-10 left-0 z-30 w-full bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden">
          <button
            type="button"
            onClick={() => { onChange(''); setOpen(false) }}
            className="w-full text-left px-4 py-2.5 text-[13px] text-gray-400 hover:bg-gray-50 transition-colors"
          >
            All
          </button>
          {options.map((o) => (
            <button
              key={o}
              type="button"
              onClick={() => { onChange(o); setOpen(false) }}
              className="w-full text-left px-4 py-2.5 text-[13px] text-gray-700 hover:bg-orange-50 transition-colors"
              style={{ color: value === o ? PRIMARY : '#374151', fontWeight: value === o ? 600 : 400 }}
            >
              {o}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

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
      <button
        onClick={() => setOpen((p) => !p)}
        className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:border-gray-400 hover:bg-gray-50 transition-all"
      >
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

// ─── Document Modal (Add / Edit) ──────────────────────────────────────────────
function DocumentModal({ mode, initial, onClose, onSave }) {
  const overlayRef = useRef(null)
  const [form, setForm] = useState({
    name:          initial?.name          ?? '',
    type:          initial?.type          ?? 'PDF',
    applicableFor: initial?.applicableFor ?? 'Employee',
    mandatory:     initial?.mandatory     ?? true,
    active:        initial?.active        ?? true,
  })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const h = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', h)
    return () => window.removeEventListener('keydown', h)
  }, [onClose])

  const setField = (k, v) => { setForm((p) => ({ ...p, [k]: v })); setErrors((p) => ({ ...p, [k]: '' })) }

  const validate = () => {
    const e = {}
    if (!form.name.trim()) e.name = 'Document name is required'
    return e
  }

  const handleSubmit = async () => {
    const e = validate()
    if (Object.keys(e).length) { setErrors(e); return }
    setLoading(true)
    try {
      await new Promise((r) => setTimeout(r, 300))
      onSave({ ...form, name: form.name.trim() })
      onClose()
    } finally { setLoading(false) }
  }

  const isEdit = mode === 'edit'

  return (
    <div
      ref={overlayRef}
      onClick={(e) => { if (e.target === overlayRef.current) onClose() }}
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ backgroundColor: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(3px)' }}
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full flex flex-col"
        style={{ maxWidth: 600, margin: '0 16px' }}>

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 rounded-t-2xl"
          style={{ backgroundColor: '#111827' }}>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: PRIMARY }}>
              <FileText size={16} color="#fff" />
            </div>
            <h2 className="text-white font-semibold text-sm">
              {isEdit ? 'Edit Document' : 'Create Document'}
            </h2>
          </div>
          <button onClick={onClose}
            className="w-8 h-8 rounded-lg bg-gray-700 flex items-center justify-center text-gray-300 hover:bg-gray-600 transition-colors">
            <X size={15} />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5">
          {/* Row 1: Document Name + Document Type */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                Document Name <span style={{ color: PRIMARY }}>*</span>
              </label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setField('name', e.target.value)}
                placeholder="Aadhar Card"
                className="w-full h-10 px-3.5 text-sm text-gray-800 bg-gray-50 border rounded-xl outline-none transition-colors placeholder:text-gray-400"
                style={{ borderColor: errors.name ? '#EF4444' : '#E5E7EB' }}
                onFocus={(e) => { e.target.style.borderColor = PRIMARY }}
                onBlur={(e)  => { e.target.style.borderColor = errors.name ? '#EF4444' : '#E5E7EB' }}
              />
              {errors.name && <p className="text-[11px] text-red-500 mt-1">⚠ {errors.name}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">Document Type</label>
              <select
                value={form.type}
                onChange={(e) => setField('type', e.target.value)}
                className="w-full h-10 px-3.5 text-sm text-gray-800 bg-gray-50 border border-gray-200 rounded-xl outline-none appearance-none cursor-pointer transition-colors"
                onFocus={(e) => { e.target.style.borderColor = PRIMARY }}
                onBlur={(e)  => { e.target.style.borderColor = '#E5E7EB' }}
              >
                {DOC_TYPES.map((t) => <option key={t}>{t}</option>)}
              </select>
            </div>
          </div>

          {/* Row 2: Applicable For + Mandatory */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">Applicable For</label>
              <select
                value={form.applicableFor}
                onChange={(e) => setField('applicableFor', e.target.value)}
                className="w-full h-10 px-3.5 text-sm text-gray-800 bg-gray-50 border border-gray-200 rounded-xl outline-none appearance-none cursor-pointer transition-colors"
                onFocus={(e) => { e.target.style.borderColor = PRIMARY }}
                onBlur={(e)  => { e.target.style.borderColor = '#E5E7EB' }}
              >
                {APPLICABLE.map((a) => <option key={a}>{a}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-2">Mandatory</label>
              <div className="flex items-center gap-6 mt-1">
                {[{ label: 'Yes', val: true }, { label: 'No', val: false }].map(({ label, val }) => (
                  <label key={label} className="flex items-center gap-2 cursor-pointer select-none text-sm text-gray-600"
                    onClick={() => setField('mandatory', val)}>
                    <span className="w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all"
                      style={{ borderColor: form.mandatory === val ? PRIMARY : '#D1D5DB', backgroundColor: form.mandatory === val ? PRIMARY : 'transparent' }}>
                      {form.mandatory === val && <span className="w-2 h-2 rounded-full bg-white" />}
                    </span>
                    {label}
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Status */}
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

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-100 flex justify-end gap-3">
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
            {isEdit ? 'Update Document' : 'Save Document'}
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Delete Confirm Modal ─────────────────────────────────────────────────────
function DeleteModal({ doc, onClose, onConfirm }) {
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
        <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4"
          style={{ backgroundColor: '#FEE2E2' }}>
          <Trash2 size={24} color="#B91C1C" />
        </div>
        <h2 className="text-lg font-bold text-gray-900 mb-1">Delete Document</h2>
        <p className="text-sm text-gray-500 mb-6 leading-relaxed">
          Are you sure you want to delete <span className="font-semibold text-gray-800">"{doc.name}"</span>?
        </p>
        <div className="flex gap-3 w-full">
          <button onClick={onClose}
            className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors">
            Cancel
          </button>
          <button onClick={() => { onConfirm(doc.id); onClose() }}
            className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white bg-red-600 hover:bg-red-700 transition-colors">
            Delete
          </button>
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
export default function DocumentManagement() {
  const [data,         setData]         = useState(INITIAL_DATA)
  const [search,       setSearch]       = useState('')
  const [typeFilter,   setTypeFilter]   = useState('')
  const [appFilter,    setAppFilter]    = useState('')
  const [page,         setPage]         = useState(1)
  const [modalMode,    setModalMode]    = useState(null)   // 'add' | 'edit'
  const [editTarget,   setEditTarget]   = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(null)

  const filtered = useMemo(() => {
    const q = search.toLowerCase()
    return data.filter((d) => {
      const s = !q || d.name.toLowerCase().includes(q) || d.type.toLowerCase().includes(q)
      const t = !typeFilter || d.type === typeFilter
      const a = !appFilter  || d.applicableFor === appFilter
      return s && t && a
    })
  }, [data, search, typeFilter, appFilter])

  useEffect(() => setPage(1), [search, typeFilter, appFilter])

  const paginated = useMemo(() => filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE), [filtered, page])

  const handleAdd    = (form) => setData((p) => [{ id: Date.now(), ...form }, ...p])
  const handleEdit   = (form) => setData((p) => p.map((d) => d.id === editTarget.id ? { ...d, ...form } : d))
  const handleDelete = (id)   => setData((p) => p.filter((d) => d.id !== id))

  return (
    <>
      {/* ── Header ───────────────────────────────────────────── */}
      <div className="flex items-center justify-between mb-5 gap-3 flex-wrap">
        <div>
          <h1 className="text-xl font-bold text-gray-900 m-0">Document Management</h1>
          <p className="text-xs text-gray-400 mt-0.5">Manage all required documents and their configurations</p>
        </div>
        <button
          onClick={() => setModalMode('add')}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white transition-colors"
          style={{ backgroundColor: '#111827' }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#1F2937')}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#111827')}
        >
          <Plus size={15} strokeWidth={2.5} />
          Create Document
        </button>
      </div>

      {/* ── Stats ────────────────────────────────────────────── */}
      <div className="grid grid-cols-3 gap-3 mb-5">
        {[
          { label: 'Total',    value: data.length,                        color: '#111827', bg: '#F3F4F6' },
          { label: 'Active',   value: data.filter(d => d.active).length,  color: '#15803D', bg: '#DCFCE7' },
          { label: 'Inactive', value: data.filter(d => !d.active).length, color: '#B91C1C', bg: '#FEE2E2' },
        ].map(({ label, value, color, bg }) => (
          <div key={label} className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: bg }}>
              <FileText size={18} color={color} />
            </div>
            <div>
              <p className="text-2xl font-bold leading-none" style={{ color }}>{value}</p>
              <p className="text-[11px] text-gray-500 mt-0.5 font-medium">{label} Documents</p>
            </div>
          </div>
        ))}
      </div>

      {/* ── Toolbar ──────────────────────────────────────────── */}
      <div className="flex items-center gap-2 mb-4 flex-wrap">
        {/* Search */}
        <label className="flex items-center gap-2 bg-white rounded-xl px-3 h-10 border border-gray-200 cursor-text flex-1" style={{ maxWidth: 380 }}>
          <Search size={13} color="#9CA3AF" strokeWidth={2} className="flex-shrink-0" />
          <input
            type="text" value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder="Search Documents"
            className="border-none outline-none text-[13px] text-gray-900 bg-transparent w-full"
            onFocus={(e) => { e.target.parentElement.style.borderColor = PRIMARY }}
            onBlur={(e)  => { e.target.parentElement.style.borderColor = '#E5E7EB' }}
          />
        </label>

        <div className="flex items-center gap-2 ml-auto">
          <SelectDropdown value={typeFilter} onChange={setTypeFilter} options={DOC_TYPES}  placeholder="Document Type" />
          <SelectDropdown value={appFilter}  onChange={setAppFilter}  options={APPLICABLE} placeholder="Applicable"    />
        </div>
      </div>

      {/* ── Table ────────────────────────────────────────────── */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse" style={{ minWidth: 700 }}>
            <thead>
              <tr style={{ backgroundColor: PRIMARY }}>
                {['Document Name', 'Document Type', 'Applicable', 'Status', 'Action'].map((h) => (
                  <th key={h}
                    className={`px-5 py-3.5 text-left text-xs font-semibold text-white whitespace-nowrap ${h === 'Action' ? 'text-center' : ''}`}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paginated.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-14 text-center text-sm text-gray-400">
                    No documents match your search or filters.
                  </td>
                </tr>
              ) : paginated.map((row, idx) => (
                <tr key={row.id}
                  className="hover:bg-orange-50 transition-colors"
                  style={{ backgroundColor: idx % 2 === 0 ? '#fff' : '#FAFAFA' }}>

                  {/* Document Name */}
                  <td className="px-5 py-4 border-b border-gray-50">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                        style={{ backgroundColor: '#FDE8DD' }}>
                        <FileText size={15} color={PRIMARY} />
                      </div>
                      <div>
                        <p className="text-[13px] font-semibold text-gray-900 leading-none">{row.name}</p>
                        <p className="text-[10px] text-gray-400 mt-0.5">{row.mandatory ? 'Mandatory' : 'Optional'}</p>
                      </div>
                    </div>
                  </td>

                  {/* Document Type */}
                  <td className="px-5 py-4 border-b border-gray-50 whitespace-nowrap">
                    <TypeBadge type={row.type} />
                  </td>

                  {/* Applicable */}
                  <td className="px-5 py-4 border-b border-gray-50 text-[13px] text-gray-600 whitespace-nowrap">
                    {row.applicableFor}
                  </td>

                  {/* Status */}
                  <td className="px-5 py-4 border-b border-gray-50 whitespace-nowrap">
                    <StatusBadge active={row.active} />
                  </td>

                  {/* Action */}
                  <td className="px-5 py-4 border-b border-gray-50 text-center">
                    <ActionMenu
                      onEdit={() => { setEditTarget(row); setModalMode('edit') }}
                      onDelete={() => setDeleteTarget(row)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Pagination current={page} total={filtered.length} pageSize={PAGE_SIZE} onChange={setPage} />
      </div>

      {/* ── Modals ───────────────────────────────────────────── */}
      {(modalMode === 'add' || modalMode === 'edit') && (
        <DocumentModal
          mode={modalMode}
          initial={modalMode === 'edit' ? editTarget : null}
          onClose={() => { setModalMode(null); setEditTarget(null) }}
          onSave={modalMode === 'add' ? handleAdd : handleEdit}
        />
      )}
      {deleteTarget && (
        <DeleteModal
          doc={deleteTarget}
          onClose={() => setDeleteTarget(null)}
          onConfirm={handleDelete}
        />
      )}
    </>
  )
}


