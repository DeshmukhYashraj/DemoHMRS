// src/pages/shift/ShiftViewCard.jsx
import { useNavigate, useParams } from 'react-router-dom'
import { Sun, Coffee, ArrowLeft, Edit2, Trash2, ToggleLeft } from 'lucide-react'

const PRIMARY = '#C35E33'

// ── Mock shift data ───────────────────────────────────────────────────────────
const SHIFT_DETAIL = {
  id: 1,
  name: 'Morning shift',
  type: 'Normal shift',
  status: 'Active',
  shiftId: '#SHIFT-0042',
  startTime: '09:00AM',
  endTime: '06:00PM',
  checkInWindow:  '08:30 — 09:30',
  checkOutWindow: '17:30 — 18:30',
  gracePeriod: '10 min',
  lateMarkAfter: '15 min',
  lateMarkLimit: '3 times',
  minWorkHours: '8 hrs',
  overtime: 'After 30 min',
  autoCheckout: 'Enabled',
  weekOffs: ['MON','TUE','WED','THU','FRI','SAT','SUN'],
  activeWeekDays: ['MON','TUE','WED','THU','FRI'],
  breaks: [
    { name: 'Lunch break', duration: '60 min', type: 'Paid'   },
    { name: 'Tea break',   duration: '15 min', type: 'Unpaid' },
  ],
  audit: {
    createdAt:    '12 Mar 2025, 10:42',
    createdBy:    'Admin - Mark',
    lastModified: '01 Apr 2025, 09:15',
  },
}

const ALL_DAYS = ['MON','TUE','WED','THU','FRI','SAT','SUN']

function InfoRow({ label, value, valueStyle }) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-gray-50 last:border-0">
      <span className="text-sm text-gray-500">{label}</span>
      <span className="text-sm font-semibold" style={valueStyle || { color: PRIMARY }}>{value}</span>
    </div>
  )
}

function Badge({ children, style }) {
  return (
    <span className="px-3 py-1 rounded-full text-xs font-semibold" style={style}>{children}</span>
  )
}

