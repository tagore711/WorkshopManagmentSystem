# Deployment Guide - Render

## Quick Start

This guide will help you deploy the KTM Workshop Management System to Render.

---

## Part 1: GitHub Setup

### 1. Initialize Git (if not already done)
```bash
git init
git add .
git commit -m "Initial commit"
```

### 2. Create GitHub Repository
1. Go to https://github.com/new
2. Name: `ktm-workshop-management`
3. Visibility: Public or Private
4. **Don't** initialize with README
5. Click "Create repository"

### 3. Push to GitHub
```bash
git remote add origin https://github.com/YOUR_USERNAME/ktm-workshop-management.git
git branch -M main
git push -u origin main
```

---

## Part 2: Render Database Setup

### 1. Create Render Account
- Go to https://render.com
- Sign up with GitHub (recommended)

### 2. Create PostgreSQL Database
1. Dashboard → "New +" → "PostgreSQL"
2. Settings:
   - **Name**: `ktm-workshop-db`
   - **Database**: `ktmdb_pg`
   - **User**: Leave default or use `ktm_user`
   - **Region**: Choose closest to you
   - **Plan**: Free
3. Click "Create Database"
4. Wait 2-3 minutes for provisioning

### 3. Save Credentials
Once ready, copy:
- **Internal Database URL** (for your app)
- **External Database URL** (for pgAdmin)

Example Internal URL:
```
postgresql://user:pass@dpg-xxxxx.oregon-postgres.render.com/ktmdb_pg
```

### 4. Import Database Schema
**Option A: Using Render Shell**
1. Go to your database in Render
2. Click "Shell" tab
3. Copy entire contents of `pgadmin.sql`
4. Paste and execute

**Option B: Using pgAdmin**
1. Open pgAdmin
2. Right-click "Servers" → "Register" → "Server"
3. General tab: Name = "Render Production"
4. Connection tab: Use External Database URL details
   - Host: `dpg-xxxxx.oregon-postgres.render.com`
   - Port: `5432`
   - Database: `ktmdb_pg`
   - Username: from URL
   - Password: from URL
5. Save
6. Open Query Tool
7. Load and execute `pgadmin.sql`

---

## Part 3: Deploy Web Service

### 1. Create Web Service
1. Render Dashboard → "New +" → "Web Service"
2. "Connect a repository"
3. Authorize GitHub
4. Select `ktm-workshop-management`

### 2. Configure Service
- **Name**: `ktm-workshop-app`
- **Region**: Same as database
- **Branch**: `main`
- **Root Directory**: (leave empty)
- **Runtime**: Node
- **Build Command**: `npm install`
- **Start Command**: `npm start`
- **Plan**: Free

### 3. Environment Variables
Click "Advanced" → Add these variables:

**From your Render database Internal URL, extract:**

| Variable | Value | Example |
|----------|-------|---------|
| `PG_USER` | Username from DB URL | `ktm_user` |
| `PG_HOST` | Host from DB URL | `dpg-xxxxx.oregon-postgres.render.com` |
| `PG_DATABASE` | Database name | `ktmdb_pg` |
| `PG_PASSWORD` | Password from DB URL | `xxxxx` |
| `PG_PORT` | Port | `5432` |
| `PORT` | App port | `3000` |
| `FRONTEND_URL` | CORS origin | `*` |
| `NODE_ENV` | Environment | `production` |

### 4. Deploy
1. Click "Create Web Service"
2. Wait 5-10 minutes for first build
3. Monitor logs for errors

---

## Part 4: Verify Deployment

### 1. Check Homepage
Visit: `https://ktm-workshop-app.onrender.com`

Should see:
```
KTM Workshop Management API is running. All backend routes are active.
```

### 2. Test Database Connection
Visit: `https://ktm-workshop-app.onrender.com/db-test`

Should return JSON with database data.

### 3. Test API Endpoints
- `https://ktm-workshop-app.onrender.com/api/workshops`
- `https://ktm-workshop-app.onrender.com/api/aics`
- `https://ktm-workshop-app.onrender.com/api/wics`

---

## Part 5: Update Frontend API URL

After deployment, update your React app to use the production API:

1. Create `src/config.js`:
```javascript
const API_URL = process.env.NODE_ENV === 'production' 
  ? 'https://ktm-workshop-app.onrender.com'
  : 'http://localhost:3000';

export default API_URL;
```

2. Update your API calls to use this URL

3. Push changes:
```bash
git add .
git commit -m "Update API URL for production"
git push origin main
```

Render will auto-deploy in 2-3 minutes.

---

## Continuous Deployment

Every time you push to GitHub:
1. Render detects the push
2. Automatically rebuilds
3. Deploys new version
4. Takes 2-5 minutes

```bash
# Make changes
git add .
git commit -m "Your changes"
git push origin main
# Render auto-deploys!
```

---

## Troubleshooting

### Build Fails
- Check Render logs for errors
- Verify `package.json` scripts
- Ensure all dependencies are in `dependencies`, not `devDependencies`

### Database Connection Error
- Verify environment variables match database credentials
- Check Internal Database URL is correct
- Ensure database is running (not sleeping)

### API Returns 404
- Check route paths in your code
- Verify routes are properly mounted in `server.js`

### Free Tier Limitations
- Database: 1GB storage, expires after 90 days (manual renewal)
- Web Service: Spins down after 15 min inactivity (slow first request)
- No custom domains on free tier

---

## Connecting Local pgAdmin to Production

1. Open pgAdmin
2. Register new server:
   - **Name**: Render Production
   - **Host**: From External Database URL
   - **Port**: 5432
   - **Database**: ktmdb_pg
   - **Username**: From External URL
   - **Password**: From External URL
3. Save

Now you can manage production data from your laptop!

---

## Need Help?

- Render Docs: https://render.com/docs
- Render Community: https://community.render.com
- Check deployment logs in Render dashboard
