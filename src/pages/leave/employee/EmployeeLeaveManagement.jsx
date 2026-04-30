// src/pages/leave/employee/EmployeeLeaveManagement.jsx
// ─── Employee / Intern / Trainee Leave Portal ─────────────────────────────────
// Tabs: My Leaves | Apply Leave | My Balance | Comp Off

import { useState } from 'react'
import {
  CalendarDays, PlusCircle, Wallet, RefreshCw, ChevronRight,
} from 'lucide-react'
import MyLeavesTab      from './tabs/MyLeavesTab'
import ApplyLeaveTab    from './tabs/ApplyLeaveTab'
import MyBalanceTab     from './tabs/MyBalanceTab'
import EmpCompOffTab    from './tabs/EmpCompOffTab'

const PRIMARY = '#C35E33'

const TABS = [
  { key: 'leaves',  label: 'My Leaves',    icon: CalendarDays,  desc: 'View & manage your leave history' },
  { key: 'apply',   label: 'Apply Leave',   icon: PlusCircle,    desc: 'Submit a new leave request' },
  { key: 'balance', label: 'Leave Balance', icon: Wallet,        desc: 'Check available leave days' },
  { key: 'compoff', label: 'Comp Off',      icon: RefreshCw,     desc: 'Request compensatory off' },
]

// Fake logged-in employee — swap with authStore in production
export const CURRENT_EMPLOYEE = {
  id:          7,
  personalId:  101,
  name:        'Leo Workman',
  employeeCode:'JK-07',
  designation: 'QA Engineer',
  department:  'Engineering',
  avatar:      'LW',
}

export default function EmployeeLeaveManagement() {
  const [activeTab, setActiveTab] = useState('leaves')

  const renderTab = () => {
    switch (activeTab) {
      case 'leaves':  return <MyLeavesTab   employee={CURRENT_EMPLOYEE} />
      case 'apply':   return <ApplyLeaveTab employee={CURRENT_EMPLOYEE} onSuccess={() => setActiveTab('leaves')} />
      case 'balance': return <MyBalanceTab  employee={CURRENT_EMPLOYEE} />
      case 'compoff': return <EmpCompOffTab employee={CURRENT_EMPLOYEE} />
      default:        return <MyLeavesTab   employee={CURRENT_EMPLOYEE} />
    }
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F9FAFB' }}>
      {/* ── Page Header ─────────────────────────────────────────── */}
      <div className="mb-6">
        <div className="flex items-center gap-2 text-xs text-gray-400 mb-1">
          <span>My Portal</span>
          <ChevronRight size={12} />
          <span style={{ color: PRIMARY }} className="font-medium">Leave Management</span>
        </div>

        {/* Employee identity strip */}
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            <div
              className="w-12 h-12 rounded-2xl flex items-center justify-center text-base font-bold text-white shadow-md"
              style={{ background: `linear-gradient(135deg, ${PRIMARY}, #A34A24)` }}>
              {CURRENT_EMPLOYEE.avatar}
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900 leading-none">{CURRENT_EMPLOYEE.name}</h1>
              <p className="text-xs text-gray-500 mt-0.5">
                {CURRENT_EMPLOYEE.employeeCode} · {CURRENT_EMPLOYEE.designation} · {CURRENT_EMPLOYEE.department}
              </p>
            </div>
          </div>

          {/* Quick apply button */}
          <button
            onClick={() => setActiveTab('apply')}
            className="ml-auto flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white shadow-sm transition-all"
            style={{ backgroundColor: PRIMARY }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#A34A24')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = PRIMARY)}>
            <PlusCircle size={15} strokeWidth={2} />
            Apply Leave
          </button>
        </div>
      </div>

      {/* ── Tab Navigation ──────────────────────────────────────── */}
      <div className="flex items-center gap-1.5 mb-6 overflow-x-auto pb-1 flex-nowrap">
        {TABS.map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => setActiveTab(key)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all border flex-shrink-0"
            style={
              activeTab === key
                ? { backgroundColor: PRIMARY, color: '#fff', borderColor: PRIMARY, boxShadow: '0 2px 10px rgba(195,94,51,0.30)' }
                : { backgroundColor: '#fff', color: '#6B7280', borderColor: '#E5E7EB' }
            }>
            <Icon size={15} strokeWidth={1.8} />
            {label}
          </button>
        ))}
      </div>

      {/* ── Tab Content ─────────────────────────────────────────── */}
      <div>{renderTab()}</div>
    </div>
  )
}