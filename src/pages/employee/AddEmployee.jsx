// src/pages/employee/AddEmployee.jsx
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const PRIMARY = '#C35E33'

const EMPLOYMENT_TYPE_ROUTES = {
  Internship: '/employee/add-intern',
  Training:   '/employee/add-trainee',
  Employee:   '/employee/add',
}

// ─── Reusable field components ────────────────────────────────────────────────
function FieldLabel({ children, required }) {
  return (
    <label className="block text-xs font-medium text-gray-500 mb-1">
      {children}
      {required && <span className="text-red-500 ml-0.5">*</span>}
    </label>
  )
}

function TextInput({ placeholder, type = 'text', value, onChange, className = '' }) {
  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className={`w-full h-9 px-3 text-sm text-gray-700 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:border-[#C35E33] focus:bg-white transition-colors placeholder:text-gray-400 ${className}`}
    />
  )
}

function SelectInput({ children, value, onChange }) {
  return (
    <select
      value={value}
      onChange={onChange}
      className="w-full h-9 px-3 text-sm text-gray-700 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:border-[#C35E33] focus:bg-white transition-colors appearance-none cursor-pointer"
    >
      {children}
    </select>
  )
}

function RadioOption({ name, value, checked, onChange, label }) {
  return (
    <label className="flex items-center gap-1.5 cursor-pointer">
      <input
        type="radio"
        name={name}
        value={value}
        checked={checked}
        onChange={onChange}
        className="hidden"
      />
      <span
        className="w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors"
        style={{
          borderColor: checked ? PRIMARY : '#D1D5DB',
          backgroundColor: checked ? PRIMARY : 'transparent',
        }}
      >
        {checked && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
      </span>
      <span className="text-xs text-gray-600 whitespace-nowrap">{label}</span>
    </label>
  )
}

function FileUpload({ label }) {
  return (
    <div className="relative">
      <div className="flex items-center h-9 px-3 bg-gray-50 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors">
        <span className="text-sm text-gray-400 flex-1">Choose File</span>
        <button
          type="button"
          className="w-7 h-7 rounded-md flex items-center justify-center flex-shrink-0"
          style={{ backgroundColor: PRIMARY }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
            <polyline points="17 8 12 3 7 8" />
            <line x1="12" y1="3" x2="12" y2="15" />
          </svg>
        </button>
      </div>
    </div>
  )
}

function SectionCard({ title, children, className = '' }) {
  return (
    <div
      className={`bg-white rounded-xl border-2 p-5 ${className}`}
      style={{ borderColor: '#E8C5A8' }}
    >
      <h2 className="text-sm font-semibold text-gray-800 mb-4">{title}</h2>
      {children}
    </div>
  )
}

// ─── Main Page ─────────────────────────────────────────────────────────────────
export default function AddEmployee() {

  const navigate = useNavigate()

  const [ setEmploymentType] = useState('Employee')

  // Personal Info
  const [personalInfo, setPersonalInfo] = useState({
    firstName: '', middleName: '', lastName: '', gender: '',
    dob: '', personalPhone: '', emergencyPhone: '', personalEmail: '',
    maritalStatus: '', spouseName: '',
  })

  // Office Info
  const [officeInfo, setOfficeInfo] = useState({
    employeeId: '', designation: 'Developer', department: 'Demo',
    officeEmail: '', password: '', joiningDate: '', experience: '01',
    prevCompany: '01', workLocation: '**', shiftTiming: '00:00:00',
    reportingManager: 'Max Johnson', role: 'Demo',
  })

  // Employment Details
  const [empDetails, setEmpDetails] = useState({
    salary: '', status: 'Active',
    workMode: 'Remote', workingMode: 'Part-Time', noticePeriod: '00',
  })

  // Address
  const [address, setAddress] = useState({
    currentAddress: 'Demo', city: 'Demo', district: 'Demo', landmark: 'Demo',
    state: '854256', pinCode: 'Demo', country: 'Demo',
    sameAsCurrent: true,
    permAddress: 'Demo', permCity: 'Demo', permDistrict: 'Demo', permLandmark: 'Demo',
    permState: '854256', permPinCode: 'Demo', permCountry: 'Demo',
  })

  // Bank & Legal
  const [bankInfo, setBankInfo] = useState({
    bankName: 'HPbank.pvt.ltd', accountNumber: '', ifscCode: 'Demo',
    panNumber: 'Demo', aadhaarNumber: '585885214585', esicNumber: '',
    pan2: 'Demo', pfNumber: '585885214585', uanNumber: '1245889585',
    esic2: '',
  })

  const updateField = (setter) => (field) => (e) =>
    setter((prev) => ({ ...prev, [field]: e.target.value }))

  const updatePersonal = updateField(setPersonalInfo)
  const updateOffice   = updateField(setOfficeInfo)
  const updateEmp      = updateField(setEmpDetails)
  const updateAddress  = updateField(setAddress)
  const updateBank     = updateField(setBankInfo)

  return (
    <div className="min-h-full pb-8">
      {/* ── Page Header ───────────────────────────────────────── */}
      <div className="flex items-start justify-between mb-5 flex-wrap gap-4">
        <h1 className="text-xl font-bold text-gray-900">Add Employee</h1>

        {/* Employment Type */}
<div className="flex flex-col items-end gap-1.5">
  <span className="text-xs font-semibold text-gray-700">Employment Type</span>
  <div className="flex items-center gap-4">
    {['Internship', 'Training', 'Employee'].map((type) => (
      <RadioOption
        key={type}
        name="employmentType"
        value={type}
        checked={type === 'Employee'}
        onChange={() => navigate(EMPLOYMENT_TYPE_ROUTES[type])}
        label={type}
      />
    ))}
  </div>
</div>
      </div>

      <div className="flex flex-col gap-5">

        {/* ── Personal Information ───────────────────────────── */}
        <SectionCard title="Personal Information">
          {/* Row 1 */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3">
            <div>
              <FieldLabel>First Name</FieldLabel>
              <TextInput placeholder="Enter your First Name" value={personalInfo.firstName} onChange={updatePersonal('firstName')} />
            </div>
            <div>
              <FieldLabel>Middle Name</FieldLabel>
              <TextInput placeholder="Enter your Middle Name" value={personalInfo.middleName} onChange={updatePersonal('middleName')} />
            </div>
            <div>
              <FieldLabel>Last Name</FieldLabel>
              <TextInput placeholder="Enter your Last Name" value={personalInfo.lastName} onChange={updatePersonal('lastName')} />
            </div>
            <div>
              <FieldLabel>Gender</FieldLabel>
              <SelectInput value={personalInfo.gender} onChange={updatePersonal('gender')}>
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </SelectInput>
            </div>
          </div>

          {/* Row 2 */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3">
            <div>
              <FieldLabel>Date of Birth</FieldLabel>
              <div className="relative">
                <TextInput type="date" placeholder="DD-MM-YYYY" value={personalInfo.dob} onChange={updatePersonal('dob')} />
              </div>
            </div>
            <div>
              <FieldLabel>Personal Phone Number</FieldLabel>
              <div className="flex h-9">
                <span className="flex items-center px-2 bg-gray-50 border border-r-0 border-gray-200 rounded-l-lg text-xs text-gray-500 whitespace-nowrap">+ 91</span>
                <input
                  type="tel"
                  placeholder="8547526584"
                  value={personalInfo.personalPhone}
                  onChange={updatePersonal('personalPhone')}
                  className="flex-1 min-w-0 px-2 text-sm text-gray-700 bg-gray-50 border border-gray-200 rounded-r-lg outline-none focus:border-[#C35E33] transition-colors"
                />
              </div>
            </div>
            <div>
              <FieldLabel>Emergency phone number</FieldLabel>
              <div className="flex h-9">
                <span className="flex items-center px-2 bg-gray-50 border border-r-0 border-gray-200 rounded-l-lg text-xs text-gray-500 whitespace-nowrap">+ 91</span>
                <input
                  type="tel"
                  placeholder="8547526584"
                  value={personalInfo.emergencyPhone}
                  onChange={updatePersonal('emergencyPhone')}
                  className="flex-1 min-w-0 px-2 text-sm text-gray-700 bg-gray-50 border border-gray-200 rounded-r-lg outline-none focus:border-[#C35E33] transition-colors"
                />
              </div>
            </div>
            <div>
              <FieldLabel>Personal Email</FieldLabel>
              <TextInput type="email" placeholder="Demo@gmail.com" value={personalInfo.personalEmail} onChange={updatePersonal('personalEmail')} />
            </div>
          </div>

          {/* Row 3 */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3">
            <div>
              <FieldLabel>Marital Status</FieldLabel>
              <SelectInput value={personalInfo.maritalStatus} onChange={updatePersonal('maritalStatus')}>
                <option value="">Status</option>
                <option value="Single">Single</option>
                <option value="Married">Married</option>
                <option value="Divorced">Divorced</option>
              </SelectInput>
            </div>
            <div>
              <FieldLabel>Spouse Name OR Parents Name</FieldLabel>
              <TextInput placeholder="Name" value={personalInfo.spouseName} onChange={updatePersonal('spouseName')} />
            </div>
          </div>

          {/* Row 4 - Upload */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div>
              <FieldLabel>Upload photo</FieldLabel>
              <FileUpload />
            </div>
          </div>
        </SectionCard>

        {/* ── Office Information ─────────────────────────────── */}
        <SectionCard title="Office Information">
          {/* Row 1 */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-3">
            <div>
              <FieldLabel>Employee ID</FieldLabel>
              <TextInput placeholder="ID" value={officeInfo.employeeId} onChange={updateOffice('employeeId')} />
            </div>
            <div>
              <FieldLabel>Designation</FieldLabel>
              <TextInput placeholder="Developer" value={officeInfo.designation} onChange={updateOffice('designation')} />
            </div>
            <div>
              <FieldLabel>Department</FieldLabel>
              <TextInput placeholder="Demo" value={officeInfo.department} onChange={updateOffice('department')} />
            </div>
          </div>

          {/* Row 2 */}
          <div className="grid grid-cols-2 md:grid-cols-6 gap-3 mb-3">
            <div className="md:col-span-1">
              <FieldLabel>Office Email</FieldLabel>
              <TextInput type="email" placeholder="Demo@gmail.com" value={officeInfo.officeEmail} onChange={updateOffice('officeEmail')} />
            </div>
            <div className="md:col-span-1">
              <FieldLabel>Employee Password (HRMS)</FieldLabel>
              <TextInput type="password" placeholder="••••••••••" value={officeInfo.password} onChange={updateOffice('password')} />
            </div>
            <div className="md:col-span-1">
              <FieldLabel>Date of Joining</FieldLabel>
              <TextInput type="date" placeholder="DD-MM-YYYY" value={officeInfo.joiningDate} onChange={updateOffice('joiningDate')} />
            </div>
            <div className="md:col-span-1">
              <FieldLabel>Years of Experience</FieldLabel>
              <TextInput placeholder="01" value={officeInfo.experience} onChange={updateOffice('experience')} />
            </div>
            <div className="md:col-span-1">
              <FieldLabel>Prev Company name</FieldLabel>
              <div className="flex gap-1">
                <TextInput placeholder="01" value={officeInfo.prevCompany} onChange={updateOffice('prevCompany')} />
                <button
                  type="button"
                  className="w-8 h-9 rounded-lg flex items-center justify-center flex-shrink-0 text-white font-bold text-lg"
                  style={{ backgroundColor: PRIMARY }}
                >
                  +
                </button>
              </div>
            </div>
          </div>

          {/* Row 3 */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div>
              <FieldLabel>Work Location / Branch</FieldLabel>
              <TextInput placeholder="**" value={officeInfo.workLocation} onChange={updateOffice('workLocation')} />
            </div>
            <div>
              <FieldLabel>Shift Timing</FieldLabel>
              <div className="relative">
                <TextInput type="time" placeholder="00:00:00" value={officeInfo.shiftTiming} onChange={updateOffice('shiftTiming')} />
              </div>
            </div>
            <div>
              <FieldLabel>Reporting Manager</FieldLabel>
              <TextInput placeholder="Max Johnson" value={officeInfo.reportingManager} onChange={updateOffice('reportingManager')} />
            </div>
            <div>
              <FieldLabel>Role</FieldLabel>
              <TextInput placeholder="Demo" value={officeInfo.role} onChange={updateOffice('role')} />
            </div>
          </div>
        </SectionCard>

        {/* ── Employment Details ────────────────────────────── */}
        <SectionCard title="Employment Details">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Left col */}
            <div className="space-y-4">
              <div>
                <FieldLabel>Salary / CTC</FieldLabel>
                <TextInput type="password" placeholder="••••••••" value={empDetails.salary} onChange={updateEmp('salary')} />
              </div>
              <div>
                <FieldLabel>Work Mode</FieldLabel>
                <div className="flex items-center gap-4 mt-1">
                  {['Remote', 'Hybrid', 'On site'].map((mode) => (
                    <RadioOption
                      key={mode}
                      name="workMode"
                      value={mode}
                      checked={empDetails.workMode === mode}
                      onChange={updateEmp('workMode')}
                      label={mode}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Right col */}
            <div className="space-y-4">
              <div>
                <FieldLabel>Employee Status</FieldLabel>
                <div className="flex items-center gap-4 mt-1">
                  {['Active', 'Inactive', 'On Hold'].map((s) => (
                    <RadioOption
                      key={s}
                      name="empStatus"
                      value={s}
                      checked={empDetails.status === s}
                      onChange={updateEmp('status')}
                      label={s}
                    />
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <FieldLabel>Working Mode</FieldLabel>
                  <div className="flex flex-col gap-1.5 mt-1">
                    {['Part-Time', 'Full-time', 'Contractual'].map((m) => (
                      <RadioOption
                        key={m}
                        name="workingMode"
                        value={m}
                        checked={empDetails.workingMode === m}
                        onChange={updateEmp('workingMode')}
                        label={m}
                      />
                    ))}
                  </div>
                </div>
                <div>
                  <FieldLabel>Notice Period</FieldLabel>
                  <TextInput placeholder="00" value={empDetails.noticePeriod} onChange={updateEmp('noticePeriod')} />
                </div>
              </div>
            </div>
          </div>
        </SectionCard>

        {/* ── Address Details ───────────────────────────────── */}
        <SectionCard title="Address Details">
          {/* Current Address */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3">
            <div>
              <FieldLabel>Current Address</FieldLabel>
              <TextInput placeholder="Demo" value={address.currentAddress} onChange={updateAddress('currentAddress')} />
            </div>
            <div>
              <FieldLabel>City</FieldLabel>
              <TextInput placeholder="Demo" value={address.city} onChange={updateAddress('city')} />
            </div>
            <div>
              <FieldLabel>District</FieldLabel>
              <TextInput placeholder="Demo" value={address.district} onChange={updateAddress('district')} />
            </div>
            <div>
              <FieldLabel>Landmark</FieldLabel>
              <TextInput placeholder="Demo" value={address.landmark} onChange={updateAddress('landmark')} />
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            <div>
              <FieldLabel>State</FieldLabel>
              <TextInput placeholder="854256" value={address.state} onChange={updateAddress('state')} />
            </div>
            <div>
              <FieldLabel>PIN Code</FieldLabel>
              <TextInput placeholder="Demo" value={address.pinCode} onChange={updateAddress('pinCode')} />
            </div>
            <div>
              <FieldLabel>Country</FieldLabel>
              <TextInput placeholder="Demo" value={address.country} onChange={updateAddress('country')} />
            </div>
          </div>
        </SectionCard>

        {/* ── Same Address Checkbox + Permanent ────────────── */}
        <div
          className="rounded-xl border-2 p-5"
          style={{ borderColor: '#C35E33' }}
        >
          {/* Checkbox */}
          <label className="flex items-start gap-2.5 cursor-pointer mb-4">
            <div className="relative mt-0.5 flex-shrink-0">
              <input
                type="checkbox"
                checked={address.sameAsCurrent}
                onChange={(e) =>
                  setAddress((prev) => ({ ...prev, sameAsCurrent: e.target.checked }))
                }
                className="hidden"
              />
              <div
                className="w-4 h-4 rounded flex items-center justify-center border-2 transition-colors"
                style={{
                  backgroundColor: address.sameAsCurrent ? PRIMARY : 'white',
                  borderColor: address.sameAsCurrent ? PRIMARY : '#D1D5DB',
                }}
              >
                {address.sameAsCurrent && (
                  <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                    <path d="M1 4l3 3 5-6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </div>
            </div>
            <span className="text-xs text-gray-600 leading-relaxed">
              If the current address and permanent address are the same, then check the check mark, as the permanent address is the same as the current address.
            </span>
          </label>

          {/* Permanent Address */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3">
            <div>
              <FieldLabel>Permanent Address</FieldLabel>
              <TextInput
                placeholder="Demo"
                value={address.sameAsCurrent ? address.currentAddress : address.permAddress}
                onChange={updateAddress('permAddress')}
              />
            </div>
            <div>
              <FieldLabel>City</FieldLabel>
              <TextInput
                placeholder="Demo"
                value={address.sameAsCurrent ? address.city : address.permCity}
                onChange={updateAddress('permCity')}
              />
            </div>
            <div>
              <FieldLabel>District</FieldLabel>
              <TextInput
                placeholder="Demo"
                value={address.sameAsCurrent ? address.district : address.permDistrict}
                onChange={updateAddress('permDistrict')}
              />
            </div>
            <div>
              <FieldLabel>Landmark</FieldLabel>
              <TextInput
                placeholder="Demo"
                value={address.sameAsCurrent ? address.landmark : address.permLandmark}
                onChange={updateAddress('permLandmark')}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            <div>
              <FieldLabel>State</FieldLabel>
              <TextInput
                placeholder="854256"
                value={address.sameAsCurrent ? address.state : address.permState}
                onChange={updateAddress('permState')}
              />
            </div>
            <div>
              <FieldLabel>PIN Code</FieldLabel>
              <TextInput
                placeholder="Demo"
                value={address.sameAsCurrent ? address.pinCode : address.permPinCode}
                onChange={updateAddress('permPinCode')}
              />
            </div>
            <div>
              <FieldLabel>Country</FieldLabel>
              <TextInput
                placeholder="Demo"
                value={address.sameAsCurrent ? address.country : address.permCountry}
                onChange={updateAddress('permCountry')}
              />
            </div>
          </div>
        </div>

        {/* ── Bank & Legal Details ──────────────────────────── */}
        <SectionCard title="Bank & Legal Details">
          {/* Row 1 */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-3">
            <div>
              <FieldLabel>Bank Name</FieldLabel>
              <TextInput placeholder="HPbank.pvt.ltd" value={bankInfo.bankName} onChange={updateBank('bankName')} />
            </div>
            <div>
              <FieldLabel>Account Number</FieldLabel>
              <TextInput type="password" placeholder="••••••••" value={bankInfo.accountNumber} onChange={updateBank('accountNumber')} />
            </div>
            <div>
              <FieldLabel>IFSC Code</FieldLabel>
              <TextInput placeholder="Demo" value={bankInfo.ifscCode} onChange={updateBank('ifscCode')} />
            </div>
          </div>
          {/* Row 2 */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-3">
            <div>
              <FieldLabel>PAN Number</FieldLabel>
              <TextInput placeholder="Demo" value={bankInfo.panNumber} onChange={updateBank('panNumber')} />
            </div>
            <div>
              <FieldLabel>Aadhaar Card Number</FieldLabel>
              <TextInput placeholder="585885214585" value={bankInfo.aadhaarNumber} onChange={updateBank('aadhaarNumber')} />
            </div>
            <div>
              <FieldLabel>ESIC Number</FieldLabel>
              <TextInput type="password" placeholder="••••••••••" value={bankInfo.esicNumber} onChange={updateBank('esicNumber')} />
            </div>
          </div>
          {/* Row 3 */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-3">
            <div>
              <FieldLabel>PAN Number</FieldLabel>
              <TextInput placeholder="Demo" value={bankInfo.pan2} onChange={updateBank('pan2')} />
            </div>
            <div>
              <FieldLabel>PF Number</FieldLabel>
              <TextInput placeholder="585885214585" value={bankInfo.pfNumber} onChange={updateBank('pfNumber')} />
            </div>
            <div>
              <FieldLabel>UAN Number</FieldLabel>
              <TextInput placeholder="1245889585" value={bankInfo.uanNumber} onChange={updateBank('uanNumber')} />
            </div>
          </div>
          {/* Row 4 */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            <div>
              <FieldLabel>ESIC Number</FieldLabel>
              <TextInput type="password" placeholder="••••••••••" value={bankInfo.esic2} onChange={updateBank('esic2')} />
            </div>
          </div>
        </SectionCard>

        {/* ── Documents ─────────────────────────────────────── */}
        <SectionCard title="Documents">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <FieldLabel>Upload Document ( ID Proof ETC... )</FieldLabel>
              <FileUpload />
            </div>
            <div>
              <FieldLabel>Employee Joining Documentation</FieldLabel>
              <FileUpload />
            </div>
            <div>
              <FieldLabel>Employee Relieving Documentation</FieldLabel>
              <FileUpload />
            </div>
          </div>
        </SectionCard>

        {/* ── Action Buttons ────────────────────────────────── */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={() => navigate('/employee')}
            className="px-6 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            cancel
          </button>
          <button
            type="button"
            className="px-6 py-2.5 text-sm font-semibold text-white rounded-lg transition-colors"
            style={{ backgroundColor: '#111827' }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#374151')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#111827')}
          >
            Add Employee
          </button>
        </div>

      </div>
    </div>
  )
}