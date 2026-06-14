# Backend Deployment Guide (Firestore Rules & Indexes)

The backend is fully serverless on the **Firebase Spark (free) plan**: Cloud Firestore with security rules and composite indexes. There are no Cloud Functions and no Storage bucket, so **no billing account is required**.

## Deploy
```bash
cd backend
firebase login
firebase use <your-project-id>
./scripts/deploy.sh    # firebase deploy --only firestore:rules,firestore:indexes
```

## What enforces backend behavior without Functions?
| Concern | Mechanism |
|---|---|
| RBAC / data access | `firestore.rules` (deny-by-default, role checks against `users/{uid}`) |
| Duplicate attendance prevention | Deterministic session doc IDs inside a client Firestore **transaction** |
| Session locking | `locked` flag enforced in rules (faculty cannot update locked sessions) |
| Percentage engine & defaulter detection | Client-side realtime aggregation (`utils/attendance.js`) over live listeners |
| Notifications | Firestore documents + realtime listeners (in-app delivery) |
| Reports (PDF/Excel) | Generated **client-side** (jsPDF / SheetJS), downloaded directly in the browser; only metadata is stored in `reports` |
| Audit logging | Append-only `auditLogs` collection (updates/deletes denied by rules) |

## Verify after deployment
- Console → Firestore → Rules shows the deployed revision
- Console → Firestore → Indexes: all composite indexes *Enabled*
