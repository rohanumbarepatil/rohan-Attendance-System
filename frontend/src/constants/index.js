export const ROLES = Object.freeze({
  ADMIN: 'ADMIN',
  FACULTY: 'FACULTY',
  STUDENT: 'STUDENT',
});

export const COLLECTIONS = Object.freeze({
  USERS: 'users',
  ROLES: 'roles',
  PERMISSIONS: 'permissions',
  DEPARTMENTS: 'departments',
  COURSES: 'courses',
  PROGRAMS: 'programs',
  ACADEMIC_YEARS: 'academicYears',
  SEMESTERS: 'semesters',
  SUBJECTS: 'subjects',
  FACULTY: 'faculty',
  STUDENTS: 'students',
  ATTENDANCE_SESSIONS: 'attendanceSessions',
  ATTENDANCE_RECORDS: 'attendanceRecords',
  NOTIFICATIONS: 'notifications',
  REPORTS: 'reports',
  AUDIT_LOGS: 'auditLogs',
  SETTINGS: 'settings',
});

export const ATTENDANCE_STATUS = Object.freeze({
  PRESENT: 'PRESENT',
  ABSENT: 'ABSENT',
  LATE: 'LATE',
  MEDICAL_LEAVE: 'MEDICAL_LEAVE',
  AUTHORIZED_LEAVE: 'AUTHORIZED_LEAVE',
});

// Statuses counted as attended for percentage calculation
export const COUNTED_AS_PRESENT = Object.freeze([
  ATTENDANCE_STATUS.PRESENT,
  ATTENDANCE_STATUS.LATE,
  ATTENDANCE_STATUS.MEDICAL_LEAVE,
  ATTENDANCE_STATUS.AUTHORIZED_LEAVE,
]);

export const ATTENDANCE_CATEGORY = Object.freeze({
  EXCELLENT: { key: 'EXCELLENT', label: 'Excellent', min: 90, color: '#2e7d32' },
  GOOD: { key: 'GOOD', label: 'Good', min: 75, color: '#0288d1' },
  WARNING: { key: 'WARNING', label: 'Warning', min: 60, color: '#ed6c02' },
  CRITICAL: { key: 'CRITICAL', label: 'Critical', min: 0, color: '#d32f2f' },
});

export const DEFAULTER_THRESHOLD = 75;
export const CRITICAL_THRESHOLD = 60;

export const NOTIFICATION_TYPES = Object.freeze({
  ATTENDANCE_MARKED: 'ATTENDANCE_MARKED',
  LOW_ATTENDANCE: 'LOW_ATTENDANCE',
  DEFAULTER_ALERT: 'DEFAULTER_ALERT',
  ANNOUNCEMENT: 'ANNOUNCEMENT',
  SYSTEM: 'SYSTEM',
});
