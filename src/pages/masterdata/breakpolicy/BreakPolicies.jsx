// src/pages/masterdata/breakpolicy/BreakPolicies.jsx
import { useState, useMemo, useEffect, useRef } from 'react'
import {
  Search, Filter, Plus, X, Clock, ChevronDown,
  Coffee, Edit2, Trash2, ToggleLeft, ToggleRight, ChevronLeft, ChevronRight
} from 'lucide-react'
import FilterModal from '@/components/shared/FilterModal'

const PRIMARY      = '#C35E33'
const PRIMARY_DARK = '#A34A24'
const PRIMARY_LIGHT = '#FDE8DD'
const PAGE_SIZE    = 8












// ── Mock data ─────────────────────────────────────────────────────────────────
const MOCK_BREAKS = [
  { id: 1,  name: 'Lunch Break', category: 'Fixed',    startTime: '01:00 PM', endTime: '01:30 PM', duration: 30,  breakType: 'Paid',   status: 'Active'   },
  { id: 2,  name: 'Tea Break',   category: 'Flexible', startTime: '—',        endTime: '—',        duration: 15,  breakType: 'Paid',   status: 'Active'   },
  { id: 3,  name: 'Rest Break',  category: 'Flexible', startTime: '—',        endTime: '—',        duration: 20,  breakType: 'Paid',   status: 'Active'   },
  { id: 4,  name: 'Tea Break',   category: 'Fixed',    startTime: '04:00 PM', endTime: '04:15 PM', duration: 15,  breakType: 'Paid',   status: 'Active'   },
  { id: 5,  name: 'Tea Break',   category: 'Fixed',    startTime: '04:15 PM', endTime: '04:30 PM', duration: 15,  breakType: 'Paid',   status: 'Active'   },
  { id: 6,  name: 'Tea Break',   category: 'Fixed',    startTime: '04:00 PM', endTime: '04:15 PM', duration: 15,  breakType: 'Paid',   status: 'Active'   },
  { id: 7,  name: 'Power Nap',   category: 'Flexible', startTime: '—',        endTime: '—',        duration: 10,  breakType: 'Unpaid', status: 'Inactive' },
  { id: 8,  name: 'Bio Break',   category: 'Flexible', startTime: '—',        endTime: '—',        duration: 5,   breakType: 'Paid',   status: 'Active'   },
  { id: 9,  name: 'Snack Break', category: 'Fixed',    startTime: '11:00 AM', endTime: '11:15 AM', duration: 15,  breakType: 'Unpaid', status: 'Active'   },
]

const FILTER_CONFIG = [
  { key: 'category',  label: 'Category',   type: 'multi',  options: ['Fixed', 'Flexible'] },
  { key: 'breakType', label: 'Break Type', type: 'multi',  options: ['Paid', 'Unpaid']    },
  { key: 'status',    label: 'Status',     type: 'multi',  options: ['Active', 'Inactive'] },
]

// ── Helpers ───────────────────────────────────────────────────────────────────
function fmtDuration(min) {
  if (!min) return '—'
  if (min < 60) return `${min} Minutes`
  const h = Math.floor(min / 60)
  const m = min % 60
  return m ? `${h}h ${m}m` : `${h} Hour${h > 1 ? 's' : ''}`
}

function StatusBadge({ status }) {
  const active = status === 'Active'
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold"
      style={{ backgroundColor: active ? '#DCFCE7' : '#FEE2E2', color: active ? '#15803D' : '#B91C1C' }}>
      <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: active ? '#16A34A' : '#DC2626' }} />
      {status}
    </span>
  )
}

function CategoryBadge({ category }) {
  const fixed = category === 'Fixed'
  return (
    <span className="inline-flex px-2.5 py-1 rounded-lg text-[11px] font-semibold"
      style={{ backgroundColor: fixed ? '#DBEAFE' : '#F5F3FF', color: fixed ? '#1D4ED8' : '#6D28D9' }}>
      {category}
    </span>
  )
}

