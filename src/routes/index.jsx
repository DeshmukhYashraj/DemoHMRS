// src/router/index.jsx
// ─────────────────────────────────────────────────────────────────────────────
// Complete router — includes all existing routes + new Shift Management routes
// ─────────────────────────────────────────────────────────────────────────────

import { createBrowserRouter } from 'react-router-dom'
import { lazy, Suspense } from 'react'
import { ROUTES } from '@/constants/routes'
import ProtectedRoute from './ProtectedRoute'
import RoleRoute from './RoleRoute'
import AppShell from '@/components/layout/AppShell'

// ── Dashboard ────────────────────────────────────────────────────────────────
const DashboardRouter = lazy(() => import('@/pages/dashboard/DashboardRouter'))


// ── Auth ─────────────────────────────────────────────────────────────────────
const LoginPage          = lazy(() => import('@/pages/auth/LoginPage'))
const ForgotPasswordPage = lazy(() => import('@/pages/auth/ForgotPasswordPage'))
const VerifyOTPPage      = lazy(() => import('@/pages/auth/VerifyOTPPage'))
const ResetPasswordPage  = lazy(() => import('@/pages/auth/ResetPasswordPage'))

// ── Employee ─────────────────────────────────────────────────────────────────
const EmployeeList   = lazy(() => import('@/pages/employee/EmployeeList'))
const AddEmployee    = lazy(() => import('@/pages/employee/AddEmployee'))
const AddIntern      = lazy(() => import('@/pages/employee/AddIntern'))
const AddTrainee     = lazy(() => import('@/pages/employee/AddTrainee'))

// ── Attendance ───────────────────────────────────────────────────────────────
const AttendanceOverview = lazy(() => import('@/pages/attendance/AttendanceOverview'))
const PendingApprovals   = lazy(() => import('@/pages/attendance/PendingApprovals'))
const EmployeeAttendance = lazy(() => import('@/pages/attendance/EmployeeAttendance'))
const EmployeeAttendanceHistory = lazy(() => import('@/pages/attendance/EmployeeAttendanceHistory'))

// ── Shift Management ─────────────────────────────────────────────────────────
const ShiftManagement   = lazy(() => import('@/pages/shift/ShiftManagement'))
const ShiftForm         = lazy(() => import('@/pages/shift/ShiftForm'))
const ShiftViewCard     = lazy(() => import('@/pages/shift/ShiftViewCard'))
const CustomShiftDetails= lazy(() => import('@/pages/shift/CustomShiftDetails'))
const AssignShift       = lazy(() => import('@/pages/shift/AssignShift'))
const EmployeeShiftView = lazy(() => import('@/pages/shift/EmployeeShiftView'))


const LeaveManagement       = lazy(() => import('@/pages/leave/LeaveManagement'))
const EmployeeLeaveManagement = lazy(() => import('@/pages/leave/employee/EmployeeLeaveManagement'))

const RolesPermissions = lazy(() => import('@/pages/roles/RolesPermissions'))

const ComingSoon = lazy(() => import('@/pages/ComingSoon'))


// ── Master Data ───────────────────────────────────────────────────────────────
const DesignationManagement  = lazy(() => import('@/pages/masterdata/designation/DesignationManagement'))
const DocumentManagement     = lazy(() => import('@/pages/masterdata/documents/DocumentManagement'))
const DepartmentManagement   = lazy(() => import('@/pages/masterdata/department/DepartmentManagement'))
const BranchManagement       = lazy(() => import('@/pages/masterdata/branch/BranchManagement'))
const InternCourseManagement = lazy(() => import('@/pages/masterdata/interncourse/InternCourseManagement'))
const BreakPolicies     = lazy(() => import('@/pages/masterdata/breakpolicy/BreakPolicies'))
const HolidayManagement = lazy(() => import('@/pages/masterdata/holiday/HolidayManagement'))
const EmployeeShiftHistory = lazy(() => import('@/pages/shift/EmployeeShiftHistory'))


const ProfilePage = lazy(() => import('@/pages/profile/ProfilePage'))

// ── Loader & HOC ─────────────────────────────────────────────────────────────
const Loader = () => (
  <div className="flex h-screen items-center justify-center text-gray-500">Loading…</div>
)
const s = (Component) => (
  <Suspense fallback={<Loader />}><Component /></Suspense>
)

// ── Helper: role-wrapped lazy route ──────────────────────────────────────────
const rr = (route, Component) => ({
  path: route,
  element: (
    <RoleRoute route={route}>
      <Suspense fallback={<Loader />}><Component /></Suspense>
    </RoleRoute>
  ),
})

