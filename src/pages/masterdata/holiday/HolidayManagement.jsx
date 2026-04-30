// src/pages/masterdata/holiday/HolidayManagement.jsx

import { useState, useMemo, useEffect } from 'react'
import {
  Search, Filter, Plus, X, Calendar, Edit2, Trash2,
  ChevronLeft, ChevronRight, Sun, Globe, Star, Palmtree
} from 'lucide-react'
import FilterModal from '@/components/shared/FilterModal'

const PRIMARY       = '#C35E33'
const PRIMARY_DARK  = '#A34A24'
const PRIMARY_LIGHT = '#FDE8DD'
const PAGE_SIZE     = 8

// ── Mock holiday data ─────────────────────────────────────────────────────────
const MOCK_HOLIDAYS = [
  { id: 1,  name: "New Year's Day",       date: '2026-01-01', type: 'National Holiday', description: 'Start of the new calendar year.',              flotter: true,  active: true  },
  { id: 2,  name: 'Makar Sankranti',      date: '2026-01-14', type: 'Regional Holiday', description: 'Festival of harvest and sun.',                  flotter: false, active: true  },
  { id: 3,  name: 'Republic Day',         date: '2026-01-26', type: 'National Holiday', description: 'Celebrates the constitution of India.',          flotter: false, active: true  },
  { id: 4,  name: 'Holi',                 date: '2026-03-03', type: 'Festival',         description: 'Festival of colours.',                          flotter: true,  active: true  },
  { id: 5,  name: 'Good Friday',          date: '2026-04-03', type: 'National Holiday', description: 'Christian observance before Easter.',            flotter: false, active: true  },
  { id: 6,  name: 'Eid ul-Fitr',          date: '2026-03-31', type: 'Festival',         description: 'End of Ramadan celebration.',                   flotter: true,  active: true  },
  { id: 7,  name: 'Ambedkar Jayanti',     date: '2026-04-14', type: 'National Holiday', description: 'Birth anniversary of Dr. B.R. Ambedkar.',       flotter: false, active: false },
  { id: 8,  name: 'Maharashtra Day',      date: '2026-05-01', type: 'Regional Holiday', description: 'Formation of Maharashtra state.',                flotter: false, active: true  },
  { id: 9,  name: 'Independence Day',     date: '2026-08-15', type: 'National Holiday', description: "India's Independence from British rule.",        flotter: false, active: true  },
  { id: 10, name: 'Ganesh Chaturthi',     date: '2026-08-25', type: 'Festival',         description: 'Birth of Lord Ganesha.',                        flotter: true,  active: true  },
  { id: 11, name: 'Gandhi Jayanti',       date: '2026-10-02', type: 'National Holiday', description: 'Birth anniversary of Mahatma Gandhi.',          flotter: false, active: true  },
  { id: 12, name: 'Diwali',               date: '2026-10-20', type: 'Festival',         description: 'Festival of lights.',                           flotter: false, active: true  },
  { id: 13, name: 'Christmas',            date: '2026-12-25', type: 'National Holiday', description: 'Birth of Jesus Christ.',                        flotter: false, active: true  },
]

const HOLIDAY_TYPES = ['National Holiday', 'Regional Holiday', 'Festival', 'Optional Holiday']

const FILTER_CONFIG = [
  { key: 'type',    label: 'Holiday Type', type: 'multi', options: HOLIDAY_TYPES },
  { key: 'flotter', label: 'Flotter',      type: 'multi', options: ['Yes', 'No'] },
  { key: 'active',  label: 'Status',       type: 'multi', options: ['Active', 'Inactive'] },
]

// ── Helpers ───────────────────────────────────────────────────────────────────
function fmtDate(iso) {
  if (!iso) return '—'
  return new Date(iso).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
}

function daysLeft(iso) {
  if (!iso) return null
  const diff = Math.ceil((new Date(iso) - new Date()) / 86400000)
  return diff
}

