// src/pages/leave/modals/LeaveRequestDetailModal.jsx

import { useEffect, useRef } from 'react'
import { X } from 'lucide-react'

const PRIMARY = '#C35E33'
const BORDER = '#E9C7B8'
const BG_LIGHT = '#F9F9F9'

const STATUS_MAP = {
  APPROVED: { label: 'Approved', bg: '#DCFCE7', color: '#15803D' },
  REJECTED: { label: 'Rejected', bg: '#FEE2E2', color: '#DC2626' },
  PENDING:  { label: 'Pending',  bg: '#E5E7EB', color: '#374151' },
}

export default function LeaveRequestDetailModal({ record, onClose }) {
  const overlayRef = useRef(null)

  useEffect(() => {
    const handler = (e) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  const handleOverlay = (e) => {
    if (e.target === overlayRef.current) onClose()
  }

  const status = STATUS_MAP[record.status]

  return (
    <div
      ref={overlayRef}
      onClick={handleOverlay}
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: 'rgba(0,0,0,0.4)' }}
    >
      <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-xl">

        {/* Header */}
        <div className="px-5 py-4 text-white flex justify-between items-center"
             style={{ background: PRIMARY }}>
          <h2 className="text-sm font-semibold">Leave Request Details</h2>
          <button onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 space-y-5 text-sm">

          {/* Profile */}
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-gray-200"></div>
            <div>
              <p className="font-semibold text-gray-800">{record.name}</p>
              <p className="text-xs text-gray-500">
                {record.employeeCode} ·{' '}
                <span style={{ color: PRIMARY }}>{record.leaveType}</span>
              </p>
            </div>
            <span
              className="ml-auto px-3 py-1 rounded-full text-xs font-medium"
              style={{ background: status.bg, color: status.color }}
            >
              {status.label}
            </span>
          </div>

          {/* Date Info */}
          <Section title="Date Info">
            <Row label="Start Date" value={record.startDate} />
            <Divider />
            <Row label="End Date" value={record.endDate} />
            <Divider />
            <Row label="Applied On" value={record.appliedOn} />
          </Section>

          {/* Duration Summary */}
          <Section title="Duration Summary">
            <Row label="Applied" value={`${record.appliedDays || record.days} Days`} />
            <Divider />
            <Row label="Active" value={`${record.activeDays || record.days} Days`} />
          </Section>

          {/* Cancelled Dates */}
          {record.cancelledDates?.length > 0 && (
            <Section title="Cancelled Date">
              {record.cancelledDates.map((d, i) => (
                <Bullet key={i} text={d} />
              ))}
            </Section>
          )}

          {/* Actual Dates */}
          {record.actualLeaveDates?.length > 0 && (
            <Section title="Actual Leave Date">
              {record.actualLeaveDates.map((d, i) => (
                <Bullet key={i} text={d} />
              ))}
            </Section>
          )}

          {/* Reason */}
          <div>
            <p className="text-xs font-medium text-gray-600 mb-2">Reason</p>
            <div
              className="rounded-xl px-4 py-3 text-gray-600"
              style={{ background: BG_LIGHT, border: `1px solid ${BORDER}` }}
            >
              {record.reason}
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}

/* ---------- Components ---------- */

function Section({ title, children }) {
  return (
    <div
      className="rounded-xl px-4 py-3"
      style={{ border: `1px solid ${BORDER}`, background: BG_LIGHT }}
    >
      <p className="text-xs text-gray-500 mb-2">{title}</p>
      {children}
    </div>
  )
}

function Row({ label, value }) {
  return (
    <div className="flex justify-between text-sm">
      <span className="text-gray-500">{label}</span>
      <span style={{ color: PRIMARY }} className="font-medium">
        {value}
      </span>
    </div>
  )
}

function Divider() {
  return <div className="border-t my-2" style={{ borderColor: '#EFEFEF' }} />
}

function Bullet({ text }) {
  return (
    <div className="flex items-center gap-2 text-gray-600 text-sm">
      <span
        className="w-2 h-2 rounded-full"
        style={{ background: PRIMARY }}
      ></span>
      {text}
    </div>
  )
}