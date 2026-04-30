// src/pages/masterdata/designation/DesignationManagement.jsx
import { useState, useMemo, useRef, useEffect } from 'react'
import {
  Search, Filter, Plus, ChevronLeft, ChevronRight,
  MoreVertical, Pencil, Trash2, X, CheckCircle, XCircle,
  Building2, ClipboardList,
} from 'lucide-react'
import FilterModal from '@/components/shared/FilterModal'

const PRIMARY      = '#C35E33'
const PRIMARY_DARK = '#A34A24'
const PAGE_SIZE    = 8


// ─── Demo data (matches DesignationResponseDTO) ───────────────────────────────
const INITIAL_DATA = [
  { id: 1,  name: 'Software Developer',  description: 'Develops and maintains software systems and applications',            active: true  },
  { id: 2,  name: 'UI/UX Designer',      description: 'Designs user interfaces and experiences for products',                active: true  },
  { id: 3,  name: 'HR Manager',          description: 'Manages human resources operations and employee relations',           active: true  },
  { id: 4,  name: 'Sales Executive',     description: 'Handles client acquisition and revenue generation',                  active: false },
  { id: 5,  name: 'QA Engineer',         description: 'Ensures product quality through testing and validation',             active: true  },
  { id: 6,  name: 'DevOps Engineer',     description: 'Manages infrastructure, CI/CD pipelines and deployments',            active: true  },
  { id: 7,  name: 'Data Analyst',        description: 'Analyzes data to provide actionable business insights',              active: true  },
  { id: 8,  name: 'Product Manager',     description: 'Owns product vision, roadmap and cross-functional coordination',     active: false },
  { id: 9,  name: 'Backend Developer',   description: 'Builds server-side APIs and business logic',                        active: true  },
  { id: 10, name: 'Frontend Developer',  description: 'Implements responsive UI components and client-side features',       active: true  },
  { id: 11, name: 'Marketing Analyst',   description: 'Executes marketing campaigns and measures performance',              active: true  },
  { id: 12, name: 'Finance Officer',     description: 'Handles budgets, reporting and financial compliance',                active: false },
]

const FILTER_CONFIG = [
  { key: 'status', label: 'Status', type: 'multi', options: ['Active', 'Inactive'] },
]

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

// ─── Action Menu ──────────────────────────────────────────────────────────────
function ActionMenu({ onEdit, onDelete }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
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
          <button
            onClick={() => { onEdit(); setOpen(false) }}
            className="w-full flex items-center gap-2.5 px-3.5 py-2.5 text-xs font-medium text-gray-700 hover:bg-orange-50 hover:text-[#C35E33] transition-colors"
          >
            <Pencil size={13} /> Edit
          </button>
          <div className="mx-3 h-px bg-gray-100" />
          <button
            onClick={() => { onDelete(); setOpen(false) }}
            className="w-full flex items-center gap-2.5 px-3.5 py-2.5 text-xs font-medium text-red-600 hover:bg-red-50 transition-colors"
          >
            <Trash2 size={13} /> Delete
          </button>
        </div>
      )}
    </div>
  )
}