export const router = createBrowserRouter([
  // ── Auth (public) ──────────────────────────────────────────────────────────
  { path: ROUTES.LOGIN,           element: s(LoginPage)          },
  { path: '/forgot-password',     element: s(ForgotPasswordPage) },
  { path: '/verify-otp',          element: s(VerifyOTPPage)      },
  { path: '/reset-password',      element: s(ResetPasswordPage)  },

  {
    path: '/',
    element: (
      <ProtectedRoute>
        <AppShell />
      </ProtectedRoute>
    ),
    children: [
      // ── Dashboard
      rr(ROUTES.DASHBOARD, DashboardRouter),
      // ── Employee
      rr(ROUTES.EMPLOYEE,            EmployeeList),
      rr(ROUTES.EMPLOYEE_ADD_INTERN, AddIntern),
      rr(ROUTES.EMPLOYEE_ADD_TRAINEE,AddTrainee),
      rr(ROUTES.EMPLOYEE_ADD,        AddEmployee),

      // ── Attendance
      rr(ROUTES.ATTENDANCE,         AttendanceOverview),
      rr(ROUTES.ATTENDANCE_PENDING, PendingApprovals),
      rr(ROUTES.ATTENDANCE_EMPLOYEE, EmployeeAttendance),
      rr(ROUTES.ATTENDANCE_EMPLOYEE_HISTORY, EmployeeAttendanceHistory),

      // ── Shift Management
      // List
      rr(ROUTES.SHIFT, ShiftManagement),
      rr(ROUTES.SHIFT_EMPLOYEE, EmployeeShiftView),
      rr(ROUTES.SHIFT_EMPLOYEE_HISTORY, EmployeeShiftHistory),


      // Create new shift
      {
        path: ROUTES.SHIFT_NEW,
        element: (
          <RoleRoute route={ROUTES.SHIFT}>
            <Suspense fallback={<Loader />}><ShiftForm /></Suspense>
          </RoleRoute>
        ),
      },

      // Edit existing shift
      {
        path: ROUTES.SHIFT_EDIT, 
        element: (
          <RoleRoute route={ROUTES.SHIFT}>
            <Suspense fallback={<Loader />}><ShiftForm /></Suspense>
          </RoleRoute>
        ),
      },

      // View shift detail card
      {
        path: ROUTES.SHIFT_VIEW,
        element: (
          <RoleRoute route={ROUTES.SHIFT}>
            <Suspense fallback={<Loader />}><ShiftViewCard /></Suspense>
          </RoleRoute>
        ),
      },

      // Custom shift day-wise editor
      {
        path: ROUTES.SHIFT_CUSTOM,
        element: (
          <RoleRoute route={ROUTES.SHIFT}>
            <Suspense fallback={<Loader />}><CustomShiftDetails /></Suspense>
          </RoleRoute>
        ),
      },

      // Assign shift to employees
      {
        path: ROUTES.SHIFT_ASSIGN,
        element: (
          <RoleRoute route={ROUTES.SHIFT}>
            <Suspense fallback={<Loader />}><AssignShift /></Suspense>
          </RoleRoute>
        ),
      },

      {
  path: ROUTES.PROFILE,
  element: (
    <Suspense fallback={<Loader />}>
      <ProfilePage />
    </Suspense>
  ),
},

{
  path: ROUTES.LEAVE_EMPLOYEE,
  element: (
    <RoleRoute route={ROUTES.LEAVE_EMPLOYEE}>
      <Suspense fallback={<Loader />}>
        <EmployeeLeaveManagement />
      </Suspense>
    </RoleRoute>
  ),
},
 

      // ── Master Data
      rr(ROUTES.DESIGNATION,  DesignationManagement),
      rr(ROUTES.DOCUMENTS,    DocumentManagement),
      rr(ROUTES.DEPARTMENT,   DepartmentManagement),
      rr(ROUTES.BRANCH,       BranchManagement),
      rr(ROUTES.INTERN_COURSE,InternCourseManagement),
      rr(ROUTES.BREAK_POLICY, BreakPolicies),
      rr(ROUTES.HOLIDAY, HolidayManagement),

      // ── Uncomment when modules are built
      rr(ROUTES.LEAVE,     LeaveManagement),
      rr(ROUTES.ROLES,     RolesPermissions),
      rr(ROUTES.PROJECTS,  ComingSoon ),
      rr(ROUTES.TIMESHEET, ComingSoon ),
      rr(ROUTES.REPORTS,   ComingSoon ),
      rr(ROUTES.PAYROLL,   ComingSoon ),
    ],
  },

  // ── Error pages
  // { path: ROUTES.UNAUTHORIZED, element: s(Unauthorized) },
  // { path: '*',                 element: s(NotFound) },
])