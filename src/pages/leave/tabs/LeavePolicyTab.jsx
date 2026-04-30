// src/pages/leave/tabs/LeavePolicyTab.jsx
import { useState } from 'react'
import { Plus, Edit2, Trash2, ChevronDown, Check } from 'lucide-react'

const PRIMARY      = '#C35E33'
const PRIMARY_DARK = '#A34A24'

// ─── Shared form input components ────────────────────────────────────────────
function FormInput({ label, placeholder, value, onChange, type = 'text', required }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-gray-700 mb-1.5">
        {label}{required && <span style={{ color: PRIMARY }}> *</span>}
      </label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full h-10 px-3 text-sm border border-gray-200 rounded-xl outline-none bg-gray-50 placeholder:text-gray-300 transition-colors"
        style={{ '--tw-ring-color': PRIMARY }}
        onFocus={(e) => (e.target.style.borderColor = PRIMARY)}
        onBlur={(e) => (e.target.style.borderColor = '#E5E7EB')}
      />
    </div>
  )
}

function FormSelect({ label, children, value, onChange, required }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-gray-700 mb-1.5">
        {label}{required && <span style={{ color: PRIMARY }}> *</span>}
      </label>
      <div className="relative">
        <select
          value={value}
          onChange={onChange}
          className="w-full h-10 px-3 pr-8 text-sm border border-gray-200 rounded-xl outline-none bg-gray-50 appearance-none cursor-pointer"
          onFocus={(e) => (e.target.style.borderColor = PRIMARY)}
          onBlur={(e) => (e.target.style.borderColor = '#E5E7EB')}>
          {children}
        </select>
        <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
      </div>
    </div>
  )
}

function FormTextarea({ label, placeholder, value, onChange }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-gray-700 mb-1.5">{label}</label>
      <textarea
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        rows={4}
        className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl outline-none bg-gray-50 resize-none placeholder:text-gray-300"
        onFocus={(e) => (e.target.style.borderColor = PRIMARY)}
        onBlur={(e) => (e.target.style.borderColor = '#E5E7EB')}
      />
    </div>
  )
}

function RadioGroup({ label, options, value, onChange }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-gray-700 mb-2">{label}</label>
      <div className="flex items-center gap-4">
        {options.map((opt) => (
          <label key={opt.value} className="flex items-center gap-1.5 cursor-pointer">
            <div
              onClick={() => onChange(opt.value)}
              className="w-4 h-4 rounded-full border-2 flex items-center justify-center cursor-pointer transition-all"
              style={{ borderColor: value === opt.value ? PRIMARY : '#D1D5DB', backgroundColor: value === opt.value ? PRIMARY : 'transparent' }}>
              {value === opt.value && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
            </div>
            <span className="text-sm text-gray-600">{opt.label}</span>
          </label>
        ))}
      </div>
    </div>
  )
}

function FormCard({ title, children, onSave }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
      <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
        <h3 className="text-sm font-bold text-gray-900">{title}</h3>
      </div>
      <div className="p-6 space-y-4">{children}</div>
      <div className="px-6 py-4 border-t border-gray-100 flex justify-end">
        <button
          onClick={onSave}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-colors"
          style={{ backgroundColor: '#111827' }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#1F2937')}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#111827')}>
          <Plus size={14} /> Add
        </button>
      </div>
    </div>
  )
}

