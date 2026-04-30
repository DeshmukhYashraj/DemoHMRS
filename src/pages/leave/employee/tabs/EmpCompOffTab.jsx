// src/pages/leave/employee/tabs/EmpCompOffTab.jsx
import { useState, useMemo } from 'react'
import {
  ChevronDown, RefreshCw, Calendar, Eye, Clock,
  CheckCircle2, XCircle, AlertCircle,
} from 'lucide-react'
import { useToast } from '@/components/shared/toast/ToastProvider'

const PRIMARY      = '#C35E33'
const PRIMARY_DARK = '#A34A24'

const MY_COMPOFF_INIT = [
  { id: 1, workedDate: '2026-04-05', earnedDays: '1 Day', totalHours: 9, reason: 'Worked on weekend for project deadline.', status: 'APPROVED', appliedOn: '2026-04-06' },
  { id: 2, workedDate: '2026-03-22', earnedDays: '0.5 Day', totalHours: 5, reason: 'Emergency support on holiday.',          status: 'PENDING',  appliedOn: '2026-03-23' },
]

const STATUS_CONFIG = {
  PENDING:  { label: 'Pending',  bg: '#FEF9C3', color: '#854D0E', icon: Clock        },
  APPROVED: { label: 'Approved', bg: '#DCFCE7', color: '#15803D', icon: CheckCircle2 },
  REJECTED: { label: 'Rejected', bg: '#FEE2E2', color: '#DC2626', icon: XCircle      },
}

function StatusBadge({ status }) {
  const cfg  = STATUS_CONFIG[status] || { label: status, bg: '#F3F4F6', color: '#374151', icon: Clock }
  const Icon = cfg.icon
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-semibold whitespace-nowrap"
      style={{ backgroundColor: cfg.bg, color: cfg.color }}>
      <Icon size={10} strokeWidth={2.5} />{cfg.label}
    </span>
  )
}

