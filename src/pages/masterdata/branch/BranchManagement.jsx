// src/pages/masterdata/branch/BranchManagement.jsx
import { useState, useRef, useEffect, useCallback } from 'react'
import {
  Search, Filter, Plus, MoreVertical, Pencil, Trash2,
  X, ChevronDown, MapPin, Building, GripVertical, CheckCircle, XCircle,
} from 'lucide-react'
import FilterModal from '@/components/shared/FilterModal'

const PRIMARY      = '#C35E33'
const PRIMARY_DARK = '#A34A24'

// ─── Demo tree data ───────────────────────────────────────────────────────────
// Each node: { id, code, name, city, state, address, landmark, district, pincode, country, active, children[] }
let _id = 20
const uid = () => ++_id

const INITIAL_TREE = [
  {
    id: 1, code: '004', name: 'Corporate Office', city: 'Dahod',     state: 'Gujarat', address: '12 MG Road', landmark: 'Near Bus Stand', district: 'Dahod',     pincode: '389151', country: 'India', active: true,
    children: [
      {
        id: 2, code: '003', name: 'Head Office',   city: 'Ahmedabad', state: 'Gujarat', address: 'SG Highway', landmark: 'Iskcon Cross Road', district: 'Ahmedabad', pincode: '380059', country: 'India', active: false,
        children: [
          { id: 3, code: '001', name: 'Surat Branch',    city: 'Surat',    state: 'Gujarat', address: 'Ring Road',   landmark: 'Varachha', district: 'Surat',    pincode: '395006', country: 'India', active: true,  children: [] },
          { id: 4, code: '002', name: 'Navsari Office',  city: 'Navsari',  state: 'Gujarat', address: 'Station Rd', landmark: 'Clock Tower', district: 'Navsari', pincode: '396445', country: 'India', active: false, children: [] },
        ],
      },
      { id: 5, code: '005', name: 'Head Office',   city: 'Jamnagar',  state: 'Gujarat', address: 'Bedi Port Rd',  landmark: 'Lakhota Lake', district: 'Jamnagar',  pincode: '361001', country: 'India', active: true,  children: [] },
      { id: 6, code: '006', name: 'Head Office',   city: 'Bhavnagar', state: 'Gujarat', address: 'Ghogha Circle', landmark: 'Victoria Park', district: 'Bhavnagar', pincode: '364001', country: 'India', active: false, children: [] },
      { id: 7, code: '007', name: 'Head Office',   city: 'Dang',      state: 'Gujarat', address: 'Ahwa Road',     landmark: 'Tribal Museum', district: 'Dang',     pincode: '394710', country: 'India', active: true,  children: [] },
    ],
  },
]

const COUNTRIES = ['India', 'USA', 'UK', 'Canada', 'Australia', 'UAE']
const FILTER_CONFIG = [
  { key: 'status', label: 'Status', type: 'multi', options: ['Active', 'Inactive'] },
]

// ─── Helpers ─────────────────────────────────────────────────────────────────
const StatusBadge = ({ active }) => active ? (
  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap"
    style={{ backgroundColor: PRIMARY, color: '#fff' }}>
    <CheckCircle size={11} /> Active
  </span>
) : (
  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap"
    style={{ backgroundColor: '#111827', color: '#fff' }}>
    <XCircle size={11} /> Inactive
  </span>
)

// ─── Deep clone ──────────────────────────────────────────────────────────────
const deepClone = (obj) => JSON.parse(JSON.stringify(obj))

// ─── Find node by id (returns [node, parent, index]) ─────────────────────────
function findNode(nodes, id, parent = null) {
  for (let i = 0; i < nodes.length; i++) {
    if (nodes[i].id === id) return [nodes[i], parent, i]
    const found = findNode(nodes[i].children, id, nodes[i])
    if (found) return found
  }
  return null
}