// ─── Sub-tab: Leave Policy ────────────────────────────────────────────────────
function LeavePolicyForm() {
  const [form, setForm] = useState({
    policyName: '', employmentType: 'Intern', description: '',
    effectiveFrom: '', effectiveTo: '', status: 'Active',
    requiresApproval: true, allowHalfDay: true,
    allowBackdatedLeave: false, sandwichRuleEnabled: false,
  })

  const set = (key) => (e) => setForm(p => ({ ...p, [key]: e.target ? e.target.value : e }))

  return (
    <FormCard title="Leave Policy" onSave={() => console.log('Save policy', form)}>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FormInput label="Policy Name" placeholder="Name" value={form.policyName} onChange={set('policyName')} required />
        <FormSelect label="Employment Type" value={form.employmentType} onChange={set('employmentType')} required>
          <option value="Intern">Intern</option>
          <option value="Trainee">Trainee</option>
          <option value="FULL_TIME">Full Time</option>
          <option value="PART_TIME">Part Time</option>
          <option value="CONTRACT">Contract</option>
        </FormSelect>
      </div>
      <FormTextarea label="Description" placeholder="Type" value={form.description} onChange={set('description')} />
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1.5">Effective From <span style={{ color: PRIMARY }}>*</span></label>
          <div className="relative">
            <input type="date" value={form.effectiveFrom} onChange={set('effectiveFrom')}
              className="w-full h-10 px-3 pr-9 text-sm border border-gray-200 rounded-xl outline-none bg-gray-50 appearance-none"
              onFocus={(e) => (e.target.style.borderColor = PRIMARY)}
              onBlur={(e) => (e.target.style.borderColor = '#E5E7EB')} />
          </div>
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1.5">Effective To</label>
          <input type="date" value={form.effectiveTo} onChange={set('effectiveTo')}
            className="w-full h-10 px-3 text-sm border border-gray-200 rounded-xl outline-none bg-gray-50"
            onFocus={(e) => (e.target.style.borderColor = PRIMARY)}
            onBlur={(e) => (e.target.style.borderColor = '#E5E7EB')} />
        </div>
        <FormSelect label="Status" value={form.status} onChange={set('status')}>
          <option>Active</option>
          <option>Inactive</option>
        </FormSelect>
      </div>

      {/* Boolean toggles */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
        {[
          { key: 'requiresApproval',    label: 'Requires Approval' },
          { key: 'allowHalfDay',        label: 'Allow Half Day' },
          { key: 'allowBackdatedLeave', label: 'Allow Backdated' },
          { key: 'sandwichRuleEnabled', label: 'Sandwich Rule' },
        ].map(({ key, label }) => (
          <div key={key} className="flex items-center justify-between p-3 rounded-xl border border-gray-100 bg-gray-50">
            <span className="text-xs font-medium text-gray-600">{label}</span>
            <button
              onClick={() => setForm(p => ({ ...p, [key]: !p[key] }))}
              className="relative w-9 h-5 rounded-full transition-colors flex-shrink-0"
              style={{ backgroundColor: form[key] ? PRIMARY : '#D1D5DB' }}>
              <div className="absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all"
                style={{ left: form[key] ? '18px' : '2px' }} />
            </button>
          </div>
        ))}
      </div>
    </FormCard>
  )
}

// ─── Sub-tab: Leave Policy Type (mapping) ────────────────────────────────────
function LeavePolicyTypeForm() {
  const [form, setForm] = useState({
    policyId: 'General Leave Policy', leaveTypeId: 'Casual Leave (CL)',
    totalLeaves: '06', accrualType: 'Monthly', accrualValue: '',
  })
  const set = (key) => (e) => setForm(p => ({ ...p, [key]: e.target ? e.target.value : e }))

  return (
    <FormCard title="Leave Policy Type" onSave={() => console.log('Save mapping', form)}>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <FormSelect label="Leave Policy" value={form.policyId} onChange={set('policyId')} required>
          <option value="General Leave Policy">General Leave Policy</option>
          <option>Intern Policy</option>
          <option>Trainee Policy</option>
        </FormSelect>
        <FormSelect label="Leave Type" value={form.leaveTypeId} onChange={set('leaveTypeId')} required>
          <option value="Casual Leave (CL)">Casual Leave (CL)</option>
          <option>Sick Leave (SL)</option>
          <option>Earned Leave (EL)</option>
          <option>Annual Leave (AL)</option>
        </FormSelect>
        <FormInput label="Total Leaves" placeholder="06" value={form.totalLeaves} onChange={set('totalLeaves')} type="number" required />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <RadioGroup
          label="Accrual Type"
          options={[{ label: 'Monthly', value: 'Monthly' }, { label: 'Yearly', value: 'Yearly' }, { label: 'Quarterly', value: 'Quarterly' }]}
          value={form.accrualType}
          onChange={(v) => setForm(p => ({ ...p, accrualType: v }))}
        />
        <FormInput label="Accrual Value" placeholder="Type" value={form.accrualValue} onChange={set('accrualValue')} type="number" />
      </div>
    </FormCard>
  )
}

// ─── Sub-tab: Leave Eligibility Rule ─────────────────────────────────────────
function LeaveEligibilityRuleForm() {
  const [form, setForm] = useState({
    policyId: 'General Leave Policy', probationPeriodInMonths: '06', allowCompOff: 'Yes'
  })
  const set = (key) => (e) => setForm(p => ({ ...p, [key]: e.target ? e.target.value : e }))

  return (
    <FormCard title="Leave Eligibility Rule" onSave={() => console.log('Save eligibility', form)}>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <FormSelect label="Leave Policy" value={form.policyId} onChange={set('policyId')} required>
          <option value="General Leave Policy">General Leave Policy</option>
          <option>Intern Policy</option>
        </FormSelect>
        <FormInput label="Probation Period (Months)" placeholder="06" value={form.probationPeriodInMonths} onChange={set('probationPeriodInMonths')} type="number" />
        <RadioGroup
          label="Allow Comp Off (Yes/No)"
          options={[{ label: 'Yes', value: 'Yes' }, { label: 'No', value: 'No' }]}
          value={form.allowCompOff}
          onChange={(v) => setForm(p => ({ ...p, allowCompOff: v }))}
        />
      </div>
    </FormCard>
  )
}

// ─── Sub-tab: Leave Application Rule ─────────────────────────────────────────
function LeaveApplicationRuleForm() {
  const [form, setForm] = useState({
    policyId: '', allowHalfDay: true, minLeaveDuration: '0.5',
    maxConsecutiveDays: '', applyBeforeDays: '',
    allowBackdatedLeave: false, sandwichRuleEnabled: false,
    includeHolidays: false, includeWeekends: false,
  })

  return (
    <FormCard title="Leave Application Rule" onSave={() => console.log('Save app rule', form)}>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FormSelect label="Leave Policy" value={form.policyId} onChange={(e) => setForm(p => ({ ...p, policyId: e.target.value }))} required>
          <option value="">Select Policy</option>
          <option>General Leave Policy</option>
          <option>Intern Policy</option>
        </FormSelect>
        <FormInput label="Min Leave Duration (days)" placeholder="0.5" value={form.minLeaveDuration}
          onChange={(e) => setForm(p => ({ ...p, minLeaveDuration: e.target.value }))} type="number" />
        <FormInput label="Max Consecutive Days" placeholder="30" value={form.maxConsecutiveDays}
          onChange={(e) => setForm(p => ({ ...p, maxConsecutiveDays: e.target.value }))} type="number" />
        <FormInput label="Apply Before Days" placeholder="0" value={form.applyBeforeDays}
          onChange={(e) => setForm(p => ({ ...p, applyBeforeDays: e.target.value }))} type="number" />
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
        {[
          { key: 'allowHalfDay',        label: 'Allow Half Day' },
          { key: 'allowBackdatedLeave', label: 'Allow Backdated' },
          { key: 'sandwichRuleEnabled', label: 'Sandwich Rule' },
          { key: 'includeHolidays',     label: 'Include Holidays' },
          { key: 'includeWeekends',     label: 'Include Weekends' },
        ].map(({ key, label }) => (
          <div key={key} className="flex items-center justify-between p-3 rounded-xl border border-gray-100 bg-gray-50">
            <span className="text-xs font-medium text-gray-600">{label}</span>
            <button
              onClick={() => setForm(p => ({ ...p, [key]: !p[key] }))}
              className="relative w-9 h-5 rounded-full transition-colors flex-shrink-0"
              style={{ backgroundColor: form[key] ? PRIMARY : '#D1D5DB' }}>
              <div className="absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all"
                style={{ left: form[key] ? '18px' : '2px' }} />
            </button>
          </div>
        ))}
      </div>
    </FormCard>
  )
}

// ─── Main component ───────────────────────────────────────────────────────────
const SUB_TABS = [
  { key: 'policy',      label: 'Leave Policy' },
  { key: 'policytype',  label: 'Policy Type' },
  { key: 'eligibility', label: 'Eligibility Rule' },
  { key: 'application', label: 'Application Rule' },
]

export default function LeavePolicyTab() {
  const [sub, setSub] = useState('policy')

  return (
    <>
      {/* Sub tabs */}
      <div className="flex items-center gap-1 mb-5 border-b border-gray-200">
        {SUB_TABS.map(({ key, label }) => (
          <button key={key} onClick={() => setSub(key)}
            className="px-4 py-2.5 text-sm font-medium whitespace-nowrap transition-all border-b-2 -mb-px"
            style={{
              borderBottomColor: sub === key ? PRIMARY : 'transparent',
              color: sub === key ? PRIMARY : '#6B7280',
            }}>
            {label}
          </button>
        ))}
      </div>

      {sub === 'policy'      && <LeavePolicyForm />}
      {sub === 'policytype'  && <LeavePolicyTypeForm />}
      {sub === 'eligibility' && <LeaveEligibilityRuleForm />}
      {sub === 'application' && <LeaveApplicationRuleForm />}
    </>
  )
}