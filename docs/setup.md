# Setup Guide

## Prerequisites
- Node.js 20+, npm 10+
- Firebase CLI: `npm i -g firebase-tools`
- A Firebase project with **Authentication (Email/Password)** and **Cloud Firestore** enabled.
  **The free Spark plan is sufficient** — no Storage, Cloud Functions or billing required.

## 1. Clone & install
```bash
git clone <repo-url>
cd rohanumbarepatil-project/frontend
npm install
```

## 2. Configure environment
```bash
cp .env.example .env
```
Fill in the values from *Firebase Console → Project Settings → Your apps → Web app*.

## 3. Deploy security rules
```bash
cd ../backend
firebase login
firebase use --add          # select your project
./scripts/deploy.sh         # deploys firestore.rules + indexes
```

## 4. Bootstrap the first admin
1. Firebase Console → Authentication → Add user (email + password).
2. Firestore → create document `users/{thatUID}`:
```json
{ "displayName": "System Admin", "email": "admin@college.edu", "role": "ADMIN", "active": true }
```
3. Sign in at the app with those credentials.

## 5. Run locally
```bash
cd ../frontend
npm run dev          # http://localhost:5173
npm test             # vitest suite
```
Optional: `cd ../backend && firebase emulators:start` with `VITE_USE_EMULATORS=true`.

## 6. Seed master data (in-app)
As admin: Departments → Academic Years → Semesters → Courses → Programs → Subjects → Users (faculty/students in Auth + `users`) → Faculty/Students records → Assignments.
