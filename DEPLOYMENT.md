# Deployment Guide

## Overview

| Component | Platform | Notes |
|-----------|----------|-------|
| Frontend | Vercel | Auto-deploy from GitHub |
| Backend | Render (or Railway) | Node.js web service |
| Database | Supabase / Railway PostgreSQL | Managed PostgreSQL |

---

## Database – Supabase (Free)

1. Go to [supabase.com](https://supabase.com) → Create a new project
2. Copy the **Connection String** (URI format) from: Settings → Database → Connection string → URI
3. Use this as your `DATABASE_URL` in backend environment variables
4. Run `npx prisma db push` with the production `DATABASE_URL`

---

## Backend – Render

1. Go to [render.com](https://render.com) → New → Web Service
2. Connect your GitHub repository
3. Set the following:
   - **Root Directory**: `backend`
   - **Build Command**: `npm install && npx prisma generate && npx prisma db push`
   - **Start Command**: `node src/server.js`
4. Add Environment Variables:
   ```
   DATABASE_URL=<your-supabase-connection-string>
   JWT_SECRET=<generate-a-strong-random-secret>
   PORT=3000
   NODE_ENV=production
   ```
5. Deploy and note the service URL (e.g. `https://your-app.onrender.com`)

### Alternative: Railway

1. Go to [railway.app](https://railway.app) → New Project → Deploy from GitHub
2. Select the repository and set `Root Directory` to `backend`
3. Add a PostgreSQL service from the Railway marketplace
4. Set the same environment variables as above
5. Deploy

---

## Frontend – Vercel

1. Go to [vercel.com](https://vercel.com) → New Project
2. Import your GitHub repository
3. Set the following:
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. Add Environment Variable:
   ```
   VITE_API_URL=https://your-backend.onrender.com/api
   ```
5. Deploy

---

## Backend CORS Update

Before deploying, update the CORS config in `backend/src/app.js` to allow your Vercel domain:

```javascript
app.use(cors({
  origin: [
    'https://your-app.vercel.app',
    'http://localhost:5173',
  ],
  credentials: true,
}));
```

---

## Post-Deployment Checklist

- [ ] Backend health check: `GET https://your-backend.onrender.com/health` → `{"status":"ok"}`
- [ ] Register an admin account via the frontend
- [ ] Add a test vehicle from the Admin Panel
- [ ] Verify purchase works on the Dashboard
- [ ] Verify restock works from the Admin Panel

---

## Environment Variable Reference

### Backend
| Variable | Required | Description |
|----------|----------|-------------|
| `DATABASE_URL` | ✅ | PostgreSQL connection string |
| `JWT_SECRET` | ✅ | Min 32-char random string |
| `PORT` | Optional | Default: 3000 |
| `NODE_ENV` | Optional | `production` / `development` |

### Frontend
| Variable | Required | Description |
|----------|----------|-------------|
| `VITE_API_URL` | ✅ | Backend API base URL |
