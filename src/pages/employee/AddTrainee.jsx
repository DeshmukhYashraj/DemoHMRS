// src/pages/employee/AddTrainee.jsx
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const PRIMARY = '#C35E33'

const EMPLOYMENT_TYPE_ROUTES = {
  Internship: '/employees/add-intern',
  Training:   '/employees/add-trainee',
  Employee:   '/employees/add',
}
// ─── Shared primitives ─────────────────────────────────────────────────────────
function FieldLabel({ children }) {
  return (
    <label className="block text-xs font-medium text-gray-500 mb-1">{children}</label>
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

function PhoneInput({ placeholder, value, onChange }) {
  return (
    <div className="flex h-9">
      <span className="flex items-center px-2.5 bg-gray-50 border border-r-0 border-gray-200 rounded-l-lg text-xs text-gray-500 whitespace-nowrap">
        + 91
      </span>
      <input
        type="tel"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="flex-1 min-w-0 px-2 text-sm text-gray-700 bg-gray-50 border border-gray-200 rounded-r-lg outline-none focus:border-[#C35E33] transition-colors placeholder:text-gray-400"
      />
    </div>
  )
}

function RadioOption({ name, value, checked, onChange, label }) {
  return (
    <label className="flex items-center gap-1.5 cursor-pointer">
      <input type="radio" name={name} value={value} checked={checked} onChange={onChange} className="hidden" />
      <span
        className="w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors"
        style={{ borderColor: checked ? PRIMARY : '#D1D5DB', backgroundColor: checked ? PRIMARY : 'transparent' }}
      >
        {checked && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
      </span>
      <span className="text-xs text-gray-600 whitespace-nowrap">{label}</span>
    </label>
  )
}

function FileUpload() {
  return (
    <div className="flex items-center h-9 px-3 bg-gray-50 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors">
      <span className="text-sm text-gray-400 flex-1">Choose File</span>
      <button
        type="button"
        className="w-7 h-7 rounded-md flex items-center justify-center flex-shrink-0"
        style={{ backgroundColor: PRIMARY }}
      >
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
          <polyline points="17 8 12 3 7 8" />
          <line x1="12" y1="3" x2="12" y2="15" />
        </svg>
      </button>
    </div>
  )
}

function SectionCard({ title, children }) {
  return (
    <div className="bg-white rounded-xl border-2 p-5" style={{ borderColor: '#E8C5A8' }}>
      <h2 className="text-sm font-semibold text-gray-800 mb-4">{title}</h2>
      {children}
    </div>
  )
}

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function AddTrainee() {
  const navigate = useNavigate()

  // Personal Info
  const [personal, setPersonal] = useState({
    firstName: '', middleName: '', lastName: '', gender: '',
    dob: '', personalPhone: '', emergencyPhone: '', personalEmail: '',
    maritalStatus: '', spouseName: '',
  })

  // Trainee Info
  const [trainee, setTrainee] = useState({
    traineeId: '#540', designation: 'demo',
    department: '', stipend: '',
    reportingManager: '', officeMail: 'Demo@gmail.com',
    password: '', status: 'Active',
  })

  // Work Details
  const [work, setWork] = useState({
    workLocation: '', trainingPeriod: '3 month',
    startDate: '', endDate: '',
    shiftTiming: '',
    workingType: 'Part-Time',
    workMode: 'Remote',
  })

  // Bank & Legal
  const [bank, setBank] = useState({
    bankName: 'HPbank.pvt.ltd', accountNumber: '', ifscCode: 'Demo',
    panNumber: 'Demo', aadhaarNumber: '585885214585', esicNumber: '',
    pfNumber: '585885214585', uanNumber: '1245889585',
  })

  // Address
  const [address, setAddress] = useState({
    currentAddress: 'Demo', city: 'Demo', district: 'Demo', landmark: 'Demo',
    state: '854256', pinCode: 'Demo', country: 'Demo',
    sameAsCurrent: true,
    permAddress: 'Demo', permCity: 'Demo', permDistrict: 'Demo', permLandmark: 'Demo',
    permState: '854256', permPinCode: 'Demo', permCountry: 'Demo',
  })

  // Educational Details
  const [edu, setEdu] = useState({
    hscCompletion: '3 month', hscYear: '2023',
    bachelorCompletion: '3 month', bachelorYear: '2023',
    masterCompletion: '3 month', masterYear: '2023',
    degreeName: '3 month', degreeResult: '52%',
    universityName: '3 month', universityAddress: 'usa',
    trainingStatus: 'Complete',
  })

  const up = (setter) => (field) => (e) =>
    setter((prev) => ({ ...prev, [field]: e.target.value }))

  const upPersonal = up(setPersonal)
  const upTrainee  = up(setTrainee)
  const upWork     = up(setWork)
  const upBank     = up(setBank)
  const upAddress  = up(setAddress)
  const upEdu      = up(setEdu)

  const YEARS = ['2018','2019','2020','2021','2022','2023','2024','2025','2026']
  const PERIODS = ['1 month','2 months','3 month','6 months','1 year']

  return (
    <div className="min-h-full pb-8">
      {/* Header */}
      <div className="flex items-start justify-between mb-5 flex-wrap gap-4">
        <h1 className="text-xl font-bold text-gray-900">Add Trainee</h1>
        {/* Employment Type */}
<div className="flex flex-col items-end gap-1.5">
  <span className="text-xs font-semibold text-gray-700">Employment Type</span>
  <div className="flex items-center gap-4">
    {['Internship', 'Training', 'Employee'].map((type) => (
      <RadioOption
        key={type}
        name="employmentType"
        value={type}
        checked={type === 'Training'}
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
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3">
            <div><FieldLabel>First Name</FieldLabel><TextInput placeholder="Enter your First Name" value={personal.firstName} onChange={upPersonal('firstName')} /></div>
            <div><FieldLabel>Middle Name</FieldLabel><TextInput placeholder="Enter your Middle Name" value={personal.middleName} onChange={upPersonal('middleName')} /></div>
            <div><FieldLabel>Last Name</FieldLabel><TextInput placeholder="Enter your Last Name" value={personal.lastName} onChange={upPersonal('lastName')} /></div>
            <div>
              <FieldLabel>Gender</FieldLabel>
              <SelectInput value={personal.gender} onChange={upPersonal('gender')}>
                <option value="">Select Gender</option>
                <option>Male</option><option>Female</option><option>Other</option>
              </SelectInput>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3">
            <div><FieldLabel>Date of Birth</FieldLabel><TextInput type="date" placeholder="DD-MM-YYYY" value={personal.dob} onChange={upPersonal('dob')} /></div>
            <div><FieldLabel>Personal Phone Number</FieldLabel><PhoneInput placeholder="8547526584" value={personal.personalPhone} onChange={upPersonal('personalPhone')} /></div>
            <div><FieldLabel>Emergency phone number</FieldLabel><PhoneInput placeholder="8547526584" value={personal.emergencyPhone} onChange={upPersonal('emergencyPhone')} /></div>
            <div><FieldLabel>Personal Email</FieldLabel><TextInput type="email" placeholder="Demo@gmail.com" value={personal.personalEmail} onChange={upPersonal('personalEmail')} /></div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3">
            <div>
              <FieldLabel>Marital Status</FieldLabel>
              <SelectInput value={personal.maritalStatus} onChange={upPersonal('maritalStatus')}>
                <option value="">Status</option>
                <option>Single</option><option>Married</option><option>Divorced</option>
              </SelectInput>
            </div>
            <div><FieldLabel>Spouse Name OR Parents Name</FieldLabel><TextInput placeholder="Name" value={personal.spouseName} onChange={upPersonal('spouseName')} /></div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div><FieldLabel>Upload photo</FieldLabel><FileUpload /></div>
          </div>
        </SectionCard>

        {/* ── Trainee Details card (orange border) ──────────── */}
        <div className="bg-white rounded-xl border-2 p-5" style={{ borderColor: '#E8C5A8' }}>
          <div className="grid grid-cols-2 gap-3 mb-3">
            <div><FieldLabel>Trainee ID</FieldLabel><TextInput placeholder="#540" value={trainee.traineeId} onChange={upTrainee('traineeId')} /></div>
            <div>
              <FieldLabel>Designation</FieldLabel>
              <SelectInput value={trainee.designation} onChange={upTrainee('designation')}>
                <option value="">demo</option>
                <option>Junior Developer</option><option>Senior Developer</option>
                <option>UI/UX Designer</option><option>QA Engineer</option>
              </SelectInput>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 mb-3">
            <div><FieldLabel>Department</FieldLabel><TextInput placeholder="Name" value={trainee.department} onChange={upTrainee('department')} /></div>
            <div><FieldLabel>Stipend</FieldLabel><TextInput placeholder="Amount" value={trainee.stipend} onChange={upTrainee('stipend')} /></div>
          </div>
          <div className="grid grid-cols-2 gap-3 mb-3">
            <div>
              <FieldLabel>Reporting Manager</FieldLabel>
              <SelectInput value={trainee.reportingManager} onChange={upTrainee('reportingManager')}>
                <option value="">Name</option>
                <option>Max Johnson</option><option>Sarah Lee</option>
              </SelectInput>
            </div>
            <div><FieldLabel>Office Mail</FieldLabel><TextInput type="email" placeholder="Demo@gmail.com" value={trainee.officeMail} onChange={upTrainee('officeMail')} /></div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div><FieldLabel>Trainee Password (HRMS)</FieldLabel><TextInput type="password" placeholder="Name" value={trainee.password} onChange={upTrainee('password')} /></div>
            <div>
              <FieldLabel>Trainee Status</FieldLabel>
              <div className="flex items-center gap-4 mt-2">
                {['Active', 'Inactive', 'On Hold'].map((s) => (
                  <RadioOption key={s} name="traineeStatus" value={s} checked={trainee.status === s} onChange={upTrainee('status')} label={s} />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ── Work Details ───────────────────────────────────── */}
        <SectionCard title="Work Details">
          {/* Row 1 */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-3">
            <div className="md:col-span-1"><FieldLabel>Work Location / Branch</FieldLabel><TextInput placeholder="Name" value={work.workLocation} onChange={upWork('workLocation')} /></div>
            <div>
              <FieldLabel>Training Period</FieldLabel>
              <SelectInput value={work.trainingPeriod} onChange={upWork('trainingPeriod')}>
                {PERIODS.map(p => <option key={p}>{p}</option>)}
              </SelectInput>
            </div>
            <div><FieldLabel>Training Start Date</FieldLabel><TextInput type="date" placeholder="DD-MM-YYYY" value={work.startDate} onChange={upWork('startDate')} /></div>
            <div><FieldLabel>Training End Date</FieldLabel><TextInput type="date" placeholder="DD-MM-YYYY" value={work.endDate} onChange={upWork('endDate')} /></div>
          </div>
          {/* Row 2 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <FieldLabel>Training Shift Time</FieldLabel>
              <SelectInput value={work.shiftTiming} onChange={upWork('shiftTiming')}>
                <option value="">Select •</option>
                <option>Morning</option><option>Afternoon</option><option>Evening</option><option>Night</option>
              </SelectInput>
            </div>
            <div>
              <FieldLabel>Working type</FieldLabel>
              <div className="flex items-center gap-3 mt-1">
                {['Part-Time', 'Full-time', 'Contractual'].map((t) => (
                  <RadioOption key={t} name="workingType" value={t} checked={work.workingType === t} onChange={upWork('workingType')} label={t} />
                ))}
              </div>
            </div>
            <div>
              <FieldLabel>Work Mode</FieldLabel>
              <div className="flex items-center gap-3 mt-1">
                {['Remote', 'Hybrid', 'On site'].map((m) => (
                  <RadioOption key={m} name="workMode" value={m} checked={work.workMode === m} onChange={upWork('workMode')} label={m} />
                ))}
              </div>
            </div>
          </div>
        </SectionCard>

        {/* ── Bank & Legal Details ──────────────────────────── */}
        <SectionCard title="Bank & Legal Details">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-3">
            <div><FieldLabel>Bank Name</FieldLabel><TextInput placeholder="HPbank.pvt.ltd" value={bank.bankName} onChange={upBank('bankName')} /></div>
            <div><FieldLabel>Account Number</FieldLabel><TextInput type="password" placeholder="••••••••" value={bank.accountNumber} onChange={upBank('accountNumber')} /></div>
            <div><FieldLabel>IFSC Code</FieldLabel><TextInput placeholder="Demo" value={bank.ifscCode} onChange={upBank('ifscCode')} /></div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-3">
            <div><FieldLabel>PAN Number</FieldLabel><TextInput placeholder="Demo" value={bank.panNumber} onChange={upBank('panNumber')} /></div>
            <div><FieldLabel>Aadhaar Card Number</FieldLabel><TextInput placeholder="585885214585" value={bank.aadhaarNumber} onChange={upBank('aadhaarNumber')} /></div>
            <div><FieldLabel>ESIC Number</FieldLabel><TextInput type="password" placeholder="••••••••••" value={bank.esicNumber} onChange={upBank('esicNumber')} /></div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div><FieldLabel>PF Number</FieldLabel><TextInput placeholder="585885214585" value={bank.pfNumber} onChange={upBank('pfNumber')} /></div>
            <div><FieldLabel>UAN Number</FieldLabel><TextInput placeholder="1245889585" value={bank.uanNumber} onChange={upBank('uanNumber')} /></div>
          </div>
        </SectionCard>

        {/* ── Address Details ───────────────────────────────── */}
        <SectionCard title="Address Details">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3">
            <div><FieldLabel>Current Address</FieldLabel><TextInput placeholder="Demo" value={address.currentAddress} onChange={upAddress('currentAddress')} /></div>
            <div><FieldLabel>City</FieldLabel><TextInput placeholder="Demo" value={address.city} onChange={upAddress('city')} /></div>
            <div><FieldLabel>District</FieldLabel><TextInput placeholder="Demo" value={address.district} onChange={upAddress('district')} /></div>
            <div><FieldLabel>Landmark</FieldLabel><TextInput placeholder="Demo" value={address.landmark} onChange={upAddress('landmark')} /></div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            <div><FieldLabel>State</FieldLabel><TextInput placeholder="854256" value={address.state} onChange={upAddress('state')} /></div>
            <div><FieldLabel>PIN Code</FieldLabel><TextInput placeholder="Demo" value={address.pinCode} onChange={upAddress('pinCode')} /></div>
            <div><FieldLabel>Country</FieldLabel><TextInput placeholder="Demo" value={address.country} onChange={upAddress('country')} /></div>
          </div>
        </SectionCard>

        {/* ── Permanent Address (same-as checkbox) ─────────── */}
        <div className="rounded-xl border-2 p-5" style={{ borderColor: PRIMARY }}>
          <label className="flex items-start gap-2.5 cursor-pointer mb-4">
            <div
              className="w-4 h-4 rounded flex items-center justify-center border-2 transition-colors flex-shrink-0 mt-0.5 cursor-pointer"
              style={{ backgroundColor: address.sameAsCurrent ? PRIMARY : 'white', borderColor: address.sameAsCurrent ? PRIMARY : '#D1D5DB' }}
              onClick={() => setAddress(p => ({ ...p, sameAsCurrent: !p.sameAsCurrent }))}
            >
              {address.sameAsCurrent && (
                <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                  <path d="M1 4l3 3 5-6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
            </div>
            <span className="text-xs text-gray-600 leading-relaxed">
              If the current address and permanent address are the same, then check the check mark, as the permanent address is the same as the current address.
            </span>
          </label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3">
            <div><FieldLabel>Permanent Address</FieldLabel><TextInput placeholder="Demo" value={address.sameAsCurrent ? address.currentAddress : address.permAddress} onChange={upAddress('permAddress')} /></div>
            <div><FieldLabel>City</FieldLabel><TextInput placeholder="Demo" value={address.sameAsCurrent ? address.city : address.permCity} onChange={upAddress('permCity')} /></div>
            <div><FieldLabel>District</FieldLabel><TextInput placeholder="Demo" value={address.sameAsCurrent ? address.district : address.permDistrict} onChange={upAddress('permDistrict')} /></div>
            <div><FieldLabel>Landmark</FieldLabel><TextInput placeholder="Demo" value={address.sameAsCurrent ? address.landmark : address.permLandmark} onChange={upAddress('permLandmark')} /></div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            <div><FieldLabel>State</FieldLabel><TextInput placeholder="854256" value={address.sameAsCurrent ? address.state : address.permState} onChange={upAddress('permState')} /></div>
            <div><FieldLabel>PIN Code</FieldLabel><TextInput placeholder="Demo" value={address.sameAsCurrent ? address.pinCode : address.permPinCode} onChange={upAddress('permPinCode')} /></div>
            <div><FieldLabel>Country</FieldLabel><TextInput placeholder="Demo" value={address.sameAsCurrent ? address.country : address.permCountry} onChange={upAddress('permCountry')} /></div>
          </div>
        </div>

        {/* ── Educational Details ───────────────────────────── */}
        <SectionCard title="Educational Details">
          {/* 12th */}
          <div className="grid grid-cols-2 gap-3 mb-3">
            <div>
              <FieldLabel>12th (HSC) Completion</FieldLabel>
              <SelectInput value={edu.hscCompletion} onChange={upEdu('hscCompletion')}>
                {PERIODS.map(p => <option key={p}>{p}</option>)}
              </SelectInput>
            </div>
            <div>
              <FieldLabel>Year</FieldLabel>
              <SelectInput value={edu.hscYear} onChange={upEdu('hscYear')}>
                {YEARS.map(y => <option key={y}>{y}</option>)}
              </SelectInput>
            </div>
          </div>
          {/* Bachelor */}
          <div className="grid grid-cols-2 gap-3 mb-3">
            <div>
              <FieldLabel>Bachelor Degree Completion</FieldLabel>
              <SelectInput value={edu.bachelorCompletion} onChange={upEdu('bachelorCompletion')}>
                {PERIODS.map(p => <option key={p}>{p}</option>)}
              </SelectInput>
            </div>
            <div>
              <FieldLabel>Year</FieldLabel>
              <SelectInput value={edu.bachelorYear} onChange={upEdu('bachelorYear')}>
                {YEARS.map(y => <option key={y}>{y}</option>)}
              </SelectInput>
            </div>
          </div>
          {/* Master */}
          <div className="grid grid-cols-2 gap-3 mb-3">
            <div>
              <FieldLabel>Master Degree Completion</FieldLabel>
              <SelectInput value={edu.masterCompletion} onChange={upEdu('masterCompletion')}>
                {PERIODS.map(p => <option key={p}>{p}</option>)}
              </SelectInput>
            </div>
            <div>
              <FieldLabel>Year</FieldLabel>
              <SelectInput value={edu.masterYear} onChange={upEdu('masterYear')}>
                {YEARS.map(y => <option key={y}>{y}</option>)}
              </SelectInput>
            </div>
          </div>
          {/* Degree Name + Result */}
          <div className="grid grid-cols-2 gap-3 mb-3">
            <div>
              <FieldLabel>Degree Name</FieldLabel>
              <SelectInput value={edu.degreeName} onChange={upEdu('degreeName')}>
                {PERIODS.map(p => <option key={p}>{p}</option>)}
              </SelectInput>
            </div>
            <div><FieldLabel>Degree Result</FieldLabel><TextInput placeholder="52%" value={edu.degreeResult} onChange={upEdu('degreeResult')} /></div>
          </div>
          {/* University */}
          <div className="grid grid-cols-2 gap-3 mb-3">
            <div>
              <FieldLabel>University Name</FieldLabel>
              <SelectInput value={edu.universityName} onChange={upEdu('universityName')}>
                {PERIODS.map(p => <option key={p}>{p}</option>)}
              </SelectInput>
            </div>
            <div><FieldLabel>University Address</FieldLabel><TextInput placeholder="usa" value={edu.universityAddress} onChange={upEdu('universityAddress')} /></div>
          </div>
          {/* Training Completion Status */}
          <div>
            <FieldLabel>Training Completion Status</FieldLabel>
            <div className="flex items-center gap-5 mt-1">
              {['Complete', 'Pending', 'On Going'].map((s) => (
                <RadioOption key={s} name="trainingStatus" value={s} checked={edu.trainingStatus === s} onChange={upEdu('trainingStatus')} label={s} />
              ))}
            </div>
          </div>
        </SectionCard>

        {/* ── Document Uploads ──────────────────────────────── */}
        <SectionCard title="Document Uploads">
          <div className="grid grid-cols-2 gap-3">
            <div><FieldLabel>Aadhar Card</FieldLabel><FileUpload /></div>
            <div><FieldLabel>PAN Card</FieldLabel><FileUpload /></div>
            <div><FieldLabel>Photo</FieldLabel><FileUpload /></div>
            <div><FieldLabel>Address Proof</FieldLabel><FileUpload /></div>
            <div><FieldLabel>10th Marksheet</FieldLabel><FileUpload /></div>
            <div><FieldLabel>12th Marksheet</FieldLabel><FileUpload /></div>
            <div><FieldLabel>Degree Marksheet</FieldLabel><FileUpload /></div>
            <div><FieldLabel>Degree Certificate</FieldLabel><FileUpload /></div>
            <div><FieldLabel>Previous Training Certificate</FieldLabel><FileUpload /></div>
            <div><FieldLabel>Bank Statement</FieldLabel><FileUpload /></div>
            <div><FieldLabel>Trainee Joining Documentation</FieldLabel><FileUpload /></div>
            <div><FieldLabel>Trainee Relieving Documentation</FieldLabel><FileUpload /></div>
            <div><FieldLabel>Upload Resume</FieldLabel><FileUpload /></div>
            <div><FieldLabel>Bond paper</FieldLabel><FileUpload /></div>
          </div>
        </SectionCard>

        {/* ── Action Buttons ────────────────────────────────── */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={() => navigate('/employee')}
            className="px-6 py-2.5 text-sm font-medium rounded-lg border transition-colors"
            style={{ color: PRIMARY, borderColor: PRIMARY, background: 'white' }}
            onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(195,94,51,0.05)')}
            onMouseLeave={(e) => (e.currentTarget.style.background = 'white')}
          >
            Save as a Draft
          </button>
          <button
            type="button"
            className="px-6 py-2.5 text-sm font-semibold text-white rounded-lg transition-colors"
            style={{ backgroundColor: '#111827' }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#374151')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#111827')}
          >
            Save & Send Email
          </button>
        </div>

      </div>
    </div>
  )
}