function TypeBadge({ type }) {
  const map = {
    'National Holiday': { bg: '#DBEAFE', color: '#1D4ED8' },
    'Regional Holiday': { bg: '#F5F3FF', color: '#6D28D9' },
    'Festival':         { bg: '#FEF9C3', color: '#854D0E' },
    'Optional Holiday': { bg: '#DCFCE7', color: '#15803D' },
  }
  const s = map[type] || { bg: '#F3F4F6', color: '#374151' }
  return (
    <span className="inline-flex px-2.5 py-1 rounded-lg text-[11px] font-semibold whitespace-nowrap"
      style={{ backgroundColor: s.bg, color: s.color }}>
      {type}
    </span>
  )
}

function StatusBadge({ active }) {
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold"
      style={{ backgroundColor: active ? '#DCFCE7' : '#FEE2E2', color: active ? '#15803D' : '#B91C1C' }}>
      <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: active ? '#16A34A' : '#DC2626' }} />
      {active ? 'Active' : 'Inactive'}
    </span>
  )
}

function HolidayIcon({ type }) {
  const props = { size: 15, strokeWidth: 1.8 }
  if (type === 'National Holiday') return <Globe  {...props} color="#1D4ED8" />
  if (type === 'Regional Holiday') return <Star   {...props} color="#6D28D9" />
  if (type === 'Festival')         return <Sun    {...props} color="#854D0E" />
  return <Calendar {...props} color="#15803D" />
}

function HolidayBg({ type }) {
  if (type === 'National Holiday') return '#DBEAFE'
  if (type === 'Regional Holiday') return '#F5F3FF'
  if (type === 'Festival')         return '#FEF9C3'
  return '#DCFCE7'
}

