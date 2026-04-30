// src/pages/leave/employee/tabs/MyBalanceTab.jsx
import { Calendar, TrendingDown, TrendingUp, Info } from 'lucide-react'

const PRIMARY = '#C35E33'

const MY_BALANCE = [
  { code: 'CL',  label: 'Casual Leave',  total: 12, used: 6,  remaining: 6,  color: '#2563EB', bg: '#DBEAFE' },
  { code: 'SL',  label: 'Sick Leave',    total: 10, used: 4,  remaining: 6,  color: '#16A34A', bg: '#DCFCE7' },
  { code: 'EL',  label: 'Earned Leave',  total: 15, used: 5,  remaining: 10, color: '#7C3AED', bg: '#EDE9FE' },
  { code: 'AL',  label: 'Annual Leave',  total: 18, used: 8,  remaining: 10, color: PRIMARY,   bg: '#F5EBE5' },
  { code: 'CO',  label: 'Comp Off',      total: 2,  used: 0,  remaining: 2,  color: '#0891B2', bg: '#CFFAFE' },
]

// Trend history (fake last 3 months)
const HISTORY = [
  { month: 'Feb 2026', type: 'SL', label: 'Sick Leave',   days: 1, action: 'Used'    },
  { month: 'Mar 2026', type: 'CL', label: 'Casual Leave', days: 2, action: 'Used'    },
  { month: 'Apr 2026', type: 'AL', label: 'Annual Leave', days: 3, action: 'Used'    },
  { month: 'Apr 2026', type: 'EL', label: 'Earned Leave', days: 5, action: 'Accrued' },
]

function BalanceRing({ used, total, color }) {
  const pct = total > 0 ? Math.round((used / total) * 100) : 0
  const r = 28
  const circ = 2 * Math.PI * r
  const dash = circ * (1 - pct / 100)
  return (
    <svg width="72" height="72" className="flex-shrink-0">
      <circle cx="36" cy="36" r={r} fill="none" stroke="#F3F4F6" strokeWidth="6" />
      <circle cx="36" cy="36" r={r} fill="none" stroke={color} strokeWidth="6"
        strokeDasharray={circ} strokeDashoffset={dash}
        strokeLinecap="round"
        transform="rotate(-90 36 36)"
        style={{ transition: 'stroke-dashoffset 0.6s ease' }}
      />
      <text x="36" y="40" textAnchor="middle" fontSize="11" fontWeight="700" fill={color}>
        {100 - pct}%
      </text>
    </svg>
  )
}

export default function MyBalanceTab({ employee }) {
  const totalRemaining = MY_BALANCE.reduce((s, b) => s + b.remaining, 0)
  const totalUsed      = MY_BALANCE.reduce((s, b) => s + b.used, 0)

  return (
    <div className="space-y-5">
      {/* Summary banner */}
      <div className="rounded-2xl overflow-hidden shadow-sm"
        style={{ background: `linear-gradient(135deg, ${PRIMARY}, #8B3A1A)` }}>
        <div className="px-6 py-5 flex items-center justify-between flex-wrap gap-4">
          <div>
            <p className="text-orange-100 text-xs font-medium mb-1">Total Available Balance</p>
            <p className="text-4xl font-bold text-white leading-none">{totalRemaining}</p>
            <p className="text-orange-200 text-sm mt-1">days across all leave types</p>
          </div>
          <div className="flex items-center gap-6">
            <div className="text-center">
              <p className="text-orange-100 text-[11px] font-medium">Used This Year</p>
              <p className="text-2xl font-bold text-white">{totalUsed}</p>
            </div>
            <div className="w-px h-10 bg-white/20" />
            <div className="text-center">
              <p className="text-orange-100 text-[11px] font-medium">Leave Types</p>
              <p className="text-2xl font-bold text-white">{MY_BALANCE.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Balance cards */}
      <div>
        <h3 className="text-sm font-bold text-gray-900 mb-3">Leave Breakdown <span className="text-xs font-normal text-gray-400">- {new Date().getFullYear()}</span></h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {MY_BALANCE.map((b) => (
            <div key={b.code} className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 flex items-center gap-4">
              <BalanceRing used={b.used} total={b.total} color={b.color} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md"
                    style={{ backgroundColor: b.bg, color: b.color }}>{b.code}</span>
                  <span className="text-[12px] font-semibold text-gray-800 truncate">{b.label}</span>
                </div>

                {/* Progress bar */}
                <div className="h-1.5 rounded-full bg-gray-100 overflow-hidden mb-2">
                  <div className="h-full rounded-full transition-all"
                    style={{ width: `${(b.used / b.total) * 100}%`, backgroundColor: b.color }} />
                </div>

                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-gray-400">Used <span className="font-bold text-gray-600">{b.used}</span></span>
                  <span className="text-gray-400">Left <span className="font-bold" style={{ color: b.color }}>{b.remaining}</span></span>
                  <span className="text-gray-400">Total <span className="font-bold text-gray-600">{b.total}</span></span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent leave activity */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-2">
          <Calendar size={15} color={PRIMARY} />
          <h3 className="text-sm font-bold text-gray-900">Recent Activity</h3>
        </div>
        <div className="divide-y divide-gray-50">
          {HISTORY.map((h, i) => (
            <div key={i} className="px-5 py-3.5 flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: h.action === 'Used' ? '#FEE2E2' : '#DCFCE7' }}>
                {h.action === 'Used'
                  ? <TrendingDown size={15} color="#DC2626" />
                  : <TrendingUp   size={15} color="#16A34A" />
                }
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[12px] font-semibold text-gray-800">
                  {h.action} {h.days} day{h.days !== 1 ? 's' : ''} - {h.label}
                </p>
                <p className="text-[11px] text-gray-400">{h.month}</p>
              </div>
              <span className="text-[11px] font-bold"
                style={{ color: h.action === 'Used' ? '#DC2626' : '#16A34A' }}>
                {h.action === 'Used' ? '−' : '+'}{h.days}d
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Info note */}
      <div className="flex items-start gap-3 px-4 py-3.5 rounded-xl border"
        style={{ borderColor: '#BFDBFE', backgroundColor: '#EFF6FF' }}>
        <Info size={15} color="#2563EB" className="flex-shrink-0 mt-0.5" />
        <p className="text-[12px] text-blue-800 leading-relaxed">
          Leave balances are updated after approval. Accruals happen on the 1st of each month per your policy.
          Contact HR if you notice any discrepancy.
        </p>
      </div>
    </div>
  )
}