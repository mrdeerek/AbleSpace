# Deployment Guide

This guide describes how to deploy the Task Manager application to production.

## Prerequisites
- A Docker Hub account (or other container registry).
- A VPS (e.g., DigitalOcean Droplet, AWS EC2) OR a Platform-as-a-Service (PaaS) like Render/Railway.
- MongoDB hosted on Atlas or running in a container.

## Option 1: Docker Compose (VPS)
This is the simplest way to run the full stack if you have a Linux server with Docker installed.

1. **Clone the repository** to your server.
2. **Create a `.env` file** in the root directory (or separate `.env` files in `backend/` and `frontend/` as configured):
   ```bash
   MONGO_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/dbname
   JWT_SECRET=production_secret_key
   PORT=5000
   ```
3. **Run Docker Compose**:
   ```bash
   docker-compose up --build -d
   ```
   This will spin up:
   - **Frontend**: Accessible at `http://your-server-ip:5173`
   - **Backend**: Accessible at `http://your-server-ip:5000`
   - **MongoDB**: (If keeping local) Accessible internally.

   *Note: For production, you should put Nginx in front of these services to handle SSL and standard port 80/443 routing.*

## Option 2: PaaS (Render / Railway / Vercel)

### Backend (Render/Railway)
1. Push your code to GitHub.
2. Link your repository to Render/Railway.
3. **Build Command**: `cd backend && npm install && npm run build`
4. **Start Command**: `cd backend && npm start`
5. **Environment Variables**: Set `MONGO_URI`, `JWT_SECRET` in the dashboard.

### Frontend (Vercel/Netlify)
1. Link your repository to Vercel.
2. **Root Directory**: `frontend`
3. **Build Command**: `npm run build`
4. **Output Directory**: `dist`
5. **Environment Variables**:
   - `VITE_API_URL`: The URL of your deployed backend (e.g., `https://my-backend.onrender.com/api`).
   *(Note: You will need to update `frontend/src/lib/api.ts` to use `import.meta.env.VITE_API_URL` instead of hardcoded localhost)*.

## Updating for Production
The current code hardcodes `http://localhost:5000` in a few places. Before deploying, update these:

1. **`frontend/src/lib/api.ts`**:
   Replace:
   ```typescript
   const API_URL = "http://localhost:5000/api";
   ```
   With:
   ```typescript
   const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
   ```

2. **`frontend/src/hooks/useSocket.ts`**:
   Replace:
   ```typescript
   const socketUrl = "http://localhost:5000";
   ```
   With:
   ```typescript
   const socketUrl = import.meta.env.VITE_API_URL?.replace('/api', '') || "http://localhost:5000";
   ```

Then set `VITE_API_URL` in your deployment platform to your real backend URL.