// ─── Insert node at target ────────────────────────────────────────────────────
function insertAfter(nodes, targetId, nodeToInsert) {
  for (let i = 0; i < nodes.length; i++) {
    if (nodes[i].id === targetId) {
      nodes.splice(i + 1, 0, nodeToInsert)
      return true
    }
    if (insertAfter(nodes[i].children, targetId, nodeToInsert)) return true
  }
  return false
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
      <button onClick={() => setOpen((p) => !p)}
        className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 text-gray-400 hover:border-gray-400 hover:bg-gray-50 transition-all">
        <MoreVertical size={15} />
      </button>
      {open && (
        <div className="absolute right-0 top-9 z-40 w-36 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden">
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

// ─── Branch Modal (Add / Edit) ────────────────────────────────────────────────
function BranchModal({ mode, initial, onClose, onSave }) {
  const overlayRef = useRef(null)
  const isEdit = mode === 'edit'

  const blank = { name: '', code: '', address: '', landmark: '', city: '', district: '', state: '', pincode: '', country: 'India', active: true }
  const [form, setForm] = useState(initial ? {
    name: initial.name, code: initial.code, address: initial.address, landmark: initial.landmark,
    city: initial.city, district: initial.district, state: initial.state, pincode: initial.pincode,
    country: initial.country, active: initial.active,
  } : blank)
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const h = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', h)
    return () => window.removeEventListener('keydown', h)
  }, [onClose])

  const sf = (k, v) => { setForm((p) => ({ ...p, [k]: v })); setErrors((p) => ({ ...p, [k]: '' })) }

  const validate = () => {
    const e = {}
    if (!form.name.trim())  e.name  = 'Branch name is required'
    if (!form.code.trim())  e.code  = 'Branch code is required'
    if (!form.city.trim())  e.city  = 'City is required'
    return e
  }

  const handleSubmit = async () => {
    const e = validate()
    if (Object.keys(e).length) { setErrors(e); return }
    setLoading(true)
    try {
      await new Promise((r) => setTimeout(r, 300))
      onSave({ ...form })
      onClose()
    } finally { setLoading(false) }
  }

  const Field = ({ label, fkey, placeholder, required, half }) => (
    <div className={half ? '' : 'col-span-2 sm:col-span-1'}>
      <label className="block text-xs font-semibold text-gray-700 mb-1.5">
        {label} {required && <span style={{ color: PRIMARY }}>*</span>}
      </label>
      <input type="text" value={form[fkey]} onChange={(e) => sf(fkey, e.target.value)}
        placeholder={placeholder}
        className="w-full h-10 px-3.5 text-sm text-gray-800 bg-gray-50 border rounded-xl outline-none placeholder:text-gray-400 transition-colors"
        style={{ borderColor: errors[fkey] ? '#EF4444' : '#E5E7EB' }}
        onFocus={(e) => { e.target.style.borderColor = PRIMARY }}
        onBlur={(e)  => { e.target.style.borderColor = errors[fkey] ? '#EF4444' : '#E5E7EB' }}
      />
      {errors[fkey] && <p className="text-[11px] text-red-500 mt-0.5">⚠ {errors[fkey]}</p>}
    </div>
  )

  return (
    <div ref={overlayRef} onClick={(e) => { if (e.target === overlayRef.current) onClose() }}
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ backgroundColor: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(3px)' }}>
      <div className="bg-white rounded-2xl shadow-2xl w-full flex flex-col"
        style={{ maxWidth: 680, maxHeight: '92vh', margin: '0 16px' }}>

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 rounded-t-2xl flex-shrink-0"
          style={{ backgroundColor: '#111827' }}>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: PRIMARY }}>
              <Building size={16} color="#fff" />
            </div>
            <h2 className="text-white font-semibold text-sm">{isEdit ? 'Edit Branch' : 'Add Branch'}</h2>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-lg bg-gray-700 flex items-center justify-center text-gray-300 hover:bg-gray-600 transition-colors">
            <X size={15} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-5">
          <div className="border rounded-xl p-5" style={{ borderColor: PRIMARY }}>
            {/* Row 1: name + code */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              <Field label="Branch Name" fkey="name" placeholder="Enter Branch Name" required />
              <Field label="Branch Code" fkey="code" placeholder="2585695" required />
            </div>

            {/* Row 2: address + landmark */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">Address</label>
                <textarea value={form.address} onChange={(e) => sf('address', e.target.value)}
                  placeholder="Enter your address" rows={3}
                  className="w-full px-3.5 py-2.5 text-sm text-gray-800 bg-gray-50 border border-gray-200 rounded-xl outline-none resize-none placeholder:text-gray-400 transition-colors"
                  onFocus={(e) => { e.target.style.borderColor = PRIMARY }}
                  onBlur={(e)  => { e.target.style.borderColor = '#E5E7EB' }}
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">Landmark</label>
                <input type="text" value={form.landmark} onChange={(e) => sf('landmark', e.target.value)}
                  placeholder="Ahmedabad"
                  className="w-full h-10 px-3.5 text-sm text-gray-800 bg-gray-50 border border-gray-200 rounded-xl outline-none placeholder:text-gray-400 transition-colors"
                  onFocus={(e) => { e.target.style.borderColor = PRIMARY }}
                  onBlur={(e)  => { e.target.style.borderColor = '#E5E7EB' }}
                />
              </div>
            </div>

            {/* Row 3: city + district + state */}
            <div className="grid grid-cols-3 gap-4 mb-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">City <span style={{ color: PRIMARY }}>*</span></label>
                <input type="text" value={form.city} onChange={(e) => sf('city', e.target.value)}
                  placeholder="Ahmedabad"
                  className="w-full h-10 px-3.5 text-sm text-gray-800 bg-gray-50 border rounded-xl outline-none placeholder:text-gray-400 transition-colors"
                  style={{ borderColor: errors.city ? '#EF4444' : '#E5E7EB' }}
                  onFocus={(e) => { e.target.style.borderColor = PRIMARY }}
                  onBlur={(e)  => { e.target.style.borderColor = errors.city ? '#EF4444' : '#E5E7EB' }}
                />
                {errors.city && <p className="text-[11px] text-red-500 mt-0.5">⚠ {errors.city}</p>}
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">District</label>
                <input type="text" value={form.district} onChange={(e) => sf('district', e.target.value)}
                  placeholder="Demo"
                  className="w-full h-10 px-3.5 text-sm text-gray-800 bg-gray-50 border border-gray-200 rounded-xl outline-none placeholder:text-gray-400 transition-colors"
                  onFocus={(e) => { e.target.style.borderColor = PRIMARY }}
                  onBlur={(e)  => { e.target.style.borderColor = '#E5E7EB' }}
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">State</label>
                <input type="text" value={form.state} onChange={(e) => sf('state', e.target.value)}
                  placeholder="Gujarat"
                  className="w-full h-10 px-3.5 text-sm text-gray-800 bg-gray-50 border border-gray-200 rounded-xl outline-none placeholder:text-gray-400 transition-colors"
                  onFocus={(e) => { e.target.style.borderColor = PRIMARY }}
                  onBlur={(e)  => { e.target.style.borderColor = '#E5E7EB' }}
                />
              </div>
            </div>

            {/* Row 4: pincode + country + status */}
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">Pincode</label>
                <input type="text" value={form.pincode} onChange={(e) => sf('pincode', e.target.value)}
                  placeholder="380059"
                  className="w-full h-10 px-3.5 text-sm text-gray-800 bg-gray-50 border border-gray-200 rounded-xl outline-none placeholder:text-gray-400 transition-colors"
                  onFocus={(e) => { e.target.style.borderColor = PRIMARY }}
                  onBlur={(e)  => { e.target.style.borderColor = '#E5E7EB' }}
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">Country</label>
                <select value={form.country} onChange={(e) => sf('country', e.target.value)}
                  className="w-full h-10 px-3.5 text-sm text-gray-800 bg-gray-50 border border-gray-200 rounded-xl outline-none appearance-none cursor-pointer transition-colors"
                  onFocus={(e) => { e.target.style.borderColor = PRIMARY }}
                  onBlur={(e)  => { e.target.style.borderColor = '#E5E7EB' }}
                >
                  {COUNTRIES.map((c) => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-2">Status</label>
                <div className="flex items-center gap-5 mt-1">
                  {[{ label: 'Active', val: true }, { label: 'Inactive', val: false }].map(({ label, val }) => (
                    <label key={label} className="flex items-center gap-2 cursor-pointer select-none text-sm text-gray-600"
                      onClick={() => sf('active', val)}>
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
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-100 flex justify-end gap-3 flex-shrink-0">
          <button onClick={onClose} className="px-5 py-2 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors">Cancel</button>
          <button onClick={handleSubmit} disabled={loading}
            className="px-5 py-2 rounded-xl text-sm font-semibold text-white transition-colors flex items-center gap-2 disabled:opacity-60"
            style={{ backgroundColor: '#111827' }}
            onMouseEnter={(e) => !loading && (e.currentTarget.style.backgroundColor = '#1F2937')}
            onMouseLeave={(e) => !loading && (e.currentTarget.style.backgroundColor = '#111827')}
          >
            {loading && <svg className="animate-spin w-3.5 h-3.5" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/></svg>}
            {isEdit ? 'Update Branch' : 'Save Branch'}
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Delete Confirm ───────────────────────────────────────────────────────────
function DeleteModal({ branch, onClose, onConfirm }) {
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
        <h2 className="text-lg font-bold text-gray-900 mb-1">Delete Branch</h2>
        <p className="text-sm text-gray-500 mb-6 leading-relaxed">
          Are you sure you want to delete <span className="font-semibold text-gray-800">"{branch.name} ({branch.code})"</span>?
          Child branches will also be removed.
        </p>
        <div className="flex gap-3 w-full">
          <button onClick={onClose} className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors">Cancel</button>
          <button onClick={() => { onConfirm(branch.id); onClose() }} className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white bg-red-600 hover:bg-red-700 transition-colors">Delete</button>
        </div>
      </div>
    </div>
  )
}

// ─── Tree Node Row ────────────────────────────────────────────────────────────
function BranchNode({
  node, depth, expandedIds, toggleExpand,
  onAdd, onEdit, onDelete,
  dragging, dragOverId, setDragOverId,
  onDragStart, onDragEnd, onDrop,
}) {
  const hasChildren = node.children?.length > 0
  const isExpanded  = expandedIds.has(node.id)
  const isDragging  = dragging === node.id
  const isDragOver  = dragOverId === node.id

  const indent = depth * 48

  return (
    <div>
      {/* Drop indicator above */}
      {isDragOver && dragging !== node.id && (
        <div className="h-0.5 mx-4 rounded-full transition-all" style={{ backgroundColor: PRIMARY, marginLeft: indent + 16 }} />
      )}

      <div
        draggable
        onDragStart={() => onDragStart(node.id)}
        onDragEnd={onDragEnd}
        onDragOver={(e) => { e.preventDefault(); setDragOverId(node.id) }}
        onDrop={(e) => { e.preventDefault(); onDrop(node.id) }}
        className="flex items-center gap-3 px-4 py-3.5 border-b border-gray-100 group transition-colors"
        style={{
          paddingLeft: indent + 16,
          backgroundColor: isDragOver ? '#FFF7F4' : isDragging ? 'rgba(195,94,51,0.04)' : '#fff',
          opacity: isDragging ? 0.5 : 1,
          cursor: 'grab',
        }}
      >
        {/* Drag handle */}
        <span className="opacity-0 group-hover:opacity-50 transition-opacity cursor-grab flex-shrink-0">
          <GripVertical size={15} color="#9CA3AF" />
        </span>

        {/* Expand / collapse toggle */}
        <button
          onClick={() => hasChildren && toggleExpand(node.id)}
          className="w-5 h-5 flex items-center justify-center flex-shrink-0 transition-transform"
          style={{ opacity: hasChildren ? 1 : 0, transform: isExpanded ? 'rotate(0deg)' : 'rotate(-90deg)', transition: 'transform 200ms ease' }}
        >
          <ChevronDown size={14} color={PRIMARY} strokeWidth={2.5} />
        </button>

        {/* Icon */}
        <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ backgroundColor: '#FDE8DD' }}>
          <Building size={16} color={PRIMARY} />
        </div>

        {/* Name + location */}
        <div className="flex-1 min-w-0">
          <p className="text-[13px] font-semibold text-gray-900 leading-none">
            {node.name} <span className="font-normal text-gray-400">({node.code})</span>
          </p>
          <p className="text-[11px] text-gray-400 mt-0.5 flex items-center gap-1">
            <MapPin size={10} /> {node.city}, {node.state}
          </p>
        </div>

        {/* Status */}
        <StatusBadge active={node.active} />

        {/* Add child */}
        <button
          onClick={() => onAdd(node.id)}
          className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 text-gray-400 hover:border-[#C35E33] hover:text-[#C35E33] hover:bg-orange-50 transition-all ml-1"
          title="Add child branch"
        >
          <Plus size={14} strokeWidth={2.5} />
        </button>

        {/* Action menu */}
        <ActionMenu
          onEdit={() => onEdit(node)}
          onDelete={() => onDelete(node)}
        />
      </div>

      {/* Children */}
      {hasChildren && isExpanded && (
        <div style={{ borderLeft: `2px solid #F3E8E0`, marginLeft: indent + 40 }}>
          {node.children.map((child) => (
            <BranchNode
              key={child.id}
              node={child}
              depth={depth + 1}
              expandedIds={expandedIds}
              toggleExpand={toggleExpand}
              onAdd={onAdd}
              onEdit={onEdit}
              onDelete={onDelete}
              dragging={dragging}
              dragOverId={dragOverId}
              setDragOverId={setDragOverId}
              onDragStart={onDragStart}
              onDragEnd={onDragEnd}
              onDrop={onDrop}
            />
          ))}
        </div>
      )}
    </div>
  )
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function BranchManagement() {
  const [tree,          setTree]          = useState(INITIAL_TREE)
  const [search,        setSearch]        = useState('')
  const [showFilter,    setShowFilter]    = useState(false)
  const [activeFilters, setActiveFilters] = useState({})
  const [expandedIds,   setExpandedIds]   = useState(new Set([1, 2]))  // open by default
  const [modalMode,     setModalMode]     = useState(null)   // 'add' | 'edit'
  const [editTarget,    setEditTarget]    = useState(null)
  const [addParentId,   setAddParentId]   = useState(null)   // which node to add child under
  const [deleteTarget,  setDeleteTarget]  = useState(null)

  // Drag state
  const [dragging,   setDragging]   = useState(null)
  const [dragOverId, setDragOverId] = useState(null)

  const toggleExpand = (id) => setExpandedIds((prev) => {
    const next = new Set(prev)
    next.has(id) ? next.delete(id) : next.add(id)
    return next
  })

  // ── Drag handlers ─────────────────────────────────────────────────────────
  const handleDragStart = useCallback((id) => setDragging(id), [])
  const handleDragEnd   = useCallback(() => { setDragging(null); setDragOverId(null) }, [])

  const handleDrop = useCallback((targetId) => {
    if (!dragging || dragging === targetId) { setDragging(null); setDragOverId(null); return }

    setTree((prev) => {
      const cloned = deepClone(prev)

      // Remove dragged node
      const found = findNode(cloned, dragging)
      if (!found) return prev
      const [draggedNode, draggedParent, draggedIdx] = found

      const sourceList = draggedParent ? draggedParent.children : cloned
      sourceList.splice(draggedIdx, 1)

      // Insert after targetId
      insertAfter(cloned, targetId, draggedNode)

      return cloned
    })

    setDragging(null)
    setDragOverId(null)
  }, [dragging])

  // ── Add / Edit handlers ───────────────────────────────────────────────────
  const handleSave = (form) => {
    if (modalMode === 'add') {
      const newNode = { id: uid(), ...form, children: [] }
      setTree((prev) => {
        const cloned = deepClone(prev)
        if (addParentId === null) {
          cloned.push(newNode)
        } else {
          const found = findNode(cloned, addParentId)
          if (found) found[0].children.push(newNode)
        }
        return cloned
      })
    } else {
      setTree((prev) => {
        const cloned = deepClone(prev)
        const found  = findNode(cloned, editTarget.id)
        if (found) Object.assign(found[0], form)
        return cloned
      })
    }
  }

  const handleDelete = (id) => {
    const removeNode = (nodes) => nodes
      .filter((n) => n.id !== id)
      .map((n) => ({ ...n, children: removeNode(n.children) }))
    setTree((prev) => removeNode(deepClone(prev)))
  }

  // ── Count nodes
  const countAll = (nodes) => nodes.reduce((acc, n) => acc + 1 + countAll(n.children), 0)
  const countActive = (nodes) => nodes.reduce((acc, n) => acc + (n.active ? 1 : 0) + countActive(n.children), 0)
  const total  = countAll(tree)
  const active = countActive(tree)

  const filterCount = Object.values(activeFilters).filter((v) => Array.isArray(v) ? v.length > 0 : !!v).length

  // ── Search filter (flatten + highlight) — simple approach: filter root names ──
  const filteredTree = search || activeFilters.status?.length
    ? tree.filter((n) => {
        const q  = search.toLowerCase()
        const sm = !q || n.name.toLowerCase().includes(q) || n.city.toLowerCase().includes(q) || n.code.toLowerCase().includes(q)
        const st = !activeFilters.status?.length || activeFilters.status.some((s) => s === 'Active' ? n.active : !n.active)
        return sm && st
      })
    : tree

  return (
    <>
      {/* Header */}
      <div className="flex items-center justify-between mb-5 gap-3 flex-wrap">
        <div>
          <h1 className="text-xl font-bold text-gray-900 m-0">Work Location &amp; Branch</h1>
          <p className="text-xs text-gray-400 mt-0.5">Manage branch hierarchy — drag rows to reorder</p>
        </div>
        <button
          onClick={() => { setAddParentId(null); setModalMode('add') }}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white transition-colors"
          style={{ backgroundColor: '#111827' }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#1F2937')}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#111827')}
        >
          <Plus size={15} strokeWidth={2.5} /> Add Branch
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 mb-5">
        {[
          { label: 'Total Branches', value: total,         color: '#111827', bg: '#F3F4F6' },
          { label: 'Active',         value: active,        color: '#15803D', bg: '#DCFCE7' },
          { label: 'Inactive',       value: total - active,color: '#B91C1C', bg: '#FEE2E2' },
        ].map(({ label, value, color, bg }) => (
          <div key={label} className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: bg }}>
              <Building size={18} color={color} />
            </div>
            <div>
              <p className="text-2xl font-bold leading-none" style={{ color }}>{value}</p>
              <p className="text-[11px] text-gray-500 mt-0.5 font-medium">{label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Toolbar */}
      <div className="flex items-center gap-2 mb-4 flex-wrap">
        <label className="flex items-center gap-2 bg-white rounded-xl px-3 h-10 border border-gray-200 cursor-text flex-1" style={{ maxWidth: 420 }}>
          <Search size={13} color="#9CA3AF" strokeWidth={2} className="flex-shrink-0" />
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder="Search Branch Name"
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

      {/* Drag hint */}
      <div className="flex items-center gap-2 mb-3 px-1">
        <GripVertical size={13} color="#9CA3AF" />
        <p className="text-[11px] text-gray-400">Drag any row to reorder branches within the hierarchy</p>
      </div>

      {/* Tree */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden"
        onDragOver={(e) => e.preventDefault()}
        onDragLeave={() => setDragOverId(null)}
      >
        {filteredTree.length === 0 ? (
          <div className="py-16 text-center text-sm text-gray-400">No branches match your search.</div>
        ) : filteredTree.map((node) => (
          <BranchNode
            key={node.id}
            node={node}
            depth={0}
            expandedIds={expandedIds}
            toggleExpand={toggleExpand}
            onAdd={(parentId) => { setAddParentId(parentId); setModalMode('add') }}
            onEdit={(node) => { setEditTarget(node); setModalMode('edit') }}
            onDelete={(node) => setDeleteTarget(node)}
            dragging={dragging}
            dragOverId={dragOverId}
            setDragOverId={setDragOverId}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            onDrop={handleDrop}
          />
        ))}
      </div>

      {/* Modals */}
      {(modalMode === 'add' || modalMode === 'edit') && (
        <BranchModal
          mode={modalMode}
          initial={modalMode === 'edit' ? editTarget : null}
          onClose={() => { setModalMode(null); setEditTarget(null); setAddParentId(null) }}
          onSave={handleSave}
        />
      )}
      {deleteTarget && (
        <DeleteModal branch={deleteTarget} onClose={() => setDeleteTarget(null)} onConfirm={handleDelete} />
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