// ── Pagination ────────────────────────────────────────────────────────────────
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
        <button onClick={() => onChange(current + 1)} disabled={current === Math.ceil(total / pageSize)}
          className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:border-gray-400 disabled:opacity-30 disabled:cursor-not-allowed transition-colors">
          <ChevronRight size={14} />
        </button>
      </div>
    </div>
  )
}

// ── Add/Edit Break Modal ──────────────────────────────────────────────────────
const EMPTY_FORM = {
  name: '', category: 'Fixed', startTime: '', endTime: '',
  durationHH: '00', durationMM: '00', breakType: 'Paid',
}

function BreakFormModal({ initial, onClose, onSave }) {
  const overlayRef  = useRef(null)
  const [form, setForm] = useState(initial || EMPTY_FORM)
  const isFlexible  = form.category === 'Flexible'
  const isEdit      = !!initial?.id

  useEffect(() => {
    const fn = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', fn)
    return () => window.removeEventListener('keydown', fn)
  }, [onClose])

  const set = (k, v) => setForm((p) => ({ ...p, [k]: v }))

  const handleSave = () => {
    if (!form.name.trim()) return
    const durationMin = parseInt(form.durationHH || 0) * 60 + parseInt(form.durationMM || 0)
    onSave({
      ...form,
      id:        initial?.id || Date.now(),
      duration:  durationMin,
      startTime: isFlexible ? '—' : form.startTime || '—',
      endTime:   isFlexible ? '—' : form.endTime   || '—',
      status:    initial?.status || 'Active',
    })
    onClose()
  }

  const inputCls = "w-full h-10 px-3.5 text-sm text-gray-800 bg-white border-2 rounded-xl outline-none transition-colors placeholder:text-gray-400 focus:border-orange-400"
  const borderStyle = { borderColor: PRIMARY + '40' }

  const SelectField = ({ label, value, onChange, options }) => (
    <div className="relative">
      <select value={value} onChange={(e) => onChange(e.target.value)}
        className="w-full h-10 px-3.5 pr-8 text-sm text-gray-800 bg-white border-2 rounded-xl outline-none appearance-none cursor-pointer transition-colors focus:border-orange-400"
        style={borderStyle}>
        {options.map((o) => <option key={o}>{o}</option>)}
      </select>
      <ChevronDown size={13} color="#9CA3AF" className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
    </div>
  )

  return (
    <div
      ref={overlayRef}
      onClick={(e) => { if (e.target === overlayRef.current) onClose() }}
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ backgroundColor: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(3px)' }}
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full overflow-hidden flex flex-col"
        style={{ maxWidth: 680, margin: '0 16px' }}>

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ backgroundColor: PRIMARY_LIGHT }}>
              <Coffee size={17} color={PRIMARY} />
            </div>
            <div>
              <h2 className="text-base font-bold text-gray-900">{isEdit ? 'Edit Break .' : 'Add Break .'}</h2>
              <p className="text-[11px] text-gray-400">Fill in the break policy details below</p>
            </div>
          </div>
          <button onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors">
            <X size={16} />
          </button>
        </div>

        {/* Form body — matches Figma layout */}
        <div className="px-6 py-5">
          {/* Bordered form card — exactly like Figma */}
          <div className="rounded-2xl border-2 p-5 space-y-5" style={{ borderColor: PRIMARY + '50' }}>

            {/* Row 1: Name | Category | Start | End */}
            <div className="grid grid-cols-4 gap-4">
              <div>
                <label className="text-[11px] font-semibold text-gray-700 mb-1.5 block">Break Name</label>
                <input
                  type="text"
                  placeholder="Lunch Break"
                  value={form.name}
                  onChange={(e) => set('name', e.target.value)}
                  className={inputCls}
                  style={borderStyle}
                />
              </div>
              <div>
                <label className="text-[11px] font-semibold text-gray-700 mb-1.5 block">Break Category</label>
                <SelectField value={form.category} onChange={(v) => set('category', v)} options={['Fixed', 'Flexible']} />
              </div>
              <div>
                <label className="text-[11px] font-semibold text-gray-700 mb-1.5 block">Break Start Timing</label>
                <input
                  type="time"
                  value={isFlexible ? '' : form.startTime}
                  disabled={isFlexible}
                  onChange={(e) => set('startTime', e.target.value)}
                  className={inputCls + (isFlexible ? ' opacity-40 cursor-not-allowed' : '')}
                  style={borderStyle}
                />
              </div>
              <div>
                <label className="text-[11px] font-semibold text-gray-700 mb-1.5 block">Break End Timing</label>
                <input
                  type="time"
                  value={isFlexible ? '' : form.endTime}
                  disabled={isFlexible}
                  onChange={(e) => set('endTime', e.target.value)}
                  className={inputCls + (isFlexible ? ' opacity-40 cursor-not-allowed' : '')}
                  style={borderStyle}
                />
              </div>
            </div>

            {/* Row 2: Duration (HH:MM) | Break Type */}
            <div className="grid grid-cols-4 gap-4">
              <div>
                <label className="text-[11px] font-semibold text-gray-700 mb-1.5 block">Break Duration</label>
                <div className="flex items-center gap-1.5 h-10 px-3 border-2 rounded-xl"
                  style={{ borderColor: PRIMARY + '40' }}>
                  <input
                    type="number" min="0" max="23"
                    value={form.durationHH}
                    onChange={(e) => set('durationHH', e.target.value.padStart(2, '0'))}
                    className="w-8 text-sm font-semibold text-gray-800 border-none outline-none bg-transparent text-center"
                  />
                  <span className="text-gray-400 text-sm">:</span>
                  <input
                    type="number" min="0" max="59"
                    value={form.durationMM}
                    onChange={(e) => set('durationMM', e.target.value.padStart(2, '0'))}
                    className="w-8 text-sm font-semibold text-gray-800 border-none outline-none bg-transparent text-center"
                  />
                  <Clock size={14} color={PRIMARY} className="ml-auto flex-shrink-0" />
                </div>
              </div>
              <div>
                <label className="text-[11px] font-semibold text-gray-700 mb-1.5 block">Break Type</label>
                <SelectField value={form.breakType} onChange={(v) => set('breakType', v)} options={['Paid', 'Unpaid']} />
              </div>
              {/* Flexible hint */}
              {isFlexible && (
                <div className="col-span-2 flex items-end pb-1">
                  <p className="text-[11px] text-blue-600 bg-blue-50 px-3 py-2 rounded-lg">
                    ℹ️ Flexible breaks have no fixed start/end time — duration only applies.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-end gap-3">
          <button onClick={onClose}
            className="px-6 py-2.5 rounded-xl border-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
            style={{ borderColor: PRIMARY }}>
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={!form.name.trim()}
            className="px-6 py-2.5 rounded-xl text-sm font-semibold text-white transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            style={{ backgroundColor: '#111827' }}>
            Save Documents
          </button>
        </div>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN PAGE
// ─────────────────────────────────────────────────────────────────────────────
export default function BreakPolicies() {
  const [data,          setData]          = useState(MOCK_BREAKS)
  const [search,        setSearch]        = useState('')
  const [showFilter,    setShowFilter]    = useState(false)
  const [activeFilters, setActiveFilters] = useState({})
  const [page,          setPage]          = useState(1)
  const [showForm,      setShowForm]      = useState(false)
  const [editRecord,    setEditRecord]    = useState(null)

  const filtered = useMemo(() => {
    const q = search.toLowerCase()
    return data.filter((d) => {
      const sm = !q || d.name.toLowerCase().includes(q) || d.category.toLowerCase().includes(q)
      const cm = !activeFilters.category?.length  || activeFilters.category.includes(d.category)
      const bm = !activeFilters.breakType?.length || activeFilters.breakType.includes(d.breakType)
      const stm= !activeFilters.status?.length   || activeFilters.status.includes(d.status)
      return sm && cm && bm && stm
    })
  }, [data, search, activeFilters])

  const paginated = useMemo(
    () => filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE),
    [filtered, page]
  )

  const filterCount = Object.values(activeFilters).filter((v) => Array.isArray(v) ? v.length > 0 : !!v).length

  const handleSave = (record) => {
    setData((prev) =>
      prev.find((d) => d.id === record.id)
        ? prev.map((d) => d.id === record.id ? record : d)
        : [...prev, record]
    )
    setPage(1)
  }

  const handleDelete = (id) => setData((prev) => prev.filter((d) => d.id !== id))

  const toggleStatus = (id) =>
    setData((prev) => prev.map((d) =>
      d.id === id ? { ...d, status: d.status === 'Active' ? 'Inactive' : 'Active' } : d
    ))

  const openEdit = (record) => { setEditRecord(record); setShowForm(true) }
  const openAdd  = ()       => { setEditRecord(null);   setShowForm(true) }

  // Stats
  const totalActive   = data.filter((d) => d.status === 'Active').length
  const totalFixed    = data.filter((d) => d.category === 'Fixed').length
  const totalFlexible = data.filter((d) => d.category === 'Flexible').length

  return (
    <>
      {/* ── Header ───────────────────────────────────────────── */}
      <div className="flex items-center justify-between mb-5 gap-3 flex-wrap">
        <div>
          <h1 className="text-xl font-bold text-gray-900 m-0">Break Policies</h1>
          <p className="text-xs text-gray-400 mt-0.5">Manage employee break schedules and durations</p>
        </div>
        <button
          onClick={openAdd}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white transition-colors"
          style={{ backgroundColor: '#111827' }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#374151'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#111827'}
        >
          <Plus size={15} strokeWidth={2.5} />
          Add Break Policy
        </button>
      </div>

      {/* ── Stats row ────────────────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
        {[
          { label: 'Total Policies', value: data.length,    color: '#111827', bg: '#F3F4F6'  },
          { label: 'Active',         value: totalActive,    color: '#15803D', bg: '#DCFCE7'  },
          { label: 'Fixed',          value: totalFixed,     color: '#1D4ED8', bg: '#DBEAFE'  },
          { label: 'Flexible',       value: totalFlexible,  color: '#6D28D9', bg: '#F5F3FF'  },
        ].map(({ label, value, color, bg }) => (
          <div key={label} className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: bg }}>
              <Coffee size={18} color={color} strokeWidth={1.8} />
            </div>
            <div>
              <p className="text-xl font-bold" style={{ color }}>{value}</p>
              <p className="text-[10px] text-gray-500 font-medium">{label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ── Toolbar ──────────────────────────────────────────── */}
      <div className="flex items-center gap-3 mb-4 flex-wrap">
        <label className="flex items-center gap-2 bg-white rounded-xl px-4 h-10 border border-gray-200 flex-1 min-w-48 cursor-text"
          style={{ maxWidth: 420 }}>
          <Search size={14} color="#9CA3AF" />
          <input
            type="text"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1) }}
            placeholder="Search Documents"
            className="border-none outline-none text-sm text-gray-900 bg-transparent flex-1 placeholder:text-gray-400"
          />
          {search && (
            <button onClick={() => setSearch('')}>
              <X size={13} color="#9CA3AF" />
            </button>
          )}
        </label>
        <button
          onClick={() => setShowFilter(true)}
          className="relative flex items-center gap-1.5 bg-white border rounded-xl px-4 h-10 text-sm font-medium cursor-pointer hover:bg-gray-50 transition-colors ml-auto"
          style={{ borderColor: filterCount > 0 ? PRIMARY : '#E5E7EB', color: filterCount > 0 ? PRIMARY : '#374151' }}>
          <Filter size={14} strokeWidth={2} />
          Filter
          {filterCount > 0 && (
            <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full text-[9px] font-bold text-white flex items-center justify-center"
              style={{ backgroundColor: PRIMARY }}>{filterCount}</span>
          )}
        </button>
      </div>

      {/* ── Table ────────────────────────────────────────────── */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse" style={{ minWidth: 800 }}>
            <thead>
              <tr style={{ backgroundColor: PRIMARY }}>
                {['Break Name', 'Break Category', 'Break Start Time', 'Break End Time', 'Break Duration', 'Paid', 'Status', 'Actions'].map((h) => (
                  <th key={h} className="px-5 py-4 text-left text-xs font-semibold text-white whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paginated.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-5 py-14 text-center text-sm text-gray-400">
                    No break policies match your search.
                  </td>
                </tr>
              ) : paginated.map((row, idx) => (
                <tr key={row.id}
                  className="hover:bg-orange-50/50 transition-colors"
                  style={{ backgroundColor: idx % 2 === 0 ? '#fff' : '#FAFAFA' }}>
                  <td className="px-5 py-4 border-b border-gray-50">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                        style={{ backgroundColor: PRIMARY_LIGHT }}>
                        <Coffee size={14} color={PRIMARY} />
                      </div>
                      <span className="text-sm font-semibold text-gray-900">{row.name}</span>
                    </div>
                  </td>
                  <td className="px-5 py-4 border-b border-gray-50">
                    <CategoryBadge category={row.category} />
                  </td>
                  <td className="px-5 py-4 border-b border-gray-50 text-sm text-gray-600 whitespace-nowrap">
                    {row.startTime}
                  </td>
                  <td className="px-5 py-4 border-b border-gray-50 text-sm text-gray-600 whitespace-nowrap">
                    {row.endTime}
                  </td>
                  <td className="px-5 py-4 border-b border-gray-50">
                    <span className="text-sm font-semibold text-gray-800">{fmtDuration(row.duration)}</span>
                  </td>
                  <td className="px-5 py-4 border-b border-gray-50">
                    <span className={`text-sm font-medium ${row.breakType === 'Paid' ? 'text-green-600' : 'text-orange-500'}`}>
                      {row.breakType}
                    </span>
                  </td>
                  <td className="px-5 py-4 border-b border-gray-50">
                    <StatusBadge status={row.status} />
                  </td>
                  <td className="px-5 py-4 border-b border-gray-50">
                    <div className="flex items-center gap-1.5">
                      {/* Toggle status */}
                      <button
                        onClick={() => toggleStatus(row.id)}
                        title={row.status === 'Active' ? 'Deactivate' : 'Activate'}
                        className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 transition-all hover:bg-gray-50">
                        {row.status === 'Active'
                          ? <ToggleRight size={16} color="#16A34A" />
                          : <ToggleLeft  size={16} color="#9CA3AF" />}
                      </button>
                      {/* Edit */}
                      <button
                        onClick={() => openEdit(row)}
                        className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 transition-all hover:border-orange-300 hover:bg-orange-50 hover:text-orange-500 text-gray-400">
                        <Edit2 size={13} />
                      </button>
                      {/* Delete */}
                      <button
                        onClick={() => handleDelete(row.id)}
                        className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 transition-all hover:border-red-300 hover:bg-red-50 hover:text-red-500 text-gray-400">
                        <Trash2 size={13} />
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

      {/* ── Modals ───────────────────────────────────────────── */}
      {showForm && (
        <BreakFormModal
          initial={editRecord}
          onClose={() => { setShowForm(false); setEditRecord(null) }}
          onSave={handleSave}
        />
      )}
      <FilterModal
        isOpen={showFilter}
        onClose={() => setShowFilter(false)}
        onApply={(f) => { setActiveFilters(f); setPage(1) }}
        onReset={() => setActiveFilters({})}
        config={FILTER_CONFIG}
      />
    </>
  )
}