export default function ShiftViewCard() {
  const navigate = useNavigate()
  const { id }   = useParams()
  const shift    = SHIFT_DETAIL // In production: fetch by id

  const statusStyle = {
    Active:   { bg: '#DCFCE7', color: '#15803D' },
    Inactive: { bg: '#FEE2E2', color: '#B91C1C' },
    Hold:     { bg: '#111827', color: '#fff'     },
  }[shift.status] ?? { bg: '#F3F4F6', color: '#374151' }

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
          <h1 className="text-xl font-bold text-gray-900 m-0">Shift Detail / View Card</h1>
          <p className="text-xs text-gray-400 mt-0.5">Complete shift configuration at a glance</p>
        </div>
      </div>

      {/* ── Two-column layout ──────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

        {/* ── LEFT: Main shift card ─── */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          {/* Card header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#FDE8DD' }}>
                <Sun size={16} color={PRIMARY} />
              </div>
              <div>
                <p className="text-sm font-bold text-gray-900">{shift.name}</p>
                <p className="text-[11px] text-gray-400">{shift.shiftId}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-gray-500">{shift.type}</span>
              <Badge style={{ backgroundColor: statusStyle.bg, color: statusStyle.color }}>
                {shift.status}
              </Badge>
            </div>
          </div>

          {/* Start / End time highlight */}
          <div className="grid grid-cols-2 gap-3 p-5">
            <div className="rounded-xl p-4" style={{ backgroundColor: PRIMARY }}>
              <p className="text-[10px] font-semibold text-orange-200 uppercase tracking-wider mb-1">Start time</p>
              <p className="text-2xl font-bold text-white">{shift.startTime}</p>
            </div>
            <div className="rounded-xl p-4 border border-gray-200 bg-gray-50">
              <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1">End time</p>
              <p className="text-2xl font-bold text-gray-800">{shift.endTime}</p>
            </div>
          </div>

          {/* Detail rows */}
          <div className="px-5 pb-4">
            <InfoRow label="Check-in window"  value={shift.checkInWindow}  />
            <InfoRow label="Check-out window" value={shift.checkOutWindow} />
            <InfoRow label="Grace period"     value={shift.gracePeriod}    />
            <InfoRow label="Late mark after"  value={shift.lateMarkAfter}  />
            <InfoRow label="Late mark limit"  value={shift.lateMarkLimit}  />
            <InfoRow label="Min work hours"   value={shift.minWorkHours}   />
            <div className="flex items-center justify-between py-3 border-b border-gray-50">
              <span className="text-sm text-gray-500">Overtime</span>
              <Badge style={{ backgroundColor: '#111827', color: '#fff' }}>{shift.overtime}</Badge>
            </div>
            <div className="flex items-center justify-between py-3 border-b border-gray-50">
              <span className="text-sm text-gray-500">Auto checkout</span>
              <Badge style={{ backgroundColor: PRIMARY, color: '#fff' }}>{shift.autoCheckout}</Badge>
            </div>

            {/* Week offs */}
            <div className="py-3">
              <p className="text-sm font-semibold mb-3" style={{ color: PRIMARY }}>Week offs</p>
              <div className="flex items-center gap-1.5 flex-wrap">
                {ALL_DAYS.map(day => {
                  const isWorking = shift.activeWeekDays.includes(day)
                  return (
                    <div
                      key={day}
                      className="flex flex-col items-center px-2 py-2 rounded-lg min-w-[42px]"
                      style={{
                        border: isWorking ? `2px solid ${PRIMARY}` : '2px solid #E5E7EB',
                        backgroundColor: isWorking ? '#FDE8DD' : '#F9FAFB',
                      }}
                    >
                      <span className="text-[10px] font-bold" style={{ color: isWorking ? PRIMARY : '#9CA3AF' }}>{day}</span>
                      <span className="w-1.5 h-1.5 rounded-full mt-1" style={{ backgroundColor: isWorking ? PRIMARY : '#D1D5DB' }} />
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </div>

        {/* ── RIGHT: Break policies + Audit ─── */}
        <div className="space-y-4">

          {/* Break policies */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#FDE8DD' }}>
                <Coffee size={14} color={PRIMARY} />
              </div>
              <div>
                <p className="text-sm font-bold text-gray-900">Break policies</p>
                <p className="text-xs text-gray-400">{shift.breaks.length} break types assigned</p>
              </div>
            </div>
            <div className="space-y-2">
              {shift.breaks.map(b => (
                <div
                  key={b.name}
                  className="flex items-center justify-between px-4 py-3 rounded-xl"
                  style={{ backgroundColor: b.type === 'Paid' ? PRIMARY : '#111827' }}
                >
                  <span className="text-sm font-semibold text-white">{b.name}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-orange-200">{b.duration}</span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold"
                      style={{
                        backgroundColor: b.type === 'Paid' ? '#111827' : '#fff',
                        color: b.type === 'Paid' ? '#fff' : '#111827',
                      }}>
                      {b.type}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Audit info */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-gray-100">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#6B7280" strokeWidth="2">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                  <polyline points="14,2 14,8 20,8"/>
                  <line x1="16" y1="13" x2="8" y2="13"/>
                  <line x1="16" y1="17" x2="8" y2="17"/>
                  <polyline points="10,9 9,9 8,9"/>
                </svg>
              </div>
              <div>
                <p className="text-sm font-bold text-gray-900">Audit info</p>
                <p className="text-xs text-gray-400">Created &amp; last modified</p>
              </div>
            </div>
            <div className="space-y-0">
              {[
                { label: 'Created at',    value: shift.audit.createdAt    },
                { label: 'Created by',    value: shift.audit.createdBy    },
                { label: 'Last modified', value: shift.audit.lastModified },
                { label: 'Shift ID',      value: shift.shiftId            },
              ].map(({ label, value }) => (
                <div key={label} className="flex items-center justify-between py-3 border-b border-gray-50 last:border-0">
                  <span className="text-sm text-gray-500">{label}</span>
                  <span className="text-sm font-semibold" style={{ color: PRIMARY }}>{value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Footer actions ──────────────────────────────────── */}
      <div className="flex items-center justify-end gap-3 mt-6 pb-6">
        <button
          onClick={() => {}}
          className="px-5 py-2.5 rounded-xl border border-gray-300 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
        >
          Deactivate
        </button>
        <button
          onClick={() => {}}
          className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-colors"
          style={{ backgroundColor: '#111827' }}
          onMouseEnter={e => e.currentTarget.style.backgroundColor = '#374151'}
          onMouseLeave={e => e.currentTarget.style.backgroundColor = '#111827'}
        >
          Delete shift
        </button>
        <button
          onClick={() => navigate(`/shift/${id || 1}/edit`)}
          className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-colors"
          style={{ backgroundColor: PRIMARY }}
          onMouseEnter={e => e.currentTarget.style.backgroundColor = '#A34A24'}
          onMouseLeave={e => e.currentTarget.style.backgroundColor = PRIMARY}
        >
          Edit Shift
        </button>
      </div>
    </>
  )
}