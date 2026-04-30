export const ROUTES = {
  LOGIN:            '/',
  FORGOT_PASSWORD:  '/forgot-password',
  VERIFY_OTP:       '/verify-otp',
  RESET_PASSWORD:   '/reset-password',
 
  DASHBOARD:    '/dashboard',
 
  EMPLOYEE:            '/employee',
  EMPLOYEE_ADD:        '/employee/add',
  EMPLOYEE_ADD_INTERN: '/employee/add-intern',
  EMPLOYEE_ADD_TRAINEE:'/employee/add-trainee',
   
 
  ATTENDANCE:         '/attendance',
  ATTENDANCE_PENDING: '/attendance/pending-approvals',
  ATTENDANCE_EMPLOYEE: '/my-attendance',
  ATTENDANCE_EMPLOYEE_HISTORY: '/my-attendance/history',
 
  // Leave Management
  LEAVE:     '/leave',
  LEAVE_BALANCE:'/leave/balance', 
  LEAVE_EMPLOYEE: '/my-leave', 

  ROLES:     '/roles-permissions',
  PROJECTS:  '/projects',
  TIMESHEET: '/timesheet',
  REPORTS:   '/reports',
  PAYROLL:   '/payroll',
 
  // ── Master Data
  DESIGNATION: '/designation',
  DEPARTMENT:  '/department',
  BRANCH:      '/branch',
  DOCUMENTS:   '/documents',
  INTERN_COURSE: '/intern-course', 
  BREAK_POLICY: '/master/break-policy',
  HOLIDAY:      '/master/holiday',

    // Shift Management
  SHIFT:        '/shift',
  SHIFT_NEW:    '/shift/new',
  SHIFT_EDIT:   '/shift/:id/edit',
  SHIFT_VIEW:   '/shift/:id/view',
  SHIFT_CUSTOM: '/shift/:id/custom',
  SHIFT_ASSIGN: '/shift/assign',
  SHIFT_EMPLOYEE: '/my-shift', 
  SHIFT_EMPLOYEE_HISTORY: '/my-shift/history',


  PROFILE: '/profile',

  UNAUTHORIZED: '/unauthorized',
}