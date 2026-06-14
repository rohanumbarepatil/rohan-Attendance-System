# Deployment Guide

The application deploys as **two independent units**, both compatible with the **Firebase Spark (free) plan**:

| Unit | Directory | Target | Guide |
|---|---|---|---|
| Frontend (React SPA) | `frontend/` | Vercel or Netlify | [deployment-frontend.md](deployment-frontend.md) |
| Backend (Firestore rules + indexes) | `backend/` | Firebase | [deployment-backend.md](deployment-backend.md) |

## Recommended order
1. Deploy the **backend** (`cd backend && ./scripts/deploy.sh`).
2. Configure the frontend environment (`VITE_FIREBASE_*`).
3. Deploy the **frontend** to Vercel or Netlify.
4. Add the frontend production domain to Firebase Auth **Authorized domains**.

No billing account, Storage bucket or Cloud Functions are required.
