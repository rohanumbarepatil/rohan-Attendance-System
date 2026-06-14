# Requirement Analysis

## Project Overview
CAMS digitizes the complete attendance lifecycle of a college: marking, auditing, monitoring, analytics, reporting and proactive alerting, with strict role-based access for administrators, faculty and students.

## Problem Statement
Manual attendance registers are error-prone, unauditable, and provide no timely visibility into defaulters. Students discover attendance shortfalls too late; faculty spend hours compiling reports; administrators lack live institutional insight.

## Objectives
1. Lecture-wise digital attendance with duplicate prevention and tamper-proof audit trails.
2. Real-time attendance percentages and automatic defaulter detection.
3. Self-service reports (PDF/Excel) for every stakeholder.
4. Proactive notifications (in-app, push, alerts) before attendance becomes critical.
5. Centralized administration of all academic master data.

## Scope
**In scope:** authentication, RBAC, master-data management, attendance marking/editing/locking, percentage engine, defaulter detection, reports, analytics, notifications, audit logging, settings.
**Out of scope:** fee management, exams/grading, timetable generation, biometric hardware integration.

## Functional Requirements
| ID | Requirement |
|---|---|
| FR-01 | Email/password login with reset and verification |
| FR-02 | Role resolution from Firestore (`users.role`) on every session |
| FR-03 | Admin CRUD for all 11 master-data collections with search, filter, export |
| FR-04 | Faculty mark lecture-wise attendance with 5 statuses |
| FR-05 | Duplicate sessions (subject+date+lecture) must be rejected atomically |
| FR-06 | Sessions lock on submission; edits require unlock + reason + audit log |
| FR-07 | Percentage = present/conducted × 100, updated in real time |
| FR-08 | Auto defaulter detection below 75% (configurable) |
| FR-09 | Daily/weekly/monthly/semester/yearly reports with PDF & Excel export |
| FR-10 | In-app + FCM push notifications; admin announcements by audience |
| FR-11 | Students see only their own records; faculty only their classes |
| FR-12 | Immutable audit logs for all sensitive mutations |

## Non-Functional Requirements
- **Security:** Firestore/Storage rules deny-by-default, RBAC, input sanitization (XSS), immutable audit logs.
- **Performance:** realtime listeners with composite indexes; denormalized labels avoid join reads.
- **Availability:** fully serverless on Firebase (no servers to manage).
- **Usability:** responsive (mobile/tablet/desktop), skeleton loaders, toasts.
- **Maintainability:** feature-based folders, config-driven CRUD, reusable services.

## User Stories (selection)
- *As an admin*, I manage departments, subjects and user accounts so the institution structure stays current.
- *As a faculty member*, I mark attendance for my lecture in under a minute and cannot accidentally submit it twice.
- *As a faculty member*, I see defaulters live and send warnings in one click.
- *As a student*, I see my live percentage per subject and get alerted before I become a defaulter.
- *As an admin*, I watch every session appear live on the attendance monitor.

## Use Cases
1. **Mark Attendance:** Faculty selects subject → date → lecture → toggles statuses → submit. System validates duplicates, writes session + records transactionally, locks the session, notifies students.
2. **Edit Attendance:** Admin unlocks a session → faculty changes a record with a reason → modification history + audit log written → Cloud Function double-logs server-side.
3. **Generate Report:** User picks period + reference date → aggregation → table → PDF/Excel download → report metadata persisted.
4. **Defaulter Scan:** Scheduled function aggregates all records nightly, flags defaulters, notifies students.

## Acceptance Criteria (samples)
- Submitting attendance twice for the same subject/date/lecture shows "Attendance already marked" and writes nothing.
- A student opening another student's record gets a Firestore permission error.
- Editing a record appends `{previousStatus,newStatus,modifiedBy,reason,modifiedAt}` to `modificationHistory` and creates an audit log.
- A student with 44 present of 60 conducted lectures sees 73.33% and the Warning category with a defaulter banner.

## Business Rules
- BR-1: One attendance session per subject + date + lecture number.
- BR-2: Sessions are locked immediately on submission.
- BR-3: Late, Medical Leave and Authorized Leave count as attended for percentage purposes.
- BR-4: Defaulter threshold 75%, critical threshold 60% (admin-configurable in Settings).
- BR-5: Audit logs are append-only; updates and deletes are denied by security rules.
- BR-6: Users can never change their own `role` or `active` flag.

## Assumptions
- Admins create Firebase Auth accounts and register the UID in the `users` collection.
- Class rosters derive from student `semesterId` + `departmentId` matching the subject.
- Email delivery uses Firebase Auth templates (reset/verification) and FCM for alerts.

## Constraints
- Firebase-only backend (no SQL/ORM).
- Firestore query model requires denormalized display fields and composite indexes.
- FCM web push requires HTTPS and user permission.
