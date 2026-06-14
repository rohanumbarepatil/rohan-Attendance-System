# Security Documentation

## Defense in Depth
1. **Route guards (client):** `ProtectedRoute` blocks unauthenticated/deactivated users; `RoleRoute` enforces per-role route access.
2. **Firestore rules (authoritative):** deny-by-default; every rule resolves the caller's role from `users/{uid}` so client tampering is irrelevant.
3. **Client-side file safety:** report files (PDF/Excel) are generated and downloaded entirely in the browser; no files are stored server-side, so there is no file-access surface. Only report metadata is written to Firestore under rules enforcement.

## RBAC Matrix
| Capability | ADMIN | FACULTY | STUDENT |
|---|---|---|---|
| Master data CRUD | ✔ | read | read |
| Mark attendance | ✔ | own subjects only | ✘ |
| Edit attendance | ✔ | own records, unlocked sessions | ✘ |
| Unlock sessions | ✔ | ✘ | ✘ |
| View any student record | ✔ | ✔ | own only |
| Reports | institution | institution | own only |
| Notifications | send to anyone | send | read own + broadcasts |
| Audit logs | read | ✘ | ✘ |
| Settings | ✔ | read | read |

## Threats Addressed
- **Privilege escalation:** users cannot modify their own `role`/`active`; rules compare against the stored document; Cloud Function logs all privilege changes.
- **Unauthorized reads/data leakage:** students filtered to `studentUserId == auth.uid` on records, reports and notifications; default-deny wildcard rule.
- **Unauthorized writes:** faculty can only create sessions/records carrying their own UID (`facultyUserId`/`markedBy == auth.uid`); locked sessions reject faculty updates.
- **Tampering/audit evasion:** `auditLogs` rules deny update/delete; server-side trigger writes an independent log for every status change.
- **XSS:** all string inputs sanitized (`sanitize()` strips HTML) before write; React escapes rendering; hosting sends `X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy` headers.
- **Session handling:** Firebase ID tokens (auto-refresh, revocable); app state restored only via `onAuthStateChanged`; deactivated accounts bounced at guard + rules level.

## Operational Guidance
- Create users in Firebase Auth, then register UID + role in `users`; never grant `ADMIN` casually.
- Review `auditLogs` for `UPDATE`/`DELETE`/`ATTENDANCE_EDITED` events regularly.
- The app runs on the Spark plan: there is no Storage bucket and no server key material to rotate.
