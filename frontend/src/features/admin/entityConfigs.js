import { COLLECTIONS, ROLES } from '../../constants';
import { isRequired, isEmail, isDate } from '../../utils/validators';

/**
 * Config-driven CRUD definitions for every admin-managed collection.
 * Each entry powers EntityManagerPage: columns, form fields, validation and lookups.
 */
export const entityConfigs = {
  departments: {
    collection: COLLECTIONS.DEPARTMENTS,
    title: 'Departments',
    columns: [
      { key: 'name', label: 'Name' },
      { key: 'code', label: 'Code' },
      { key: 'headName', label: 'Head of Department' },
    ],
    fields: [
      { key: 'name', label: 'Department Name', rules: [isRequired] },
      { key: 'code', label: 'Code', rules: [isRequired] },
      { key: 'headName', label: 'Head of Department', rules: [] },
    ],
  },
  courses: {
    collection: COLLECTIONS.COURSES,
    title: 'Courses',
    columns: [
      { key: 'name', label: 'Name' },
      { key: 'code', label: 'Code' },
      { key: 'departmentName', label: 'Department' },
      { key: 'durationYears', label: 'Duration (years)' },
    ],
    fields: [
      { key: 'name', label: 'Course Name', rules: [isRequired] },
      { key: 'code', label: 'Code', rules: [isRequired] },
      { key: 'departmentId', label: 'Department', type: 'lookup', lookup: COLLECTIONS.DEPARTMENTS, lookupLabel: 'name', denormalize: 'departmentName', rules: [isRequired] },
      { key: 'durationYears', label: 'Duration (years)', type: 'number', rules: [isRequired] },
    ],
  },
  programs: {
    collection: COLLECTIONS.PROGRAMS,
    title: 'Programs',
    columns: [
      { key: 'name', label: 'Name' },
      { key: 'courseName', label: 'Course' },
      { key: 'level', label: 'Level' },
    ],
    fields: [
      { key: 'name', label: 'Program Name', rules: [isRequired] },
      { key: 'courseId', label: 'Course', type: 'lookup', lookup: COLLECTIONS.COURSES, lookupLabel: 'name', denormalize: 'courseName', rules: [isRequired] },
      { key: 'level', label: 'Level', type: 'select', options: ['UG', 'PG', 'Diploma', 'PhD'], rules: [isRequired] },
    ],
  },
  academicYears: {
    collection: COLLECTIONS.ACADEMIC_YEARS,
    title: 'Academic Years',
    columns: [
      { key: 'name', label: 'Year' },
      { key: 'startDate', label: 'Start' },
      { key: 'endDate', label: 'End' },
      { key: 'current', label: 'Current', render: (r) => (r.current ? 'Yes' : 'No') },
    ],
    fields: [
      { key: 'name', label: 'Year (e.g. 2025-26)', rules: [isRequired] },
      { key: 'startDate', label: 'Start Date', type: 'date', rules: [isRequired, isDate] },
      { key: 'endDate', label: 'End Date', type: 'date', rules: [isRequired, isDate] },
      { key: 'current', label: 'Current Year', type: 'checkbox', rules: [] },
    ],
  },
  semesters: {
    collection: COLLECTIONS.SEMESTERS,
    title: 'Semesters',
    columns: [
      { key: 'name', label: 'Name' },
      { key: 'number', label: 'Number' },
      { key: 'academicYearName', label: 'Academic Year' },
    ],
    fields: [
      { key: 'name', label: 'Semester Name', rules: [isRequired] },
      { key: 'number', label: 'Semester Number', type: 'number', rules: [isRequired] },
      { key: 'academicYearId', label: 'Academic Year', type: 'lookup', lookup: COLLECTIONS.ACADEMIC_YEARS, lookupLabel: 'name', denormalize: 'academicYearName', rules: [isRequired] },
    ],
  },
  subjects: {
    collection: COLLECTIONS.SUBJECTS,
    title: 'Subjects',
    columns: [
      { key: 'name', label: 'Name' },
      { key: 'code', label: 'Code' },
      { key: 'departmentName', label: 'Department' },
      { key: 'semesterName', label: 'Semester' },
      { key: 'facultyName', label: 'Faculty' },
      { key: 'totalLectures', label: 'Planned Lectures' },
    ],
    fields: [
      { key: 'name', label: 'Subject Name', rules: [isRequired] },
      { key: 'code', label: 'Code', rules: [isRequired] },
      { key: 'departmentId', label: 'Department', type: 'lookup', lookup: COLLECTIONS.DEPARTMENTS, lookupLabel: 'name', denormalize: 'departmentName', rules: [isRequired] },
      { key: 'semesterId', label: 'Semester', type: 'lookup', lookup: COLLECTIONS.SEMESTERS, lookupLabel: 'name', denormalize: 'semesterName', rules: [isRequired] },
      { key: 'facultyUserId', label: 'Assigned Faculty', type: 'lookup', lookup: COLLECTIONS.FACULTY, lookupLabel: 'name', lookupValue: 'userId', denormalize: 'facultyName', rules: [] },
      { key: 'totalLectures', label: 'Planned Lectures', type: 'number', rules: [] },
    ],
  },
  faculty: {
    collection: COLLECTIONS.FACULTY,
    title: 'Faculty',
    columns: [
      { key: 'name', label: 'Name' },
      { key: 'email', label: 'Email' },
      { key: 'departmentName', label: 'Department' },
      { key: 'designation', label: 'Designation' },
    ],
    fields: [
      { key: 'name', label: 'Full Name', rules: [isRequired] },
      { key: 'email', label: 'Email', rules: [isRequired, isEmail] },
      { key: 'userId', label: 'User UID (from Users)', rules: [isRequired] },
      { key: 'departmentId', label: 'Department', type: 'lookup', lookup: COLLECTIONS.DEPARTMENTS, lookupLabel: 'name', denormalize: 'departmentName', rules: [isRequired] },
      { key: 'designation', label: 'Designation', rules: [] },
    ],
  },
  students: {
    collection: COLLECTIONS.STUDENTS,
    title: 'Students',
    columns: [
      { key: 'rollNumber', label: 'Roll No.' },
      { key: 'name', label: 'Name' },
      { key: 'email', label: 'Email' },
      { key: 'departmentName', label: 'Department' },
      { key: 'semesterName', label: 'Semester' },
    ],
    fields: [
      { key: 'rollNumber', label: 'Roll Number', rules: [isRequired] },
      { key: 'name', label: 'Full Name', rules: [isRequired] },
      { key: 'email', label: 'Email', rules: [isRequired, isEmail] },
      { key: 'userId', label: 'User UID (from Users)', rules: [isRequired] },
      { key: 'departmentId', label: 'Department', type: 'lookup', lookup: COLLECTIONS.DEPARTMENTS, lookupLabel: 'name', denormalize: 'departmentName', rules: [isRequired] },
      { key: 'semesterId', label: 'Semester', type: 'lookup', lookup: COLLECTIONS.SEMESTERS, lookupLabel: 'name', denormalize: 'semesterName', rules: [isRequired] },
      { key: 'programId', label: 'Program', type: 'lookup', lookup: COLLECTIONS.PROGRAMS, lookupLabel: 'name', denormalize: 'programName', rules: [] },
    ],
  },
  users: {
    collection: COLLECTIONS.USERS,
    title: 'User Accounts',
    note: 'Accounts are managed internally.',
    columns: [
      { key: 'displayName', label: 'Name' },
      { key: 'email', label: 'Email' },
      { key: 'role', label: 'Role' },
      { key: 'active', label: 'Active', render: (r) => (r.active ? 'Yes' : 'No') },
    ],
    fields: [
      { key: 'displayName', label: 'Display Name', rules: [isRequired] },
      { key: 'email', label: 'Email', rules: [isRequired, isEmail] },
      { key: 'role', label: 'Role', type: 'select', options: Object.values(ROLES), rules: [isRequired] },
      { key: 'active', label: 'Active', type: 'checkbox', rules: [] },
    ],
  },
  roles: {
    collection: COLLECTIONS.ROLES,
    title: 'Roles & Permissions',
    columns: [
      { key: 'name', label: 'Role' },
      { key: 'description', label: 'Description' },
      { key: 'permissions', label: 'Permissions', render: (r) => (r.permissions || []).join(', ') },
    ],
    fields: [
      { key: 'name', label: 'Role Name', rules: [isRequired] },
      { key: 'description', label: 'Description', rules: [] },
      { key: 'permissions', label: 'Permissions (comma separated)', type: 'csv', rules: [] },
    ],
  },
};