export default function EmpCompOffTab({ employee }) {
  const { toast } = useToast()

  const [records, setRecords] = useState(MY_COMPOFF_INIT)
  const [showForm, setShowForm] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const [form, setForm] = useState({
    workedDate: '', earnedDays: '1 Day', totalHours: '8', reason: '',
  })
  const [errors, setErrors] = useState({})

  const set = (key) => (val) =>
    setForm((p) => ({ ...p, [key]: val }))

  const validate = () => {
    const e = {}
    if (!form.workedDate)          e.workedDate  = 'Worked date is required'
    if (!form.reason.trim())       e.reason      = 'Reason is required'
    if (form.reason.trim().length < 10) e.reason = 'Reason must be at least 10 characters'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = async () => {
    if (!validate()) {
      toast.error('Please fix the errors before submitting.', 'Validation Failed')
      return
    }
    setSubmitting(true)
    await new Promise((r) => setTimeout(r, 1000))
    const newRecord = {
      id: records.length + 1,
      workedDate:  form.workedDate,
      earnedDays:  form.earnedDays,
      totalHours:  Number(form.totalHours),
      reason:      form.reason,
      status:      'PENDING',
      appliedOn:   new Date().toISOString().split('T')[0],
    }
    setRecords((p) => [newRecord, ...p])
    setSubmitting(false)
    setShowForm(false)
    setForm({ workedDate: '', earnedDays: '1 Day', totalHours: '8', reason: '' })
    setErrors({})
    toast.success('Your comp off request has been submitted.', 'Comp Off Requested')
  }

  return (
    <div className="max-w-3xl mx-auto space-y-5">
      {/* Info banner */}
      <div className="flex items-start gap-3 px-4 py-3.5 rounded-xl border"
        style={{ borderColor: PRIMARY + '40', backgroundColor: PRIMARY + '08' }}>
        <RefreshCw size={15} color={PRIMARY} className="flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-[12px] font-semibold" style={{ color: PRIMARY }}>Compensatory Off Requests</p>
          <p className="text-[11px] text-gray-600 mt-0.5 leading-relaxed">
            Submit a comp off request when you work on a holiday or weekend. After approval, the days are credited to your leave balance.
          </p>
        </div>
      </div>

      {/* Existing requests */}
      {records.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
            <h3 className="text-sm font-bold text-gray-900">My Comp Off Requests</h3>
            <button
              onClick={() => setShowForm(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold text-white"
              style={{ backgroundColor: PRIMARY }}>
              + New Request
            </button>
          </div>
          <div className="divide-y divide-gray-50">
            {records.map((r) => (
              <div key={r.id} className="px-5 py-4 flex items-start gap-4">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: '#F5EBE5' }}>
                  <Calendar size={16} color={PRIMARY} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <span className="text-[13px] font-semibold text-gray-900">{r.workedDate}</span>
                    <span className="text-[11px] text-gray-400">·</span>
                    <span className="text-[12px] font-medium" style={{ color: PRIMARY }}>{r.earnedDays}</span>
                    <span className="text-[11px] text-gray-400">·</span>
                    <span className="text-[11px] text-gray-400">{r.totalHours}h worked</span>
                  </div>
                  <p className="text-[12px] text-gray-500 truncate">{r.reason}</p>
                  <p className="text-[10px] text-gray-400 mt-0.5">Applied: {r.appliedOn}</p>
                </div>
                <StatusBadge status={r.status} />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* New request form */}
      {(showForm || records.length === 0) && (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-100"
            style={{ background: `linear-gradient(135deg, ${PRIMARY}08, #fff 60%)` }}>
            <h3 className="text-sm font-bold text-gray-900">New Comp Off Request</h3>
            <p className="text-xs text-gray-500 mt-0.5">Record the date you worked on a holiday or weekend</p>
          </div>

          <div className="p-6 space-y-5">
            {/* Row 1 */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Worked Date */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  Worked Date <span style={{ color: PRIMARY }}>*</span>
                </label>
                <div className="relative">
                  <input
                    type="date"
                    value={form.workedDate}
                    max={new Date().toISOString().split('T')[0]}
                    onChange={(e) => { set('workedDate')(e.target.value); setErrors((er) => ({ ...er, workedDate: '' })) }}
                    className="w-full h-10 px-3 pr-9 text-sm border rounded-xl outline-none bg-gray-50"
                    style={{ borderColor: errors.workedDate ? '#DC2626' : '#E5E7EB' }}
                    onFocus={(e) => { if (!errors.workedDate) e.target.style.borderColor = PRIMARY }}
                    onBlur={(e)  => { if (!errors.workedDate) e.target.style.borderColor = '#E5E7EB' }}
                  />
                  <Calendar size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                </div>
                {errors.workedDate && (
                  <p className="flex items-center gap-1 text-[11px] mt-1" style={{ color: '#DC2626' }}>
                    <AlertCircle size={11} /> {errors.workedDate}
                  </p>
                )}
              </div>

              {/* Earned Days */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">Earned Days</label>
                <div className="relative">
                  <select
                    value={form.earnedDays}
                    onChange={(e) => set('earnedDays')(e.target.value)}
                    className="w-full h-10 px-3 pr-8 text-sm border border-gray-200 rounded-xl outline-none bg-gray-50 appearance-none"
                    onFocus={(e) => (e.target.style.borderColor = PRIMARY)}
                    onBlur={(e)  => (e.target.style.borderColor = '#E5E7EB')}>
                    <option value="1 Day">1 Day</option>
                    <option value="0.5 Day">0.5 Day</option>
                  </select>
                  <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                </div>
              </div>

              {/* Total Hours */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">Total Hours Worked</label>
                <input
                  type="number"
                  value={form.totalHours}
                  min="1"
                  max="24"
                  onChange={(e) => set('totalHours')(e.target.value)}
                  placeholder="8"
                  className="w-full h-10 px-3 text-sm border border-gray-200 rounded-xl outline-none bg-gray-50 placeholder:text-gray-300"
                  onFocus={(e) => (e.target.style.borderColor = PRIMARY)}
                  onBlur={(e)  => (e.target.style.borderColor = '#E5E7EB')}
                />
              </div>
            </div>

            {/* Reason */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                Reason <span style={{ color: PRIMARY }}>*</span>
              </label>
              <textarea
                value={form.reason}
                onChange={(e) => { set('reason')(e.target.value); setErrors((er) => ({ ...er, reason: '' })) }}
                placeholder="Describe why you worked on this day (project deadline, emergency support, etc.)..."
                rows={4}
                className="w-full px-3 py-2.5 text-sm border rounded-xl outline-none bg-gray-50 resize-none placeholder:text-gray-300"
                style={{ borderColor: errors.reason ? '#DC2626' : '#E5E7EB' }}
                onFocus={(e) => { if (!errors.reason) e.target.style.borderColor = PRIMARY }}
                onBlur={(e)  => { if (!errors.reason) e.target.style.borderColor = '#E5E7EB' }}
              />
              {errors.reason && (
                <p className="flex items-center gap-1 text-[11px] mt-1" style={{ color: '#DC2626' }}>
                  <AlertCircle size={11} /> {errors.reason}
                </p>
              )}
            </div>
          </div>

          <div className="px-6 py-4 border-t border-gray-100 flex justify-end gap-2" style={{ backgroundColor: '#FAFAFA' }}>
            {records.length > 0 && (
              <button
                onClick={() => { setShowForm(false); setErrors({}) }}
                className="px-4 py-2 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-100 transition-colors">
                Cancel
              </button>
            )}
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-semibold text-white transition-all disabled:opacity-60 disabled:cursor-not-allowed"
              style={{ backgroundColor: PRIMARY }}
              onMouseEnter={(e) => !submitting && (e.currentTarget.style.backgroundColor = PRIMARY_DARK)}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = PRIMARY)}>
              {submitting ? (
                <><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />Submitting…</>
              ) : 'Submit Request'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}