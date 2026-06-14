# Firestore Database Design

All collections are top-level. Display labels (e.g. `departmentName`) are **denormalized** onto referencing documents for single-read list rendering; IDs remain the source of truth.

## users (doc id = Firebase Auth UID)
| Field | Type | Notes |
|---|---|---|
| displayName | string | required |
| email | string | required, valid email |
| role | string | `ADMIN` \| `FACULTY` \| `STUDENT` (authoritative for RBAC) |
| active | boolean | deactivation kills all access via rules |
| photoURL | string | Storage download URL |
| phone | string | optional |
| fcmToken | string | FCM push token |
| lastLoginAt / createdAt / updatedAt | timestamp | server timestamps |

**Queries:** direct get by UID on login; admin lists all. **Index:** none beyond automatic.

## roles / permissions
`roles`: `{ name, description, permissions: string[] }` — documents the permission matrix; `permissions`: `{ name, description }`. Read: any signed-in; write: admin.

## departments / courses / programs / academicYears / semesters
Standard master data: `name`, `code`, plus FKs (`departmentId`, `courseId`, `academicYearId`) and denormalized parent names. `academicYears` adds `startDate`, `endDate`, `current`.

## subjects
`{ name, code, departmentId, departmentName, semesterId, semesterName, facultyUserId, facultyName, totalLectures }`
**Query:** `where facultyUserId == uid` (faculty's subjects). **Index:** `facultyUserId + name`.

## faculty
`{ name, email, userId, departmentId, departmentName, designation }` — links a person record to an auth account.

## students
`{ rollNumber, name, email, userId, departmentId, departmentName, semesterId, semesterName, programId, programName, attendancePercentage, attendedLectures, totalLectures, isDefaulter }`
The last four fields are caches written by Cloud Functions. **Index:** `departmentId + rollNumber`.

## attendanceSessions (doc id = `{subjectId}_{date}_{lectureNumber}`)
| Field | Type |
|---|---|
| subjectId, subjectName, departmentId, semesterId | string |
| date | string `YYYY-MM-DD` |
| lectureNumber | number |
| facultyUserId, facultyName | string |
| totalStudents, presentCount | number |
| locked | boolean |

Deterministic doc ID enforces **duplicate prevention** inside a transaction. **Indexes:** `facultyUserId + date desc`, `subjectId + date desc`.

## attendanceRecords (doc id = `{sessionKey}_{studentId}`)
| Field | Type |
|---|---|
| sessionId, subjectId, subjectName | string |
| studentId, studentUserId, studentName, rollNumber | string |
| date, lectureNumber | string / number |
| status | `PRESENT` \| `ABSENT` \| `LATE` \| `MEDICAL_LEAVE` \| `AUTHORIZED_LEAVE` |
| markedBy, markedAt, lastModifiedBy | audit fields |
| modificationHistory | array of `{previousStatus,newStatus,modifiedBy,reason,modifiedAt}` |

**Queries:** by `studentUserId` (student portal, realtime), by `sessionId` (faculty editing), by `studentId + subjectId + date` (reports). **Indexes:** see `firestore.indexes.json`.

## notifications
`{ userId, audience (ALL|role|null), type, title, message, read, readAt, createdAt }`
**Query:** `userId == uid orderBy createdAt desc limit 50` (realtime). **Index:** `userId + createdAt desc`.

## reports
`{ period, generatedBy, studentUserId, rowCount, format, generatedAt }` — metadata of every generated report.

## auditLogs (append-only)
`{ action, entity, entityId, before, after, performedBy, performedByEmail, timestamp }` — updates/deletes denied by rules. **Index:** `entity + timestamp desc`.

## settings (doc id = `system`)
`{ institutionName, defaulterThreshold, criticalThreshold, lecturesPerDay, academicYear }`

## Validation Strategy
- Client: schema validators (`src/utils/validators.js`) + HTML sanitization on every string write.
- Rules: role + ownership checks, immutable audit logs, restricted notification updates (`read`/`readAt` only).
- Functions: server-side re-aggregation and audit duplication for tamper evidence.