// ─── Add / Edit Modal ─────────────────────────────────────────────────────────
function DesignationModal({ mode, initial, onClose, onSave }) {
  const overlayRef = useRef(null)
  const [form, setForm] = useState({
    name:        initial?.name        ?? '',
    description: initial?.description ?? '',
    active:      initial?.active      ?? true,
  })
  const [errors, setErrors] = useState({})

  useEffect(() => {
    const h = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', h)
    return () => window.removeEventListener('keydown', h)
  }, [onClose])

  const validate = () => {
    const e = {}
    if (!form.name.trim()) e.name = 'Designation name is required'
    return e
  }

  const handleSubmit = () => {
    const e = validate()
    if (Object.keys(e).length) { setErrors(e); return }
    onSave(form)
    onClose()
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
        style={{ maxWidth: 560, margin: '0 16px' }}>

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 rounded-t-2xl"
          style={{ backgroundColor: '#111827' }}>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: PRIMARY }}>
              <ClipboardList size={16} color="#fff" />
            </div>
            <h2 className="text-white font-semibold text-sm">
              {isEdit ? 'Edit Designation' : 'Add Designation'}
            </h2>
          </div>
          <button onClick={onClose}
            className="w-8 h-8 rounded-lg bg-gray-700 flex items-center justify-center text-gray-300 hover:bg-gray-600 transition-colors">
            <X size={15} />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5 space-y-4">
          {/* Designation Name */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">
              Designation Name <span style={{ color: PRIMARY }}>*</span>
            </label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => { setForm(p => ({ ...p, name: e.target.value })); setErrors(p => ({ ...p, name: '' })) }}
              placeholder="e.g. Sr Developer"
              className="w-full h-10 px-3.5 text-sm text-gray-800 bg-gray-50 border rounded-xl outline-none transition-colors placeholder:text-gray-400"
              style={{ borderColor: errors.name ? '#EF4444' : '#E5E7EB' }}
              onFocus={(e) => { e.target.style.borderColor = PRIMARY }}
              onBlur={(e) => { e.target.style.borderColor = errors.name ? '#EF4444' : '#E5E7EB' }}
            />
            {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">
              Description (Roles &amp; Responsibility)
            </label>
            <textarea
              value={form.description}
              onChange={(e) => setForm(p => ({ ...p, description: e.target.value }))}
              placeholder="Text…."
              rows={4}
              className="w-full px-3.5 py-2.5 text-sm text-gray-800 bg-gray-50 border border-gray-200 rounded-xl outline-none resize-none transition-colors placeholder:text-gray-400"
              onFocus={(e) => { e.target.style.borderColor = PRIMARY }}
              onBlur={(e) => { e.target.style.borderColor = '#E5E7EB' }}
            />
          </div>

          {/* Status */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-2">Status</label>
            <div className="flex items-center gap-5">
              {[{ label: 'Active', val: true }, { label: 'Inactive', val: false }].map(({ label, val }) => (
                <label key={label} className="flex items-center gap-2 cursor-pointer select-none text-sm text-gray-600">
                  <span
                    onClick={() => setForm(p => ({ ...p, active: val }))}
                    className="w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all cursor-pointer"
                    style={{
                      borderColor: form.active === val ? PRIMARY : '#D1D5DB',
                      backgroundColor: form.active === val ? PRIMARY : 'transparent',
                    }}
                  >
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
          <button onClick={onClose}
            className="px-5 py-2 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors">
            Cancel
          </button>
          <button onClick={handleSubmit}
            className="px-5 py-2 rounded-xl text-sm font-semibold text-white transition-colors"
            style={{ backgroundColor: '#111827' }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#1F2937')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#111827')}
          >
            {isEdit ? 'Update Designation' : 'Save Designation'}
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Delete Confirm Modal ─────────────────────────────────────────────────────
function DeleteModal({ designation, onClose, onConfirm }) {
  const overlayRef = useRef(null)

  useEffect(() => {
    const h = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', h)
    return () => window.removeEventListener('keydown', h)
  }, [onClose])

  return (
    <div
      ref={overlayRef}
      onClick={(e) => { if (e.target === overlayRef.current) onClose() }}
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ backgroundColor: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(3px)' }}
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full flex flex-col items-center p-8 text-center"
        style={{ maxWidth: 400, margin: '0 16px' }}>
        <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4"
          style={{ backgroundColor: '#FEE2E2' }}>
          <Trash2 size={24} color="#B91C1C" />
        </div>
        <h2 className="text-lg font-bold text-gray-900 mb-1">Delete Designation</h2>
        <p className="text-sm text-gray-500 mb-6 leading-relaxed">
          Are you sure you want to delete <span className="font-semibold text-gray-800">"{designation.name}"</span>?
          This action performs a soft delete and can be re-activated later.
        </p>
        <div className="flex gap-3 w-full">
          <button onClick={onClose}
            className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors">
            Cancel
          </button>
          <button onClick={() => { onConfirm(designation.id); onClose() }}
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
        Showing <span className="font-semibold text-gray-800">{(current - 1) * pageSize + 1}–{Math.min(current * pageSize, total)}</span> of <span className="font-semibold text-gray-800">{total}</span> designations
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
        <button onClick={() => onChange(current + 1)} disabled={current === totalPages}
          className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:border-gray-400 disabled:opacity-30 disabled:cursor-not-allowed transition-colors">
          <ChevronRight size={14} />
        </button>
      </div>
    </div>
  )
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function DesignationManagement() {
  const [data,          setData]          = useState(INITIAL_DATA)
  const [search,        setSearch]        = useState('')
  const [showFilter,    setShowFilter]    = useState(false)
  const [activeFilters, setActiveFilters] = useState({})
  const [page,          setPage]          = useState(1)
  const [modalMode,     setModalMode]     = useState(null)   // 'add' | 'edit'
  const [editTarget,    setEditTarget]    = useState(null)
  const [deleteTarget,  setDeleteTarget]  = useState(null)

  const filtered = useMemo(() => {
    const q = search.toLowerCase()
    return data.filter((d) => {
      const searchMatch = !q || d.name.toLowerCase().includes(q) || (d.description || '').toLowerCase().includes(q)
      const statusMatch = !activeFilters.status?.length || activeFilters.status.some((s) => {
        if (s === 'Active')   return d.active === true
        if (s === 'Inactive') return d.active === false
        return true
      })
      return searchMatch && statusMatch
    })
  }, [data, search, activeFilters])

  useEffect(() => setPage(1), [search, activeFilters])

  const paginated = useMemo(
    () => filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE),
    [filtered, page]
  )

  const filterCount = Object.values(activeFilters).filter((v) => Array.isArray(v) ? v.length > 0 : !!v).length

  const handleAdd = (form) => {
    const newItem = { id: Date.now(), ...form }
    setData((p) => [newItem, ...p])
  }

  const handleEdit = (form) => {
    setData((p) => p.map((d) => d.id === editTarget.id ? { ...d, ...form } : d))
  }

  const handleDelete = (id) => {
    setData((p) => p.map((d) => d.id === id ? { ...d, active: false } : d))
  }

  const totalActive   = data.filter(d => d.active).length
  const totalInactive = data.filter(d => !d.active).length

  return (
    <>
      {/* ── Header ───────────────────────────────────────────── */}
      <div className="flex items-center justify-between mb-5 gap-3 flex-wrap">
        <div>
          <h1 className="text-xl font-bold text-gray-900 m-0">Designation Management</h1>
          <p className="text-xs text-gray-400 mt-0.5">Manage all designations and their responsibilities</p>
        </div>
        <button
          onClick={() => setModalMode('add')}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white transition-colors"
          style={{ backgroundColor: '#111827' }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#1F2937')}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#111827')}
        >
          <Plus size={15} strokeWidth={2.5} />
          Add Designation
        </button>
      </div>

      {/* ── Stats ────────────────────────────────────────────── */}
      <div className="grid grid-cols-3 gap-3 mb-5">
        {[
          { label: 'Total',    value: data.length,   color: '#111827', bg: '#F3F4F6' },
          { label: 'Active',   value: totalActive,   color: '#15803D', bg: '#DCFCE7' },
          { label: 'Inactive', value: totalInactive, color: '#B91C1C', bg: '#FEE2E2' },
        ].map(({ label, value, color, bg }) => (
          <div key={label} className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: bg }}>
              <Building2 size={18} color={color} />
            </div>
            <div>
              <p className="text-2xl font-bold leading-none" style={{ color }}>{value}</p>
              <p className="text-[11px] text-gray-500 mt-0.5 font-medium">{label} Designations</p>
            </div>
          </div>
        ))}
      </div>

      {/* ── Toolbar ──────────────────────────────────────────── */}
      <div className="flex items-center gap-2 mb-4 flex-wrap justify-end">
        <label className="flex items-center gap-2 bg-white rounded-lg px-3 h-9 border border-gray-200 cursor-text">
          <Search size={13} color="#9CA3AF" strokeWidth={2} className="flex-shrink-0" />
          <input
            type="text" value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder="Search Designation Name…"
            className="border-none outline-none text-[13px] text-gray-900 bg-transparent w-52"
          />
        </label>
        <button
          onClick={() => setShowFilter(true)}
          className="relative flex items-center gap-1.5 bg-white border rounded-lg px-3 h-9 text-[13px] font-medium cursor-pointer hover:bg-gray-50 transition-colors"
          style={{ borderColor: filterCount > 0 ? PRIMARY : '#E5E7EB', color: filterCount > 0 ? PRIMARY : '#374151' }}
        >
          <Filter size={13} strokeWidth={2} />
          <span>Filter</span>
          {filterCount > 0 && (
            <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full text-[9px] font-bold text-white flex items-center justify-center"
              style={{ backgroundColor: PRIMARY }}>{filterCount}</span>
          )}
        </button>
      </div>

      {/* ── Table ────────────────────────────────────────────── */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse" style={{ minWidth: 680 }}>
            <thead>
              <tr style={{ backgroundColor: PRIMARY }}>
                {['#', 'Designation Name', 'Roles & Responsibility', 'Status', 'Action'].map((h) => (
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
                    No designations match your search or filters.
                  </td>
                </tr>
              ) : paginated.map((row, idx) => (
                <tr key={row.id}
                  className="hover:bg-orange-50 transition-colors"
                  style={{ backgroundColor: idx % 2 === 0 ? '#fff' : '#FAFAFA' }}>

                  {/* # */}
                  <td className="px-5 py-4 text-xs font-semibold text-gray-400 border-b border-gray-50 w-12">
                    {(page - 1) * PAGE_SIZE + idx + 1}
                  </td>

                  {/* Designation Name */}
                  <td className="px-5 py-4 border-b border-gray-50 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-[11px] font-bold flex-shrink-0"
                        style={{ backgroundColor: PRIMARY }}>
                        {row.name.charAt(0).toUpperCase()}
                      </div>
                      <span className="text-[13px] font-semibold text-gray-900">{row.name}</span>
                    </div>
                  </td>

                  {/* Description */}
                  <td className="px-5 py-4 border-b border-gray-50 max-w-xs">
                    {row.description ? (
                      <div className="flex items-center gap-2">
                        <span className="text-[12px] text-gray-600 truncate max-w-[220px]">{row.description}</span>
                        <button
                          title={row.description}
                          className="w-6 h-6 flex items-center justify-center rounded-md border border-gray-200 text-gray-400 hover:text-gray-600 flex-shrink-0">
                          <ClipboardList size={12} />
                        </button>
                      </div>
                    ) : (
                      <span className="text-[12px] text-gray-300">—</span>
                    )}
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

      {/* ── Add / Edit Modal ─────────────────────────────────── */}
      {(modalMode === 'add' || modalMode === 'edit') && (
        <DesignationModal
          mode={modalMode}
          initial={modalMode === 'edit' ? editTarget : null}
          onClose={() => { setModalMode(null); setEditTarget(null) }}
          onSave={modalMode === 'add' ? handleAdd : handleEdit}
        />
      )}

      {/* ── Delete Confirm ───────────────────────────────────── */}
      {deleteTarget && (
        <DeleteModal
          designation={deleteTarget}
          onClose={() => setDeleteTarget(null)}
          onConfirm={handleDelete}
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