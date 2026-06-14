# Frontend Deployment Guide (Vercel / Netlify)

The frontend is a standalone Vite SPA in `frontend/`.

## Build
```bash
cd frontend
npm ci
npm run build   # outputs frontend/dist
```

## Vercel
1. Import the GitLab repository in Vercel.
2. **Root Directory:** `frontend` (Framework preset: Vite). `frontend/vercel.json` provides SPA rewrites and security headers.
3. Add all `VITE_*` environment variables from `frontend/.env.example` under *Settings → Environment Variables*.
4. Deploy. Note the production URL (e.g. `https://cams.vercel.app`).

## Netlify
1. Add new site from Git, set **Base directory** to `frontend`.
2. Build command `npm run build`, publish directory `dist` (already in `frontend/netlify.toml`).
3. Add all `VITE_*` environment variables under *Site configuration → Environment variables*.
4. Deploy and note the production URL.

## After deploying
- Add the domain to **Firebase Console → Authentication → Settings → Authorized domains**, otherwise login is rejected.