// ── Custom Checkbox ───────────────────────────────────────────────────────────
function Checkbox({ checked, onChange, label }) {
  return (
    <label className="flex items-center gap-2 cursor-pointer select-none">
      <div
        onClick={() => onChange(!checked)}
        className="w-5 h-5 rounded flex items-center justify-center border-2 transition-all flex-shrink-0"
        style={{ borderColor: checked ? PRIMARY : '#D1D5DB', backgroundColor: checked ? PRIMARY : '#fff' }}>
        {checked && (
          <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
            <path d="M2 6l3 3 5-5" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </div>
      {label && <span className="text-sm font-medium text-gray-700">{label}</span>}
    </label>
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

// ── Empty form ────────────────────────────────────────────────────────────────
const EMPTY = { name: '', date: '', type: 'National Holiday', description: '', flotter: false, active: false }

// ─────────────────────────────────────────────────────────────────────────────
// MAIN PAGE
// ─────────────────────────────────────────────────────────────────────────────
export default function HolidayManagement() {
  const [data,          setData]          = useState(MOCK_HOLIDAYS)
  const [form,          setForm]          = useState(EMPTY)
  const [editId,        setEditId]        = useState(null)
  const [formOpen,      setFormOpen]      = useState(false)
  const [search,        setSearch]        = useState('')
  const [showFilter,    setShowFilter]    = useState(false)
  const [activeFilters, setActiveFilters] = useState({})
  const [page,          setPage]          = useState(1)
  const [errors,        setErrors]        = useState({})

  const set = (k, v) => { setForm((p) => ({ ...p, [k]: v })); setErrors((p) => ({ ...p, [k]: '' })) }

  const openAdd = () => {
    setForm(EMPTY)
    setEditId(null)
    setErrors({})
    setFormOpen(true)
    setTimeout(() => document.getElementById('hm-name')?.focus(), 100)
  }

  const openEdit = (row) => {
    setForm({ name: row.name, date: row.date, type: row.type, description: row.description, flotter: row.flotter, active: row.active })
    setEditId(row.id)
    setErrors({})
    setFormOpen(true)
    setTimeout(() => document.getElementById('hm-name')?.focus(), 100)
  }

  const validate = () => {
    const e = {}
    if (!form.name.trim()) e.name = 'Holiday name is required'
    if (!form.date)         e.date = 'Date is required'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSave = () => {
    if (!validate()) return
    if (editId) {
      setData((prev) => prev.map((d) => d.id === editId ? { ...d, ...form } : d))
    } else {
      setData((prev) => [...prev, { ...form, id: Date.now() }])
    }
    setForm(EMPTY)
    setEditId(null)
    setFormOpen(false)
    setPage(1)
  }

  const handleDelete = (id) => setData((prev) => prev.filter((d) => d.id !== id))
  const toggleActive = (id) => setData((prev) => prev.map((d) => d.id === id ? { ...d, active: !d.active } : d))

  const filtered = useMemo(() => {
    const q = search.toLowerCase()
    return data.filter((d) => {
      const sm  = !q || d.name.toLowerCase().includes(q) || d.type.toLowerCase().includes(q)
      const tm  = !activeFilters.type?.length    || activeFilters.type.includes(d.type)
      const fm  = !activeFilters.flotter?.length || activeFilters.flotter.includes(d.flotter ? 'Yes' : 'No')
      const am  = !activeFilters.active?.length  || activeFilters.active.includes(d.active ? 'Active' : 'Inactive')
      return sm && tm && fm && am
    })
  }, [data, search, activeFilters])

  const paginated = useMemo(() => filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE), [filtered, page])
  const filterCount = Object.values(activeFilters).filter((v) => Array.isArray(v) ? v.length > 0 : !!v).length

  // Stats
  const upcoming = data.filter((d) => daysLeft(d.date) > 0 && daysLeft(d.date) <= 90 && d.active).length

  const inputCls = (err) =>
    `w-full h-10 px-3.5 text-sm text-gray-800 bg-white border-2 rounded-xl outline-none transition-colors placeholder:text-gray-400 ` +
    (err ? 'border-red-400 focus:border-red-500' : 'focus:border-orange-400')

  return (
    <>
      {/* ── Header ───────────────────────────────────────────── */}
      <div className="flex items-center justify-between mb-5 gap-3 flex-wrap">
        <div>
          <h1 className="text-xl font-bold text-gray-900 m-0">Holiday Management</h1>
          <p className="text-xs text-gray-400 mt-0.5">Manage company holidays and observances</p>
        </div>
        <button
          onClick={openAdd}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white transition-colors"
          style={{ backgroundColor: PRIMARY }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = PRIMARY_DARK}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = PRIMARY}
        >
          <Plus size={15} strokeWidth={2.5} />
          Add Holiday
        </button>
      </div>

      {/* ── Stats ────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
        {[
          { label: 'Total Holidays', value: data.length,                                  color: '#111827', bg: '#F3F4F6' },
          { label: 'Active',         value: data.filter((d) => d.active).length,           color: '#15803D', bg: '#DCFCE7' },
          { label: 'Upcoming (90d)', value: upcoming,                                      color: PRIMARY,   bg: PRIMARY_LIGHT },
          { label: 'Flotter',        value: data.filter((d) => d.flotter && d.active).length, color: '#6D28D9', bg: '#F5F3FF' },
        ].map(({ label, value, color, bg }) => (
          <div key={label} className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: bg }}>
              <Calendar size={18} color={color} strokeWidth={1.8} />
            </div>
            <div>
              <p className="text-xl font-bold" style={{ color }}>{value}</p>
              <p className="text-[10px] text-gray-500 font-medium">{label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ── Inline Form (Figma style) ─────────────────────────── */}
      {formOpen && (
        <div className="bg-white rounded-2xl border-2 shadow-sm mb-5 overflow-hidden" style={{ borderColor: PRIMARY + '50' }}>
          {/* Form header */}
          <div className="flex items-center justify-between px-5 py-3.5 border-b border-gray-100">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: PRIMARY_LIGHT }}>
                <Calendar size={15} color={PRIMARY} />
              </div>
              <h2 className="text-sm font-bold text-gray-900">
                {editId ? 'Edit Holiday' : 'Add Holiday .'}
              </h2>
            </div>
            <button onClick={() => { setFormOpen(false); setEditId(null); setForm(EMPTY) }}
              className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors">
              <X size={15} />
            </button>
          </div>

          <div className="px-5 py-5 space-y-4">
            {/* Row 1 — Name | Date | Type */}
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="text-[11px] font-semibold text-gray-700 mb-1.5 block">Holiday Name</label>
                <input
                  id="hm-name"
                  type="text"
                  placeholder="Name"
                  value={form.name}
                  onChange={(e) => set('name', e.target.value)}
                  className={inputCls(errors.name)}
                  style={errors.name ? {} : { borderColor: PRIMARY + '40' }}
                />
                {errors.name && <p className="text-[10px] text-red-500 mt-1">{errors.name}</p>}
              </div>
              <div>
                <label className="text-[11px] font-semibold text-gray-700 mb-1.5 block">Holiday Date</label>
                <div className="relative">
                  <input
                    type="date"
                    value={form.date}
                    onChange={(e) => set('date', e.target.value)}
                    className={inputCls(errors.date) + ' pr-10'}
                    style={errors.date ? {} : { borderColor: PRIMARY + '40' }}
                  />
                  <Calendar size={15} color={PRIMARY} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
                {errors.date && <p className="text-[10px] text-red-500 mt-1">{errors.date}</p>}
              </div>
              <div>
                <label className="text-[11px] font-semibold text-gray-700 mb-1.5 block">Holiday Type</label>
                <div className="relative">
                  <select
                    value={form.type}
                    onChange={(e) => set('type', e.target.value)}
                    className="w-full h-10 px-3.5 pr-8 text-sm text-gray-800 border-2 rounded-xl outline-none appearance-none bg-white cursor-pointer focus:border-orange-400"
                    style={{ borderColor: PRIMARY + '40' }}>
                    {HOLIDAY_TYPES.map((t) => <option key={t}>{t}</option>)}
                  </select>
                  <ChevronLeft size={13} color="#9CA3AF" className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none -rotate-90" />
                </div>
              </div>
            </div>

            {/* Row 2 — Description */}
            <div>
              <label className="text-[11px] font-semibold text-gray-700 mb-1.5 block">Description</label>
              <textarea
                rows={3}
                placeholder="Address"
                value={form.description}
                onChange={(e) => set('description', e.target.value)}
                className="w-full px-3.5 py-3 text-sm text-gray-800 border-2 rounded-xl outline-none resize-none placeholder:text-gray-400 focus:border-orange-400 transition-colors"
                style={{ borderColor: PRIMARY + '40' }}
              />
            </div>

            {/* Row 3 — Flotter | Active checkboxes */}
            <div className="flex items-center gap-6">
              <Checkbox checked={form.flotter} onChange={(v) => set('flotter', v)} label="Flotter" />
              <Checkbox checked={form.active}  onChange={(v) => set('active', v)}  label="Active"  />
            </div>
          </div>

          {/* Form footer */}
          <div className="px-5 py-4 border-t border-gray-100 flex items-center justify-end gap-3">
            <button
              onClick={() => { setFormOpen(false); setEditId(null); setForm(EMPTY) }}
              className="px-5 py-2.5 rounded-xl border-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
              style={{ borderColor: PRIMARY }}>
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-colors"
              style={{ backgroundColor: '#111827' }}>
              {editId ? 'Update Holiday' : 'Save Documents'}
            </button>
          </div>
        </div>
      )}

      {/* ── Toolbar ──────────────────────────────────────────── */}
      <div className="flex items-center gap-3 mb-4 flex-wrap">
        <label className="flex items-center gap-2 bg-white rounded-xl px-4 h-10 border border-gray-200 flex-1 min-w-48 cursor-text"
          style={{ maxWidth: 380 }}>
          <Search size={14} color="#9CA3AF" />
          <input
            type="text" value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1) }}
            placeholder="Search holidays…"
            className="border-none outline-none text-sm text-gray-900 bg-transparent flex-1 placeholder:text-gray-400"
          />
          {search && <button onClick={() => setSearch('')}><X size={13} color="#9CA3AF" /></button>}
        </label>
        <button
          onClick={() => setShowFilter(true)}
          className="relative flex items-center gap-1.5 bg-white border rounded-xl px-4 h-10 text-sm font-medium cursor-pointer hover:bg-gray-50 transition-colors ml-auto"
          style={{ borderColor: filterCount > 0 ? PRIMARY : '#E5E7EB', color: filterCount > 0 ? PRIMARY : '#374151' }}>
          <Filter size={14} />
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
          <table className="w-full border-collapse" style={{ minWidth: 820 }}>
            <thead>
              <tr style={{ backgroundColor: PRIMARY }}>
                {['Holiday Name', 'Holiday Date', 'Holiday Type', 'Description', 'Flotter', 'Status', 'Days Left', 'Actions'].map((h) => (
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
                    No holidays found. Add one above!
                  </td>
                </tr>
              ) : paginated.map((row, idx) => {
                const dl = daysLeft(row.date)
                return (
                  <tr key={row.id}
                    className="hover:bg-orange-50/40 transition-colors"
                    style={{ backgroundColor: idx % 2 === 0 ? '#fff' : '#FAFAFA' }}>

                    <td className="px-5 py-4 border-b border-gray-50">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                          style={{ backgroundColor: HolidayBg(row.type) }}>
                          <HolidayIcon type={row.type} />
                        </div>
                        <span className="text-sm font-semibold text-gray-900 whitespace-nowrap">{row.name}</span>
                      </div>
                    </td>

                    <td className="px-5 py-4 border-b border-gray-50 whitespace-nowrap">
                      <span className="text-sm text-gray-700">{fmtDate(row.date)}</span>
                    </td>

                    <td className="px-5 py-4 border-b border-gray-50">
                      <TypeBadge type={row.type} />
                    </td>

                    <td className="px-5 py-4 border-b border-gray-50 max-w-xs">
                      <p className="text-xs text-gray-500 truncate" title={row.description}>
                        {row.description || '—'}
                      </p>
                    </td>

                    <td className="px-5 py-4 border-b border-gray-50 text-center">
                      {row.flotter ? (
                        <span className="inline-flex px-2 py-0.5 rounded text-[10px] font-bold bg-purple-100 text-purple-700">YES</span>
                      ) : (
                        <span className="text-xs text-gray-400">—</span>
                      )}
                    </td>

                    <td className="px-5 py-4 border-b border-gray-50">
                      <StatusBadge active={row.active} />
                    </td>

                    <td className="px-5 py-4 border-b border-gray-50 whitespace-nowrap">
                      {dl === null ? (
                        <span className="text-xs text-gray-400">—</span>
                      ) : dl < 0 ? (
                        <span className="text-xs text-gray-400">Past</span>
                      ) : dl === 0 ? (
                        <span className="text-xs font-bold text-green-600">Today 🎉</span>
                      ) : dl <= 30 ? (
                        <span className="text-xs font-semibold" style={{ color: PRIMARY }}>In {dl}d</span>
                      ) : (
                        <span className="text-xs text-gray-500">In {dl}d</span>
                      )}
                    </td>

                    <td className="px-5 py-4 border-b border-gray-50">
                      <div className="flex items-center gap-1.5">
                        <button onClick={() => openEdit(row)}
                          className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 text-gray-400 hover:border-orange-300 hover:bg-orange-50 hover:text-orange-500 transition-all">
                          <Edit2 size={13} />
                        </button>
                        <button
                          onClick={() => toggleActive(row.id)}
                          className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 text-gray-400 transition-all text-[10px] font-bold"
                          style={row.active ? { borderColor: '#BBF7D0', backgroundColor: '#F0FDF4', color: '#16A34A' } : {}}
                          title={row.active ? 'Deactivate' : 'Activate'}>
                          {row.active ? '✓' : '○'}
                        </button>
                        <button onClick={() => handleDelete(row.id)}
                          className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 text-gray-400 hover:border-red-300 hover:bg-red-50 hover:text-red-500 transition-all">
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
        <Pagination current={page} total={filtered.length} pageSize={PAGE_SIZE} onChange={setPage} />
      </div>

      {/* ── Filter Modal ─────────────────────────────────────── */}
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